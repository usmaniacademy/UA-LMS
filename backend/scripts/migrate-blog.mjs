// One-time migration: WordPress WXR export -> BlogPost rows in Postgres,
// with images re-hosted on Cloudflare R2. Safe to re-run (upserts by slug,
// caches image uploads to disk so a second run doesn't re-upload everything).
import 'dotenv/config'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import prisma from '../src/config/prisma.js'
import { uploadImage, isStorageConfigured } from '../src/services/storage.service.js'
import { sanitizeContent } from '../src/utils/sanitizeContent.js'

const XML_PATH = 'C:\\Users\\HsMehrvi\\Downloads\\usmaniacademy.WordPress.2026-07-16.xml'
const IMAGES_DIR = 'C:\\Users\\HsMehrvi\\AppData\\Local\\Temp\\claude\\C--Users-HsMehrvi-Desktop-UA-LMS\\207bc800-4c1b-43ff-8228-7511e86cf812\\scratchpad\\blog-migration\\images'
const CACHE_PATH = 'C:\\Users\\HsMehrvi\\AppData\\Local\\Temp\\claude\\C--Users-HsMehrvi-Desktop-UA-LMS\\207bc800-4c1b-43ff-8228-7511e86cf812\\scratchpad\\blog-migration\\upload-cache.json'
const AUTHOR_NAME = 'Usmani Academy'

if (!isStorageConfigured()) {
  console.error('R2 is not configured (missing env vars) — aborting.')
  process.exit(1)
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function decodeEntities(str) {
  if (!str) return str
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
}

// WordPress occasionally lets a tag/category label get pasted twice into one
// string (e.g. "Best Online Tajweed CourseBest Online Tajweed Course") — collapse
// an exact self-concatenation back to a single copy.
function dedupeSelfConcat(text) {
  const len = text.length
  if (len % 2 === 0) {
    const half = len / 2
    if (text.slice(0, half) === text.slice(half)) return text.slice(0, half)
  }
  return text
}

function stripGutenbergComments(html) {
  return html.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n').trim()
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// A WP relative path may point at a generated size variant (e.g.
// ".../Foo-1024x832.jpg"); normalize back to the original file so every
// variant of the same image maps to one R2 object and one cache entry.
function canonicalizeWpRelative(rel) {
  const parts = rel.split('/')
  const [year, month] = parts
  const filename = decodeURIComponent(parts.slice(2).join('/')).replace(/-\d+x\d+(?=\.\w+$)/, '')
  return { year, month, filename, canonicalRel: `${year}/${month}/${filename}` }
}

const CONTENT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }

let uploadCache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) : {}
function saveCache() {
  writeFileSync(CACHE_PATH, JSON.stringify(uploadCache, null, 2))
}

async function uploadWpRelativeImage(rel) {
  const { year, month, filename, canonicalRel } = canonicalizeWpRelative(rel)
  const key = `blog/migrated/${canonicalRel}`
  if (uploadCache[key]) return uploadCache[key]

  const localPath = path.join(IMAGES_DIR, year + month, filename)
  if (!existsSync(localPath)) {
    console.warn('  [warn] local file not found for', canonicalRel, '->', localPath)
    return null
  }
  const buffer = readFileSync(localPath)
  const ext = path.extname(localPath).toLowerCase()
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'
  const url = await uploadImage(buffer, key, contentType)
  uploadCache[key] = url
  saveCache()
  return url
}

// ─── Parse the WXR export ──────────────────────────────────────────────────────

const xml = readFileSync(XML_PATH, 'utf-8')
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: false,
  trimValues: true,
  isArray: (name) => ['item', 'category', 'wp:postmeta'].includes(name)
})
const doc = parser.parse(xml)
const items = doc.rss.channel.item || []

const limitArg = parseInt(process.argv[2], 10)
const allPosts = items.filter((it) => it['wp:post_type'] === 'post' && it['wp:status'] === 'publish')
const posts = Number.isFinite(limitArg) ? allPosts.slice(0, limitArg) : allPosts
const attachments = items.filter((it) => it['wp:post_type'] === 'attachment')
const attachmentById = new Map(attachments.map((a) => [String(a['wp:post_id']), a]))

function metaValue(item, key) {
  const row = (item['wp:postmeta'] || []).find((m) => m['wp:meta_key'] === key)
  return row ? row['wp:meta_value'] : null
}

// Primary-category term id -> name, derived from single-category posts (the
// export has no wp:category/wp:term taxonomy section to look this up directly).
const categoryIdToName = new Map()
for (const p of allPosts) {
  const cats = (p.category || []).filter((c) => c['@_domain'] === 'category')
  const primaryId = metaValue(p, '_yoast_wpseo_primary_category')
  if (cats.length === 1 && primaryId) categoryIdToName.set(primaryId, cats[0]['#text'])
}

function resolveCategory(post) {
  const cats = (post.category || []).filter((c) => c['@_domain'] === 'category')
  if (cats.length === 0) return null
  if (cats.length === 1) return decodeEntities(cats[0]['#text'])
  const primaryId = metaValue(post, '_yoast_wpseo_primary_category')
  const primaryName = primaryId && categoryIdToName.get(primaryId)
  return decodeEntities(primaryName || cats[0]['#text'])
}

function resolveTags(post) {
  const tags = (post.category || []).filter((c) => c['@_domain'] === 'post_tag')
  const names = tags.map((t) => decodeEntities(dedupeSelfConcat(t['#text'])))
  return [...new Set(names.map((n) => n.trim()).filter(Boolean))]
}

function resolveExcerpt(post) {
  const raw = post['excerpt:encoded'] || metaValue(post, '_yoast_wpseo_metadesc')
  if (raw) return decodeEntities(raw).trim()
  return stripHtml(post['content:encoded'] || '').slice(0, 160).trim()
}

async function resolveFeaturedImage(post) {
  const thumbId = metaValue(post, '_thumbnail_id')
  if (!thumbId) return null
  const attachment = attachmentById.get(String(thumbId))
  const attachedFile = attachment && metaValue(attachment, '_wp_attached_file')
  if (!attachedFile) return null
  return uploadWpRelativeImage(attachedFile)
}

async function migrateContentImages(html) {
  const re = /src="https?:\/\/[^"]*\/wp-content\/uploads\/([^"]+)"/g
  const relPaths = [...new Set([...html.matchAll(re)].map((m) => decodeURIComponent(m[1])))]

  const urlByRel = new Map()
  for (const rel of relPaths) {
    const newUrl = await uploadWpRelativeImage(rel)
    if (newUrl) urlByRel.set(rel, newUrl)
  }

  return html.replace(/src="(https?:\/\/[^"]*\/wp-content\/uploads\/([^"]+))"/g, (full, _oldUrl, encodedRel) => {
    const rel = decodeURIComponent(encodedRel)
    const newUrl = urlByRel.get(rel)
    return newUrl ? `src="${newUrl}"` : full
  })
}

// ─── Migrate ───────────────────────────────────────────────────────────────────

console.log(`Migrating ${posts.length} published posts...\n`)

let created = 0
let updated = 0

for (let i = 0; i < posts.length; i++) {
  const post = posts[i]
  const slug = post['wp:post_name']
  const title = decodeEntities(post.title)
  console.log(`[${i + 1}/${posts.length}] ${slug}`)

  const featuredImage = await resolveFeaturedImage(post)
  const content = sanitizeContent(stripGutenbergComments(await migrateContentImages(post['content:encoded'] || '')))

  const data = {
    title,
    slug,
    excerpt: resolveExcerpt(post),
    content,
    featuredImage,
    category: resolveCategory(post),
    tags: resolveTags(post),
    status: 'published',
    publishedAt: new Date(post.pubDate),
    seoTitle: decodeEntities(metaValue(post, '_yoast_wpseo_title')) || title,
    seoDescription: decodeEntities(metaValue(post, '_yoast_wpseo_metadesc')) || null,
    seoKeywords: decodeEntities(metaValue(post, '_yoast_wpseo_focuskw')) || null,
    authorId: null,
    authorName: AUTHOR_NAME
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) {
    await prisma.blogPost.update({ where: { slug }, data })
    updated++
  } else {
    await prisma.blogPost.create({ data })
    created++
  }
}

console.log(`\nDone. Created ${created}, updated ${updated}, total ${posts.length}.`)
console.log(`Image upload cache: ${Object.keys(uploadCache).length} unique images at ${CACHE_PATH}`)

await prisma.$disconnect()

import prisma from '../config/prisma.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadDataUrl, getImageStream } from './storage.service.js'
import { sanitizeContent } from '../utils/sanitizeContent.js'

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(title, excludeId = null) {
  const base = slugify(title)
  let slug = base
  let counter = 1
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) break
    slug = `${base}-${counter++}`
  }
  return slug
}

const publicListSelect = {
  id: true, title: true, slug: true, excerpt: true, featuredImage: true,
  category: true, tags: true, publishedAt: true, authorName: true,
  author: { select: { firstName: true, lastName: true } }
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function listPublishedPosts({ category, tag, search, page = 1, limit = 9 } = {}) {
  const where = {
    status: 'published',
    ...(category && { category }),
    ...(tag && { tags: { has: tag } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    })
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: publicListSelect
    }),
    prisma.blogPost.count({ where })
  ])

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPublishedPostBySlug(slug) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } }
  })
  if (!post || post.status !== 'published') throw ApiError.notFound('Post not found')
  return post
}

export async function listCategories() {
  const rows = await prisma.blogPost.findMany({
    where: { status: 'published', category: { not: null } },
    select: { category: true },
    distinct: ['category']
  })
  return rows.map((r) => r.category).filter(Boolean)
}

// ─── Content writer / admin ────────────────────────────────────────────────────

export async function listAllPosts({ search, status, page = 1, limit = 20 } = {}) {
  const where = {
    ...(status && { status }),
    ...(search && { title: { contains: search, mode: 'insensitive' } })
  }
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, title: true, slug: true, status: true, category: true,
        publishedAt: true, updatedAt: true, authorName: true,
        author: { select: { firstName: true, lastName: true } }
      }
    }),
    prisma.blogPost.count({ where })
  ])
  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPostForEdit(id) {
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) throw ApiError.notFound('Post not found')
  return post
}

export async function createPost(userId, data) {
  const resolvedSlug = await uniqueSlug(data.slug || data.title)

  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug: resolvedSlug,
      excerpt: data.excerpt,
      content: sanitizeContent(data.content),
      featuredImage: data.featuredImage,
      category: data.category,
      tags: data.tags || [],
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date() : null,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      authorId: userId,
      // Posts are published under the brand by default; a writer can override
      // with a byline. authorId still records who actually wrote it internally.
      authorName: data.authorName || 'Usmani Academy'
    }
  })
}

export async function updatePost(id, data) {
  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) throw ApiError.notFound('Post not found')

  const updateData = { ...data }
  if (data.content !== undefined) updateData.content = sanitizeContent(data.content)
  if (data.slug && data.slug !== existing.slug) {
    updateData.slug = await uniqueSlug(data.slug, id)
  }
  // Publishing for the first time stamps publishedAt; re-saving a published
  // post (or a migrated one with a preserved date) doesn't reset it.
  if (data.status === 'published' && existing.status !== 'published' && !existing.publishedAt) {
    updateData.publishedAt = new Date()
  }

  return prisma.blogPost.update({ where: { id }, data: updateData })
}

export async function deletePost(id) {
  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) throw ApiError.notFound('Post not found')
  return prisma.blogPost.delete({ where: { id } })
}

// ─── Image upload ───────────────────────────────────────────────────────────

export async function uploadPostImage(dataUrl, filename) {
  return uploadDataUrl(dataUrl, filename, 'blog')
}

export { getImageStream }

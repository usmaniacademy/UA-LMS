import * as BlogService from '../services/blog.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ─── Public ───────────────────────────────────────────────────────────────────

export const listPosts = asyncHandler(async (req, res) => {
  const { category, tag, search, page, limit } = req.query
  const result = await BlogService.listPublishedPosts({
    category, tag, search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 9
  })
  res.json(result)
})

export const listPostCategories = asyncHandler(async (req, res) => {
  const categories = await BlogService.listCategories()
  res.json({ categories })
})

export const getPost = asyncHandler(async (req, res) => {
  const post = await BlogService.getPublishedPostBySlug(req.params.slug)
  res.json({ post })
})

export const proxyImage = asyncHandler(async (req, res) => {
  const key = decodeURIComponent(req.params.key)
  const result = await BlogService.getImageStream(key)
  res.setHeader('Content-Type', result.ContentType || 'application/octet-stream')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  result.Body.pipe(res)
})

// ─── Content writer / admin ────────────────────────────────────────────────────

export const listManagePosts = asyncHandler(async (req, res) => {
  const { search, status, page, limit } = req.query
  const result = await BlogService.listAllPosts({
    search, status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 20
  })
  res.json(result)
})

export const getManagePost = asyncHandler(async (req, res) => {
  const post = await BlogService.getPostForEdit(req.params.id)
  res.json({ post })
})

export const createPost = asyncHandler(async (req, res) => {
  const post = await BlogService.createPost(req.user.id, req.body)
  res.status(201).json({ message: 'Post created', post })
})

export const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogService.updatePost(req.params.id, req.body)
  res.json({ message: 'Post updated', post })
})

export const deletePost = asyncHandler(async (req, res) => {
  await BlogService.deletePost(req.params.id)
  res.json({ message: 'Post deleted' })
})

export const uploadImage = asyncHandler(async (req, res) => {
  const { dataUrl, filename } = req.body
  const result = await BlogService.uploadPostImage(dataUrl, filename)
  res.status(201).json(result)
})

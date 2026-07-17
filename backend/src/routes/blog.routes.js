import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  listPosts, listPostCategories, getPost, proxyImage,
  listManagePosts, getManagePost, createPost, updatePost, deletePost, uploadImage
} from '../controllers/blog.controller.js'
import { createBlogPostSchema, updateBlogPostSchema, uploadImageSchema } from '../validators/blog.js'

const router = Router()

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', listPosts)
router.get('/categories', listPostCategories)
router.get('/images/:key', proxyImage)

// ─── Content writer / admin (must come BEFORE /:slug to avoid conflict) ──────
router.get('/manage', authenticate, authorize('content_writer', 'admin'), listManagePosts)
router.get('/manage/:id', authenticate, authorize('content_writer', 'admin'), getManagePost)
router.post('/upload-image', authenticate, authorize('content_writer', 'admin'), validate(uploadImageSchema), uploadImage)
router.post('/', authenticate, authorize('content_writer', 'admin'), validate(createBlogPostSchema), createPost)
router.put('/:id', authenticate, authorize('content_writer', 'admin'), validate(updateBlogPostSchema), updatePost)
router.delete('/:id', authenticate, authorize('content_writer', 'admin'), deletePost)

// ─── Public post detail (slug — keep LAST to avoid catching static routes) ───
router.get('/:slug', getPost)

export default router

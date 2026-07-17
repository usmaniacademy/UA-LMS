import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { uploadImage } from '../controllers/upload.controller.js'
import { uploadImageSchema } from '../validators/blog.js'

const router = Router()

// Shared image upload for staff (course thumbnails, promo images, etc.)
router.post(
  '/image',
  authenticate,
  authorize('instructor', 'admin', 'content_writer'),
  validate(uploadImageSchema),
  uploadImage
)

export default router

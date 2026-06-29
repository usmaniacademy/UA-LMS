import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { register, login, refresh, logout, me, updateProfile } from '../controllers/auth.controller.js'
import { registerSchema, loginSchema, refreshSchema, updateProfileSchema } from '../validators/auth.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', validate(refreshSchema), refresh)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, me)
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile)

export default router

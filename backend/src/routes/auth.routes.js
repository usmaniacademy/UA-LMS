import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { register, login, refresh, logout, me, updateProfile, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller.js'
import { registerSchema, loginSchema, refreshSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../validators/auth.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', validate(refreshSchema), refresh)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, me)
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword)

export default router

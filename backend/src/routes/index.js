import { Router } from 'express'
import authRoutes from './auth.routes.js'
import courseRoutes from './course.routes.js'
import zoomRoutes from './zoom.routes.js'
import stripeRoutes from './stripe.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'usmani-academy-api', time: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/courses', courseRoutes)
router.use('/zoom', zoomRoutes)
router.use('/stripe', stripeRoutes)
router.use('/admin', adminRoutes)

export default router

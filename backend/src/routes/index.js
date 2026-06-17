import { Router } from 'express'
import authRoutes from './auth.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'usmani-academy-api', time: new Date().toISOString() })
})

router.use('/auth', authRoutes)

// router.use('/courses', courseRoutes)       // M3 — Course Management
// router.use('/zoom', zoomRoutes)            // M4 — Zoom Integration
// router.use('/stripe', stripeRoutes)        // M5 — Stripe Subscriptions
// router.use('/subscriptions', subscriptionRoutes)
// router.use('/admin', adminRoutes)          // M6 — Admin Panel

export default router

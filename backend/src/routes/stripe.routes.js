import { Router } from 'express'
import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createCheckout, webhook, getMySubscriptions, cancelSubscription, checkAccess } from '../controllers/stripe.controller.js'
import { createCheckoutSchema, cancelSubscriptionSchema } from '../validators/stripe.js'

const router = Router()

// Webhook — must use raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), webhook)

// Student routes
router.post('/create-checkout', authenticate, authorize('student'), validate(createCheckoutSchema), createCheckout)
router.get('/subscriptions', authenticate, authorize('student'), getMySubscriptions)
router.delete('/subscriptions/:id', authenticate, authorize('student'), cancelSubscription)
router.get('/access/:courseId', authenticate, checkAccess)

export default router

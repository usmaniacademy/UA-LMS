import * as StripeService from '../services/stripe.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createCheckout = asyncHandler(async (req, res) => {
  const { courseId } = req.body
  const result = await StripeService.createCheckoutSession(req.user.id, courseId)
  res.json(result)
})

// Raw body needed for Stripe webhook signature verification
export const webhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'] || ''
    const result = await StripeService.handleWebhook(req.body, signature)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getMySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await StripeService.getStudentSubscriptions(req.user.id)
  res.json({ subscriptions })
})

export const cancelSubscription = asyncHandler(async (req, res) => {
  const sub = await StripeService.cancelSubscription(req.params.id, req.user.id)
  res.json({ message: 'Subscription cancelled', subscription: sub })
})

export const checkAccess = asyncHandler(async (req, res) => {
  const result = await StripeService.checkCourseAccess(req.user.id, req.params.courseId)
  res.json(result)
})

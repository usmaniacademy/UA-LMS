import { z } from 'zod'

export const createCheckoutSchema = z.object({
  courseId: z.string().uuid('Invalid course ID')
})

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required')
})

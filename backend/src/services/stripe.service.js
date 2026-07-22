import Stripe from 'stripe'
import prisma from '../config/prisma.js'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { sendEnrollmentEmail } from './email.service.js'

const stripe = new Stripe(env.stripe.secretKey || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia'
})

const stripeConfigured = !!env.stripe.secretKey && !env.stripe.secretKey.includes('xxx')

// ─── Customer ─────────────────────────────────────────────────────────────────

async function getOrCreateCustomer(user) {
  if (user.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: { userId: user.id }
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id }
  })

  return customer.id
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckoutSession(userId, courseId) {
  if (!stripeConfigured) {
    throw ApiError.badRequest('Stripe is not configured yet. Add your API keys to .env to enable payments.')
  }

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({ where: { id: courseId } })
  ])

  if (!user) throw ApiError.notFound('User not found')
  if (!course) throw ApiError.notFound('Course not found')
  if (course.isFree) throw ApiError.badRequest('This course is free — no payment needed')
  if (!course.price || course.price <= 0) throw ApiError.badRequest('This course does not have a price set yet')

  const { hasAccess } = await checkCourseAccess(userId, courseId)
  if (hasAccess) throw ApiError.conflict('You already have access to this course')

  const customerId = await getOrCreateCustomer(user)
  const isOneTime = course.paymentType === 'one_time'

  const priceData = {
    currency: 'usd',
    unit_amount: Math.round(course.price * 100), // dollars -> cents
    product_data: { name: course.title }
  }
  if (!isOneTime) priceData.recurring = { interval: 'month' }

  const sessionParams = {
    customer: customerId,
    mode: isOneTime ? 'payment' : 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price_data: priceData, quantity: 1 }],
    success_url: `${env.frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.frontendUrl}/courses/${course.slug}`,
    metadata: { userId, courseId, paymentType: course.paymentType }
  }

  if (!isOneTime) {
    sessionParams.subscription_data = { metadata: { userId, courseId } }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return { checkoutUrl: session.url, sessionId: session.id }
}

// ─── Webhooks ─────────────────────────────────────────────────────────────────

export async function handleWebhook(rawBody, signature) {
  let event

  if (!stripeConfigured || !env.stripe.webhookSecret || env.stripe.webhookSecret.includes('xxx')) {
    // Dev mode: parse without verification
    try {
      event = JSON.parse(rawBody.toString())
    } catch {
      throw ApiError.badRequest('Invalid JSON payload')
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.stripe.webhookSecret)
    } catch (err) {
      throw ApiError.badRequest(`Webhook signature verification failed: ${err.message}`)
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
  }

  return { received: true }
}

async function handleCheckoutCompleted(session) {
  const { userId, courseId } = session.metadata || {}
  if (!userId || !courseId) return

  if (session.mode === 'payment') {
    await prisma.$transaction([
      prisma.purchase.upsert({
        where: { stripeCheckoutSessionId: session.id },
        create: {
          studentId: userId,
          courseId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
          amount: session.amount_total || 0
        },
        update: {}
      }),
      prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: userId, courseId } },
        create: { studentId: userId, courseId, accessExpiresAt: null },
        update: { accessExpiresAt: null }
      })
    ])
  } else {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)

    const periodStart = new Date(subscription.current_period_start * 1000)
    const periodEnd = new Date(subscription.current_period_end * 1000)

    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        create: {
          studentId: userId,
          courseId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id || '',
          status: 'active',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd
        },
        update: { status: 'active', currentPeriodStart: periodStart, currentPeriodEnd: periodEnd }
      }),
      prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: userId, courseId } },
        create: { studentId: userId, courseId, accessExpiresAt: periodEnd },
        update: { accessExpiresAt: periodEnd }
      })
    ])
  }

  sendEnrollmentEmailAfterTransaction(userId, courseId)
}

async function sendEnrollmentEmailAfterTransaction(userId, courseId) {
  try {
    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } }),
      prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: { select: { firstName: true, lastName: true } } }
      })
    ])
    if (!user || !course) return

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } }
    })

    await sendEnrollmentEmail({
      email: user.email,
      firstName: user.firstName,
      courseName: course.title,
      instructorName: course.instructor
        ? `${course.instructor.firstName} ${course.instructor.lastName}`
        : null,
      courseSlug: course.slug,
      enrolledAt: enrollment?.enrolledAt || new Date()
    })
  } catch (err) {
    console.error(`Failed to send enrollment email (user: ${userId}, course: ${courseId}):`, err.message)
  }
}

async function handlePaymentSucceeded(invoice) {
  const subId = invoice.subscription
  if (!subId) return

  const subscription = await stripe.subscriptions.retrieve(subId)
  const { userId, courseId } = subscription.metadata || {}
  if (!userId || !courseId) return

  const periodEnd = new Date(subscription.current_period_end * 1000)

  await prisma.$transaction([
    prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subId },
      data: {
        status: 'active',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: periodEnd
      }
    }),
    prisma.enrollment.updateMany({
      where: { studentId: userId, courseId },
      data: { accessExpiresAt: periodEnd }
    })
  ])
}

async function handlePaymentFailed(invoice) {
  const subId = invoice.subscription
  if (!subId) return

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subId },
    data: { status: 'past_due' }
  })
}

async function handleSubscriptionDeleted(subscription) {
  const { userId, courseId } = subscription.metadata || {}

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'cancelled', cancelledAt: new Date() }
  })

  if (userId && courseId) {
    await prisma.enrollment.updateMany({
      where: { studentId: userId, courseId },
      data: { accessExpiresAt: new Date() }
    })
  }
}

async function handleSubscriptionUpdated(subscription) {
  const newStatus = subscription.status === 'active' ? 'active'
    : subscription.status === 'past_due' ? 'past_due'
    : subscription.status === 'canceled' ? 'cancelled'
    : 'active'

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: newStatus }
  })
}

// ─── Student queries ──────────────────────────────────────────────────────────

export async function getStudentSubscriptions(studentId) {
  return prisma.subscription.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    include: {
      course: {
        select: { id: true, title: true, slug: true, thumbnailUrl: true, category: true }
      }
    }
  })
}

export async function cancelSubscription(subscriptionId, studentId) {
  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } })
  if (!sub) throw ApiError.notFound('Subscription not found')
  if (sub.studentId !== studentId) throw ApiError.forbidden()
  if (sub.status !== 'active') throw ApiError.badRequest('Subscription is not active')

  if (stripeConfigured) {
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId)
  }

  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'cancelled', cancelledAt: new Date() }
  })
}

export async function checkCourseAccess(studentId, courseId) {
  const [enrollment, subscription, purchase] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } }
    }),
    prisma.subscription.findFirst({
      where: { studentId, courseId, status: 'active' }
    }),
    prisma.purchase.findUnique({
      where: { studentId_courseId: { studentId, courseId } }
    })
  ])

  const hasAccess = !!purchase || !!(
    enrollment && (
      !enrollment.accessExpiresAt ||
      enrollment.accessExpiresAt > new Date()
    )
  )

  return { hasAccess, enrollment, subscription, purchase }
}

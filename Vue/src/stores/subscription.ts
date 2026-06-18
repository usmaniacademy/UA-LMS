import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface Subscription {
  id: string
  courseId: string
  stripeSubscriptionId: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt?: string
  course: {
    id: string
    title: string
    slug: string
    thumbnailUrl?: string
    category?: string
  }
}

export const useSubscriptionStore = defineStore('subscription_store', () => {
  const subscriptions = ref<Subscription[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchMySubscriptions() {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get('/stripe/subscriptions')
      subscriptions.value = data.subscriptions
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function startCheckout(courseId: string): Promise<string> {
    const data = await api.post('/stripe/create-checkout', { courseId })
    return data.checkoutUrl
  }

  async function cancelSubscription(subscriptionId: string) {
    await api.delete(`/stripe/subscriptions/${subscriptionId}`)
    const idx = subscriptions.value.findIndex((s) => s.id === subscriptionId)
    if (idx !== -1) subscriptions.value[idx].status = 'cancelled'
  }

  async function checkAccess(courseId: string): Promise<boolean> {
    try {
      const data = await api.get(`/stripe/access/${courseId}`)
      return data.hasAccess
    } catch {
      return false
    }
  }

  return { subscriptions, loading, error, fetchMySubscriptions, startCheckout, cancelSubscription, checkAccess }
})

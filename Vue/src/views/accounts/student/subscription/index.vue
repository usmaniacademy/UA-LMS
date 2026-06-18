<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">My Subscriptions</h3>
        </b-card-header>

        <b-card-body>
          <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="store.subscriptions.length === 0" class="text-center py-5">
            <h5 class="text-muted">No active subscriptions</h5>
            <p class="text-muted">Browse courses and subscribe to get started.</p>
            <router-link :to="{ name: 'courses.list' }" class="btn btn-primary">Browse Courses</router-link>
          </div>

          <div v-else class="d-flex flex-column gap-4">
            <div v-for="sub in store.subscriptions" :key="sub.id"
              class="border rounded-3 p-4"
              :class="{
                'border-success': sub.status === 'active',
                'border-danger': sub.status === 'past_due',
                'border-secondary': sub.status === 'cancelled'
              }">
              <b-row class="align-items-center g-3">
                <b-col md="6">
                  <div class="d-flex gap-3 align-items-center">
                    <img :src="sub.course.thumbnailUrl || defaultThumb" class="rounded"
                      style="width:72px;height:54px;object-fit:cover" />
                    <div>
                      <router-link :to="{ name: 'course.detail.slug', params: { slug: sub.course.slug } }"
                        class="fw-bold text-dark text-decoration-none">
                        {{ sub.course.title }}
                      </router-link>
                      <div class="text-muted small">{{ sub.course.category }}</div>
                    </div>
                  </div>
                </b-col>
                <b-col md="3">
                  <span class="badge mb-1" :class="{
                    'bg-success': sub.status === 'active',
                    'bg-danger': sub.status === 'past_due',
                    'bg-secondary': sub.status === 'cancelled'
                  }">{{ sub.status === 'past_due' ? 'Payment Failed' : sub.status }}</span>
                  <div v-if="sub.status === 'active'" class="text-muted small mt-1">
                    Renews {{ formatDate(sub.currentPeriodEnd) }}
                  </div>
                  <div v-if="sub.status === 'cancelled'" class="text-muted small mt-1">
                    Access until {{ formatDate(sub.currentPeriodEnd) }}
                  </div>
                </b-col>
                <b-col md="3" class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <router-link :to="{ name: 'course.detail.slug', params: { slug: sub.course.slug } }"
                      class="btn btn-sm btn-primary">Go to Course</router-link>
                    <b-button v-if="sub.status === 'active'" variant="outline-danger" size="sm"
                      @click="cancelSub(sub)" :disabled="cancelling === sub.id">
                      <span v-if="cancelling === sub.id" class="spinner-border spinner-border-sm me-1" />
                      Cancel
                    </b-button>
                  </div>
                </b-col>
              </b-row>
              <div v-if="sub.status === 'past_due'" class="alert alert-danger py-2 mb-0 mt-3 small">
                ⚠️ Your last payment failed. Please update your payment method to maintain access.
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>

      <b-modal v-model="cancelModal" title="Cancel Subscription" @ok="confirmCancel"
        ok-variant="danger" ok-title="Yes, Cancel">
        <p>Are you sure you want to cancel your subscription to <strong>{{ cancellingCourse }}</strong>?</p>
        <p class="text-muted small mb-0">You'll keep access until the end of the current billing period.</p>
      </b-modal>
    </b-col>
  </StudentLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StudentLayout from '@/layouts/StudentLayout.vue'
import { useSubscriptionStore } from '@/stores/subscription'
import type { Subscription } from '@/stores/subscription'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'

const store = useSubscriptionStore()
const cancelling = ref<string | null>(null)
const cancelModal = ref(false)
const cancellingCourse = ref('')
const pendingCancelId = ref<string | null>(null)

onMounted(() => store.fetchMySubscriptions())

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function cancelSub(sub: Subscription) {
  cancellingCourse.value = sub.course.title
  pendingCancelId.value = sub.id
  cancelModal.value = true
}

async function confirmCancel() {
  if (!pendingCancelId.value) return
  cancelling.value = pendingCancelId.value
  try {
    await store.cancelSubscription(pendingCancelId.value)
  } catch (e: any) {
    alert(e.message)
  } finally {
    cancelling.value = null
    pendingCancelId.value = null
  }
}
</script>

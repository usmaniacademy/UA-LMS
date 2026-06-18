<template>
  <PagesLayout>
    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!course" class="text-center py-5">
      <h4 class="text-muted">Course not found</h4>
      <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mt-3">Browse Courses</router-link>
    </div>

    <template v-else>
      <!-- Hero -->
      <section class="py-5 bg-dark">
        <b-container>
          <b-row class="align-items-center g-4">
            <b-col lg="8">
              <span class="badge bg-primary mb-2 text-capitalize">{{ course.level }}</span>
              <h1 class="text-white mb-3">{{ course.title }}</h1>
              <p class="text-white-50 mb-4">{{ course.description }}</p>

              <div class="d-flex align-items-center gap-3 text-white-50 small mb-4">
                <span>★ {{ course.ratingAvg ? Number(course.ratingAvg).toFixed(1) : 'New' }}</span>
                <span>{{ course.totalStudents }} students</span>
                <span class="text-capitalize">{{ course.category }}</span>
              </div>

              <div v-if="course.instructor" class="d-flex align-items-center gap-2 text-white-50 small">
                <img :src="course.instructor.avatarUrl || defaultAvatar" class="rounded-circle" style="width:32px;height:32px;object-fit:cover" />
                <span>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
              </div>
            </b-col>

            <b-col lg="4">
              <b-card class="border-0 shadow-lg">
                <img :src="course.thumbnailUrl || defaultThumb" class="rounded mb-3 w-100" style="height:200px;object-fit:cover" />

                <div class="text-center mb-3">
                  <div v-if="course.isFree" class="fs-3 fw-bold text-success">Free</div>
                  <div v-else class="fs-3 fw-bold text-primary">$26 / month</div>
                </div>

                <div v-if="course.isEnrolled" class="d-grid">
                  <router-link :to="{ name: 'student.course.resume' }" class="btn btn-success btn-lg">
                    Continue Learning
                  </router-link>
                </div>
                <div v-else class="d-grid gap-2">
                  <b-button v-if="course.isFree" variant="primary" size="lg" @click="enrollFree" :disabled="enrolling">
                    <span v-if="enrolling" class="spinner-border spinner-border-sm me-1" />
                    Enroll for Free
                  </b-button>
                  <b-button v-else variant="primary" size="lg" @click="handleSubscribe" :disabled="subscribing">
                    <span v-if="subscribing" class="spinner-border spinner-border-sm me-1" />
                    Subscribe — $26/month
                  </b-button>
                  <p class="text-muted small text-center mb-0">Cancel anytime. Instant access.</p>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- Curriculum -->
      <section class="py-5">
        <b-container>
          <b-row class="g-4">
            <b-col lg="8">
              <h3 class="mb-4">Course Curriculum</h3>

              <div v-if="!course.sections?.length" class="text-muted">No curriculum added yet.</div>

              <b-accordion v-else id="curriculum" class="accordion-icon accordion-bg-light">
                <b-accordion-item
                  v-for="section in course.sections"
                  :key="section.id"
                  :title="section.title"
                  header-tag="h6"
                  header-class="font-base fw-bold"
                  class="mb-3"
                >
                  <div v-for="lesson in section.lessons" :key="lesson.id"
                    class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div class="d-flex align-items-center gap-2">
                      <span class="badge bg-light text-dark text-uppercase small">{{ lesson.contentType }}</span>
                      <span :class="{ 'text-muted': !lesson.contentUrl && !lesson.isFree }">{{ lesson.title }}</span>
                      <span v-if="lesson.isFree" class="badge bg-success-soft text-success small">Free</span>
                      <span v-if="!lesson.contentUrl && !course.isEnrolled" class="text-muted small">🔒</span>
                    </div>
                    <span v-if="lesson.duration" class="text-muted small">
                      {{ Math.round(lesson.duration / 60) }}m
                    </span>
                  </div>
                </b-accordion-item>
              </b-accordion>

              <!-- Zoom Classes -->
              <ZoomClasses :courseId="course.id" :isEnrolled="course.isEnrolled ?? false" />

              <!-- Reviews -->
              <div v-if="course.reviews?.length" class="mt-5">
                <h4 class="mb-4">Student Reviews</h4>
                <div v-for="review in course.reviews" :key="review.id" class="d-flex gap-3 mb-4">
                  <img :src="review.student?.avatarUrl || defaultAvatar" class="rounded-circle" style="width:40px;height:40px;object-fit:cover" />
                  <div>
                    <div class="fw-semibold">{{ review.student?.firstName }} {{ review.student?.lastName }}</div>
                    <div class="text-warning small mb-1">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</div>
                    <p class="mb-0 text-muted">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </b-col>

            <!-- Instructor sidebar -->
            <b-col lg="4" v-if="course.instructor">
              <b-card class="border bg-light">
                <h5 class="mb-3">About the Instructor</h5>
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img :src="course.instructor.avatarUrl || defaultAvatar" class="rounded-circle" style="width:56px;height:56px;object-fit:cover" />
                  <div>
                    <div class="fw-bold">{{ course.instructor.firstName }} {{ course.instructor.lastName }}</div>
                  </div>
                </div>
                <p class="text-muted small mb-0">{{ course.instructor.bio || 'No bio available.' }}</p>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PagesLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PagesLayout from '@/layouts/PagesLayout.vue'
import { useCourseStore } from '@/stores/course'
import { useSubscriptionStore } from '@/stores/subscription'
import { api } from '@/helpers/api'
import ZoomClasses from './ZoomClasses.vue'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import defaultAvatar from '@/assets/images/avatar/01.jpg'

const route = useRoute()
const store = useCourseStore()
const subStore = useSubscriptionStore()
const course = computed(() => store.currentCourse)
const enrolling = ref(false)
const subscribing = ref(false)

onMounted(() => {
  store.fetchCourseBySlug(route.params.slug as string)
})

async function handleSubscribe() {
  if (!course.value) return
  subscribing.value = true
  try {
    const checkoutUrl = await subStore.startCheckout(course.value.id)
    window.location.href = checkoutUrl
  } catch (e: any) {
    alert(e.message)
  } finally {
    subscribing.value = false
  }
}

async function enrollFree() {
  if (!course.value) return
  enrolling.value = true
  try {
    await api.post(`/courses/${course.value.id}/enroll`, {})
    await store.fetchCourseBySlug(route.params.slug as string)
  } catch (e: any) {
    alert(e.message)
  } finally {
    enrolling.value = false
  }
}
</script>

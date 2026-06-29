<template>
  <PagesLayout>
    <div v-if="store.loading && !course" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!course" class="text-center py-5">
      <h4 class="text-muted">Course not found</h4>
      <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mt-3">Browse Courses</router-link>
    </div>

    <template v-else>
      <!-- ─── Page intro ─────────────────────────────────────────────── -->
      <section class="bg-light py-0 py-sm-5">
        <b-container>
          <b-row class="py-5">
            <b-col lg="8">
              <h6 v-if="course.category" class="mb-3 font-base bg-primary text-white py-2 px-4 rounded-2 d-inline-block">
                {{ course.category }}
              </h6>
              <h1>{{ course.title }}</h1>
              <p>{{ course.description }}</p>
              <ul class="list-inline mb-0">
                <li class="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <font-awesome-icon :icon="faStar" class="text-warning me-1" />
                  {{ course.ratingAvg ? Number(course.ratingAvg).toFixed(1) : 'New' }}
                </li>
                <li class="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <font-awesome-icon :icon="faUserGraduate" class="text-orange me-1" />
                  {{ course.totalStudents }} Enrolled
                </li>
                <li class="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <font-awesome-icon :icon="faSignal" class="text-success me-1" />
                  <span class="text-capitalize">{{ course.level }}</span>
                </li>
                <li class="list-inline-item h6 mb-0">
                  <font-awesome-icon :icon="faGlobe" class="text-info me-1" />
                  English
                </li>
              </ul>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Page content ───────────────────────────────────────────── -->
      <section class="pb-0 py-lg-5">
        <b-container>
          <b-row>
            <!-- Left: tabbed card -->
            <b-col lg="8">
              <b-card no-body class="shadow rounded-2 p-0">
                <b-card-header class="border-bottom px-4 py-3">
                  <ul class="nav nav-pills nav-tabs-line py-0">
                    <li class="nav-item me-2 me-sm-4">
                      <button class="nav-link mb-2 mb-md-0" :class="tab === 1 && 'active'" @click="tab = 1">Overview</button>
                    </li>
                    <li class="nav-item me-2 me-sm-4">
                      <button class="nav-link mb-2 mb-md-0" :class="tab === 2 && 'active'" @click="tab = 2">Curriculum</button>
                    </li>
                    <li class="nav-item me-2 me-sm-4">
                      <button class="nav-link mb-2 mb-md-0" :class="tab === 3 && 'active'" @click="tab = 3">Instructor</button>
                    </li>
                    <li class="nav-item me-2 me-sm-4">
                      <button class="nav-link mb-2 mb-md-0" :class="tab === 4 && 'active'" @click="tab = 4">Reviews</button>
                    </li>
                  </ul>
                </b-card-header>

                <b-card-body class="p-4">
                  <!-- Overview -->
                  <div v-show="tab === 1">
                    <h5 class="mb-3">Course Description</h5>
                    <p class="mb-4">{{ course.description || 'No description provided yet.' }}</p>

                    <template v-if="learningPoints.length">
                      <h5 class="mb-3">What you'll learn</h5>
                      <b-row class="mb-0">
                        <b-col sm="6" v-for="(point, i) in learningPoints" :key="i">
                          <ul class="list-group list-group-borderless">
                            <li class="list-group-item h6 fw-light d-flex mb-0">
                              <BIconPatchCheckFill class="text-success me-2 mt-1" />{{ point }}
                            </li>
                          </ul>
                        </b-col>
                      </b-row>
                    </template>
                  </div>

                  <!-- Curriculum -->
                  <div v-show="tab === 2">
                    <div v-if="!course.sections?.length" class="text-muted">No curriculum added yet.</div>

                    <b-accordion v-else class="accordion-icon accordion-bg-light">
                      <b-accordion-item
                        v-for="(section, sIdx) in course.sections"
                        :key="section.id"
                        :visible="sIdx === 0"
                        header-tag="h6"
                        header-class="font-base"
                        button-class="fw-bold rounded"
                        class="mb-3"
                      >
                        <template #title>
                          {{ section.title }}
                          <span class="small ms-2">({{ section.lessons.length }} Lectures)</span>
                        </template>

                        <template v-for="(lesson, lIdx) in section.lessons" :key="lesson.id">
                          <button type="button"
                            class="lesson-row d-flex justify-content-between align-items-center w-100 text-start bg-transparent border-0 py-2"
                            @click="openLesson(lesson)">
                            <div class="d-flex align-items-center">
                              <span class="btn btn-danger-soft btn-round btn-sm mb-0 me-2">
                                <BIconCameraVideoFill v-if="lesson.contentType === 'zoom'" />
                                <font-awesome-icon v-else :icon="faPlay" class="me-0" />
                              </span>
                              <span class="h6 fw-light mb-0">{{ lesson.title }}</span>
                              <span v-if="lesson.isFree" class="badge bg-success-soft text-success ms-2">Free</span>
                              <span v-else-if="!course.isEnrolled" class="badge text-bg-orange ms-2">
                                <font-awesome-icon :icon="faLock" class="fa-fw me-1" />Premium
                              </span>
                            </div>
                            <span class="mb-0 small text-muted">{{ lesson.duration ? Math.round(lesson.duration / 60) + 'm' : '' }}</span>
                          </button>
                          <hr v-if="lIdx !== section.lessons.length - 1" class="my-0">
                        </template>
                      </b-accordion-item>
                    </b-accordion>

                    <ZoomClasses :courseId="course.id" :isEnrolled="course.isEnrolled ?? false" />
                  </div>

                  <!-- Instructor -->
                  <div v-show="tab === 3">
                    <div v-if="course.instructor" class="d-sm-flex align-items-center">
                      <div class="avatar avatar-xxl mb-3 mb-sm-0">
                        <img v-if="course.instructor.avatarUrl" :src="course.instructor.avatarUrl"
                          class="avatar-img rounded-circle" alt="instructor">
                        <span v-else
                          class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3">
                          {{ instructorInitials }}
                        </span>
                      </div>
                      <div class="ms-sm-4">
                        <h5 class="mb-0">{{ course.instructor.firstName }} {{ course.instructor.lastName }}</h5>
                        <p class="mb-2 small">Instructor at Usmani Academy</p>
                        <p class="mb-0">{{ course.instructor.bio || 'No bio available yet.' }}</p>
                      </div>
                    </div>
                    <div v-else class="text-muted">Instructor details not available.</div>
                  </div>

                  <!-- Reviews -->
                  <div v-show="tab === 4">
                    <div v-if="!course.reviews?.length" class="text-muted">No reviews yet. Be the first to review this course.</div>
                    <div v-else>
                      <div v-for="review in course.reviews" :key="review.id" class="d-flex gap-3 mb-4">
                        <div class="avatar avatar-md flex-shrink-0">
                          <img v-if="review.student?.avatarUrl" :src="review.student.avatarUrl" class="avatar-img rounded-circle" alt="">
                          <span v-else class="avatar-img rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center">
                            {{ (review.student?.firstName || '?')[0] }}
                          </span>
                        </div>
                        <div>
                          <div class="fw-semibold">{{ review.student?.firstName }} {{ review.student?.lastName }}</div>
                          <div class="text-warning small mb-1">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</div>
                          <p class="mb-0 text-muted">{{ review.comment }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-card-body>
              </b-card>
            </b-col>

            <!-- Right: pricing + info sidebar -->
            <b-col lg="4" class="pt-5 pt-lg-0">
              <b-card no-body class="shadow p-2 mb-4">
                <div class="overflow-hidden rounded-3 position-relative">
                  <img :src="course.thumbnailUrl || defaultThumb" class="card-img" alt="course img" style="height:200px;object-fit:cover">
                  <a v-if="course.promoVideoUrl" :href="course.promoVideoUrl" target="_blank"
                    class="position-absolute top-50 start-50 translate-middle btn btn-lg text-danger btn-round bg-white shadow">
                    <font-awesome-icon :icon="faPlay" />
                  </a>
                </div>

                <b-card-body class="px-3">
                  <div class="text-center mb-3">
                    <h3 v-if="course.isFree" class="fw-bold text-success mb-0">Free</h3>
                    <h3 v-else class="fw-bold text-primary mb-0">${{ monthlyPrice }} <span class="fs-6 fw-normal text-muted">/ month</span></h3>
                  </div>

                  <div v-if="course.isEnrolled" class="d-grid">
                    <router-link :to="{ name: 'course.learn', params: { slug } }" class="btn btn-success">Continue Learning</router-link>
                  </div>
                  <div v-else class="d-grid gap-2">
                    <b-button v-if="course.isFree" variant="primary" @click="enrollFree" :disabled="enrolling">
                      <span v-if="enrolling" class="spinner-border spinner-border-sm me-1" />
                      Enroll for Free
                    </b-button>
                    <b-button v-else variant="success" @click="handleSubscribe" :disabled="subscribing">
                      <span v-if="subscribing" class="spinner-border spinner-border-sm me-1" />
                      Subscribe — ${{ monthlyPrice }}/month
                    </b-button>
                    <p class="text-muted small text-center mb-0">Cancel anytime. Instant access.</p>
                  </div>
                </b-card-body>
              </b-card>

              <b-card no-body class="card-body shadow p-4">
                <h4 class="mb-3">This course includes</h4>
                <ul class="list-group list-group-borderless">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="h6 fw-light mb-0"><font-awesome-icon :icon="faBookOpen" class="fa-fw text-primary" /> Lectures</span>
                    <span>{{ totalLectures }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="h6 fw-light mb-0"><BIconCameraVideoFill class="fa-fw text-primary" /> Live Zoom classes</span>
                    <span>{{ liveClassesCount }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="h6 fw-light mb-0"><font-awesome-icon :icon="faSignal" class="fa-fw text-primary" /> Level</span>
                    <span class="text-capitalize">{{ course.level }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="h6 fw-light mb-0"><font-awesome-icon :icon="faGlobe" class="fa-fw text-primary" /> Language</span>
                    <span>English</span>
                  </li>
                </ul>
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
import router from '@/router'
import PagesLayout from '@/layouts/PagesLayout.vue'
import { useCourseStore } from '@/stores/course'
import { useSubscriptionStore } from '@/stores/subscription'
import { api } from '@/helpers/api'
import ZoomClasses from './ZoomClasses.vue'
import { BIconPatchCheckFill, BIconCameraVideoFill } from 'bootstrap-icons-vue'
import { faStar, faUserGraduate, faSignal, faGlobe, faPlay, faLock, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'

const route = useRoute()
const store = useCourseStore()
const subStore = useSubscriptionStore()
const course = computed(() => store.currentCourse as any)
const slug = computed(() => route.params.slug as string)
const tab = ref(1)
const enrolling = ref(false)
const subscribing = ref(false)

const monthlyPrice = computed(() => course.value?.price || 26)
const learningPoints = computed<string[]>(() =>
  Array.isArray(course.value?.learningPoints) ? course.value.learningPoints.filter((p: string) => p && p.trim()) : []
)
const totalLectures = computed(() =>
  (course.value?.sections || []).reduce((sum: number, s: any) => sum + (s.lessons?.length || 0), 0)
)
const liveClassesCount = computed(() =>
  (course.value?.sections || []).reduce(
    (sum: number, s: any) => sum + (s.lessons?.filter((l: any) => l.contentType === 'zoom').length || 0), 0)
)
const instructorInitials = computed(() => {
  const i = course.value?.instructor
  if (!i) return '?'
  return [(i.firstName || '')[0], (i.lastName || '')[0]].filter(Boolean).join('').toUpperCase()
})

onMounted(() => {
  store.fetchCourseBySlug(route.params.slug as string)
})

function openLesson(lesson: any) {
  router.push({ name: 'course.learn', params: { slug: slug.value }, query: { lesson: lesson.id } })
}

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

<style scoped>
.lesson-row:hover .h6 { color: var(--bs-primary); }
</style>

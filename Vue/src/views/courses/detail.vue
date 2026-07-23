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
      <section class="course-hero py-0 py-sm-5">
        <b-container>
          <b-row class="py-5">
            <b-col lg="8">
              <h6 v-if="course.category" class="mb-3 font-base bg-white text-primary py-2 px-4 rounded-pill d-inline-block">
                {{ course.category }}
              </h6>
              <h1 class="text-white">{{ course.title }}</h1>
              <p class="text-white opacity-75 mb-3">{{ course.description }}</p>
              <ul class="list-inline mb-0">
                <li class="list-inline-item h6 fw-light text-white me-3 mb-1 mb-sm-0">
                  <font-awesome-icon :icon="faStar" class="text-warning me-1" />
                  {{ course.ratingAvg ? Number(course.ratingAvg).toFixed(1) : 'New' }}
                </li>
                <li class="list-inline-item h6 fw-light text-white me-3 mb-1 mb-sm-0">
                  <font-awesome-icon :icon="faSignal" class="me-1" />
                  <span class="text-capitalize">{{ course.level }}</span>
                </li>
                <li class="list-inline-item h6 fw-light text-white mb-0">
                  <font-awesome-icon :icon="faGlobe" class="me-1" />
                  {{ course.language || 'English' }}
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
                    <p class="mb-4" style="white-space:pre-line">{{ course.fullDescription || 'No detailed description provided yet.' }}</p>

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
              <b-card no-body class="shadow p-2 mb-4 z-index-9">
                <div class="overflow-hidden rounded-3 position-relative">
                  <img :src="course.thumbnailUrl || defaultThumb" class="card-img" alt="course img" style="height:210px;object-fit:cover">
                  <template v-if="course.promoVideoUrl">
                    <div class="bg-overlay bg-dark opacity-6"></div>
                    <div class="card-img-overlay d-flex align-items-center justify-content-center">
                      <CustomGLightbox :link="course.promoVideoUrl" class="btn btn-lg text-danger btn-round bg-white shadow mb-0">
                        <font-awesome-icon :icon="faPlay" />
                      </CustomGLightbox>
                    </div>
                  </template>
                </div>

                <b-card-body class="px-3">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <div v-if="course.isFree">
                        <h3 class="fw-bold mb-0 text-success">Free</h3>
                      </div>
                      <div v-else class="d-flex align-items-center flex-wrap gap-2">
                        <h3 class="fw-bold mb-0">${{ displayPrice }}<span v-if="priceSuffix" class="fs-6 fw-normal text-body">{{ priceSuffix }}</span></h3>
                        <span v-if="hasDiscount" class="text-decoration-line-through text-muted">${{ course.originalPrice }}</span>
                        <span v-if="hasDiscount" class="badge text-bg-orange mb-0">{{ discountPercent }}% off</span>
                      </div>
                      <p v-if="daysLeft > 0" class="mb-0 text-danger small mt-1">
                        <font-awesome-icon :icon="faStopwatch" class="me-1" />
                        {{ daysLeft }} day{{ daysLeft === 1 ? '' : 's' }} left at this price
                      </p>
                    </div>

                    <!-- Share -->
                    <b-dropdown end variant="link" toggle-class="btn btn-sm btn-light rounded small"
                      menu-class="dropdown-menu-end shadow rounded" no-caret>
                      <template #button-content>
                        <font-awesome-icon :icon="faShareAlt" class="fa-fw" />
                      </template>
                      <b-dropdown-item :href="shareLinks.twitter" target="_blank">
                        <font-awesome-icon :icon="faTwitterSquare" class="me-2" />Twitter
                      </b-dropdown-item>
                      <b-dropdown-item :href="shareLinks.facebook" target="_blank">
                        <font-awesome-icon :icon="faFacebookSquare" class="me-2" />Facebook
                      </b-dropdown-item>
                      <b-dropdown-item :href="shareLinks.linkedin" target="_blank">
                        <font-awesome-icon :icon="faLinkedinIn" class="me-2" />LinkedIn
                      </b-dropdown-item>
                      <b-dropdown-item href="#" @click.prevent="copyLink">
                        <font-awesome-icon :icon="faCopy" class="me-2" />{{ copied ? 'Copied!' : 'Copy link' }}
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>

                  <div class="mt-3">
                    <div v-if="course.isEnrolled" class="d-grid">
                      <router-link :to="{ name: 'course.learn', params: { slug } }" class="btn btn-success mb-0">Continue Learning</router-link>
                    </div>
                    <div v-else class="d-grid">
                      <b-button variant="success" class="mb-0" @click="enroll" :disabled="enrolling || subscribing">
                        <span v-if="enrolling || subscribing" class="spinner-border spinner-border-sm me-1" />Enroll now
                      </b-button>
                    </div>
                    <b-button
                      variant="outline-danger"
                      class="w-100 mt-2 mb-0"
                      @click="toggle(course.id)"
                    >
                      <font-awesome-icon :icon="isSaved(course.id) ? faHeartSolid : faHeartRegular" class="me-1" />
                      {{ isSaved(course.id) ? 'Saved to Wishlist' : 'Add to Wishlist' }}
                    </b-button>
                  </div>
                </b-card-body>
              </b-card>

              <b-card no-body class="card-body shadow p-4">
                <h4 class="mb-3">This course includes</h4>
                <ul class="list-group list-group-borderless">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="h6 fw-light mb-0"><font-awesome-icon :icon="faClock" class="fa-fw text-primary" /> Duration</span>
                    <span>{{ course.duration || 'Self-paced' }}</span>
                  </li>
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
                    <span>{{ course.language || 'English' }}</span>
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
import { useAuthStore } from '@/stores/auth'
import { api } from '@/helpers/api'
import CustomGLightbox from '@/components/CustomGLightbox.vue'
import { BIconPatchCheckFill, BIconCameraVideoFill } from 'bootstrap-icons-vue'
import { faStar, faSignal, faGlobe, faPlay, faLock, faClock, faBookOpen, faStopwatch, faShareAlt, faCopy, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faTwitterSquare, faFacebookSquare, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import { useWishlist } from '@/composables/useWishlist'

const route = useRoute()
const store = useCourseStore()
const subStore = useSubscriptionStore()
const auth = useAuthStore()
const { isSaved, toggle } = useWishlist()
const course = computed(() => store.currentCourse as any)
const slug = computed(() => route.params.slug as string)
const tab = ref(1)
const enrolling = ref(false)
const subscribing = ref(false)

const displayPrice = computed(() => course.value?.price || 26)
const isOneTime = computed(() => course.value?.paymentType === 'one_time')
const priceSuffix = computed(() => (isOneTime.value ? '' : '/month'))
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

// ─── Discount ────────────────────────────────────────────────────────────────
const hasDiscount = computed(() => {
  const o = course.value?.originalPrice
  return !course.value?.isFree && o && o > displayPrice.value
})
const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const o = course.value.originalPrice
  return Math.round(((o - displayPrice.value) / o) * 100)
})
const daysLeft = computed(() => {
  const end = course.value?.discountEndsAt
  if (!end) return 0
  const diff = new Date(end).getTime() - Date.now()
  return diff > 0 ? Math.ceil(diff / 86400000) : 0
})

// ─── Share ───────────────────────────────────────────────────────────────────
const pageUrl = computed(() => (typeof window !== 'undefined' ? window.location.href : ''))
const shareLinks = computed(() => {
  const u = encodeURIComponent(pageUrl.value)
  const t = encodeURIComponent(course.value?.title || 'Usmani Academy course')
  return {
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
  }
})
const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
  } catch {
    // Fallback for older browsers / insecure contexts
    const ta = document.createElement('textarea')
    ta.value = pageUrl.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

onMounted(async () => {
  await store.fetchCourseBySlug(route.params.slug as string)
  // Resume an enrolment the user started before signing up / in: if they arrived
  // with ?enroll=1, are now signed in, and aren't already enrolled, continue
  // automatically (free → enrol + open; paid → checkout). Strip the flag so a
  // back-navigation doesn't re-trigger it.
  if (route.query.enroll && auth.isAuthenticated() && course.value && !course.value.isEnrolled) {
    router.replace({ query: {} })
    enroll()
  }
})

function openLesson(lesson: any) {
  router.push({ name: 'course.learn', params: { slug: slug.value }, query: { lesson: lesson.id } })
}

function enroll() {
  // Guests must create an account first. Remember the course AND the intent to
  // enrol (?enroll=1) so we can resume it automatically once they're signed in.
  if (!auth.isAuthenticated()) {
    router.push({ name: 'auth.sign-up', query: { redirectedFrom: `${route.path}?enroll=1` } })
    return
  }
  // Admins / instructors don't enroll — let them preview the player
  if (auth.userRole() && auth.userRole() !== 'student') {
    router.push({ name: 'course.learn', params: { slug: slug.value } })
    return
  }
  // Students: free → instant enroll, paid → Stripe checkout
  if (course.value?.isFree) enrollFree()
  else handleSubscribe()
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
    router.push({ name: 'course.learn', params: { slug: slug.value } })
  } catch (e: any) {
    alert(e.message)
  } finally {
    enrolling.value = false
  }
}
</script>

<style scoped>
.lesson-row:hover .h6 { color: var(--bs-primary); }

/* Header banner: same green gradient + rounded corner treatment used site-wide */
.course-hero {
  background: radial-gradient(circle at 25% 15%, rgba(255,255,255,0.14), transparent 55%), linear-gradient(135deg, var(--bs-primary), var(--bs-dark));
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
}
</style>

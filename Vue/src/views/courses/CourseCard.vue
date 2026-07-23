<template>
  <router-link :to="{ name: 'course.detail.slug', params: { slug: course.slug } }" class="text-decoration-none">
    <b-card no-body class="shadow h-100 course-card overflow-hidden">
      <div class="position-relative overflow-hidden" style="height:220px">
        <img
          :src="course.thumbnailUrl || defaultThumb"
          class="w-100 h-100 course-card-img"
          style="object-fit:cover"
          :alt="course.title"
        />
        <!-- Wishlist heart -->
        <button
          type="button"
          class="wishlist-btn position-absolute top-0 start-0 m-2"
          :class="{ saved: isSaved(course.id) }"
          :title="isSaved(course.id) ? 'Remove from wishlist' : 'Save to wishlist'"
          @click.prevent.stop="toggle(course.id)"
        >
          <font-awesome-icon :icon="isSaved(course.id) ? faHeartSolid : faHeartRegular" />
        </button>
        <!-- Category badge -->
        <span v-if="course.category" class="badge bg-primary position-absolute top-0 end-0 m-2">{{ course.category }}</span>
      </div>

      <b-card-body class="d-flex flex-column">
        <h5 class="fw-bold mb-2 text-dark course-card-title">{{ course.title }}</h5>

        <!-- Price (with discount) -->
        <div class="mb-3 d-flex align-items-baseline flex-wrap gap-2">
          <span v-if="course.isFree" class="course-price fw-bold text-success">Free</span>
          <template v-else>
            <span class="course-price fw-bold text-primary">
              ${{ course.price || 26 }}<span v-if="priceUnit" class="course-price-unit text-muted fw-normal">{{ priceUnit }}</span>
            </span>
            <span v-if="hasDiscount" class="course-price-old text-muted text-decoration-line-through">
              ${{ course.originalPrice }}
            </span>
            <span v-if="hasDiscount" class="badge bg-danger-subtle text-danger fw-semibold">
              Save {{ discountPercent }}%
            </span>
          </template>
        </div>

        <!-- Instructor (left) + language/duration tags (right) -->
        <div class="d-flex align-items-center gap-2 mt-auto pt-3 border-top">
          <template v-if="course.instructor">
            <img
              v-if="course.instructor.avatarUrl"
              :src="course.instructor.avatarUrl"
              class="rounded-circle flex-shrink-0"
              style="width:26px;height:26px;object-fit:cover"
              :alt="`${course.instructor.firstName} ${course.instructor.lastName}`"
            />
            <span
              v-else
              class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style="width:26px;height:26px;font-size:0.7rem"
            >{{ instructorInitials }}</span>
            <span class="small text-muted text-truncate">{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
          </template>

          <div class="ms-auto d-flex align-items-center gap-2 flex-shrink-0">
            <span v-if="durationLabel" class="badge course-tag">
              <font-awesome-icon :icon="faClock" class="me-1" />{{ durationLabel }}
            </span>
            <span class="badge course-tag">
              <font-awesome-icon :icon="faGlobe" class="me-1" />{{ course.language || 'English' }}
            </span>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Course } from '@/stores/course'
import { useWishlist } from '@/composables/useWishlist'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import { faGlobe, faClock } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

const props = defineProps<{ course: Course }>()

const { isSaved, toggle } = useWishlist()

const priceUnit = computed(() => (props.course.paymentType === 'one_time' ? '' : '/mo'))

const instructorInitials = computed(() => {
  const i = props.course.instructor
  if (!i) return ''
  return [(i.firstName || '')[0], (i.lastName || '')[0]].filter(Boolean).join('').toUpperCase()
})

const durationLabel = computed(() => props.course.duration || '')

const hasDiscount = computed(() => {
  const p = props.course.price || 0
  const o = props.course.originalPrice || 0
  return !props.course.isFree && o > p && p > 0
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round((1 - (props.course.price! / props.course.originalPrice!)) * 100)
})
</script>

<style scoped>
.course-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
}
.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
.course-card:hover .course-card-img {
  transform: scale(1.05);
}
.course-card-img {
  transition: transform 0.4s ease;
}
.course-card-title {
  font-size: 1.15rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.95rem;
}
.course-price {
  font-size: 1.5rem;
  line-height: 1.1;
}
.course-price-unit {
  font-size: 0.9rem;
}
.course-price-old {
  font-size: 1rem;
}
.course-tag {
  background: var(--bs-light);
  color: #495057;
  border: 1px solid var(--bs-border-color);
  font-weight: 500;
  font-size: 0.75rem;
}
.wishlist-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  z-index: 2;
}
.wishlist-btn:hover {
  background: #fff;
  color: #dc3545;
  transform: scale(1.1);
}
.wishlist-btn.saved {
  color: #dc3545;
}
</style>

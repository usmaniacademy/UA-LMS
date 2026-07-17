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

        <!-- Price -->
        <div class="mb-2">
          <span v-if="course.isFree" class="fw-bold text-success fs-6">Free</span>
          <span v-else class="fw-bold text-primary fs-6">
            ${{ course.price || 26 }}<span class="text-muted small fw-normal">/mo</span>
          </span>
        </div>

        <!-- Language + duration tags -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge course-tag">
            <font-awesome-icon :icon="faGlobe" class="me-1" />{{ course.language || 'English' }}
          </span>
          <span v-if="durationLabel" class="badge course-tag">
            <font-awesome-icon :icon="faClock" class="me-1" />{{ durationLabel }}
          </span>
        </div>

        <!-- Instructor -->
        <div v-if="course.instructor" class="d-flex align-items-center gap-2 mt-auto pt-2 border-top">
          <img
            v-if="course.instructor.avatarUrl"
            :src="course.instructor.avatarUrl"
            class="rounded-circle"
            style="width:26px;height:26px;object-fit:cover"
            :alt="`${course.instructor.firstName} ${course.instructor.lastName}`"
          />
          <span
            v-else
            class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style="width:26px;height:26px;font-size:0.7rem"
          >{{ instructorInitials }}</span>
          <span class="small text-muted">{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
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

const instructorInitials = computed(() => {
  const i = props.course.instructor
  if (!i) return ''
  return [(i.firstName || '')[0], (i.lastName || '')[0]].filter(Boolean).join('').toUpperCase()
})

const durationLabel = computed(() => {
  const secs = props.course.totalDuration || 0
  if (!secs) return ''
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
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

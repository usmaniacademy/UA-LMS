<template>
  <router-link :to="{ name: 'course.detail.slug', params: { slug: course.slug } }" class="text-decoration-none">
    <b-card no-body class="shadow h-100 course-card">
      <div class="position-relative overflow-hidden" style="height:180px">
        <img
          :src="course.thumbnailUrl || defaultThumb"
          class="w-100 h-100"
          style="object-fit:cover"
          :alt="course.title"
        />
        <span v-if="course.isFree" class="badge bg-success position-absolute top-0 start-0 m-2">Free</span>
        <span v-else class="badge bg-gold position-absolute top-0 start-0 m-2">$26/mo</span>
        <span class="badge bg-primary position-absolute top-0 end-0 m-2 text-capitalize">{{ course.level }}</span>
      </div>

      <b-card-body class="d-flex flex-column">
        <div class="text-muted small mb-1">{{ course.category }}</div>
        <h6 class="fw-bold mb-2 text-dark" style="line-height:1.3">{{ course.title }}</h6>

        <div v-if="course.instructor" class="d-flex align-items-center gap-2 mb-3">
          <img
            :src="course.instructor.avatarUrl || defaultAvatar"
            class="rounded-circle"
            style="width:24px;height:24px;object-fit:cover"
            :alt="`${course.instructor.firstName} ${course.instructor.lastName}`"
          />
          <span class="small text-muted">{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
        </div>

        <div class="mt-auto d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-1">
            <span class="text-warning small">★</span>
            <span class="small fw-semibold">{{ course.ratingAvg ? Number(course.ratingAvg).toFixed(1) : 'New' }}</span>
          </div>
          <span class="small text-muted">{{ course.totalStudents }} student{{ course.totalStudents !== 1 ? 's' : '' }}</span>
        </div>
      </b-card-body>
    </b-card>
  </router-link>
</template>

<script setup lang="ts">
import type { Course } from '@/stores/course'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import defaultAvatar from '@/assets/images/avatar/01.jpg'

defineProps<{ course: Course }>()
</script>

<style scoped>
.course-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
</style>

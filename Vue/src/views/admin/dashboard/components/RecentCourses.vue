<template>
  <b-col xxl="4">
    <b-card no-body class="shadow h-100">
      <b-card-header class="border-bottom d-flex justify-content-between align-items-center p-4">
        <h5 class="card-header-title">Recent Courses</h5>
        <router-link :to="{ name: 'admin.course-list' }" class="btn btn-link p-0 mb-0">View all</router-link>
      </b-card-header>
      <b-card-body class="p-4">
        <div v-if="admin.loading && !courses.length" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="!courses.length" class="text-center text-muted py-4">
          No courses created yet.
        </div>

        <template v-else>
          <template v-for="(course, idx) in courses" :key="course.id">
            <hr v-if="idx">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="w-50px flex-shrink-0">
                  <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" class="rounded" alt="">
                  <span v-else class="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                    style="width:50px;height:40px;">
                    <font-awesome-icon :icon="faBook" />
                  </span>
                </div>
                <div class="ms-2">
                  <h6 class="mb-0">{{ course.title }}</h6>
                  <small class="text-muted">
                    {{ course.instructor.firstName }} {{ course.instructor.lastName }}
                    · {{ course._count.enrollments }} students
                  </small>
                </div>
              </div>
              <span class="badge bg-opacity-10 text-capitalize ms-2 flex-shrink-0"
                :class="course.status === 'published' ? 'bg-success text-success' : 'bg-warning text-warning'">
                {{ course.status }}
              </span>
            </div>
          </template>
        </template>
      </b-card-body>
    </b-card>
  </b-col>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const admin = useAdminStore();
const courses = computed(() => admin.courses.slice(0, 5));

onMounted(() => {
  if (!admin.courses.length) admin.fetchCourses();
});
</script>

<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12" class="d-sm-flex justify-content-between align-items-center">
        <div>
          <router-link :to="{ name: 'admin.course-list' }" class="btn btn-sm btn-light mb-2">
            <font-awesome-icon :icon="faAngleLeft" class="me-1" /> Back to courses
          </router-link>
          <h1 class="h3 mb-0">Course details</h1>
        </div>
        <router-link v-if="course" :to="{ name: 'instructor.edit.course', params: { id: course.id } }"
          class="btn btn-sm btn-primary mb-0">Edit course</router-link>
      </b-col>
    </b-row>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else-if="course">
      <!-- Hero -->
      <b-card no-body class="border rounded-3 mb-4 overflow-hidden">
        <div class="d-md-flex">
          <div class="course-hero-thumb">
            <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" alt="">
            <div v-else class="course-hero-placeholder flex-centered text-center p-4">
              <span class="fw-bold text-primary">{{ course.title }}</span>
            </div>
          </div>
          <div class="p-4 flex-grow-1 d-flex flex-column justify-content-center">
            <div class="d-flex flex-wrap gap-2 mb-2">
              <span v-if="course.category" class="badge bg-primary bg-opacity-10 text-primary">{{ course.category }}</span>
              <span class="badge text-capitalize" :class="statusBadge">{{ course.status }}</span>
              <span class="badge"
                :class="course.isFree ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'">
                {{ priceLabel }}
              </span>
            </div>
            <h2 class="mb-2">{{ course.title }}</h2>
            <div class="d-flex align-items-center">
              <div class="avatar avatar-xs">
                <span class="avatar-img rounded-circle bg-primary bg-opacity-10 text-primary flex-centered fw-bold"
                  style="font-size:.6rem">{{ instructorInitials }}</span>
              </div>
              <span class="ms-2 text-muted small">By {{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
            </div>
          </div>
        </div>
      </b-card>

      <!-- Metrics -->
      <b-row class="g-3 mb-4">
        <b-col sm="6" xl="3" v-for="(m, i) in metrics" :key="i">
          <b-card no-body class="border rounded-3 h-100">
            <b-card-body class="d-flex align-items-center">
              <div class="icon-lg rounded-3 flex-centered flex-shrink-0" :class="m.cls">
                <font-awesome-icon :icon="m.icon" />
              </div>
              <div class="ms-3">
                <h4 class="mb-0 text-capitalize">{{ m.value }}</h4>
                <span class="small text-muted">{{ m.label }}</span>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <!-- About -->
      <b-card no-body class="border rounded-3 mb-4">
        <b-card-header class="bg-transparent border-bottom">
          <h5 class="mb-0">About this course</h5>
        </b-card-header>
        <b-card-body>
          <p class="mb-0 course-about">{{ course.description || 'No description added.' }}</p>
        </b-card-body>
      </b-card>

      <!-- Curriculum -->
      <b-card no-body class="border rounded-3">
        <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Curriculum</h5>
          <span class="small text-muted">{{ course.sections.length }} sections · {{ totalLectures }} lessons</span>
        </b-card-header>
        <b-card-body>
          <div v-if="!course.sections.length" class="text-center py-5">
            <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary flex-centered mx-auto mb-3">
              <font-awesome-icon :icon="faLayerGroup" />
            </div>
            <h6 class="mb-1">No lessons yet</h6>
            <p class="small text-muted mb-0">Add sections and lessons from the course editor.</p>
          </div>
          <div v-else>
            <div v-for="section in course.sections" :key="section.id" class="mb-3">
              <div class="d-flex align-items-center justify-content-between bg-light rounded-2 px-3 py-2 mb-2">
                <h6 class="mb-0">{{ section.title }}</h6>
                <span class="small text-muted">{{ section.lessons.length }} lessons</span>
              </div>
              <ul class="list-group list-group-borderless mb-0">
                <li v-for="lesson in section.lessons" :key="lesson.id"
                  class="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                  <span>{{ lesson.title }}</span>
                  <span class="badge bg-primary bg-opacity-10 text-primary text-capitalize">{{ lesson.contentType }}</span>
                </li>
              </ul>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </template>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';
import { currency } from '@/helpers/constants';
import { faStar, faAngleLeft, faUserGraduate, faLayerGroup, faSignal } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const admin = useAdminStore();

const course = ref<any>(null);
const loading = ref(true);
const error = ref('');

const statusBadge = computed(() =>
  course.value?.status === 'published' ? 'bg-success bg-opacity-10 text-success'
    : course.value?.status === 'draft' ? 'bg-warning bg-opacity-10 text-warning'
      : 'bg-secondary bg-opacity-10 text-secondary'
);
const totalLectures = computed(() =>
  course.value ? course.value.sections.reduce((n: number, s: any) => n + s.lessons.length, 0) : 0
);
const instructorInitials = computed(() =>
  course.value ? ((course.value.instructor.firstName?.[0] || '') + (course.value.instructor.lastName?.[0] || '')).toUpperCase() : ''
);
const priceLabel = computed(() => {
  if (!course.value) return '';
  if (course.value.isFree) return 'Free';
  return course.value.price ? `${currency}${course.value.price}/mo` : 'Paid';
});

const metrics = computed(() => course.value ? [
  { icon: faUserGraduate, label: 'Enrolled students', value: course.value.totalStudents, cls: 'bg-primary bg-opacity-10 text-primary' },
  { icon: faLayerGroup, label: 'Total lessons', value: totalLectures.value, cls: 'bg-primary bg-opacity-10 text-primary' },
  { icon: faStar, label: 'Rating', value: course.value.ratingAvg ? Number(course.value.ratingAvg).toFixed(1) : 'New', cls: 'bg-warning bg-opacity-10 text-warning' },
  { icon: faSignal, label: 'Level', value: course.value.level, cls: 'bg-success bg-opacity-10 text-success' },
] : []);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    course.value = await admin.fetchCourseForAdmin(route.params.id as string);
  } catch (e: any) {
    error.value = e.message || 'Failed to load course';
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.id, load);
onMounted(load);
</script>
<style scoped>
.course-hero-thumb {
  width: 260px;
  flex-shrink: 0;
}
.course-hero-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.course-hero-placeholder {
  height: 100%;
  min-height: 175px;
  background: rgba(var(--bs-primary-rgb), 0.08);
}
.course-about {
  max-height: 220px;
  overflow-y: auto;
  white-space: pre-line;
  line-height: 1.7;
}
@media (max-width: 767.98px) {
  .course-hero-thumb { width: 100%; }
  .course-hero-placeholder { min-height: 140px; }
}
</style>

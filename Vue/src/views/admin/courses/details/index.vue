<template>
  <AdminLayout>
    <b-row class="mb-3">
      <b-col cols="12" class="d-sm-flex justify-content-between align-items-center">
        <div>
          <router-link :to="{ name: 'admin.course-list' }" class="btn btn-sm btn-light mb-2">
            <font-awesome-icon :icon="faAngleLeft" class="me-1" /> Back to Courses
          </router-link>
          <h1 class="h3 mb-0">Course Details</h1>
        </div>
        <router-link v-if="course" :to="{ name: 'instructor.edit.course', params: { id: course.id } }"
          class="btn btn-sm btn-primary mb-0">Edit Course</router-link>
      </b-col>
    </b-row>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <b-row v-else-if="course" class="g-4">
      <!-- Course info -->
      <b-col xxl="6">
        <b-card no-body class="bg-transparent border rounded-3 h-100">
          <b-card-header class="bg-light border-bottom d-flex justify-content-between align-items-center">
            <h5 class="card-header-title mb-0">{{ course.title }}</h5>
            <span class="badge text-capitalize" :class="statusBadge">{{ course.status }}</span>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col md="6">
                <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" class="rounded w-100" alt="">
                <div v-else class="rounded bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-center p-3"
                  style="min-height:150px">
                  <span class="text-primary fw-bold">{{ course.title }}</span>
                </div>
              </b-col>
              <b-col md="6">
                <p class="mb-3">{{ course.description || 'No short description.' }}</p>
                <h5 class="mb-3">{{ priceLabel }}</h5>
                <div class="d-sm-flex align-items-center">
                  <div class="avatar avatar-md">
                    <span
                      class="avatar-img rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold">
                      {{ instructorInitials }}
                    </span>
                  </div>
                  <div class="ms-sm-3 mt-2 mt-sm-0">
                    <h6 class="mb-0">By {{ course.instructor.firstName }} {{ course.instructor.lastName }}</h6>
                    <p class="mb-0 small">Instructor</p>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col md="6">
                <ul class="list-group list-group-borderless">
                  <li class="list-group-item d-flex justify-content-between"><span>Release date:</span><span class="h6 mb-0">{{ formatDate(course.createdAt) }}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span>Total enrolled:</span><span class="h6 mb-0">{{ course.totalStudents }}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span>Category:</span><span class="h6 mb-0">{{ course.category || '—' }}</span></li>
                </ul>
              </b-col>
              <b-col md="6">
                <ul class="list-group list-group-borderless">
                  <li class="list-group-item d-flex justify-content-between"><span>Level:</span><span class="h6 mb-0 text-capitalize">{{ course.level }}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span>Total lectures:</span><span class="h6 mb-0">{{ totalLectures }}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span>Rating:</span><span class="h6 mb-0">{{ course.ratingAvg ? Number(course.ratingAvg).toFixed(1) : 'New' }}
                    <font-awesome-icon :icon="faStar" class="text-warning ms-1" /></span></li>
                </ul>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>

      <!-- Curriculum -->
      <b-col xxl="6">
        <b-card no-body class="bg-transparent border rounded-3 h-100">
          <b-card-header class="bg-light border-bottom">
            <h5 class="card-header-title mb-0">Curriculum ({{ totalLectures }} lectures)</h5>
          </b-card-header>
          <b-card-body>
            <div v-if="!course.sections.length" class="text-muted small">No curriculum added yet.</div>
            <div v-for="section in course.sections" :key="section.id" class="mb-3">
              <h6 class="mb-2">{{ section.title }}</h6>
              <ul class="list-group list-group-borderless">
                <li v-for="lesson in section.lessons" :key="lesson.id"
                  class="list-group-item d-flex justify-content-between align-items-center py-1">
                  <span>{{ lesson.title }}</span>
                  <span class="badge bg-primary bg-opacity-10 text-primary text-capitalize">{{ lesson.contentType }}</span>
                </li>
              </ul>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdminStore } from '@/stores/admin';
import { currency } from '@/helpers/constants';
import { faStar, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const admin = useAdminStore();

const course = ref<any>(null);
const loading = ref(true);
const error = ref('');

const statusBadge = computed(() =>
  course.value?.status === 'published' ? 'bg-success-soft text-success'
    : course.value?.status === 'draft' ? 'bg-warning-soft text-warning'
      : 'bg-secondary-soft text-secondary'
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

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

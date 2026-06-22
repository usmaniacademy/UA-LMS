<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">Continue Learning</h3>
        </b-card-header>
        <b-card-body>
          <div v-if="store.loading && !enrolled.length" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="!enrolled.length" class="text-center py-5">
            <p class="text-muted mb-3">You don't have any courses in progress.</p>
            <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mb-0">Browse courses</router-link>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="item in enrolled" :key="item.id"
              class="d-flex justify-content-between align-items-center border rounded-3 p-3">
              <div class="d-flex align-items-center">
                <div class="w-60px">
                  <img v-if="item.course.thumbnailUrl" :src="item.course.thumbnailUrl" class="rounded" alt="">
                  <span v-else class="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                    style="width:60px;height:45px;"><BIconPlayCircle /></span>
                </div>
                <div class="ms-2">
                  <h6 class="mb-0">{{ item.course.title }}</h6>
                  <small class="text-muted">{{ item.course.category }}</small>
                </div>
              </div>
              <router-link :to="{ name: 'course.detail.slug', params: { slug: item.course.slug } }"
                class="btn btn-sm btn-primary-soft mb-0">Resume</router-link>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </StudentLayout>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import StudentLayout from '@/layouts/StudentLayout.vue';
import { useCourseStore } from '@/stores/course';
import { BIconPlayCircle } from 'bootstrap-icons-vue';

const store = useCourseStore();
const enrolled = computed(() => store.enrolledCourses);

onMounted(() => store.fetchEnrolledCourses());
</script>

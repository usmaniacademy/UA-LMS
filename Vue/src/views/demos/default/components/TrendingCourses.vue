<template>
  <section class="pb-5 pt-5">
    <b-container>
      <b-row class="mb-4">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold mb-3">Explore Our Courses</h2>
          <p class="mb-0">Islamic Studies, Science, and Technology — taught by qualified instructors.</p>
        </b-col>
      </b-row>

      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <template v-else-if="store.courses.length">
        <b-row class="g-4">
          <b-col sm="6" xl="4" v-for="course in store.courses" :key="course.id">
            <CourseCard :course="course" />
          </b-col>
        </b-row>
        <div class="text-center mt-4">
          <router-link :to="{ name: 'courses.list' }" class="btn btn-outline-primary">View all courses</router-link>
        </div>
      </template>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCourseStore } from '@/stores/course';
import CourseCard from '@/views/courses/CourseCard.vue';

const store = useCourseStore();

onMounted(() => store.fetchPublicCourses({ limit: 6 }));
</script>

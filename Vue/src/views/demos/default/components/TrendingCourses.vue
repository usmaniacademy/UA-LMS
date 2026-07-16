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
        <!-- 3 or fewer: plain grid, no point sliding through nothing -->
        <b-row v-if="store.courses.length <= 3" class="g-4">
          <b-col sm="6" xl="4" v-for="course in store.courses" :key="course.id">
            <CourseCard :course="course" />
          </b-col>
        </b-row>

        <!-- More than 3: slider, same arrow/dot treatment as the other carousels -->
        <div v-else class="arrow-blur arrow-hover dots-inside dots-primary rounded-3 overflow-hidden pb-2">
          <CustomTinySlider :settings="settings" id="trending-courses-slider">
            <div v-for="course in store.courses" :key="course.id" class="px-2">
              <CourseCard :course="course" />
            </div>
          </CustomTinySlider>
        </div>

        <div class="text-center mt-4">
          <router-link :to="{ name: 'courses.list' }" class="btn btn-outline-primary">View all courses</router-link>
        </div>
      </template>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import type { TinySliderSettings } from 'tiny-slider';
import { useCourseStore } from '@/stores/course';
import CourseCard from '@/views/courses/CourseCard.vue';
import CustomTinySlider from '@/components/CustomTinySlider.vue';

const store = useCourseStore();

onMounted(() => store.fetchPublicCourses({ limit: 9 }));

const settings: TinySliderSettings = {
  arrowKeys: true,
  gutter: 0,
  touch: true,
  autoplayButton: false,
  autoplayButtonOutput: false,
  nested: 'inner',
  autoplay: true,
  autoplayTimeout: 6000,
  autoplayHoverPause: true,
  speed: 700,
  controls: true,
  edgePadding: 2,
  items: 3,
  nav: true,
  responsive: {
    1: { items: 1 },
    576: { items: 1 },
    768: { items: 2 },
    992: { items: 3 }
  },
};
</script>

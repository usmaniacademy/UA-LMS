<template>
  <section>
    <b-container>
      <b-row class="mb-4">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold">Taught By Educators Who Care</h2>
          <p class="mb-0">Every course is led by a qualified instructor invested in your understanding.</p>
        </b-col>
      </b-row>

      <b-row>
        <CustomTinySlider :settings="settings" id="ua-instructors">
          <div v-for="(item, idx) in instructors" :key="idx" class="px-2">
            <b-card no-body class="bg-transparent">
              <div class="position-relative overflow-hidden rounded-3">
                <img :src="item.image" class="card-img" alt="instructor">
              </div>
              <b-card-body class="text-center">
                <b-card-title tag="h5" class="mb-1">{{ item.name }}</b-card-title>
                <p class="mb-0 text-primary">{{ item.subject }}</p>
              </b-card-body>
            </b-card>
          </div>
        </CustomTinySlider>
      </b-row>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import CustomTinySlider from '@/components/CustomTinySlider.vue';
import type { TinySliderSettings } from 'tiny-slider';

// Placeholder faculty — replace names, photos, and subjects with your real instructors.
// Photos live in: Vue/src/assets/images/instructor/
import instructor01 from '@/assets/images/instructor/01.jpg';
import instructor02 from '@/assets/images/instructor/02.jpg';
import instructor03 from '@/assets/images/instructor/03.jpg';
import instructor04 from '@/assets/images/instructor/04.jpg';
import instructor08 from '@/assets/images/instructor/08.jpg';

const instructors = [
  { image: instructor02, name: 'Ustadha Sophia', subject: 'Islamic Studies' },
  { image: instructor01, name: 'Ustadh Ahmad', subject: "Qur'an & Tajweed" },
  { image: instructor08, name: 'Dr. Ibrahim', subject: 'Astronomy' },
  { image: instructor04, name: 'Sr. Aisha', subject: 'Science' },
  { image: instructor03, name: 'Br. Yusuf', subject: 'Technology' },
];

const settings: TinySliderSettings = {
  arrowKeys: true,
  gutter: 30,
  touch: true,
  autoplayButton: false,
  autoplayButtonOutput: false,
  nested: 'inner',
  autoplay: true,
  controls: true,
  edgePadding: 2,
  items: 4,
  nav: false,
  responsive: {
    1: { items: 1 },
    576: { items: 1 },
    768: { items: 2 },
    992: { items: 3 },
    1200: { items: 4 }
  },
};
</script>

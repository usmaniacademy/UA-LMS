<template>
  <section>
    <b-container>
      <b-row class="mb-4">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold mb-3">Taught By Educators Who Care</h2>
          <p class="mb-0">Every course is led by a qualified instructor invested in your understanding.</p>
        </b-col>
      </b-row>

      <b-row>
        <CustomTinySlider :settings="settings" id="ua-instructors">
          <div v-for="(item, idx) in instructors" :key="idx" class="px-2">
            <b-card no-body class="bg-transparent">
              <div class="position-relative overflow-hidden rounded-3">
                <img v-if="item.image" :src="item.image" class="instructor-img" :alt="item.name">
                <div v-else class="instructor-img instructor-placeholder d-flex align-items-center justify-content-center">
                  <span class="display-6 text-white fw-bold">{{ initials(item.name) }}</span>
                </div>
              </div>
              <b-card-body class="text-center px-1">
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

// Instructor photos live in Vue/src/assets/images/instructor/
import qasmi from '@/assets/images/instructor/Qari Muhammed Imran Qasmi.jpeg';
import syed from '@/assets/images/instructor/Luqman Syed.jpeg';
import khan from '@/assets/images/instructor/Sophia Khan.jpeg';
import siddiqui from '@/assets/images/instructor/Irfan Siddiqui.jpeg';

const instructors = [
  { name: 'Qari Muhammed Imran Qasmi', subject: 'Tajweed Al Quran — Brothers', image: qasmi },
  { name: 'Luqman Syed', subject: 'Computer Networks', image: syed },
  { name: 'Sophia Khan', subject: 'Asma Ul Husna', image: khan },
  { name: 'Aisha Usmani', subject: 'Tajweed Al Quran — Sisters', image: '' }, // photo to be added later
  { name: 'Irfan Siddiqui', subject: 'Eye in the Sky', image: siddiqui },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}

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
<style scoped>
.instructor-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}
.instructor-placeholder {
  background: var(--bs-primary);
}
</style>

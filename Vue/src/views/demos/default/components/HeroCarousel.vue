<template>
  <section class="pt-6 pt-xxl-5 pb-0 overflow-hidden">
    <!-- Heading + text + CTA (centered) -->
    <b-container>
      <b-row class="justify-content-center text-center">
        <b-col lg="9" xl="8">
          <h1 class="display-5">Usmani Academy — Teaching and Learning for Understanding</h1>
          <p class="lead mb-4">We build AI-powered tools for Islamic schools and deliver world-class technology
            education to students everywhere — rooted in Islamic values.</p>
          <div class="d-flex gap-2 justify-content-center mb-5">
            <router-link :to="{ name: 'courses.list' }" class="btn btn-lg btn-primary mb-0">
              View Courses <BIconArrowRight class="ms-2" />
            </router-link>
            <router-link :to="{ name: 'about' }" class="btn btn-lg btn-outline-primary mb-0">About Us</router-link>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Full-width cylinder carousel stage -->
    <div class="hero-stage">
      <CylinderCarousel :images="images" :card-width="240" :animation-duration="36" />
    </div>
  </section>
</template>
<script setup lang="ts">
import CylinderCarousel from '@/components/CylinderCarousel.vue';
import { BIconArrowRight } from 'bootstrap-icons-vue';

// Usmani Academy photos (bg/3by4). Add/replace files there and update this list.
import p1 from '@/assets/images/bg/3by4/1.jpg';
import p2 from '@/assets/images/bg/3by4/2.jpg';
import p4 from '@/assets/images/bg/3by4/4.jpg';
import p5 from '@/assets/images/bg/3by4/5.jpg';
import p6 from '@/assets/images/bg/3by4/6.jpg';
import p7 from '@/assets/images/bg/3by4/7.jpg';
import p8 from '@/assets/images/bg/3by4/8.jpg';

const images = [
  { src: p1 }, { src: p2 }, { src: p4 }, { src: p5 }, { src: p6 }, { src: p7 }, { src: p8 },
];
</script>
<style scoped>
/* Full-bleed dark stage so the 3D carousel pops, like the reference */
.hero-stage {
  width: 100%;
  background: radial-gradient(120% 120% at 50% 0%, #12121a 0%, #0a0a0f 70%);
  padding: 3.5rem 0 4.5rem;
}
</style>

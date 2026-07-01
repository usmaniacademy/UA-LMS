<template>
  <section class="pt-5 pt-xxl-4 pb-0 overflow-hidden">
    <!-- Heading + text + CTA (centered) -->
    <b-container>
      <b-row class="justify-content-center text-center">
        <b-col lg="9" xl="8">
          <h1 class="display-5">Usmani Academy<br>Teaching and Learning for Understanding</h1>
          <p class="lead mb-4">We build AI-powered tools for Islamic schools and deliver world-class technology
            education to students everywhere — rooted in Islamic values.</p>
          <div class="d-flex gap-2 justify-content-center mb-0">
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
      <CylinderCarousel :images="images" :card-width="285" :card-aspect="'3 / 5'" :min-height="620" :animation-duration="36" :edge-fade="true" />
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

// More cards in the ring → a bigger radius, so the front arc is flatter and
// stretches wider — reaching the left/right screen edges on large monitors,
// where the edge-fade blends it out (same feel as the testimonials rows).
const base = [
  { src: p1 }, { src: p2 }, { src: p4 }, { src: p5 }, { src: p6 }, { src: p7 }, { src: p8 },
];
const images = [...base, ...base, ...base];
</script>
<style scoped>
/* Full-bleed stage — stretches the carousel edge to edge, no background */
.hero-stage {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 40px 0 3rem; /* ~40px gap between the content and the carousel */
}
</style>

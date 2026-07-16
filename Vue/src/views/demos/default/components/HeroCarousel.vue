<template>
  <section class="pt-6 pt-xxl-7 pb-0 overflow-hidden" :class="{ 'hero-reveal': revealed }">
    <!-- Heading + text + CTA (centered) -->
    <b-container>
      <b-row class="justify-content-center text-center">
        <b-col lg="9" xl="8">
          <h1 class="display-5 hero-heading">
            <span class="hero-line">
              <span class="w" style="--i:0">Usmani</span>
              <span class="w" style="--i:1">Academy</span>
            </span>
            <span class="hero-line">
              <span class="w" style="--i:2">Teaching</span>
              <span class="w" style="--i:3">and</span>
              <span class="w" style="--i:4">Learning</span>
              <span class="w" style="--i:5">for</span>
              <span class="w" style="--i:6">Understanding</span>
            </span>
          </h1>
          <p class="lead mb-4 hero-sub">We build AI-powered tools for Islamic schools and deliver world-class technology
            education to students everywhere — rooted in Islamic values.</p>
          <div class="d-flex gap-2 justify-content-center mb-0 hero-cta">
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
import { ref, onMounted } from 'vue';
import CylinderCarousel from '@/components/CylinderCarousel.vue';
import { BIconArrowRight } from 'bootstrap-icons-vue';

// Liquid text reveal: play as the splash curtain lifts. If there's no splash
// (e.g. navigating to Home from another page), just play shortly after mount.
const revealed = ref(false);
onMounted(() => {
  if (document.getElementById('splash-screen')) {
    window.addEventListener('ua-splash-reveal', () => {
      setTimeout(() => { revealed.value = true; }, 600);
    }, { once: true });
    setTimeout(() => { revealed.value = true; }, 4000); // fallback if the event is missed
  } else {
    setTimeout(() => { revealed.value = true; }, 120);
  }
});

// Usmani Academy photos (bg/3by4). Add/replace files there and update this list.
import p1 from '@/assets/images/bg/3by4/optimized-1.webp';
import p2 from '@/assets/images/bg/3by4/optimized-2.webp';
import p4 from '@/assets/images/bg/3by4/optimized-4.webp';
import p5 from '@/assets/images/bg/3by4/optimized-5.webp';
import p6 from '@/assets/images/bg/3by4/optimized-6.webp';
import p7 from '@/assets/images/bg/3by4/optimized-7.webp';
import p8 from '@/assets/images/bg/3by4/optimized-8.webp';

// More cards in the ring → a bigger radius, so the front arc is flatter and
// stretches wider — reaching the left/right screen edges on large monitors,
// where the edge-fade blends it out (same feel as the testimonials rows).
const base = [
  { src: p1 }, { src: p2 }, { src: p4 }, { src: p5 }, { src: p6 }, { src: p7 }, { src: p8 },
];
const images = [...base, ...base, ...base];
</script>
<style scoped>
/* ─── Liquid text reveal ─────────────────────────────────────────
   Heading lines rise from behind a mask while sharpening from blur;
   subtext + buttons follow, staggered. Triggered by `.hero-reveal`. */
.hero-heading .hero-line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
}
.hero-heading .w {
  display: inline-block;
  transform: translateY(115%);
  opacity: 0;
  filter: blur(8px);
}
.hero-sub,
.hero-cta {
  opacity: 0;
  transform: translateY(26px);
  filter: blur(8px);
}

/* Words rise left-to-right (staggered by --i) for a flowing, curved reveal */
.hero-reveal .hero-heading .w {
  animation: heroWordIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i, 0) * 0.06s);
}
.hero-reveal .hero-sub {
  animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
}
.hero-reveal .hero-cta {
  animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.64s forwards;
}

@keyframes heroWordIn {
  to { transform: translateY(0); opacity: 1; filter: blur(0); }
}
@keyframes heroFadeUp {
  to { transform: translateY(0); opacity: 1; filter: blur(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-heading .w,
  .hero-sub,
  .hero-cta {
    opacity: 1;
    transform: none;
    filter: none;
    animation: none;
  }
}

/* Full-bleed stage — stretches the carousel edge to edge, no background */
.hero-stage {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 40px 0 3rem; /* ~40px gap between the content and the carousel */
}
</style>

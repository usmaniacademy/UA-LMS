<template>
  <div class="home-bg">
    <TopBar1 />
    <main>

      <HeroCarousel />

      <About />

      <TrendingCourses />

      <OnFieldBanner />

      <Instructors />

      <WhyUsmani />

      <Testimonials />

    </main>
    <Footer1 />
  </div>
</template>
<script setup lang="ts">
import TopBar1 from '@/views/demos/default/components/TopBar1.vue';
import HeroCarousel from '@/views/demos/default/components/HeroCarousel.vue';
import About from '@/views/demos/school/components/About.vue';
import TrendingCourses from '@/views/demos/default/components/TrendingCourses.vue';
import OnFieldBanner from '@/views/demos/default/components/OnFieldBanner.vue';
import Instructors from '@/views/demos/default/components/Instructors.vue';
import WhyUsmani from '@/views/demos/default/components/WhyUsmani.vue';
import Testimonials from '@/views/demos/default/components/Testimonials.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';
</script>
<style scoped>
.home-bg {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  /* White veil (first layer) keeps the Islamic pattern subtle so the content
     stays readable; the pattern stays fixed while the content scrolls over it. */
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}

/* The theme paints an opaque colour on <main>, which was hiding the pattern
   everywhere except the footer. Make it transparent so the fixed pattern
   shows through the whole page. */
.home-bg > main {
  flex: 1 0 auto;
  background-color: transparent;
}

/* Frosted-glass sticky header: translucent + blurred so the pattern shows
   through it while the nav links stay readable (both static and stuck states). */
.home-bg :deep(header.navbar-sticky) {
  background-color: transparent !important;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-attachment: fixed, fixed;
  -webkit-backdrop-filter: blur(9px);
  backdrop-filter: blur(9px);
}

/* Once the header pins on scroll, make it a bit more white (it sits over
   scrolling content, so a more opaque bar reads cleaner). */
.home-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../../assets/images/pattern-islamic.svg');
}

/* Breathing room between the last section and the footer */
.home-bg :deep(footer) {
  margin-top: 4rem;
}
</style>

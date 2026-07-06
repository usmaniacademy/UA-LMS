<template>
  <div class="home-bg">
    <TopBar1 />
    <main>

      <HeroCarousel />

      <Counter />

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
import Counter from '@/views/demos/default/components/Counter.vue';
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
</style>

<template>
  <TopBar1 />
  <main>

    <MainBanner />

    <Counter />

    <About />

    <TrendingCourses />

    <OnFieldBanner />

    <WhyUsmani />

    <Reviews />

  </main>
  <Footer1 />
</template>
<script setup lang="ts">
import TopBar1 from '@/views/demos/default/components/TopBar1.vue';
import MainBanner from '@/views/demos/workshop/components/MainBanner.vue';
import Counter from '@/views/demos/default/components/Counter.vue';
import About from '@/views/demos/school/components/About.vue';
import TrendingCourses from '@/views/demos/default/components/TrendingCourses.vue';
import OnFieldBanner from '@/views/demos/default/components/OnFieldBanner.vue';
import WhyUsmani from '@/views/demos/default/components/WhyUsmani.vue';
import Reviews from '@/views/demos/default/components/Reviews.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';
</script>
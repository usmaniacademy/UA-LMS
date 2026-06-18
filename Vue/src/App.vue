<template>
  <RouterView />
  <BackToTop />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import BackToTop from '@/components/BackToTop.vue';
import AOS from 'aos';

import { useLayoutStore } from '@/stores/layout';
const useLayout = useLayoutStore();
useLayout.setTheme(useLayout.theme);

onMounted(() => {
  AOS.init();
});
</script>

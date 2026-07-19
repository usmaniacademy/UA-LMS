<template>
  <RouterView />
  <BackToTop />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BackToTop from '@/components/BackToTop.vue';

import { useLayoutStore } from '@/stores/layout';
const useLayout = useLayoutStore();
useLayout.setTheme(useLayout.theme);
</script>

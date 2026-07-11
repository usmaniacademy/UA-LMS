<template>
  <TopBar8 :showShopCart="showShopCart" />
  <main>
    <slot />
  </main>
  <Footer1 />
</template>
<script setup lang="ts">
import TopBar8 from '@/layouts/components/TopBar8.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';

type PageLayoutPropType = {
  showShopCart?: boolean;
};

defineProps<PageLayoutPropType>();
</script>
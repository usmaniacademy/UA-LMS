<template>
  <router-link class="navbar-brand" :class="logoClass" :to="{ name: 'courses.list' }">
    <img class="light-mode-item navbar-brand-item" :src="logoDark" alt="Usmani Academy" style="height:56px" />
    <img class="dark-mode-item navbar-brand-item" :src="logoLight" alt="Usmani Academy" style="height:56px" />
  </router-link>
</template>
<script setup lang="ts">
import logoDark from '@/assets/images/ua-logo-dark.png.png'
import logoLight from '@/assets/images/ua-logo-light.png.png'

defineProps<{ logoClass?: string }>()
</script>

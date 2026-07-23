<template>
  <template v-if="settings.loading && !settingsFetched">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
  </template>
  <template v-else-if="isMaintenanceMode && !isAdmin">
    <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-4">
      <h1 class="display-4 fw-bold text-dark mb-3">Under Maintenance</h1>
      <p class="lead text-muted mb-4">We are currently making some improvements to the platform. Please check back soon.</p>
      <div v-if="!auth.isAuthenticated()" class="mt-5 pt-5 text-muted small">
        Are you an admin? <router-link :to="{ name: 'auth.sign-in' }" class="text-decoration-none">Sign in</router-link>
      </div>
    </div>
  </template>
  <template v-else>
    <RouterView />
    <BackToTop />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import BackToTop from '@/components/BackToTop.vue';

import { useLayoutStore } from '@/stores/layout';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';

const useLayout = useLayoutStore();
useLayout.setTheme(useLayout.theme);

const settings = useSettingsStore();
const auth = useAuthStore();
const settingsFetched = ref(false);

const isMaintenanceMode = computed(() => {
  return settings.config.maintenanceMode === true || settings.config.maintenanceMode === 'true';
});

const isAdmin = computed(() => {
  return auth.isAuthenticated() && auth.userRole() === 'admin';
});

onMounted(async () => {
  await settings.fetchSettings();
  settingsFetched.value = true;
});
</script>

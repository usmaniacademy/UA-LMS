<template>
  <DropDown :custom-class="className">
    <a class="avatar avatar-sm p-0" href="#" id="profileDropdown" role="button" data-bs-auto-close="outside"
      data-bs-display="static" data-bs-toggle="dropdown" aria-expanded="false">
      <img v-if="avatarUrl" class="avatar-img rounded-circle" :src="avatarUrl" alt="avatar" />
      <span v-else class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
        {{ initials }}
      </span>
    </a>
    <ul class="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3" aria-labelledby="profileDropdown">
      <li class="px-3 mb-3">
        <div class="d-flex align-items-center">
          <div class="avatar me-3">
            <img v-if="avatarUrl" class="avatar-img rounded-circle shadow" :src="avatarUrl" alt="avatar" />
            <span v-else class="avatar-img rounded-circle shadow bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
              {{ initials }}
            </span>
          </div>
          <div>
            <span class="h6 d-block mb-0">{{ fullName }}</span>
            <p class="small m-0">{{ email }}</p>
          </div>
        </div>
      </li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li><router-link class="dropdown-item" :to="{ name: dashboardRoute }">
          <BIconSpeedometer2 class="fa-fw me-2" />Dashboard
        </router-link></li>
      <li v-if="editProfileRoute"><router-link class="dropdown-item" :to="{ name: editProfileRoute }">
          <BIconPerson class="fa-fw me-2" />Edit Profile
        </router-link></li>
      <li v-if="settingsRoute"><router-link class="dropdown-item" :to="{ name: settingsRoute }">
          <BIconGear class="fa-fw me-2" />Account Settings
        </router-link></li>
      <li><router-link class="dropdown-item" :to="{ name: 'about.contact.us' }">
          <BIconInfoCircle class="fa-fw me-2" />Help
        </router-link></li>
      <li><a class="dropdown-item bg-danger-soft-hover" href="#" @click.prevent="handleSignOut">
          <BIconPower class="fa-fw me-2" />Sign Out
        </a></li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li>
      <div class="bg-light dark-mode-switch theme-icon-active d-flex align-items-center p-1 rounded mt-2">
        <template v-for="mode in themeModes" :key="mode.theme">
          <button type="button" class="btn btn-sm mb-0" data-bs-theme-value="light"
            :class="{ active: mode.theme === useLayout.theme }" @click="useLayout.setTheme(mode.theme)">
            <component :is="mode.icon" />
            {{ toSentenceCase(mode.theme) }}
          </button>
        </template>
      </div>
      </li>
    </ul>
  </DropDown>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import DropDown from '@/components/DropDown.vue';
import { useLayoutStore } from '@/stores/layout';
import { useAuthStore } from '@/stores/auth';
import type { ThemeModeType } from '@/types/layout';
import { toSentenceCase } from '@/helpers/change-casing';

import { BIconPerson, BIconGear, BIconInfoCircle, BIconPower, BIconSun, BIconMoonStars, BIconCircleHalf, BIconSpeedometer2 } from 'bootstrap-icons-vue';

const useLayout = useLayoutStore();
const auth = useAuthStore();

const user = computed(() => auth.getUser());

const fullName = computed(() => {
  const u = user.value;
  if (!u) return 'Guest';
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
});
const email = computed(() => user.value?.email ?? '');
const avatarUrl = computed(() => user.value?.avatarUrl || '');
const initials = computed(() => {
  const u = user.value;
  if (!u) return 'G';
  return [(u.firstName || '')[0], (u.lastName || '')[0]].filter(Boolean).join('').toUpperCase() || (u.email[0] || 'U').toUpperCase();
});

const dashboardRoute = computed(() => {
  switch (user.value?.role) {
    case 'admin': return 'admin.dashboard';
    case 'instructor': return 'instructor.dashboard';
    default: return 'student.dashboard';
  }
});

const editProfileRoute = computed(() => {
  switch (user.value?.role) {
    case 'admin': return null; // admin has a single settings page (shown below)
    case 'instructor': return 'instructor.edit.profile';
    default: return null; // students have no dedicated profile page
  }
});

const settingsRoute = computed(() => {
  switch (user.value?.role) {
    case 'admin': return 'admin.setting';
    case 'instructor': return 'instructor.settings';
    default: return null;
  }
});

function handleSignOut() {
  auth.logout();
}

const themeModes: ThemeModeType[] = [
  {
    icon: BIconSun,
    theme: 'light'
  },
  {
    icon: BIconMoonStars,
    theme: 'dark'
  },
  {
    icon: BIconCircleHalf,
    theme: 'auto'
  }
];

type ProfileDropDownPropType = {
  className?: string;
};

defineProps<ProfileDropDownPropType>();
</script>
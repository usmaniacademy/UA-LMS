<template>
  <header ref="headerRef" :class="`${isSticky ? 'navbar-sticky-on' : ''} ${className}`">
    <slot />
  </header>
  <!-- Placeholder that holds the header's space when it becomes position:fixed,
       so the document doesn't shrink and snap the scroll upward on short pages.
       Only takes space at xl+, where the sticky header actually goes fixed. -->
  <div v-if="isSticky" class="navbar-sticky-spacer" :style="{ height: spacerHeight + 'px' }" aria-hidden="true"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

type StickyHeaderProps = {
  className?: string;
};

const isSticky = ref<boolean>(false);
const headerRef = ref<HTMLElement | null>(null);
const spacerHeight = ref<number>(0);

const onScroll = () => {
  const shouldStick = window.scrollY >= 400;
  // Capture the height the header occupies in normal flow *before* it goes
  // fixed, so the spacer can reserve that space.
  if (shouldStick && !isSticky.value && headerRef.value) {
    spacerHeight.value = headerRef.value.offsetHeight;
  }
  isSticky.value = shouldStick;
};

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

defineProps<StickyHeaderProps>();
</script>

<style scoped>
.navbar-sticky-spacer {
  display: none;
}
@media (min-width: 1200px) {
  .navbar-sticky-spacer {
    display: block;
  }
}
</style>

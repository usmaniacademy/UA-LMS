<template>
  <!-- Compact inline (used in lists) -->
  <span v-if="compact" class="text-muted small">
    <template v-if="expired">Starting soon...</template>
    <template v-else>Starts in {{ display }}</template>
  </span>

  <!-- Boxed countdown (used in the player) -->
  <div v-else>
    <div v-if="expired" class="badge bg-success fs-6 px-3 py-2">Starting soon…</div>
    <div v-else class="d-flex gap-2 text-center">
      <div class="cd-box"><div class="cd-num">{{ pad(parts.d) }}</div><div class="cd-lbl">days</div></div>
      <div class="cd-box"><div class="cd-num">{{ pad(parts.h) }}</div><div class="cd-lbl">hours</div></div>
      <div class="cd-box"><div class="cd-num">{{ pad(parts.m) }}</div><div class="cd-lbl">minutes</div></div>
      <div class="cd-box"><div class="cd-num">{{ pad(parts.s) }}</div><div class="cd-lbl">seconds</div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = withDefaults(defineProps<{ targetTime: string; compact?: boolean }>(), {
  compact: true
})

const remaining = ref(0)
let timer: ReturnType<typeof setInterval>

function update() {
  remaining.value = Math.max(0, new Date(props.targetTime).getTime() - Date.now())
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
})
onUnmounted(() => clearInterval(timer))

const expired = computed(() => remaining.value === 0)

const parts = computed(() => {
  const total = Math.floor(remaining.value / 1000)
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60
  }
})

const pad = (n: number) => String(n).padStart(2, '0')

const display = computed(() => {
  const { d, h, m, s } = parts.value
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${pad(s)}s`
})
</script>

<style scoped>
.cd-box {
  background: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: .5rem;
  padding: .6rem .4rem;
  min-width: 64px;
  box-shadow: 0 2px 6px rgba(0,0,0,.04);
}
.cd-num { font-size: 1.6rem; font-weight: 700; line-height: 1; }
.cd-lbl { font-size: .7rem; color: var(--bs-secondary-color); margin-top: .25rem; }
</style>

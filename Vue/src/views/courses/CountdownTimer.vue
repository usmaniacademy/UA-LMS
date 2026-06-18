<template>
  <span class="text-muted small">
    <template v-if="expired">Starting soon...</template>
    <template v-else>Starts in {{ display }}</template>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{ targetTime: string }>()

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

const display = computed(() => {
  const total = Math.floor(remaining.value / 1000)
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${String(s).padStart(2, '0')}s`
})
</script>

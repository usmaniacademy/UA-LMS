<template>
  <div class="cyl-viewport" :style="viewportStyle">
    <div class="cyl-ring" :style="ringStyle">
      <img
        v-for="(img, i) in images"
        :key="i"
        :src="img.src"
        :alt="img.alt || `Usmani Academy image ${i + 1}`"
        class="cyl-card"
        :style="cardStyle(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface CarouselImage {
  src: string
  alt?: string
}

const props = withDefaults(
  defineProps<{
    images: CarouselImage[]
    /** Rotation duration in seconds */
    animationDuration?: number
    /** Card width in pixels */
    cardWidth?: number
    /** Fade the left/right edges. Turn off to let cards run to the screen edges. */
    edgeFade?: boolean
  }>(),
  { animationDuration: 32, cardWidth: 250, edgeFade: true }
)

const n = computed(() => props.images.length || 1)

const viewportStyle = computed(() => {
  const style: Record<string, string> = { perspective: '70em' }
  if (props.edgeFade) {
    const mask = 'linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%)'
    style.maskImage = mask
    style.WebkitMaskImage = mask
  }
  return style
})

const ringStyle = computed(() => ({
  '--n': String(n.value),
  '--w': `${props.cardWidth}px`,
  '--ba': 'calc(1turn / var(--n))',
  animationDuration: `${props.animationDuration}s`
}))

function cardStyle(i: number) {
  return {
    '--i': String(i),
    width: 'var(--w)',
    aspectRatio: '7 / 10',
    transform:
      'rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))'
  } as Record<string, string>
}
</script>

<style scoped>
.cyl-viewport {
  width: 100%;
  height: 100%;
  min-height: 525px;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.cyl-ring {
  display: grid;
  place-items: center;
  transform-style: preserve-3d;
  animation-name: cyl-ry;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.cyl-card {
  grid-area: 1 / 1;
  object-fit: cover;
  border-radius: 1rem;
  backface-visibility: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}
@keyframes cyl-ry {
  to {
    transform: rotateY(1turn);
  }
}
@media (prefers-reduced-motion: reduce) {
  .cyl-ring {
    animation-duration: 128s !important;
  }
}
</style>

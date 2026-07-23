<template>
  <section class="pt-5">
    <b-container>
      <b-row class="mb-4">
        <b-col cols="12" class="text-center">
          <h2 class="fs-1 fw-bold mb-0">On-Field Framework</h2>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <div class="arrow-blur arrow-hover dots-inside dots-white rounded-3 overflow-hidden">
            <CustomTinySlider :settings="settings" id="onfield-slider">
              <b-card
                v-for="(slide, i) in slides"
                :key="i"
                no-body
                class="overflow-hidden h-400px h-md-500px text-center rounded-0"
                :style="`background-image:url(${slide.bg}); background-position:center center; background-size:cover;`"
              >
                <div class="bg-overlay bg-dark opacity-6"></div>
                <div class="card-img-overlay d-flex align-items-center p-3 p-sm-4">
                  <div class="w-100 my-auto">
                    <b-row class="justify-content-center">
                      <b-col cols="11" lg="8">
                        <h1 class="text-white display-5 mb-0 onfield-title">{{ slide.title }}</h1>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-card>
            </CustomTinySlider>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import CustomTinySlider from '@/components/CustomTinySlider.vue';
import type { TinySliderSettings } from 'tiny-slider';

// Slide background images (in Vue/src/assets/images/bg/), one per slide title.
import bgLearning from '@/assets/images/bg/UA learing center.jpg';
import bgRobo from '@/assets/images/bg/ai-robovision.jpg';
import bgManagement from '@/assets/images/bg/ai powered school management.jpg';
import bgSupport from '@/assets/images/bg/On-demand-technical-support.jpg';

const slides = [
  { title: 'UA Learning Center', bg: bgLearning },
  { title: 'AI RoboVision', bg: bgRobo },
  { title: 'AI Powered School Management Solutions', bg: bgManagement },
  { title: 'On-Field Technical Support', bg: bgSupport },
];

const settings: TinySliderSettings = {
  arrowKeys: true,
  gutter: 0,
  mouseDrag: true,
  autoplayButton: false,
  autoplayButtonOutput: false,
  nested: 'inner',
  autoplay: true,
  autoplayTimeout: 4500,
  controls: true,
  edgePadding: 2,
  items: 1,
  nav: true,
};
</script>
<style scoped>
/* arrow-hover (see _tiny-slider.scss) parks the arrows off-screen until
   :hover — a state touch devices can never trigger, so on mobile they were
   simply invisible. Below the desktop breakpoint, pin them to the visible
   "hovered" position permanently instead. */
@media (max-width: 991.98px) {
  :deep(.arrow-hover [data-controls='prev']) { left: 0 !important; }
  :deep(.arrow-hover [data-controls='next']) { right: 0 !important; }
}

.onfield-title {
  font-size: clamp(1.25rem, 5vw, 3rem);
}
</style>

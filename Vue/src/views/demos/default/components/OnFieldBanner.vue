<template>
  <section class="pt-0">
    <b-container>
      <b-row class="mb-4">
        <b-col cols="12" class="text-center">
          <h2 class="mb-0">On-Field Framework</h2>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <div class="arrow-round arrow-blur arrow-hover rounded-3 overflow-hidden">
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
                        <h1 class="text-white display-5 mb-0">{{ slide.title }}</h1>
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

// Slide background images — replace these files (or repoint the imports) with your own.
// Place your images in: Vue/src/assets/images/bg/
import bg01 from '@/assets/images/bg/01.jpg';
import bg02 from '@/assets/images/bg/02.jpg';
import bg03 from '@/assets/images/bg/03.jpg';
import bg04 from '@/assets/images/bg/04.jpg';

const slides = [
  { title: 'UA Learning Center', bg: bg01 },
  { title: 'AI RoboVision', bg: bg02 },
  { title: 'AI Powered School Management Solutions', bg: bg03 },
  { title: 'On-Field Technical Support', bg: bg04 },
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

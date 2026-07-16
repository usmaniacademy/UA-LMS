<template>
  <div>
    <p class="fw-bold mb-3">We operate two core products:</p>
    <b-row class="g-3">
      <b-col cols="12" v-for="p in products" :key="p.id">
        <div class="product-card p-3 rounded-4 h-100" role="button" @click="open(p)">
          <div class="d-flex align-items-center gap-3">
            <img :src="p.favicon" class="product-fav flex-shrink-0" :alt="p.title">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center">
                <h6 class="mb-0">{{ p.title }}</h6>
                <BIconArrowUpRight class="ms-auto text-primary" />
              </div>
              <p class="mb-0 product-text mt-1">{{ p.cardText }}</p>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Popup: only the round X (no header X, no OK/Cancel) -->
    <b-modal v-model="show" no-header no-footer centered size="lg" body-class="p-0">
      <template v-if="active">
        <div class="position-relative popup-logo-wrap">
          <img :src="active.image" class="popup-logo" :alt="active.title">
          <button type="button" class="btn-close-x" aria-label="Close" @click="show = false">
            <BIconX />
          </button>
        </div>
        <div class="p-4">
          <h4 class="mb-1">{{ active.heading }}</h4>
          <p class="mb-3">{{ active.description }}</p>

          <h6 class="fw-bold mb-2">{{ active.featuresLabel }}</h6>
          <b-row class="g-2 mb-3">
            <b-col sm="6" v-for="(f, i) in active.features" :key="i">
              <div class="d-flex align-items-start">
                <BIconCheckCircleFill class="text-primary me-2 mt-1 flex-shrink-0" />
                <span class="small">{{ f }}</span>
              </div>
            </b-col>
          </b-row>

          <p class="fst-italic mb-3" style="color:#454545">{{ active.footer }}</p>
          <a :href="active.link" target="_blank" rel="noopener" class="btn btn-primary mb-0">
            Learn more at {{ active.linkLabel }} <BIconArrowUpRight class="ms-1" />
          </a>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { BIconArrowUpRight, BIconBuildingFill, BIconCheckCircleFill, BIconCpuFill, BIconX } from 'bootstrap-icons-vue';

import sarkaarImg from '@/assets/images/about/sarkaar.png';
import roboImg from '@/assets/images/about/ai robo.png';
import sarkaarFav from '@/assets/images/about/sarkaar-favicon.png';
import roboFav from '@/assets/images/about/AI ROBOVISION-favicon.png';

interface Product {
  id: string;
  title: string;
  cardText: string;
  heading: string;
  image: string;
  favicon: string;
  description: string;
  featuresLabel: string;
  features: string[];
  footer: string;
  link: string;
  linkLabel: string;
}

const products: Product[] = [
  {
    id: 'sarkaar',
    title: 'Sarkaar',
    cardText: 'An AI-powered school management platform built specifically for Islamic and private schools.',
    heading: 'Sarkaar — AI-Powered School Management',
    image: sarkaarImg,
    favicon: sarkaarFav,
    description:
      'Sarkaar is an agentic school management platform built for Islamic and private schools. From admissions and attendance to finance, parent communications, and academic analytics — Sarkaar handles the operations so your staff can focus on the students.',
    featuresLabel: 'What Sarkaar covers:',
    features: [
      'Admissions & enrollment management',
      'Attendance tracking & reporting',
      'Finance & fee management',
      'Parent & student communication portals',
      'Academic analytics & AI-powered insights',
      'Staff & HR management',
      'Library management',
      'Multi-campus support'
    ],
    footer: 'Currently in active deployment with Islamic schools across the United States.',
    link: 'https://sarkaar.us',
    linkLabel: 'sarkaar.us',
    icon: BIconBuildingFill
  },
  {
    id: 'robovision',
    title: 'AI RoboVision',
    cardText: 'A K–12 curriculum marketplace covering AI, robotics, IoT, and immersive technology with Islamic ethical framing.',
    heading: 'AI RoboVision — K–12 Technology Curriculum',
    image: roboImg,
    favicon: roboFav,
    description:
      'AI RoboVision is a curriculum marketplace for K–12 schools covering Artificial Intelligence, Robotics, IoT, and Immersive Technology. Designed with Islamic ethical framing, it gives schools a plug-and-play path to bring emerging tech into every grade level — with full teacher training and support included.',
    featuresLabel: 'What AI RoboVision includes:',
    features: [
      'Grade-level curriculum for AI, Robotics, IoT, and Immersive Tech',
      'Islamic ethical framing built into every unit',
      'Onsite delivery — our instructors come to your school',
      'Teacher training and ongoing support',
      'Ready to deploy — no internal STEM expertise required'
    ],
    footer: 'Bringing emerging technology education to Islamic schools nationwide.',
    link: 'https://airobovision.com',
    linkLabel: 'airobovision.com',
    icon: BIconCpuFill
  }
];

const show = ref(false);
const active = ref<Product | null>(null);

function open(p: Product) {
  active.value = p;
  show.value = true;
}
</script>
<style scoped>
.product-card {
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
}
.popup-logo-wrap {
  padding: 2rem 1.5rem 1rem;
  background: #f8f9fa;
  border-top-left-radius: var(--bs-modal-border-radius);
  border-top-right-radius: var(--bs-modal-border-radius);
}
.popup-logo {
  display: block;
  max-width: 220px;
  max-height: 90px;
  width: auto;
  height: auto;
  object-fit: contain;
}
.product-fav {
  width: 52px;
  height: 52px;
  border-radius: 0.6rem;
  object-fit: contain;
  background: #fff;
  padding: 4px;
}
.product-text {
  color: #454545;
  font-size: 0.9rem;
}
.btn-close-x {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.9);
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.btn-close-x:hover {
  background: #fff;
}
</style>

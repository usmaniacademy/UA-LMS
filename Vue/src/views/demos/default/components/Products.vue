<template>
  <section>
    <b-container>
      <b-row class="mb-4">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold">We operate two core products</h2>
          <p class="mb-0">Click a product to learn more.</p>
        </b-col>
      </b-row>

      <b-row class="g-4 justify-content-center">
        <b-col md="6" v-for="p in products" :key="p.id">
          <div class="product-card p-4 rounded-4 h-100" role="button" @click="open(p)">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="product-icon flex-shrink-0"><component :is="p.icon" /></span>
              <h5 class="mb-0">{{ p.title }}</h5>
              <BIconArrowUpRight class="ms-auto text-primary fs-5" />
            </div>
            <p class="mb-0 text-muted">{{ p.cardText }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Popup (cross to close, no footer buttons) -->
    <b-modal v-model="show" hide-footer hide-header centered size="lg" body-class="p-0">
      <template v-if="active">
        <div class="position-relative">
          <img :src="active.image" class="w-100 rounded-top" style="max-height:300px;object-fit:cover" :alt="active.title">
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

          <p class="text-muted small mb-3">{{ active.footer }}</p>
          <a :href="active.link" target="_blank" rel="noopener" class="btn btn-primary mb-0">
            Learn more at {{ active.linkLabel }} <BIconArrowUpRight class="ms-1" />
          </a>
        </div>
      </template>
    </b-modal>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  BIconArrowUpRight, BIconBuildingFill, BIconCpuFill, BIconCheckCircleFill, BIconX
} from 'bootstrap-icons-vue';

import sarkaarImg from '@/assets/images/about/sarkaar.png';
import roboImg from '@/assets/images/about/ai robo.png';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  cardText: string;
  heading: string;
  image: string;
  description: string;
  featuresLabel: string;
  features: string[];
  footer: string;
  link: string;
  linkLabel: string;
  icon: any;
}

const products: Product[] = [
  {
    id: 'sarkaar',
    title: 'Sarkaar',
    subtitle: 'AI-Powered School Management',
    cardText: 'An AI-powered school management platform built specifically for Islamic and private schools.',
    heading: 'Sarkaar — AI-Powered School Management',
    image: sarkaarImg,
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
    subtitle: 'K–12 Technology Curriculum',
    cardText: 'A K–12 curriculum marketplace covering AI, robotics, IoT, and immersive technology with Islamic ethical framing.',
    heading: 'AI RoboVision — K–12 Technology Curriculum',
    image: roboImg,
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
  background: rgba(var(--bs-primary-rgb), 0.06);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  background: rgba(var(--bs-primary-rgb), 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.product-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.9rem;
  background: var(--bs-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
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

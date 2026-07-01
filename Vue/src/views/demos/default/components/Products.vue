<template>
  <section>
    <b-container>
      <b-row class="mb-4">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold">Our Products</h2>
          <p class="mb-0">Two platforms giving Islamic schools the tools to run smarter and teach future-ready skills.</p>
        </b-col>
      </b-row>

      <b-row class="g-4 justify-content-center">
        <b-col md="6" lg="5" v-for="p in products" :key="p.id">
          <div class="product-card p-4 rounded-4 h-100" role="button" @click="open(p)">
            <div class="d-flex align-items-center gap-3">
              <span class="product-icon flex-shrink-0">
                <component :is="p.icon" />
              </span>
              <div>
                <h5 class="mb-1">{{ p.title }}</h5>
                <p class="mb-0 text-muted small">{{ p.subtitle }}</p>
              </div>
              <BIconArrowUpRight class="ms-auto text-primary" />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Popup -->
    <b-modal v-model="show" :title="active?.title" hide-footer centered size="lg" body-class="p-0">
      <template v-if="active">
        <img :src="active.image" class="w-100" style="max-height:320px;object-fit:cover" :alt="active.title">
        <div class="p-4">
          <p class="text-primary fw-semibold mb-2">{{ active.subtitle }}</p>
          <p class="mb-4">{{ active.description }}</p>
          <a :href="active.link" target="_blank" class="btn btn-primary mb-0"
            :class="{ disabled: active.link === '#' }">
            Learn more <BIconArrowUpRight class="ms-1" />
          </a>
        </div>
      </template>
    </b-modal>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { BIconArrowUpRight, BIconBuildingFill, BIconCpuFill } from 'bootstrap-icons-vue';

import sarkaarImg from '@/assets/images/about/25.jpg';
import roboImg from '@/assets/images/bg/ai-robovision.jpg';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  link: string;
  icon: any;
}

const products: Product[] = [
  {
    id: 'sarkaar',
    title: 'Sarkaar',
    subtitle: 'AI-powered school management',
    image: sarkaarImg,
    description:
      'Sarkaar is an AI-powered school management platform built specifically for Islamic and private schools. It streamlines admissions, attendance, Hifdh tracking, halal-compliant finance workflows, and day-to-day operations — so your team can focus on education, not paperwork.',
    link: '#',
    icon: BIconBuildingFill
  },
  {
    id: 'robovision',
    title: 'AI RoboVision',
    subtitle: 'K–12 technology curriculum',
    image: roboImg,
    description:
      'AI RoboVision is a K–12 curriculum marketplace covering AI, robotics, IoT, and immersive technology — all with an Islamic ethical framing. It brings future-ready, hands-on technology education to your campus, onsite or online.',
    link: '#',
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
</style>

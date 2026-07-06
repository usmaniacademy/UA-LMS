<template>
  <section class="pt-0 pt-md-5">
    <b-container>
      <b-row class="gx-md-5 align-items-start">
        <!-- Left: decorative images -->
        <b-col lg="6" class="mb-3 mb-lg-0">
          <b-row class="mt-4 mt-md-0">
            <b-col cols="12" class="position-relative">
              <img class="rounded w-100" :src="about25" alt="">
            </b-col>
            <b-col cols="8" sm="5" class="mt-n6 align-items-end position-relative">
              <b-card no-body class="p-3 card-body shadow rounded-3 d-inline-block position-relative mt-n2">
                <h6 class="mb-2">Deployed &amp; Proven
                  <span class="ms-1">
                    <font-awesome-icon :icon="faCheckCircle" class="text-success" />
                  </span>
                </h6>
                <p class="mb-0 small">Active in Islamic schools across the U.S.</p>
                <div class="icon-lg bg-primary rounded-circle position-absolute top-100 start-100 translate-middle">
                  <BIconShieldCheck class="text-white" />
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-col>

        <!-- Right: content -->
        <b-col lg="6" class="mt-5 mt-lg-0">
          <h2 class="fs-1 fw-bold mb-3">Why Usmani Academy?</h2>
          <p class="mb-3 mb-lg-4">Islamic schools deserve the same caliber of tools as the world's best institutions —
            without losing what makes them unique. Usmani Academy exists at that intersection. Our products are built by
            people who understand your community, your values, and the operational realities of running a mission-driven
            school.</p>

          <b-row class="g-4">
            <b-col cols="12" v-for="(point, i) in points" :key="i">
              <div class="point-card d-flex align-items-center">
                <div class="icon-md fs-5 text-white rounded flex-centered flex-shrink-0" :class="point.bg">
                  <component :is="point.icon" />
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">{{ point.title }}</h6>
                  <p class="mb-0 small">{{ point.desc }}</p>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { BIconShieldCheck, BIconBuildingFill, BIconCpuFill, BIconPatchCheckFill, BIconLaptop } from 'bootstrap-icons-vue';

import about25 from '@/assets/images/about/25.jpg';

const points = [
  {
    title: 'Built for Islamic Schools',
    desc: 'Islamic framing by default, not as an afterthought. From Hifdh tracking to halal-compliant finance workflows.',
    icon: BIconBuildingFill,
    bg: 'bg-blue'
  },
  {
    title: 'AI-Native from Day One',
    desc: 'Not legacy software with AI bolted on. Sarkaar was built as an agentic platform from the ground up.',
    icon: BIconCpuFill,
    bg: 'bg-blue'
  },
  {
    title: 'Deployed and Proven',
    desc: 'Active pilots and partnerships with Islamic schools across the United States.',
    icon: BIconPatchCheckFill,
    bg: 'bg-blue'
  },
  {
    title: 'Onsite + Online',
    desc: 'AI RoboVision brings our instructors to your campus. Online courses bring our faculty to your screen.',
    icon: BIconLaptop,
    bg: 'bg-blue'
  }
];
</script>
<style scoped>
/* Frosted-glass card for each point (same treatment as the product cards),
   with padding so the text is inset and doesn't run to the corners. */
.point-card {
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
}
</style>

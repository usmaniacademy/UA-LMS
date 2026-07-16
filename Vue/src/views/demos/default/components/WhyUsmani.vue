<template>
  <section class="pt-5">
    <b-container>
      <b-row class="gx-md-5 align-items-stretch">
        <!-- Left: image that fills the column height so it lines up with the cards -->
        <b-col lg="6" class="mb-4 mb-lg-0">
          <div class="why-media">
            <div class="why-img-wrap">
              <img class="why-img" :src="about25" alt="Usmani Academy at an event">
            </div>
            <b-card no-body class="why-inset p-3 shadow rounded-3">
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
          </div>
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
/* Left image fills the column so it matches the height of the cards on the right */
.why-media {
  position: relative;
  min-height: 420px;
}
.why-img-wrap {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  overflow: hidden;
}
.why-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.why-inset {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  max-width: 66%;
  background: #fff !important;
  z-index: 2;
}
@media (min-width: 992px) {
  .why-media {
    min-height: 0;
    height: 100%;
  }
}

/* Frosted-glass card for each point (same treatment as the product cards),
   with padding so the text is inset and doesn't run to the corners. */
.point-card {
  min-height: 104px;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
}
</style>

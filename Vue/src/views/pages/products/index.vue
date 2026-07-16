<template>
  <div class="products-bg">
    <TopBar1 />
    <main>
      <!-- ─── Hero ──────────────────────────────────────────────── -->
      <section class="hero-banner text-center text-white">
        <b-container>
          <b-row class="justify-content-center">
            <b-col lg="9" xl="8">
              <span class="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill">What We Build</span>
              <h1 class="display-4 fw-bold mb-2 text-white">Our Flagship Products</h1>
              <p class="lead mb-0 opacity-75">AI-native tools built for Islamic and private schools — from day-to-day
                operations to K-12 technology curriculum.</p>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Products ──────────────────────────────────────────── -->
      <section class="py-5">
        <b-container>
          <b-row class="g-4">
            <b-col lg="6" v-for="p in products" :key="p.name">
              <div class="glass-card h-100 p-4 p-lg-5 rounded-4 d-flex flex-column">
                <img :src="p.logo" :alt="p.name" class="product-logo mb-4">

                <a :href="p.url" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                  <h3 class="fw-bold mb-3 text-dark">{{ p.title }}</h3>
                </a>
                <p class="mb-4">{{ p.description }}</p>

                <h6 class="fw-semibold mb-3">{{ p.featuresHeading }}</h6>
                <ul class="list-unstyled mb-4">
                  <li v-for="f in p.features" :key="f" class="d-flex mb-2">
                    <BIconCheckCircleFill class="text-success me-2 mt-1 flex-shrink-0" />
                    <span>{{ f }}</span>
                  </li>
                </ul>

                <p class="text-muted small mb-4">
                  {{ p.status }} → Learn more at
                  <a :href="p.url" target="_blank" rel="noopener noreferrer">{{ p.urlLabel }}</a>
                </p>

                <a :href="p.url" target="_blank" rel="noopener noreferrer"
                  class="btn btn-primary mt-auto align-self-start">
                  Explore Product <BIconArrowUpRight class="ms-1" />
                </a>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </main>
    <Footer1 />
  </div>
</template>
<script setup lang="ts">
import TopBar1 from '@/views/demos/default/components/TopBar1.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';
import { BIconCheckCircleFill, BIconArrowUpRight } from 'bootstrap-icons-vue';
import sarkaarLogo from '@/assets/images/about/sarkaar.png';
import roboVisionLogo from '@/assets/images/about/ai robo.png';

const products = [
  {
    name: 'Sarkaar',
    logo: sarkaarLogo,
    title: 'Sarkaar — AI-Powered School Management',
    url: 'https://sarkaar.us/',
    urlLabel: 'sarkaar.us',
    description: 'Sarkaar is an agentic school management platform built for Islamic and private schools. From admissions and attendance to finance, parent communications, and academic analytics — Sarkaar handles the operations so your staff can focus on the students.',
    featuresHeading: 'What Sarkaar covers:',
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
    status: 'Currently in active deployment with Islamic schools across the United States.'
  },
  {
    name: 'AI RoboVision',
    logo: roboVisionLogo,
    title: 'AI RoboVision — K–12 Technology Curriculum',
    url: 'https://airobovision.com/',
    urlLabel: 'airobovision.com',
    description: 'AI RoboVision is a curriculum marketplace for K–12 schools covering Artificial Intelligence, Robotics, IoT, and Immersive Technology. Designed with Islamic ethical framing, it gives schools a plug-and-play path to bring emerging tech into every grade level — with full teacher training and support included.',
    featuresHeading: 'What AI RoboVision includes:',
    features: [
      'Grade-level curriculum for AI, Robotics, IoT, and Immersive Tech',
      'Islamic ethical framing built into every unit',
      'Onsite delivery — our instructors come to your school',
      'Teacher training and ongoing support',
      'Ready to deploy — no internal STEM expertise required'
    ],
    status: 'Bringing emerging technology education to Islamic schools nationwide.'
  }
];
</script>
<style scoped>
.products-bg {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}
.products-bg > main {
  flex: 1 0 auto;
  background-color: transparent;
}
.products-bg :deep(header.navbar-sticky) {
  background-color: transparent !important;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-attachment: fixed, fixed;
  -webkit-backdrop-filter: blur(9px);
  backdrop-filter: blur(9px);
}
.products-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../../assets/images/pattern-islamic.svg');
}
.products-bg :deep(footer) {
  margin-top: 4rem;
}

/* Frosted cards over the pattern (same treatment as About/Contact) */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.product-logo {
  max-width: 220px;
  height: auto;
}
</style>

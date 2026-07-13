<template>
  <div class="about-bg">
    <TopBar1 />
    <main>
      <!-- ─── Hero ──────────────────────────────────────────────── -->
      <section class="hero-banner text-center text-white">
        <b-container>
          <b-row class="justify-content-center">
            <b-col lg="9" xl="8">
              <span class="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill">Who We Are</span>
              <h1 class="display-4 fw-bold mb-3 text-white">About Usmani Academy</h1>
              <p class="lead mb-0 opacity-75">Usmani Academy is a dedicated educational platform committed to providing
                high-quality learning experiences that blend traditional Islamic education with modern knowledge and
                skills. Our mission is to empower individuals with the tools they need to excel spiritually,
                intellectually, and professionally.</p>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Educational offerings ─────────────────────────────── -->
      <section class="py-5">
        <b-container>
          <b-row class="mb-5">
            <b-col lg="8" class="mx-auto text-center">
              <h2 class="fs-1 fw-bold mb-3">Our Educational Offerings</h2>
              <p class="mb-0">A blend of Islamic scholarship, science, and future-ready technology.</p>
            </b-col>
          </b-row>
          <b-row class="g-4">
            <b-col md="6" xl="3" v-for="o in offerings" :key="o.title">
              <div class="glass-card h-100 p-4 rounded-4">
                <div class="icon-lg rounded-3 bg-primary bg-opacity-10 text-primary flex-centered mb-3">
                  <component :is="o.icon" />
                </div>
                <h5 class="mb-2">{{ o.title }}</h5>
                <p class="mb-0 small text-muted">{{ o.desc }}</p>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Vision & Mission ──────────────────────────────────── -->
      <section class="py-5">
        <b-container>
          <b-row class="g-4">
            <b-col lg="6">
              <div class="glass-card h-100 p-4 p-lg-5 rounded-4">
                <div class="icon-lg rounded-3 bg-warning bg-opacity-10 text-warning flex-centered mb-3">
                  <BIconEye />
                </div>
                <h3 class="fw-bold mb-3">Our Vision</h3>
                <p class="mb-0">A world where Islamic schools don't have to choose between faith and innovation —
                  where tarbiyah and technology are one. To equip every Islamic school with the tools, curriculum,
                  and technology to raise a generation that is rooted in tarbiyah and ready for the future.</p>
              </div>
            </b-col>
            <b-col lg="6">
              <div class="glass-card h-100 p-4 p-lg-5 rounded-4">
                <div class="icon-lg rounded-3 bg-primary bg-opacity-10 text-primary flex-centered mb-3">
                  <BIconBullseye />
                </div>
                <h3 class="fw-bold mb-3">Our Mission</h3>
                <p class="mb-0">To build and deploy AI-native tools for Islamic and private schools — making
                  world-class school management and technology education accessible to institutions of every size,
                  everywhere.</p>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Instructors (reused home slider) ──────────────────── -->
      <Instructors heading="Meet Our Instructors"
        subtitle="The qualified educators behind our courses, invested in your understanding." />

      <!-- ─── Contact CTA ───────────────────────────────────────── -->
      <section class="py-5">
        <b-container>
          <div class="cta-band rounded-4 p-4 p-lg-5 text-center">
            <h2 class="fw-bold text-white mb-2">Get in Touch</h2>
            <p class="text-white opacity-75 mb-4 mx-auto" style="max-width:620px">Have a question, or want to bring
              Usmani Academy to your school? We'd love to hear from you.</p>
            <div class="d-flex flex-wrap justify-content-center gap-3 gap-md-4 mb-4 text-white">
              <a href="tel:+13162356743" class="text-white text-decoration-none"><BIconTelephone class="me-2" />+1 (316) 235-6743</a>
              <a href="mailto:info@usmaniacademy.com" class="text-white text-decoration-none"><BIconEnvelope class="me-2" />info@usmaniacademy.com</a>
              <span><BIconGeoAlt class="me-2" />555 N. Woodlawn St. Suite 220, Wichita, KS 67208</span>
            </div>
            <router-link :to="{ name: 'about.contact.us' }" class="btn btn-light btn-lg mb-0">Contact Us</router-link>
          </div>
        </b-container>
      </section>
    </main>
    <Footer1 />
  </div>
</template>
<script setup lang="ts">
import TopBar1 from '@/views/demos/default/components/TopBar1.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';
import Instructors from '@/views/demos/default/components/Instructors.vue';
import {
  BIconMoonStars, BIconBook, BIconStars, BIconCpu,
  BIconEye, BIconBullseye, BIconTelephone, BIconEnvelope, BIconGeoAlt
} from 'bootstrap-icons-vue';

const offerings = [
  {
    title: 'Islamic Studies Programs',
    desc: 'Courses designed to deepen understanding of Islamic principles, including Asma ul Husna and Tajweed Al Quran for brothers and sisters.',
    icon: BIconMoonStars
  },
  {
    title: 'Quran Tajweed Program',
    desc: 'A structured and immersive program focused on mastering the correct pronunciation and recitation of the Quran with excellence.',
    icon: BIconBook
  },
  {
    title: 'Science & Innovation',
    desc: 'Engaging programs that explore the intersections of astronomy, science, and robotics, fostering curiosity and innovation through an Islamic perspective.',
    icon: BIconStars
  },
  {
    title: 'Technology & Skills',
    desc: 'Courses in fields such as Computer Networking (Cisco) and Robotics to prepare learners for the modern world.',
    icon: BIconCpu
  }
];
</script>
<style scoped>
.about-bg {
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}
.about-bg > main {
  background-color: transparent;
}
.about-bg :deep(header.navbar-sticky) {
  background-color: transparent !important;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('../../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-attachment: fixed, fixed;
  -webkit-backdrop-filter: blur(9px);
  backdrop-filter: blur(9px);
}
/* Once the header pins on scroll, make it a bit more white for readability. */
.about-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../../../assets/images/pattern-islamic.svg');
}
.about-bg :deep(footer) {
  margin-top: 4rem;
}

/* Frosted cards over the pattern (same treatment as the home page) */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.cta-band {
  background: linear-gradient(135deg, var(--bs-primary), var(--bs-dark));
}
</style>

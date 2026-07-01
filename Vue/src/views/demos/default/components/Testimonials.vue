<template>
  <section class="py-5">
    <b-container>
      <b-row class="mb-5">
        <b-col lg="8" class="mx-auto text-center">
          <h2 class="fs-1 fw-bold">Voices from Our Community</h2>
          <p class="mb-0">What parents, students, and school leaders say about Usmani Academy.</p>
        </b-col>
      </b-row>
    </b-container>

    <!-- Two auto-scrolling rows with faded left/right edges -->
    <div class="marquee">
      <div class="marquee__track marquee__track--left">
        <div class="t-card" v-for="(t, i) in row1Loop" :key="'a' + i">
          <span class="t-quote">&#8220;</span>
          <p class="t-text">{{ t.text }}</p>
          <div class="d-flex align-items-center mt-3">
            <span class="t-avatar" :style="{ background: t.color }">{{ initials(t.name) }}</span>
            <div class="ms-2">
              <div class="fw-semibold">{{ t.name }}</div>
              <div class="small text-muted">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="marquee mt-4">
      <div class="marquee__track marquee__track--right">
        <div class="t-card" v-for="(t, i) in row2Loop" :key="'b' + i">
          <span class="t-quote">&#8220;</span>
          <p class="t-text">{{ t.text }}</p>
          <div class="d-flex align-items-center mt-3">
            <span class="t-avatar" :style="{ background: t.color }">{{ initials(t.name) }}</span>
            <div class="ms-2">
              <div class="fw-semibold">{{ t.name }}</div>
              <div class="small text-muted">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
interface Testimonial { text: string; name: string; role: string; color: string }

const row1: Testimonial[] = [
  { text: 'Usmani Academy gave our children a modern, future-ready education without ever compromising our values.', name: 'Amina R.', role: 'Parent', color: '#0F766E' },
  { text: 'The live Zoom classes made it easy for my son to keep up with his Hifdh alongside his regular studies.', name: 'Bilal K.', role: 'Parent', color: '#2563EB' },
  { text: 'Sarkaar transformed how we run our school — admissions, attendance, and finance all in one place.', name: 'Dr. Yusuf', role: 'School Principal', color: '#D4AF37' },
  { text: 'The instructors genuinely care. My daughter finally understands Tajweed with real confidence.', name: 'Fatima S.', role: 'Parent', color: '#7C3AED' },
];
const row2: Testimonial[] = [
  { text: 'AI RoboVision brought real technology education to our campus, taught with an Islamic ethical framing.', name: 'Sr. Khadija', role: 'STEM Coordinator', color: '#DB2777' },
  { text: 'A team that truly understands our community and the realities of running a mission-driven school.', name: 'Imran A.', role: 'Board Member', color: '#0891B2' },
  { text: 'The Asma Ul Husna course was beautifully taught — engaging for both my kids and me.', name: 'Hafsa M.', role: 'Parent', color: '#0F766E' },
  { text: 'Onsite training and ongoing support meant our teachers were confident from day one.', name: 'Omar T.', role: 'Vice Principal', color: '#EA580C' },
];

// Duplicate each row so the marquee loops seamlessly
const row1Loop = [...row1, ...row1];
const row2Loop = [...row2, ...row2];

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
}
</script>
<style scoped>
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.marquee__track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
}
.marquee__track--left {
  animation: marquee-left 45s linear infinite;
}
.marquee__track--right {
  animation: marquee-right 45s linear infinite;
}
.marquee:hover .marquee__track {
  animation-play-state: paused;
}
@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
.t-card {
  flex: 0 0 auto;
  width: 360px;
  background: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}
.t-quote {
  font-size: 2.5rem;
  line-height: 1;
  color: var(--bs-primary);
  font-weight: 700;
}
.t-text {
  color: #454545;
  margin: 0.25rem 0 0;
}
.t-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation-duration: 240s; }
}
</style>

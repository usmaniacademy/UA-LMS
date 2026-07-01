<template>
  <section class="pt-0 pt-md-5">
    <b-container>
      <b-row class="align-items-center g-4 g-lg-5">
        <b-col lg="6">
          <h2 class="h1">Building the Infrastructure for Islamic Education</h2>

          <p class="mt-4 mb-0">Usmani Academy is an Islamic EdTech organization building the infrastructure for the next
            generation of Muslim education — in classrooms, on campuses, and online.<br><br>We operate two core products:
          <ul class="mt-2">
            <li><b>Sarkaar</b> — an AI-powered school management platform built specifically for Islamic and private
              schools.</li>
            <li class="mt-2"><b>AI RoboVision</b> — a K–12 curriculum marketplace covering AI, robotics, IoT, and
              immersive technology with Islamic ethical framing.</li>
          </ul>
          Together, they give Islamic schools the tools to run smarter operations and deliver future-ready education —
          without compromising their values.
          <br><br>
          Alongside our products, we offer online courses in Islamic Studies, Science, and Technology for learners
          worldwide — taught by qualified instructors with deep subject expertise. We are based in Wichita, Kansas, and
          have been deployed in Islamic schools across the United States.
          </p>

          <div class="d-sm-flex align-items-center mt-4">
            <router-link :to="{ name: 'about' }" class="btn btn-lg btn-primary mb-0">Read more</router-link>
          </div>
        </b-col>

        <!-- Overlapping images: the top image sits on the upper layer of the bottom one -->
        <b-col lg="6" class="mt-4 mt-lg-0">
          <div class="about-images">
            <img :src="about26" class="rounded-3 shadow about-img about-img--bottom" alt="Usmani Academy team">
            <img :src="about25" class="rounded-3 shadow about-img about-img--top" alt="Usmani Academy at an event">
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import about25 from '@/assets/images/about/25.jpg';
import about26 from '@/assets/images/about/26.jpg';
</script>
<style scoped>
.about-images {
  position: relative;
}
.about-img {
  display: block;
  object-fit: cover;
}
/* Stacked on mobile */
.about-img--bottom {
  width: 85%;
  margin-left: auto;
}
.about-img--top {
  width: 70%;
  margin-top: -2.5rem;
  border: 4px solid #fff;
}
/* Overlap on tablet and up */
@media (min-width: 768px) {
  .about-images {
    min-height: 460px;
  }
  .about-img--bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 70%;
    z-index: 1;
    margin: 0;
  }
  .about-img--top {
    position: absolute;
    top: 0;
    right: 0;
    width: 68%;
    z-index: 2;
    margin: 0;
  }
}
</style>

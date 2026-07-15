<template>
  <section class="pt-4 pt-md-5">
    <b-container>
      <b-row class="align-items-center g-4 g-lg-5">
        <b-col lg="6">
          <h2 class="fs-1 fw-bold">Building the Infrastructure for Islamic Education</h2>

          <p class="mt-4 mb-4">Usmani Academy is an Islamic EdTech organization building the infrastructure for the next
            generation of Muslim education — in classrooms, on campuses, and online.</p>

          <!-- Product boxes, side by side -->
          <ProductBoxes class="mb-4" />

          <p class="mb-0">Alongside our products, we offer online courses in Islamic Studies, Science, and Technology for
            learners worldwide — taught by qualified instructors with deep subject expertise. We are based in Wichita,
            Kansas, and have been deployed in Islamic schools across the United States.</p>

          <div class="d-sm-flex align-items-center mt-4">
            <router-link :to="{ name: 'about' }" class="btn btn-lg btn-primary mb-0">Read more</router-link>
          </div>
        </b-col>

        <!-- Big main image, with a small inset photo in the bottom-left corner -->
        <b-col lg="6" class="mt-4 mt-lg-0">
          <div class="about-images">
            <img :src="about25" class="rounded-3 shadow about-img-main" alt="Usmani Academy at an event">
            <img :src="about26" class="about-img-inset" alt="Usmani Academy team">
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script setup lang="ts">
import ProductBoxes from '@/views/demos/default/components/ProductBoxes.vue';
import about25 from '@/assets/images/about/25.jpg';
import about26 from '@/assets/images/about/26.jpg';
</script>
<style scoped>
.about-images {
  position: relative;
}
/* Big image fills the space */
.about-img-main {
  width: 100%;
  display: block;
  object-fit: cover;
}
/* Small photo in the bottom-left corner of the big image, sitting slightly below it */
.about-img-inset {
  position: absolute;
  left: -1rem;
  bottom: calc(-3rem - 17px);
  width: 40%;
  border: 4px solid #fff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  object-fit: cover;
  z-index: 2;
}
</style>

<template>
  <footer class="footer-glass pt-5">
    <b-container>
      <b-row class="g-4">
        <b-col lg="3">
          <router-link class="me-0" :to="{ name: 'demos.default' }">
            <img class="light-mode-item" :src="logo" alt="Usmani Academy" style="height:52px">
            <img class="dark-mode-item" :src="logolight" alt="Usmani Academy" style="height:52px">
          </router-link>
          <p class="my-3">
            Usmani Academy is building the infrastructure for the next generation of Muslim education —
            in classrooms, on campuses, and online.
          </p>
          <ul class="list-inline mb-0 mt-3 d-flex gap-1">
            <li class="list-inline-item" v-for="(link, idx) in socialLink" :key="idx">
              <a :class="`btn btn-white btn-sm shadow px-2 ${link.class}`" href="#">
                <font-awesome-icon :icon="link.icon" class="fa-fw" />
              </a>
            </li>
          </ul>
        </b-col>
        <b-col lg="6">
          <b-row class="g-4">
            <b-col cols="6" v-for="(item, idx) in footerLinks" :key="idx">
              <h5 class="mb-2 mb-md-4">{{ item.text }}</h5>
              <ul class="nav flex-column">
                <li class="nav-item" v-for="(sublink, i) in item.link" :key="i">
                  <router-link class="nav-link" :to="sublink.to">{{ sublink.label }}</router-link>
                </li>
              </ul>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="3">
          <h5 class="mb-2 mb-md-4">Contact</h5>
          <p class="mb-2">
            Phone:<span class="h6 fw-light ms-2">+1 (316) 235-6743</span>
          </p>
          <p class="mb-2">
            Email:<span class="h6 fw-light ms-2">info@usmaniacademy.com</span>
          </p>
          <p class="mb-0">
            <span class="h6 fw-light">Usmani Academy<br>
            555 N. Woodlawn St. Suite - 220<br>
            Wichita, KS 67208</span>
          </p>
        </b-col>
      </b-row>

      <hr class="mt-4 mb-0">

      <div class="py-3">
        <b-container class="px-0">
          <div class="d-lg-flex justify-content-between align-items-center py-3 text-center text-md-left">
            <div class="text-body text-primary-hover">© {{ currentYear }} Usmani Academy. Developed by Acom Digital</div>
            <div class="justify-content-center mt-3 mt-lg-0">
              <ul class="nav list-inline justify-content-center mb-0">
                <li class="list-inline-item"><a class="nav-link" href="#">Terms of use</a></li>
                <li class="list-inline-item"><a class="nav-link pe-0" href="#">Privacy policy</a></li>
              </ul>
            </div>
          </div>
        </b-container>
      </div>
    </b-container>
  </footer>
</template>
<script setup lang="ts">
import { currentYear } from '@/helpers/constants';
import { faFacebookF, faInstagram, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import logo from '@/assets/images/ua-logo-dark.png.png';
import logolight from '@/assets/images/ua-logo-light.png.png';

const footerLinks = [
  {
    text: 'Useful Links',
    link: [
      { label: 'Home', to: { name: 'demos.default' } },
      { label: 'About Us', to: { name: 'about' } },
      { label: 'Courses', to: { name: 'courses.list' } },
      { label: 'Contact', to: { name: 'about.contact.us' } },
    ],
  },
  {
    text: 'Courses',
    link: [
      { label: 'Tajweed Al Quran', to: { name: 'courses.list' } },
      { label: 'Asma Ul Husna', to: { name: 'courses.list' } },
      { label: 'Computer Networks', to: { name: 'courses.list' } },
      { label: 'Eye in the Sky', to: { name: 'courses.list' } },
    ],
  },
];

const socialLink = [
  { icon: faFacebookF, class: 'text-facebook' },
  { icon: faInstagram, class: 'text-instagram' },
  { icon: faTwitter, class: 'text-twitter' },
  { icon: faLinkedinIn, class: 'text-linkedin' },
];
</script>
<style scoped>
/* Frosted-glass footer: subtle 35% wash + blur over the fixed pattern */
.footer-glass {
  background: rgba(255, 255, 255, 0.35);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>

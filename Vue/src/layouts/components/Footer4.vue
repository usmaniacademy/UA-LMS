<template>
  <footer class="bg-dark pt-5">
    <b-container>
      <b-row class="g-4">
        <!-- Brand -->
        <b-col lg="4">
          <router-link :to="{ name: 'courses.list' }">
            <img class="h-50px mb-3" :src="logoLight" alt="Usmani Academy" />
          </router-link>
          <p class="text-white-50 my-3">Teaching and Learning for Understanding. Live finance education and Islamic studies for learners worldwide.</p>
          <ul class="list-inline mb-0 mt-3 d-flex gap-2">
            <li class="list-inline-item">
              <a class="btn btn-sm btn-light px-2" href="https://www.facebook.com/usmaniacademy" target="_blank">
                <font-awesome-icon :icon="faFacebookF" class="fa-fw" />
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn btn-sm btn-light px-2" href="#" target="_blank">
                <font-awesome-icon :icon="faInstagram" class="fa-fw" />
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn btn-sm btn-light px-2" href="#" target="_blank">
                <font-awesome-icon :icon="faYoutube" class="fa-fw" />
              </a>
            </li>
          </ul>
        </b-col>

        <!-- Quick Links -->
        <b-col lg="2" md="4">
          <h5 class="text-white mb-3">Quick Links</h5>
          <ul class="nav flex-column">
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'courses.list' }">All Courses</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'about' }">About Us</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'about.contact.us' }">Contact Us</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'auth.sign-in' }">Sign In</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'auth.sign-up' }">Register</router-link></li>
          </ul>
        </b-col>

        <!-- Categories -->
        <b-col lg="2" md="4">
          <h5 class="text-white mb-3">Categories</h5>
          <ul class="nav flex-column">
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'courses.list', query: { category: 'Islamic' } }">Islamic Studies</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'courses.list', query: { category: 'Astronomy' } }">Astronomy</router-link></li>
            <li class="nav-item"><router-link class="nav-link text-white-50 px-0" :to="{ name: 'courses.list', query: { category: 'Technology' } }">Technology</router-link></li>
          </ul>
        </b-col>

        <!-- Contact -->
        <b-col lg="4" md="4">
          <h5 class="text-white mb-3">Contact Us</h5>
          <ul class="list-unstyled text-white-50">
            <li class="mb-2">
              <font-awesome-icon :icon="faPhone" class="me-2 text-primary" />
              <a href="tel:+13162356743" class="text-white-50">+1 (316) 235-6743</a>
            </li>
            <li class="mb-2">
              <font-awesome-icon :icon="faEnvelope" class="me-2 text-primary" />
              <a href="mailto:info@usmaniacademy.com" class="text-white-50">info@usmaniacademy.com</a>
            </li>
            <li class="mb-2">
              <font-awesome-icon :icon="faMapMarker" class="me-2 text-primary" />
              555 N. Woodlawn St. Suite 220<br />
              <span class="ms-4">Wichita, KS 67208</span>
            </li>
          </ul>
        </b-col>
      </b-row>

      <hr class="mt-4 mb-0 border-secondary">
      <div class="py-3 text-center text-white-50">
        <small>© {{ currentYear }} Usmani Academy. All rights reserved. | Teaching and Learning for Understanding</small>
      </div>
    </b-container>
  </footer>
</template>
<script setup lang="ts">
import { currentYear } from '@/helpers/constants'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons'
import logoLight from '@/assets/images/ua-logo-light.png.png'
</script>

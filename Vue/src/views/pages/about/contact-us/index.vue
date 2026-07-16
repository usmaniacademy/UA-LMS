<template>
  <div class="contact-bg">
    <TopBar1 />
    <main>
      <!-- ─── Hero banner (coloured, rounded bottom) ────────────── -->
      <section class="hero-banner text-center text-white">
        <b-container>
          <b-row class="justify-content-center">
            <b-col lg="8">
              <span class="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill">Get in Touch</span>
              <h1 class="display-4 fw-bold mb-3 text-white">Contact Us</h1>
              <p class="lead mb-0 opacity-75">Have a question, or want to bring Usmani Academy to your school?
                We'd love to hear from you.</p>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Contact info cards ────────────────────────────────── -->
      <section class="py-4">
        <b-container>
          <b-row class="g-4">
            <b-col md="4" v-for="c in contactCards" :key="c.title">
              <div class="glass-card h-100 p-4 rounded-4 text-center">
                <div class="icon-lg rounded-3 bg-primary bg-opacity-10 text-primary flex-centered mx-auto mb-3">
                  <component :is="c.icon" />
                </div>
                <h6 class="mb-1">{{ c.title }}</h6>
                <a v-if="c.href" :href="c.href" class="text-reset text-primary-hover">{{ c.value }}</a>
                <p v-else class="mb-0 small text-muted">{{ c.value }}</p>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <!-- ─── Form + Map ────────────────────────────────────────── -->
      <section class="py-4 py-lg-5">
        <b-container>
          <b-row class="g-4 align-items-stretch">
            <b-col lg="6">
              <div class="glass-card h-100 p-4 p-lg-5 rounded-4">
                <h3 class="fw-bold mb-2">Let's talk</h3>
                <p class="text-muted mb-4">Fill out the form and we'll get back to you promptly.</p>
                <b-form @submit.prevent="send">
                  <b-form-group label="Your name" class="mb-3">
                    <b-form-input v-model="form.name" size="lg" placeholder="e.g. Ahmed Khan" />
                  </b-form-group>
                  <b-form-group label="Email address" class="mb-3">
                    <b-form-input v-model="form.email" type="email" size="lg" placeholder="name@example.com" />
                  </b-form-group>
                  <b-form-group label="Message" class="mb-4">
                    <b-form-textarea v-model="form.message" rows="4" placeholder="How can we help?" />
                  </b-form-group>
                  <div class="d-grid">
                    <b-button variant="primary" size="lg" type="submit" class="mb-0">Send Message</b-button>
                  </div>
                </b-form>
                <div class="d-flex align-items-center mt-4">
                  <span class="me-2 fw-semibold">Follow us:</span>
                  <a class="fs-5 me-2 text-facebook" :href="social.facebook" target="_blank" rel="noopener">
                    <font-awesome-icon :icon="faFacebookSquare" class="fa-fw" />
                  </a>
                  <a class="fs-5 me-2 text-instagram" :href="social.instagram" target="_blank" rel="noopener">
                    <font-awesome-icon :icon="faInstagram" class="fa-fw" />
                  </a>
                  <a class="fs-5 text-linkedin" :href="social.linkedin" target="_blank" rel="noopener">
                    <font-awesome-icon :icon="faLinkedinIn" class="fa-fw" />
                  </a>
                </div>
              </div>
            </b-col>
            <b-col lg="6">
              <div class="glass-card h-100 rounded-4 overflow-hidden">
                <iframe class="w-100 border-0" style="min-height:100%;height:100%;display:block"
                  :src="mapSrc" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  title="Usmani Academy location"></iframe>
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
import { reactive } from 'vue';
import TopBar1 from '@/views/demos/default/components/TopBar1.vue';
import Footer1 from '@/views/demos/default/components/Footer1.vue';
import { BIconTelephone, BIconEnvelope, BIconGeoAlt } from 'bootstrap-icons-vue';
import { faFacebookSquare, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const contactCards = [
  { title: 'Call us', value: '+1 (316) 235-6743', href: 'tel:+13162356743', icon: BIconTelephone },
  { title: 'Email us', value: 'info@usmaniacademy.com', href: 'mailto:info@usmaniacademy.com', icon: BIconEnvelope },
  { title: 'Visit us', value: '555 N. Woodlawn St. Suite 220, Wichita, KS 67208', href: null, icon: BIconGeoAlt },
];

const social = {
  facebook: 'https://www.facebook.com/share/192DmY1b1t/',
  instagram: 'https://www.instagram.com/usmani_academy?igsh=MW9qNXgwZjNzM3A0ZA%3D%3D&utm_source=qr',
  linkedin: 'https://www.linkedin.com/company/usmani-academy-llc/',
};

const mapSrc = 'https://www.google.com/maps?q=555%20N%20Woodlawn%20St%20Suite%20220%20Wichita%20KS%2067208&output=embed';

const form = reactive({ name: '', email: '', message: '' });

function send() {
  const subject = encodeURIComponent(`Website enquiry from ${form.name || 'a visitor'}`);
  const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}${form.email ? ` (${form.email})` : ''}`);
  window.location.href = `mailto:info@usmaniacademy.com?subject=${subject}&body=${body}`;
}
</script>
<style scoped>
.contact-bg {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}
.contact-bg > main {
  flex: 1 0 auto;
  background-color: transparent;
}
.contact-bg :deep(header.navbar-sticky) {
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
.contact-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../../../assets/images/pattern-islamic.svg');
}
.contact-bg :deep(footer) {
  margin-top: 4rem;
}

/* Frosted cards over the pattern (same treatment as the home/About pages) */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(15, 23, 42, 0.1);
}
</style>

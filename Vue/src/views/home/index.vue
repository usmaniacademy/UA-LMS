<template>
  <PagesLayout>
    <!-- Hero -->
    <section class="py-0 position-relative" style="background: linear-gradient(135deg, #0D1B2A 0%, #1B3A4B 60%, #0F766E 100%); min-height: 90vh; display:flex; align-items:center;">
      <b-container>
        <b-row class="align-items-center g-5 py-5">
          <b-col lg="6">
            <span class="badge bg-primary bg-opacity-20 text-primary border border-primary mb-3 px-3 py-2">Teaching and Learning for Understanding</span>
            <h1 class="text-white display-4 fw-bold mb-4 lh-sm">
              Learn with<br />
              <span style="color: #D4AF37">Usmani Academy</span>
            </h1>
            <p class="text-white-50 fs-5 mb-5">
              Live courses in Islamic Studies, Astronomy, and Technology — taught by expert instructors with live Zoom sessions and on-demand content.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link :to="{ name: 'courses.list' }" class="btn btn-primary btn-lg px-4">
                Browse Courses
              </router-link>
              <router-link :to="{ name: 'auth.sign-up' }" class="btn btn-outline-light btn-lg px-4">
                Join Free
              </router-link>
            </div>
            <div class="d-flex gap-4 mt-5 text-white-50 small">
              <div><span class="text-white fw-bold fs-5">500+</span><br/>Students</div>
              <div class="border-start border-secondary ps-4"><span class="text-white fw-bold fs-5">9</span><br/>Courses</div>
              <div class="border-start border-secondary ps-4"><span class="text-white fw-bold fs-5">5</span><br/>Expert Instructors</div>
            </div>
          </b-col>
          <b-col lg="6" class="text-center">
            <img :src="logoDark" alt="Usmani Academy" class="img-fluid" style="max-height:320px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4))" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- Categories -->
    <section class="py-5 bg-light">
      <b-container>
        <div class="text-center mb-5">
          <h2 class="fw-bold">Course Categories</h2>
          <p class="text-muted">Explore our diverse range of subjects</p>
        </div>
        <b-row class="g-4 justify-content-center">
          <b-col md="4" v-for="cat in categories" :key="cat.name">
            <router-link :to="{ name: 'courses.list', query: { category: cat.name } }" class="text-decoration-none">
              <b-card class="text-center border-0 shadow-sm h-100 py-4 category-card">
                <div class="fs-1 mb-3">{{ cat.icon }}</div>
                <h5 class="fw-bold">{{ cat.name }}</h5>
                <p class="text-muted small mb-0">{{ cat.desc }}</p>
              </b-card>
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- Featured Courses -->
    <section class="py-5">
      <b-container>
        <div class="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 class="fw-bold mb-1">Featured Courses</h2>
            <p class="text-muted mb-0">Learn from the best instructors</p>
          </div>
          <router-link :to="{ name: 'courses.list' }" class="btn btn-outline-primary">View All</router-link>
        </div>

        <div v-if="courseStore.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <b-row class="g-4" v-else>
          <b-col md="6" lg="4" v-for="course in courseStore.courses.slice(0, 6)" :key="course.id">
            <router-link :to="{ name: 'course.detail.slug', params: { slug: course.slug } }" class="text-decoration-none">
              <b-card no-body class="h-100 border-0 shadow-sm course-card">
                <img :src="course.thumbnailUrl || defaultThumb" class="card-img-top" style="height:200px;object-fit:cover" :alt="course.title" />
                <b-card-body>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-primary bg-opacity-10 text-primary small">{{ course.category }}</span>
                    <span class="text-primary fw-bold">{{ course.isFree ? 'Free' : '$26/mo' }}</span>
                  </div>
                  <h6 class="fw-bold text-dark mb-2">{{ course.title }}</h6>
                  <p class="text-muted small mb-3">{{ (course.description || '').slice(0, 80) }}{{ course.description?.length > 80 ? '...' : '' }}</p>
                  <div class="d-flex align-items-center gap-2 small text-muted" v-if="course.instructor">
                    <img :src="course.instructor.avatarUrl || defaultAvatar" class="rounded-circle" style="width:24px;height:24px;object-fit:cover" />
                    {{ course.instructor.firstName }} {{ course.instructor.lastName }}
                  </div>
                </b-card-body>
              </b-card>
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- Instructors -->
    <section class="py-5 bg-light">
      <b-container>
        <div class="text-center mb-5">
          <h2 class="fw-bold">Meet Our Instructors</h2>
          <p class="text-muted">Expert educators dedicated to your success</p>
        </div>
        <b-row class="g-4 justify-content-center">
          <b-col md="6" lg="4" v-for="inst in instructors" :key="inst.name">
            <b-card class="text-center border-0 shadow-sm h-100 p-4">
              <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style="width:80px;height:80px;font-size:2rem">
                {{ inst.avatar }}
              </div>
              <h6 class="fw-bold mb-1">{{ inst.name }}</h6>
              <p class="text-primary small mb-2">{{ inst.subject }}</p>
              <p class="text-muted small mb-0">{{ inst.bio }}</p>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <!-- CTA -->
    <section class="py-5" style="background: linear-gradient(135deg, #0F766E, #065F46)">
      <b-container class="text-center">
        <h2 class="text-white fw-bold mb-3">Ready to Start Learning?</h2>
        <p class="text-white-50 mb-4 fs-5">Join hundreds of students already learning at Usmani Academy</p>
        <div class="d-flex gap-3 justify-content-center">
          <router-link :to="{ name: 'auth.sign-up' }" class="btn btn-light btn-lg px-5">Get Started Free</router-link>
          <router-link :to="{ name: 'courses.list' }" class="btn btn-outline-light btn-lg px-5">Browse Courses</router-link>
        </div>
      </b-container>
    </section>

    <!-- Contact strip -->
    <section class="py-4 bg-dark">
      <b-container>
        <b-row class="g-3 text-center text-md-start align-items-center">
          <b-col md="4" class="text-white-50">
            <font-awesome-icon :icon="faPhone" class="text-primary me-2" />
            <a href="tel:+13162356743" class="text-white-50 text-decoration-none">+1 (316) 235-6743</a>
          </b-col>
          <b-col md="4" class="text-white-50 text-center">
            <font-awesome-icon :icon="faEnvelope" class="text-primary me-2" />
            <a href="mailto:info@usmaniacademy.com" class="text-white-50 text-decoration-none">info@usmaniacademy.com</a>
          </b-col>
          <b-col md="4" class="text-white-50 text-md-end">
            <font-awesome-icon :icon="faMapMarker" class="text-primary me-2" />
            555 N. Woodlawn St. Suite 220, Wichita, KS 67208
          </b-col>
        </b-row>
      </b-container>
    </section>
  </PagesLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PagesLayout from '@/layouts/PagesLayout.vue'
import { useCourseStore } from '@/stores/course'
import { faPhone, faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons'
import logoDark from '@/assets/images/ua-logo-dark.png.png'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'
import defaultAvatar from '@/assets/images/avatar/01.jpg'

const courseStore = useCourseStore()
onMounted(() => courseStore.fetchPublicCourses({ limit: 6 }))

const categories = [
  { name: 'Islamic', icon: '🕌', desc: 'Quran, Tajweed, Arabic Language, Islamic History & more' },
  { name: 'Astronomy', icon: '🔭', desc: 'Eye in the Sky — explore the universe and celestial science' },
  { name: 'Technology', icon: '💻', desc: 'Computer Networks, IT fundamentals and digital skills' }
]

const instructors = [
  { name: 'Qari Muhammed Imran Qasmi', subject: 'Tajweed Al Quran for Brothers', bio: 'Expert in Quranic recitation and Tajweed rules for male students.', avatar: '📖' },
  { name: 'Aisha Usmani', subject: 'Tajweed Al Quran for Sisters', bio: 'Dedicated instructor for Quranic studies for female students.', avatar: '📖' },
  { name: 'Sophia Khan', subject: 'Asma Ul Husna', bio: "Teaching the 99 Names of Allah with meaning and application.", avatar: '✨' },
  { name: 'Luqman Syed', subject: 'Computer Networks', bio: 'IT professional teaching networking fundamentals in English.', avatar: '🌐' },
  { name: 'Irfan Siddiqui', subject: 'Eye in the Sky (Astronomy)', bio: 'Passionate astronomer bringing the wonders of the sky to students.', avatar: '🔭' },
]
</script>

<style scoped>
.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
.course-card {
  transition: transform 0.2s ease;
}
.course-card:hover {
  transform: translateY(-4px);
}
</style>

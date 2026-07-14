<template>
  <div class="courses-bg">
    <TopBar1 />
    <main>
      <section class="hero-banner text-center text-white">
        <b-container>
          <b-row class="justify-content-center">
            <b-col lg="8">
              <span class="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill">Explore</span>
              <h1 class="display-4 fw-bold mb-2 text-white">All Courses</h1>
              <p class="lead mb-0 opacity-75">Live courses in Islamic Studies, Astronomy and Technology.</p>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <section class="py-5">
        <b-container>
          <!-- Filters -->
          <b-row class="mb-4 g-3 align-items-center">
            <b-col md="4">
              <b-input-group>
                <b-form-input v-model="filters.search" placeholder="Search courses..." @keyup.enter="load" />
                <b-button variant="primary" @click="load">Search</b-button>
              </b-input-group>
            </b-col>
            <b-col md="3">
              <b-form-select v-model="filters.category" @change="load">
                <option value="">All categories</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Technology">Technology</option>
              </b-form-select>
            </b-col>
            <b-col md="3">
              <b-form-select v-model="filters.level" @change="load">
                <option value="">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </b-form-select>
            </b-col>
            <b-col md="2" class="text-muted small text-end">
              {{ store.pagination.total }} course{{ store.pagination.total !== 1 ? 's' : '' }}
            </b-col>
          </b-row>

          <!-- Loading -->
          <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="store.courses.length === 0" class="text-center py-5">
            <h5 class="text-muted">No courses found</h5>
            <p class="text-muted">Try adjusting your filters or search term.</p>
          </div>

          <!-- Grid -->
          <b-row v-else class="g-4">
            <b-col sm="6" xl="4" v-for="course in store.courses" :key="course.id">
              <CourseCard :course="course" />
            </b-col>
          </b-row>

          <!-- Pagination -->
          <nav v-if="store.pagination.totalPages > 1" class="mt-5 d-flex justify-content-center">
            <ul class="pagination pagination-primary-soft mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click.prevent="goToPage(currentPage - 1)" href="#">&laquo;</a>
              </li>
              <li v-for="p in store.pagination.totalPages" :key="p" class="page-item" :class="{ active: p === currentPage }">
                <a class="page-link" @click.prevent="goToPage(p)" href="#">{{ p }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === store.pagination.totalPages }">
                <a class="page-link" @click.prevent="goToPage(currentPage + 1)" href="#">&raquo;</a>
              </li>
            </ul>
          </nav>
        </b-container>
      </section>
    </main>
    <Footer1 />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import TopBar1 from '@/views/demos/default/components/TopBar1.vue'
import Footer1 from '@/views/demos/default/components/Footer1.vue'
import { useCourseStore } from '@/stores/course'
import CourseCard from './CourseCard.vue'

const store = useCourseStore()
const currentPage = ref(1)

const filters = reactive({ search: '', category: '', level: '' })

async function load() {
  const params: Record<string, string | number> = { page: currentPage.value }
  if (filters.search) params.search = filters.search
  if (filters.category) params.category = filters.category
  if (filters.level) params.level = filters.level
  await store.fetchPublicCourses(params)
}

function goToPage(p: number) {
  currentPage.value = p
  load()
}

onMounted(load)
</script>
<style scoped>
.courses-bg {
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}
.courses-bg > main {
  background-color: transparent;
}
.courses-bg :deep(header.navbar-sticky) {
  background-color: transparent !important;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-attachment: fixed, fixed;
  -webkit-backdrop-filter: blur(9px);
  backdrop-filter: blur(9px);
}
.courses-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../assets/images/pattern-islamic.svg');
}
.courses-bg :deep(footer) {
  margin-top: 4rem;
}
/* Frosted course cards over the pattern (matches the rest of the site) */
.courses-bg :deep(.course-card) {
  background: rgba(255, 255, 255, 0.7) !important;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>

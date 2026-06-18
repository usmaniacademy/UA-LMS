<template>
  <PagesLayout>
    <section class="py-5 bg-dark position-relative" style="min-height:180px">
      <b-container class="d-flex align-items-center" style="min-height:180px">
        <div>
          <h1 class="text-white mb-1">All Courses</h1>
          <p class="text-white-50 mb-0">Expand your skills in Forex, Crypto, Stocks and more.</p>
        </div>
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
              <option value="Forex">Forex Trading</option>
              <option value="Crypto">Cryptocurrency</option>
              <option value="Stocks">Stock Market</option>
              <option value="Options">Options Trading</option>
              <option value="Finance">Personal Finance</option>
              <option value="Investing">Investing</option>
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
  </PagesLayout>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import PagesLayout from '@/layouts/PagesLayout.vue'
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

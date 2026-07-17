<template>
  <div class="blog-bg">
    <TopBar1 />
    <main>
      <section class="hero-banner text-center text-white">
        <b-container>
          <b-row class="justify-content-center">
            <b-col lg="8">
              <span class="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill">Blog</span>
              <h1 class="display-4 fw-bold mb-2 text-white">Insights &amp; Articles</h1>
              <p class="lead mb-0 opacity-75">
                Guidance on Quranic studies, Arabic, Islamic knowledge, astronomy and technology.
              </p>
            </b-col>
          </b-row>
        </b-container>
      </section>

      <section class="py-5">
        <b-container>
          <!-- Filters -->
          <b-row class="mb-4 g-3 align-items-center">
            <b-col md="5">
              <b-input-group>
                <b-form-input v-model="filters.search" placeholder="Search articles..." @keyup.enter="onSearch" />
                <b-button variant="primary" @click="onSearch">Search</b-button>
              </b-input-group>
            </b-col>
            <b-col md="4">
              <b-form-select v-model="filters.category" @change="onSearch">
                <option value="">All categories</option>
                <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
              </b-form-select>
            </b-col>
            <b-col md="3" class="text-muted small text-md-end">
              {{ store.pagination.total }} article{{ store.pagination.total !== 1 ? 's' : '' }}
            </b-col>
          </b-row>

          <!-- Loading -->
          <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="store.posts.length === 0" class="text-center py-5">
            <h5 class="text-muted">No articles found</h5>
            <p class="text-muted">Try adjusting your search or category.</p>
          </div>

          <!-- Grid -->
          <b-row v-else class="g-4">
            <b-col sm="6" xl="4" v-for="post in store.posts" :key="post.id">
              <BlogCard :post="post" />
            </b-col>
          </b-row>

          <!-- Pagination -->
          <nav v-if="store.pagination.totalPages > 1" class="mt-5 d-flex justify-content-center">
            <ul class="pagination pagination-primary-soft mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click.prevent="goToPage(currentPage - 1)" href="#">&laquo;</a>
              </li>
              <li v-for="p in pageNumbers" :key="p" class="page-item" :class="{ active: p === currentPage }">
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import TopBar1 from '@/views/demos/default/components/TopBar1.vue'
import Footer1 from '@/views/demos/default/components/Footer1.vue'
import { useBlogStore } from '@/stores/blog'
import BlogCard from './BlogCard.vue'

const store = useBlogStore()
const currentPage = ref(1)
const filters = reactive({ search: '', category: '' })

useHead({
  title: 'Blog | Usmani Academy',
  meta: [
    { name: 'description', content: 'Articles and insights on Quranic studies, Arabic, Islamic knowledge, astronomy and technology from Usmani Academy.' }
  ]
})

// Windowed page numbers so long paginations don't overflow (show up to 7)
const pageNumbers = computed(() => {
  const total = store.pagination.totalPages
  const cur = currentPage.value
  const span = 3
  let start = Math.max(1, cur - span)
  let end = Math.min(total, cur + span)
  if (cur <= span) end = Math.min(total, 2 * span + 1)
  if (cur > total - span) start = Math.max(1, total - 2 * span)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

async function load() {
  const params: Record<string, string | number> = { page: currentPage.value, limit: 9 }
  if (filters.search) params.search = filters.search
  if (filters.category) params.category = filters.category
  await store.fetchPosts(params)
}

function onSearch() {
  currentPage.value = 1
  load()
}

function goToPage(p: number) {
  if (p < 1 || p > store.pagination.totalPages) return
  currentPage.value = p
  load()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  store.fetchCategories()
  load()
})
</script>

<style scoped>
.blog-bg {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('../../assets/images/pattern-islamic.svg');
  background-repeat: repeat, repeat;
  background-size: cover, 120px 120px;
  background-position: center center, center center;
  background-attachment: fixed, fixed;
}
.blog-bg > main {
  flex: 1 0 auto;
  background-color: transparent;
}
.blog-bg :deep(header.navbar-sticky) {
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
.blog-bg :deep(header.navbar-sticky-on) {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    url('../../assets/images/pattern-islamic.svg');
}
.blog-bg :deep(footer) {
  margin-top: 4rem;
}
.blog-bg :deep(.blog-card) {
  background: rgba(255, 255, 255, 0.95) !important;
}
</style>

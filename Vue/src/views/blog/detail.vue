<template>
  <div class="blog-detail-bg">
    <TopBar1 />
    <main>
      <!-- Loading -->
      <div v-if="store.loading && !post" class="text-center py-5 my-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <!-- Not found -->
      <div v-else-if="!post" class="text-center py-5 my-5">
        <h4 class="text-muted">Article not found</h4>
        <router-link :to="{ name: 'blog.list' }" class="btn btn-primary mt-3">Back to Blog</router-link>
      </div>

      <template v-else>
        <!-- Hero -->
        <section class="article-hero text-white">
          <div class="article-hero-overlay"></div>
          <b-container class="position-relative">
            <b-row class="justify-content-center text-center py-5">
              <b-col lg="9">
                <router-link
                  v-if="post.category"
                  :to="{ name: 'blog.list', query: { category: post.category } }"
                  class="badge bg-primary text-decoration-none mb-3 px-3 py-2"
                >{{ post.category }}</router-link>
                <h1 class="display-5 fw-bold text-white mb-3">{{ post.title }}</h1>
                <ul class="list-inline mb-0 text-white opacity-75">
                  <li class="list-inline-item me-3">
                    <font-awesome-icon :icon="faUser" class="me-1" />{{ authorLabel }}
                  </li>
                  <li class="list-inline-item">
                    <font-awesome-icon :icon="faCalendar" class="me-1" />{{ formattedDate }}
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-container>
        </section>

        <!-- Body -->
        <section class="py-5">
          <b-container>
            <b-row class="justify-content-center">
              <b-col lg="9" xl="8">
                <b-card no-body class="shadow-sm border-0 p-3 p-md-5 article-card">
                  <img
                    v-if="post.featuredImage"
                    :src="post.featuredImage"
                    class="w-100 rounded-3 mb-4 article-featured"
                    :alt="post.title"
                  />

                  <article class="article-body" v-html="post.content"></article>

                  <!-- Tags -->
                  <div v-if="post.tags && post.tags.length" class="mt-5 pt-4 border-top">
                    <h6 class="mb-3">Tags</h6>
                    <router-link
                      v-for="tag in post.tags"
                      :key="tag"
                      :to="{ name: 'blog.list', query: { tag } }"
                      class="btn btn-outline-secondary btn-sm me-2 mb-2"
                    >{{ tag }}</router-link>
                  </div>
                </b-card>

                <div class="text-center mt-4">
                  <router-link :to="{ name: 'blog.list' }" class="btn btn-outline-primary">
                    <font-awesome-icon :icon="faArrowLeft" class="me-2" />Back to all articles
                  </router-link>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </section>
      </template>
    </main>
    <Footer1 />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { faUser, faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import TopBar1 from '@/views/demos/default/components/TopBar1.vue'
import Footer1 from '@/views/demos/default/components/Footer1.vue'
import { useBlogStore, type BlogPost } from '@/stores/blog'

const route = useRoute()
const store = useBlogStore()

const post = computed<BlogPost | null>(() => store.currentPost)

const authorLabel = computed(() => {
  if (!post.value) return ''
  return post.value.authorName || 'Usmani Academy'
})

const formattedDate = computed(() => {
  if (!post.value?.publishedAt) return ''
  return new Date(post.value.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})

useHead({
  title: computed(() => post.value ? `${post.value.seoTitle || post.value.title} | Usmani Academy` : 'Blog | Usmani Academy'),
  meta: [
    { name: 'description', content: computed(() => post.value?.seoDescription || post.value?.excerpt || '') },
    { name: 'keywords', content: computed(() => post.value?.seoKeywords || '') },
    // Open Graph for social sharing
    { property: 'og:title', content: computed(() => post.value?.seoTitle || post.value?.title || '') },
    { property: 'og:description', content: computed(() => post.value?.seoDescription || post.value?.excerpt || '') },
    { property: 'og:image', content: computed(() => post.value?.featuredImage || '') },
    { property: 'og:type', content: 'article' }
  ]
})

async function load(slug: string) {
  try {
    await store.fetchPostBySlug(slug)
  } catch {
    // 404 handled by the template's not-found state
  }
}

watch(() => route.params.slug, (slug) => {
  if (slug) load(String(slug))
}, { immediate: true })
</script>

<style scoped>
.blog-detail-bg {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f9;
}
.blog-detail-bg > main {
  flex: 1 0 auto;
}

.article-hero {
  position: relative;
  padding: 2rem 0;
  background:
    radial-gradient(circle at 25% 15%, rgba(255, 255, 255, 0.14), transparent 55%),
    linear-gradient(135deg, var(--bs-primary), var(--bs-dark));
  border-bottom-left-radius: 2.5rem;
  border-bottom-right-radius: 2.5rem;
}
.article-hero-overlay {
  position: absolute;
  inset: 0;
  border-bottom-left-radius: 2.5rem;
  border-bottom-right-radius: 2.5rem;
}

.article-card {
  background: #fff;
  border-radius: 1rem;
}
.article-featured {
  max-height: 460px;
  object-fit: cover;
}

/* Rendered post content — WordPress/Quill HTML */
.article-body {
  font-size: 1.075rem;
  line-height: 1.85;
  color: #2b2b33;
}
.article-body :deep(h2) {
  font-size: 1.7rem;
  font-weight: 700;
  margin: 2.2rem 0 1rem;
}
.article-body :deep(h3) {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 1.8rem 0 0.85rem;
}
.article-body :deep(h4) {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
}
.article-body :deep(p) {
  margin-bottom: 1.25rem;
}
.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
.article-body :deep(li) {
  margin-bottom: 0.5rem;
}
.article-body :deep(a) {
  color: var(--bs-primary);
  text-decoration: underline;
}
.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
  display: block;
}
.article-body :deep(figure) {
  margin: 1.5rem 0;
}
.article-body :deep(figcaption) {
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
  margin-top: 0.5rem;
}
.article-body :deep(table) {
  width: 100%;
  margin-bottom: 1.5rem;
  border-collapse: collapse;
}
.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid #dee2e6;
  padding: 0.6rem 0.85rem;
}
.article-body :deep(blockquote) {
  border-left: 4px solid var(--bs-primary);
  padding-left: 1.25rem;
  color: #555;
  font-style: italic;
  margin: 1.5rem 0;
}
</style>

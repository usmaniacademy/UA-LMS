<template>
  <router-link :to="{ name: 'blog.detail', params: { slug: post.slug } }" class="text-decoration-none">
    <b-card no-body class="shadow h-100 blog-card overflow-hidden">
      <div class="position-relative overflow-hidden" style="height:200px">
        <img
          :src="post.featuredImage || defaultThumb"
          class="w-100 h-100 blog-card-img"
          style="object-fit:cover"
          :alt="post.title"
          loading="lazy"
        />
        <span v-if="post.category" class="badge bg-primary position-absolute top-0 start-0 m-3">
          {{ post.category }}
        </span>
      </div>

      <b-card-body class="d-flex flex-column">
        <h5 class="fw-bold mb-2 text-dark blog-card-title" style="line-height:1.35">{{ post.title }}</h5>
        <p v-if="post.excerpt" class="text-muted small mb-3 blog-card-excerpt">{{ post.excerpt }}</p>

        <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
          <span class="small text-muted">{{ authorLabel }}</span>
          <span class="small text-muted">{{ formattedDate }}</span>
        </div>
      </b-card-body>
    </b-card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BlogListItem } from '@/stores/blog'
import defaultThumb from '@/assets/images/courses/4by3/08.jpg'

const props = defineProps<{ post: BlogListItem }>()

const authorLabel = computed(() => {
  return props.post.authorName || 'Usmani Academy'
})

const formattedDate = computed(() => {
  if (!props.post.publishedAt) return ''
  return new Date(props.post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
})
</script>

<style scoped>
.blog-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
}
.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
.blog-card:hover .blog-card-img {
  transform: scale(1.05);
}
.blog-card-img {
  transition: transform 0.4s ease;
}
.blog-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

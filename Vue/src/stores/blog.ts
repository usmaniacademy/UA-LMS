import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  category?: string
  tags: string[]
  status: 'draft' | 'published'
  publishedAt?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  authorId?: string | null
  authorName?: string | null
  author?: { firstName: string; lastName: string; avatarUrl?: string } | null
  createdAt?: string
  updatedAt?: string
}

export interface BlogListItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  category?: string
  tags: string[]
  publishedAt?: string
  authorName?: string | null
  author?: { firstName: string; lastName: string } | null
}

export const useBlogStore = defineStore('blog_store', () => {
  const posts = ref<BlogListItem[]>([])
  const currentPost = ref<BlogPost | null>(null)
  const categories = ref<string[]>([])
  const loading = ref(false)
  const error = ref('')
  const pagination = ref({ total: 0, page: 1, totalPages: 1 })

  // ─── Public ─────────────────────────────────────────────────────────────────

  async function fetchPosts(params: Record<string, string | number> = {}) {
    loading.value = true
    error.value = ''
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const data = await api.get(`/blog${query ? `?${query}` : ''}`)
      posts.value = data.posts
      pagination.value = { total: data.total, page: data.page, totalPages: data.totalPages }
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const data = await api.get('/blog/categories')
      categories.value = data.categories
    } catch {
      categories.value = []
    }
  }

  async function fetchPostBySlug(slug: string) {
    loading.value = true
    error.value = ''
    currentPost.value = null
    try {
      const data = await api.get(`/blog/${slug}`)
      currentPost.value = data.post
      return data.post
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // ─── Content writer / admin ───────────────────────────────────────────────────

  const managePosts = ref<BlogPost[]>([])

  async function fetchManagePosts(params: Record<string, string | number> = {}) {
    loading.value = true
    error.value = ''
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const data = await api.get(`/blog/manage${query ? `?${query}` : ''}`)
      managePosts.value = data.posts
      pagination.value = { total: data.total, page: data.page, totalPages: data.totalPages }
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchManagePost(id: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/blog/manage/${id}`)
      currentPost.value = data.post
      return data.post
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createPost(payload: Partial<BlogPost>) {
    const data = await api.post('/blog', payload)
    return data.post
  }

  async function updatePost(id: string, payload: Partial<BlogPost>) {
    const data = await api.put(`/blog/${id}`, payload)
    return data.post
  }

  async function deletePost(id: string) {
    await api.delete(`/blog/${id}`)
    managePosts.value = managePosts.value.filter((p) => p.id !== id)
  }

  async function uploadImage(dataUrl: string, filename?: string): Promise<{ url: string; key: string }> {
    return api.post('/blog/upload-image', { dataUrl, filename })
  }

  return {
    posts, currentPost, categories, loading, error, pagination, managePosts,
    fetchPosts, fetchCategories, fetchPostBySlug,
    fetchManagePosts, fetchManagePost, createPost, updatePost, deletePost, uploadImage
  }
})

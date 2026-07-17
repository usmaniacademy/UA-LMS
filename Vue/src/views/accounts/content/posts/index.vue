<template>
  <ContentLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <h3 class="mb-0">All Posts</h3>
          <router-link :to="{ name: 'content.post.new' }" class="btn btn-sm btn-primary mb-0">
            <font-awesome-icon :icon="faPlus" class="me-1" />New Post
          </router-link>
        </b-card-header>

        <b-card-body>
          <!-- Filters -->
          <b-row class="g-3 mb-4 align-items-center">
            <b-col md="6">
              <b-input-group>
                <b-form-input v-model="search" placeholder="Search posts by title..." @keyup.enter="load" />
                <b-button variant="primary" @click="load">Search</b-button>
              </b-input-group>
            </b-col>
            <b-col md="4">
              <b-form-select v-model="statusFilter" @change="load">
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </b-form-select>
            </b-col>
            <b-col md="2" class="text-md-end text-muted small">
              {{ store.pagination.total }} total
            </b-col>
          </b-row>

          <!-- Loading -->
          <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="store.managePosts.length === 0" class="text-center py-5">
            <h5 class="text-muted">No posts yet</h5>
            <router-link :to="{ name: 'content.post.new' }" class="btn btn-primary mt-2">Write your first post</router-link>
          </div>

          <!-- Table -->
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in store.managePosts" :key="post.id">
                  <td style="max-width:320px">
                    <span class="fw-semibold d-block text-truncate">{{ post.title }}</span>
                    <small class="text-muted">/{{ post.slug }}</small>
                  </td>
                  <td><span class="small">{{ post.category || '—' }}</span></td>
                  <td>
                    <span class="badge" :class="post.status === 'published' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ post.status }}
                    </span>
                  </td>
                  <td><span class="small">{{ formatDate(post.publishedAt) }}</span></td>
                  <td class="text-end">
                    <a
                      v-if="post.status === 'published'"
                      :href="`/blog/${post.slug}`"
                      target="_blank"
                      class="btn btn-sm btn-light mb-0 me-1"
                      title="View"
                    >
                      <font-awesome-icon :icon="faEye" />
                    </a>
                    <router-link
                      :to="{ name: 'content.post.edit', params: { id: post.id } }"
                      class="btn btn-sm btn-primary-soft mb-0 me-1"
                      title="Edit"
                    >
                      <font-awesome-icon :icon="faPen" />
                    </router-link>
                    <b-button size="sm" variant="danger-soft" class="mb-0" title="Delete" @click="confirmDelete(post)">
                      <font-awesome-icon :icon="faTrash" />
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav v-if="store.pagination.totalPages > 1" class="mt-4 d-flex justify-content-center">
            <ul class="pagination pagination-primary-soft mb-0">
              <li class="page-item" :class="{ disabled: page === 1 }">
                <a class="page-link" href="#" @click.prevent="goTo(page - 1)">&laquo;</a>
              </li>
              <li v-for="p in store.pagination.totalPages" :key="p" class="page-item" :class="{ active: p === page }">
                <a class="page-link" href="#" @click.prevent="goTo(p)">{{ p }}</a>
              </li>
              <li class="page-item" :class="{ disabled: page === store.pagination.totalPages }">
                <a class="page-link" href="#" @click.prevent="goTo(page + 1)">&raquo;</a>
              </li>
            </ul>
          </nav>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Delete confirm modal -->
    <b-modal v-model="deleteModal" title="Delete post?" ok-variant="danger" ok-title="Delete" @ok="doDelete">
      <p class="mb-0">
        Are you sure you want to delete <strong>{{ postToDelete?.title }}</strong>? This can't be undone.
      </p>
    </b-modal>
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { faPlus, faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import ContentLayout from '@/layouts/ContentLayout.vue'
import { useBlogStore, type BlogPost } from '@/stores/blog'

const store = useBlogStore()
const search = ref('')
const statusFilter = ref('')
const page = ref(1)

const deleteModal = ref(false)
const postToDelete = ref<BlogPost | null>(null)

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function load() {
  const params: Record<string, string | number> = { page: page.value, limit: 20 }
  if (search.value) params.search = search.value
  if (statusFilter.value) params.status = statusFilter.value
  await store.fetchManagePosts(params)
}

function goTo(p: number) {
  if (p < 1 || p > store.pagination.totalPages) return
  page.value = p
  load()
}

function confirmDelete(post: BlogPost) {
  postToDelete.value = post
  deleteModal.value = true
}

async function doDelete() {
  if (!postToDelete.value) return
  await store.deletePost(postToDelete.value.id)
  postToDelete.value = null
  // Reload to keep pagination counts correct
  load()
}

onMounted(load)
</script>

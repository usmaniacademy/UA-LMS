<template>
  <ContentLayout>
    <b-col xl="9">
      <b-form @submit.prevent="save">
        <b-card no-body class="border bg-transparent rounded-3">
          <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
            <h3 class="mb-0">{{ isEdit ? 'Edit Post' : 'New Post' }}</h3>
            <router-link :to="{ name: 'content.posts' }" class="btn btn-sm btn-light mb-0">
              <font-awesome-icon :icon="faArrowLeft" class="me-1" />Back
            </router-link>
          </b-card-header>

          <b-card-body>
            <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
            <div v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>

            <div v-if="loadingPost" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>

            <template v-else>
              <!-- Title -->
              <b-form-group label="Title *" class="mb-3">
                <b-form-input v-model="form.title" placeholder="Post title" size="lg" @input="onTitleInput" required />
              </b-form-group>

              <!-- Slug -->
              <b-form-group label="URL slug" class="mb-3"
                description="The article's web address: /blog/your-slug. Auto-filled from the title — edit only if needed.">
                <b-input-group>
                  <template #prepend>
                    <span class="input-group-text text-muted">/blog/</span>
                  </template>
                  <b-form-input v-model="form.slug" placeholder="post-url-slug" @input="slugTouched = true" />
                </b-input-group>
              </b-form-group>

              <!-- Excerpt -->
              <b-form-group label="Excerpt" class="mb-3"
                description="Short summary shown on the blog listing cards and used as the fallback meta description.">
                <b-form-textarea v-model="form.excerpt" rows="2" max-rows="4" placeholder="A short summary of the post..." />
              </b-form-group>

              <!-- Featured image -->
              <b-form-group label="Featured image" class="mb-4">
                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <div v-if="form.featuredImage" class="position-relative">
                    <img :src="form.featuredImage" class="rounded-3 border" style="width:200px;height:120px;object-fit:cover" alt="featured" />
                    <b-button size="sm" variant="danger" class="position-absolute top-0 end-0 m-1 py-0 px-2"
                      @click="form.featuredImage = ''">&times;</b-button>
                  </div>
                  <div v-else
                    class="rounded-3 border border-dashed d-flex align-items-center justify-content-center text-muted"
                    style="width:200px;height:120px">
                    <span class="small">No image</span>
                  </div>
                  <div>
                    <b-button variant="primary-soft" :disabled="uploadingFeatured" @click="triggerFeaturedUpload">
                      <span v-if="uploadingFeatured" class="spinner-border spinner-border-sm me-2" />
                      {{ form.featuredImage ? 'Replace image' : 'Upload image' }}
                    </b-button>
                    <input ref="featuredInput" type="file" accept="image/*" class="d-none" @change="onFeaturedSelected" />
                    <p class="small text-muted mb-0 mt-2">JPG, PNG or WebP. Max 8MB.</p>
                  </div>
                </div>
              </b-form-group>

              <!-- Content -->
              <b-form-group label="Content *" class="mb-4">
                <RichTextEditor v-model="form.content" :upload-fn="store.uploadImage" :min-height="340"
                  placeholder="Write your article here..." />
              </b-form-group>

              <hr class="my-4" />
              <h5 class="mb-3">Organization</h5>

              <b-row class="g-3 mb-2">
                <b-col md="6">
                  <b-form-group label="Category">
                    <b-form-input v-model="form.category" list="category-options" placeholder="e.g. Quranic Studies" />
                    <datalist id="category-options">
                      <option v-for="c in store.categories" :key="c" :value="c" />
                    </datalist>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Tags" description="Comma-separated, e.g. tajweed, quran, recitation">
                    <b-form-input v-model="tagsInput" placeholder="tag one, tag two" />
                  </b-form-group>
                </b-col>
              </b-row>

              <hr class="my-4" />
              <h5 class="mb-1">SEO</h5>
              <p class="text-muted small mb-3">Leave blank to fall back to the title and excerpt.</p>

              <b-form-group label="SEO title" class="mb-3">
                <b-form-input v-model="form.seoTitle" placeholder="Custom title for search engines" />
              </b-form-group>
              <b-form-group label="Meta description" class="mb-3"
                :description="`${(form.seoDescription || '').length}/160 characters recommended`">
                <b-form-textarea v-model="form.seoDescription" rows="2" placeholder="Description shown in Google results..." />
              </b-form-group>
              <b-form-group label="Focus keywords" class="mb-3"
                description="Comma-separated keywords you're targeting.">
                <b-form-input v-model="form.seoKeywords" placeholder="keyword one, keyword two" />
              </b-form-group>
            </template>
          </b-card-body>

          <b-card-footer class="bg-transparent border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">Status:</span>
              <span class="badge" :class="form.status === 'published' ? 'bg-success' : 'bg-warning text-dark'">
                {{ form.status }}
              </span>
            </div>
            <div class="d-flex gap-2">
              <b-button variant="light" :disabled="saving" @click="save('draft')">
                <span v-if="saving && savingAs === 'draft'" class="spinner-border spinner-border-sm me-2" />
                Save draft
              </b-button>
              <b-button variant="primary" :disabled="saving" @click="save('published')">
                <span v-if="saving && savingAs === 'published'" class="spinner-border spinner-border-sm me-2" />
                {{ form.status === 'published' ? 'Update' : 'Publish' }}
              </b-button>
            </div>
          </b-card-footer>
        </b-card>
      </b-form>
    </b-col>
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ContentLayout from '@/layouts/ContentLayout.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const router = useRouter()
const store = useBlogStore()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => String(route.params.id || ''))

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  status: 'draft' as 'draft' | 'published',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})
const tagsInput = ref('')

const slugTouched = ref(false)
const loadingPost = ref(false)
const saving = ref(false)
const savingAs = ref<'draft' | 'published' | ''>('')
const errorMsg = ref('')
const successMsg = ref('')

const featuredInput = ref<HTMLInputElement | null>(null)
const uploadingFeatured = ref(false)

// ─── Slug ─────────────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
function onTitleInput() {
  if (!slugTouched.value) form.slug = slugify(form.title)
}

// ─── Images ─────────────────────────────────────────────────────────────────
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function triggerFeaturedUpload() {
  featuredInput.value?.click()
}

async function onFeaturedSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  errorMsg.value = ''
  uploadingFeatured.value = true
  try {
    const dataUrl = await readAsDataUrl(file)
    const { url } = await store.uploadImage(dataUrl, file.name)
    form.featuredImage = url
  } catch (err: any) {
    errorMsg.value = err.message || 'Image upload failed'
  } finally {
    uploadingFeatured.value = false
    if (featuredInput.value) featuredInput.value.value = ''
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────
async function save(status?: 'draft' | 'published') {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.title || form.title.trim().length < 3) {
    errorMsg.value = 'Title must be at least 3 characters.'
    return
  }
  const plain = (form.content || '').replace(/<[^>]*>/g, '').trim()
  if (!plain) {
    errorMsg.value = 'Content is required.'
    return
  }

  const targetStatus = status || form.status
  saving.value = true
  savingAs.value = targetStatus

  const payload: Record<string, unknown> = {
    title: form.title.trim(),
    slug: form.slug ? slugify(form.slug) : undefined,
    excerpt: form.excerpt || undefined,
    content: form.content,
    featuredImage: form.featuredImage || undefined,
    category: form.category || undefined,
    tags: tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean),
    status: targetStatus,
    seoTitle: form.seoTitle || undefined,
    seoDescription: form.seoDescription || undefined,
    seoKeywords: form.seoKeywords || undefined
  }

  try {
    if (isEdit.value) {
      await store.updatePost(editId.value, payload)
      form.status = targetStatus
      successMsg.value = 'Post saved.'
    } else {
      const created = await store.createPost(payload)
      successMsg.value = 'Post created.'
      // Switch to edit mode for the newly created post
      router.replace({ name: 'content.post.edit', params: { id: created.id } })
      form.status = created.status
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to save post.'
  } finally {
    saving.value = false
    savingAs.value = ''
  }
}

// ─── Load (edit mode) ─────────────────────────────────────────────────────────
async function loadForEdit() {
  loadingPost.value = true
  try {
    const post = await store.fetchManagePost(editId.value)
    form.title = post.title
    form.slug = post.slug
    form.excerpt = post.excerpt || ''
    form.content = post.content || ''
    form.featuredImage = post.featuredImage || ''
    form.category = post.category || ''
    form.status = post.status
    form.seoTitle = post.seoTitle || ''
    form.seoDescription = post.seoDescription || ''
    form.seoKeywords = post.seoKeywords || ''
    tagsInput.value = (post.tags || []).join(', ')
    slugTouched.value = true
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to load post.'
  } finally {
    loadingPost.value = false
  }
}

onMounted(() => {
  store.fetchCategories()
  if (isEdit.value) loadForEdit()
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed !important;
}
</style>

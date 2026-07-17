<template>
  <div id="step-1" role="tabpanel" class="content fade" aria-labelledby="steppertrigger1">
    <h4>Course Details</h4>
    <hr>
    <b-row class="g-4">
      <b-col cols="12">
        <b-form-group label="Course title *">
          <b-form-input v-model="form.title" type="text" placeholder="e.g. Complete Forex Trading Masterclass" size="lg" />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Short description *">
          <b-form-textarea v-model="form.description" placeholder="Brief one-line overview shown below the course title" rows="2" />
          <div class="form-text">A short blurb shown below the title and on course cards. The full description is added in Step 2.</div>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Category *">
          <b-form-select v-model="form.category" size="lg">
            <option value="">Select category</option>
            <option value="Islamic Studies">Islamic Studies</option>
            <option value="Astronomy">Astronomy</option>
            <option value="Technology">Technology</option>
            <option value="Other">Other</option>
          </b-form-select>
        </b-form-group>
        <div v-if="form.category === 'Other'" class="mt-2">
          <b-form-input v-model="form.customCategory" placeholder="Enter category name" size="lg" />
        </div>
      </b-col>

      <b-col md="6">
        <b-form-group label="Course level *">
          <b-form-select v-model="form.level" size="lg">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col cols="12" v-if="isAdmin">
        <b-form-group label="Assign Instructor *">
          <b-form-select v-model="form.instructorId" size="lg">
            <option value="">Select instructor</option>
            <option v-for="i in adminStore.instructors" :key="i.id" :value="i.id">
              {{ i.firstName }} {{ i.lastName }} ({{ i.email }})
            </option>
          </b-form-select>
          <div class="form-text">The course will appear on this instructor's dashboard.</div>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Thumbnail image">
          <div class="d-flex align-items-start gap-3 flex-wrap">
            <div v-if="form.thumbnailUrl" class="position-relative">
              <img :src="form.thumbnailUrl" class="rounded border" style="width:220px;height:132px;object-fit:cover;" alt="Thumbnail preview" />
              <b-button size="sm" variant="danger" class="position-absolute top-0 end-0 m-1 py-0 px-2"
                @click="form.thumbnailUrl = ''">&times;</b-button>
            </div>
            <div v-else class="rounded border border-dashed d-flex align-items-center justify-content-center text-muted"
              style="width:220px;height:132px;">
              <span class="small">No image</span>
            </div>
            <div>
              <b-button variant="primary" :disabled="uploadingThumb" @click="triggerThumbUpload">
                <span v-if="uploadingThumb" class="spinner-border spinner-border-sm me-2" />
                {{ form.thumbnailUrl ? 'Replace image' : 'Upload image' }}
              </b-button>
              <input ref="thumbInput" type="file" accept="image/*" class="d-none" @change="onThumbSelected" />
              <p class="small text-muted mb-2 mt-2">JPG, PNG or WebP. Max 8MB.</p>
              <div v-if="thumbError" class="small text-danger">{{ thumbError }}</div>
            </div>
          </div>
          <div class="mt-3">
            <b-form-input v-model="form.thumbnailUrl" type="url" placeholder="…or paste a direct image URL" />
          </div>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="isFree" v-model="form.isFree">
          <label class="form-check-label fw-semibold" for="isFree">
            This is a free course (no Stripe subscription required)
          </label>
        </div>
      </b-col>

      <b-col cols="12" class="d-flex justify-content-end">
        <b-button variant="primary" @click="handleNext" :disabled="!canProceed">
          Next: Course Media
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import { useCourseStore } from '@/stores/course'

const props = defineProps<{ form: any; nextPage: () => void }>()

const auth = useAuthStore()
const adminStore = useAdminStore()
const courseStore = useCourseStore()
const isAdmin = computed(() => auth.getUser()?.role === 'admin')

// ─── Thumbnail upload ─────────────────────────────────────────────────────────
const thumbInput = ref<HTMLInputElement | null>(null)
const uploadingThumb = ref(false)
const thumbError = ref('')

function triggerThumbUpload() {
  thumbInput.value?.click()
}

async function onThumbSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  thumbError.value = ''
  uploadingThumb.value = true
  try {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const { url } = await courseStore.uploadImage(dataUrl, file.name)
    props.form.thumbnailUrl = url
  } catch (err: any) {
    thumbError.value = err.message || 'Image upload failed'
  } finally {
    uploadingThumb.value = false
    if (thumbInput.value) thumbInput.value.value = ''
  }
}

onMounted(() => {
  if (isAdmin.value && !adminStore.instructors.length) adminStore.fetchInstructors()
})

const canProceed = computed(() =>
  props.form.title?.trim().length >= 3 &&
  props.form.category &&
  (props.form.category !== 'Other' || props.form.customCategory?.trim().length >= 2) &&
  (!isAdmin.value || props.form.instructorId)
)

function handleNext() {
  if (canProceed.value) props.nextPage()
}
</script>

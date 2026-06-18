<template>
  <div id="step-4" role="tabpanel" class="content fade" aria-labelledby="steppertrigger4">
    <h4>Pricing & Publish</h4>
    <hr>
    <b-row class="g-4">
      <!-- Free toggle summary -->
      <b-col cols="12">
        <div class="border rounded-3 p-4" :class="form.isFree ? 'border-success bg-success bg-opacity-10' : 'bg-light'">
          <div class="d-flex align-items-center gap-3">
            <span class="fs-2">{{ form.isFree ? '🆓' : '💳' }}</span>
            <div>
              <h5 class="mb-1">{{ form.isFree ? 'Free Course' : 'Paid Course — $26/month' }}</h5>
              <p class="mb-0 text-muted small">
                {{ form.isFree
                  ? 'Students can access this course without subscribing. Great for attracting new learners.'
                  : 'Students subscribe at $26/month per course via Stripe. You\'ll set the Stripe Price ID after publishing.' }}
              </p>
            </div>
          </div>
          <div class="mt-3">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="isFreeToggle" v-model="form.isFree">
              <label class="form-check-label" for="isFreeToggle">Make this a free course</label>
            </div>
          </div>
        </div>
      </b-col>

      <!-- Stripe price ID (paid only) -->
      <b-col v-if="!form.isFree" cols="12">
        <b-form-group label="Stripe Price ID (optional — set after creating in Stripe Dashboard)">
          <b-form-input v-model="form.stripePriceId" placeholder="price_..." />
          <div class="form-text">Create a recurring monthly price in your Stripe Dashboard and paste the Price ID here.</div>
        </b-form-group>
      </b-col>

      <!-- Course summary -->
      <b-col cols="12">
        <div class="border rounded-3 p-4 bg-light">
          <h6 class="mb-3">Course Summary</h6>
          <table class="table table-sm table-borderless mb-0">
            <tbody>
              <tr><td class="text-muted">Title</td><td class="fw-semibold">{{ form.title || '—' }}</td></tr>
              <tr><td class="text-muted">Category</td><td>{{ form.category || '—' }}</td></tr>
              <tr><td class="text-muted">Level</td><td class="text-capitalize">{{ form.level }}</td></tr>
              <tr><td class="text-muted">Pricing</td><td>{{ form.isFree ? 'Free' : '$26/month' }}</td></tr>
            </tbody>
          </table>
        </div>
      </b-col>

      <b-col cols="12">
        <div v-if="error" class="alert alert-danger py-2 mb-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2 mb-3">{{ success }}</div>
      </b-col>

      <b-col cols="12" class="d-flex justify-content-between gap-2 flex-wrap">
        <b-button variant="outline-secondary" @click="previousPage">Back</b-button>
        <div class="d-flex gap-2">
          <b-button variant="outline-primary" @click="handleSaveDraft" :disabled="loading">
            <span v-if="loading === 'draft'" class="spinner-border spinner-border-sm me-1" />
            Save as Draft
          </b-button>
          <b-button variant="primary" @click="handlePublish" :disabled="loading">
            <span v-if="loading === 'publish'" class="spinner-border spinner-border-sm me-1" />
            Save & Publish
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCourseStore } from '@/stores/course'
import router from '@/router'

const props = defineProps<{
  form: any
  courseId: string | null
  setCourseId: (id: string) => void
  previousPage: () => void
}>()

const courseStore = useCourseStore()
const loading = ref<false | 'draft' | 'publish'>(false)
const error = ref('')
const success = ref('')

async function saveCourse(publish: boolean) {
  error.value = ''
  success.value = ''
  loading.value = publish ? 'publish' : 'draft'

  try {
    const payload = {
      title: props.form.title,
      description: props.form.description,
      category: props.form.category,
      level: props.form.level,
      isFree: props.form.isFree,
      thumbnailUrl: props.form.thumbnailUrl || undefined,
      stripePriceId: props.form.stripePriceId || undefined
    }

    let course
    if (props.courseId) {
      course = await courseStore.updateCourse(props.courseId, payload)
    } else {
      course = await courseStore.createCourse(payload)
      props.setCourseId(course.id)
    }

    if (publish) {
      await courseStore.publishCourse(course.id)
      success.value = 'Course published successfully!'
    } else {
      success.value = 'Draft saved!'
    }

    setTimeout(() => router.push({ name: 'instructor.course' }), 1500)
  } catch (e: any) {
    error.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const handleSaveDraft = () => saveCourse(false)
const handlePublish = () => saveCourse(true)
</script>

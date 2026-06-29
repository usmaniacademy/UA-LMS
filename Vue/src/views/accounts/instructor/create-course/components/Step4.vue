<template>
  <div id="step-4" role="tabpanel" class="content fade" aria-labelledby="steppertrigger4">
    <h4>Pricing & Publish</h4>
    <hr>
    <b-row class="g-4">
      <!-- Free toggle -->
      <b-col cols="12">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="isFreeToggle" v-model="form.isFree">
          <label class="form-check-label fw-semibold" for="isFreeToggle">Make this a free course</label>
        </div>
        <div class="form-text">Free courses are accessible without a subscription.</div>
      </b-col>

      <!-- Paid pricing fields -->
      <template v-if="!form.isFree">
        <b-col md="4">
          <b-form-group label="Monthly price (USD) *">
            <b-input-group prepend="$">
              <b-form-input
                v-model.number="form.price"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 49"
              />
            </b-input-group>
            <div class="form-text">Students will be billed this amount per month via Stripe.</div>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-group label="Stripe Price ID (optional — paste after creating in Stripe Dashboard)">
            <b-form-input v-model="form.stripePriceId" placeholder="price_..." />
            <div class="form-text">Leave blank for now — you can add this after setting up the price in Stripe.</div>
          </b-form-group>
        </b-col>
      </template>

      <!-- Course summary -->
      <b-col cols="12">
        <div class="border rounded-3 p-4 bg-light">
          <h6 class="mb-3">Course Summary</h6>
          <table class="table table-sm table-borderless mb-0">
            <tbody>
              <tr><td class="text-muted">Title</td><td class="fw-semibold">{{ form.title || '—' }}</td></tr>
              <tr><td class="text-muted">Category</td><td>{{ form.category === 'Other' ? form.customCategory : form.category || '—' }}</td></tr>
              <tr><td class="text-muted">Level</td><td class="text-capitalize">{{ form.level }}</td></tr>
              <tr><td class="text-muted">Pricing</td><td>{{ form.isFree ? 'Free' : form.price ? `$${form.price}/month` : 'Set price above' }}</td></tr>
            </tbody>
          </table>
        </div>
      </b-col>

      <b-col cols="12">
        <div v-if="error" class="alert alert-danger py-2 mb-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2 mb-3">{{ success }}</div>
      </b-col>

      <b-col cols="12">
        <p v-if="isEditMode" class="text-muted small mb-2">
          Your existing details are kept — edit only what you need and save.
        </p>
      </b-col>

      <b-col cols="12" class="d-flex justify-content-between gap-2 flex-wrap">
        <b-button variant="outline-secondary" @click="previousPage">Back</b-button>
        <div class="d-flex gap-2">
          <b-button variant="outline-primary" @click="handleSaveDraft" :disabled="loading">
            <span v-if="loading === 'draft'" class="spinner-border spinner-border-sm me-1" />
            {{ isEditMode ? 'Save Changes' : 'Save as Draft' }}
          </b-button>
          <b-button variant="primary" @click="handlePublish" :disabled="loading">
            <span v-if="loading === 'publish'" class="spinner-border spinner-border-sm me-1" />
            {{ isEditMode ? 'Save & Publish' : 'Save & Publish' }}
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
  isEditMode?: boolean
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
    const cleanedLearningPoints = (props.form.learningPoints || []).filter((p: string) => p && p.trim())

    const payload = {
      title: props.form.title,
      description: props.form.description,
      fullDescription: props.form.fullDescription || undefined,
      category: props.form.category === 'Other' ? props.form.customCategory : props.form.category,
      level: props.form.level,
      isFree: props.form.isFree,
      price: props.form.isFree ? undefined : (props.form.price || undefined),
      promoVideoUrl: props.form.promoVideoUrl || undefined,
      learningPoints: cleanedLearningPoints.length ? cleanedLearningPoints : undefined,
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
      // Only navigate away on publish
      setTimeout(() => router.push({ name: 'instructor.course' }), 1500)
    } else {
      // Stay on the builder so the user can keep adding curriculum & Zoom classes
      success.value = props.isEditMode
        ? 'Changes saved.'
        : 'Draft saved. You can now add curriculum and Zoom classes in the Curriculum step.'
    }
  } catch (e: any) {
    error.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const handleSaveDraft = () => saveCourse(false)
const handlePublish = () => saveCourse(true)
</script>

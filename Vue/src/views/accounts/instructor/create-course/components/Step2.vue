<template>
  <div id="step-2" role="tabpanel" class="content fade" aria-labelledby="steppertrigger2">
    <h4>Course Media</h4>
    <hr>
    <b-row class="g-4">
      <b-col cols="12">
        <b-form-group label="Promo video URL (optional)">
          <b-form-input v-model="form.promoVideoUrl" type="url" placeholder="https://youtube.com/watch?v=..." size="lg" />
          <div class="form-text">YouTube or Vimeo URL — shown on the public course page.</div>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Full course description">
          <b-form-textarea
            v-model="form.description"
            rows="8"
            placeholder="Describe what students will learn, who this course is for, prerequisites, etc."
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <div class="bg-light border rounded p-4">
          <h6 class="mb-3">What students will learn</h6>
          <div v-for="(_, idx) in form.learningPoints" :key="idx" class="d-flex gap-2 mb-2">
            <b-form-input v-model="form.learningPoints[idx]" placeholder="e.g. How to read forex charts" />
            <b-button variant="outline-danger" size="sm" @click="removeLearningPoint(idx)">✕</b-button>
          </div>
          <b-button variant="outline-primary" size="sm" @click="addLearningPoint">+ Add point</b-button>
        </div>
      </b-col>

      <b-col cols="12" class="d-flex justify-content-between">
        <b-button variant="outline-secondary" @click="previousPage">Back</b-button>
        <b-button variant="primary" @click="nextPage">Next: Curriculum</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ form: any; nextPage: () => void; previousPage: () => void }>()

if (!Array.isArray(props.form.learningPoints)) props.form.learningPoints = ['', '']

function addLearningPoint() {
  props.form.learningPoints.push('')
}

function removeLearningPoint(idx: number) {
  props.form.learningPoints.splice(idx, 1)
}
</script>

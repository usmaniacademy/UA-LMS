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
          <b-form-textarea v-model="form.description" placeholder="Brief overview of what students will learn" rows="3" />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Category *">
          <b-form-select v-model="form.category" size="lg">
            <option value="">Select category</option>
            <option value="Forex">Forex Trading</option>
            <option value="Crypto">Cryptocurrency</option>
            <option value="Stocks">Stock Market</option>
            <option value="Options">Options Trading</option>
            <option value="Finance">Personal Finance</option>
            <option value="Investing">Investing</option>
          </b-form-select>
        </b-form-group>
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

      <b-col cols="12">
        <b-form-group label="Thumbnail URL">
          <b-form-input v-model="form.thumbnailUrl" type="url" placeholder="https://..." size="lg" />
          <div class="form-text">Paste a direct image URL. Image upload will be added in a future update.</div>
        </b-form-group>
        <div v-if="form.thumbnailUrl" class="mt-2">
          <img :src="form.thumbnailUrl" class="rounded" style="max-height:140px;object-fit:cover;" alt="Thumbnail preview" />
        </div>
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
import { computed } from 'vue'

const props = defineProps<{ form: any; nextPage: () => void }>()

const canProceed = computed(() =>
  props.form.title?.trim().length >= 3 && props.form.category
)

function handleNext() {
  if (canProceed.value) props.nextPage()
}
</script>

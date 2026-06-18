<template>
  <div id="step-3" role="tabpanel" class="content fade" aria-labelledby="steppertrigger3">
    <h4>Curriculum</h4>
    <hr>

    <div v-if="!courseId" class="alert alert-info">
      Complete Step 1 and save the course first before adding curriculum.
    </div>

    <template v-else>
      <!-- Sections list -->
      <div v-for="(section, sIdx) in localSections" :key="section.id ?? sIdx" class="border rounded-3 mb-3 overflow-hidden">
        <div class="bg-light px-4 py-3 d-flex justify-content-between align-items-center">
          <div v-if="section.editing" class="d-flex gap-2 flex-fill me-3">
            <b-form-input v-model="section.title" size="sm" placeholder="Section title" />
            <b-button size="sm" variant="primary" @click="saveSection(section, sIdx)">Save</b-button>
            <b-button size="sm" variant="outline-secondary" @click="section.editing = false">Cancel</b-button>
          </div>
          <h6 v-else class="mb-0 fw-semibold flex-fill">{{ section.title }}</h6>
          <div class="d-flex gap-2">
            <b-button size="sm" variant="outline-primary" @click="section.editing = true">Edit</b-button>
            <b-button size="sm" variant="outline-danger" @click="removeSection(section, sIdx)">Delete</b-button>
          </div>
        </div>

        <div class="p-3">
          <!-- Lessons -->
          <div v-for="(lesson, lIdx) in section.lessons" :key="lesson.id ?? lIdx"
            class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-light text-dark text-uppercase small">{{ lesson.contentType }}</span>
              <span>{{ lesson.title }}</span>
              <span v-if="lesson.isFree" class="badge bg-success-soft text-success small">Free preview</span>
            </div>
            <div class="d-flex gap-2">
              <b-button size="sm" variant="outline-success" @click="openEditLesson(section, lesson)">Edit</b-button>
              <b-button size="sm" variant="outline-danger" @click="removeLesson(section, lesson, lIdx)">✕</b-button>
            </div>
          </div>

          <b-button size="sm" variant="outline-primary" class="mt-3" @click="openAddLesson(section)">
            + Add Lesson
          </b-button>
        </div>
      </div>

      <!-- Add section -->
      <div class="border border-dashed rounded-3 p-3 mb-4">
        <div class="d-flex gap-2">
          <b-form-input v-model="newSectionTitle" placeholder="New section title (e.g. Introduction)" />
          <b-button variant="primary" @click="addSection" :disabled="!newSectionTitle.trim()">Add Section</b-button>
        </div>
      </div>
    </template>

    <div class="d-flex justify-content-between mt-2">
      <b-button variant="outline-secondary" @click="previousPage">Back</b-button>
      <b-button variant="primary" @click="nextPage">Next: Pricing & Publish</b-button>
    </div>

    <!-- Lesson modal -->
    <b-modal v-model="lessonModal" :title="editingLesson ? 'Edit Lesson' : 'Add Lesson'" @ok="saveLesson">
      <b-form class="d-flex flex-column gap-3">
        <b-form-group label="Lesson title *">
          <b-form-input v-model="lessonForm.title" placeholder="e.g. What is Forex?" />
        </b-form-group>
        <b-form-group label="Content type">
          <b-form-select v-model="lessonForm.contentType">
            <option value="video">Video</option>
            <option value="text">Text / Reading</option>
            <option value="zoom">Zoom Class</option>
          </b-form-select>
        </b-form-group>
        <b-form-group v-if="lessonForm.contentType !== 'zoom'" label="Content URL">
          <b-form-input v-model="lessonForm.contentUrl" placeholder="https://..." />
        </b-form-group>
        <b-form-group label="Duration (minutes)">
          <b-form-input v-model.number="lessonForm.durationMin" type="number" min="0" />
        </b-form-group>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="isFreeLesson" v-model="lessonForm.isFree">
          <label class="form-check-label" for="isFreeLesson">Free preview (visible without subscription)</label>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCourseStore } from '@/stores/course'

const props = defineProps<{
  courseId: string | null
  nextPage: () => void
  previousPage: () => void
}>()

const courseStore = useCourseStore()

const localSections = ref<any[]>([])
const newSectionTitle = ref('')
const lessonModal = ref(false)
const editingLesson = ref(false)
const activeSectionRef = ref<any>(null)
const activeLessonRef = ref<any>(null)

const lessonForm = reactive({
  title: '', contentType: 'video', contentUrl: '', durationMin: 0, isFree: false
})

async function addSection() {
  if (!props.courseId || !newSectionTitle.value.trim()) return
  const section = await courseStore.createSection(props.courseId, newSectionTitle.value.trim(), localSections.value.length)
  localSections.value.push({ ...section, lessons: [], editing: false })
  newSectionTitle.value = ''
}

async function saveSection(section: any, idx: number) {
  if (section.id) await courseStore.updateSection(section.id, { title: section.title })
  section.editing = false
}

async function removeSection(section: any, idx: number) {
  if (!confirm('Delete this section and all its lessons?')) return
  if (section.id) await courseStore.deleteSection(section.id)
  localSections.value.splice(idx, 1)
}

function openAddLesson(section: any) {
  activeSectionRef.value = section
  editingLesson.value = false
  Object.assign(lessonForm, { title: '', contentType: 'video', contentUrl: '', durationMin: 0, isFree: false })
  lessonModal.value = true
}

function openEditLesson(section: any, lesson: any) {
  activeSectionRef.value = section
  activeLessonRef.value = lesson
  editingLesson.value = true
  Object.assign(lessonForm, {
    title: lesson.title,
    contentType: lesson.contentType,
    contentUrl: lesson.contentUrl || '',
    durationMin: lesson.duration ? Math.round(lesson.duration / 60) : 0,
    isFree: lesson.isFree
  })
  lessonModal.value = true
}

async function saveLesson() {
  const payload = {
    title: lessonForm.title,
    contentType: lessonForm.contentType,
    contentUrl: lessonForm.contentUrl || undefined,
    duration: lessonForm.durationMin * 60,
    isFree: lessonForm.isFree,
    orderIndex: activeSectionRef.value.lessons?.length ?? 0
  }

  if (editingLesson.value && activeLessonRef.value?.id) {
    const updated = await courseStore.updateLesson(activeLessonRef.value.id, payload)
    Object.assign(activeLessonRef.value, updated)
  } else {
    const lesson = await courseStore.createLesson(activeSectionRef.value.id, payload)
    if (!activeSectionRef.value.lessons) activeSectionRef.value.lessons = []
    activeSectionRef.value.lessons.push(lesson)
  }
}

async function removeLesson(section: any, lesson: any, idx: number) {
  if (!confirm('Delete this lesson?')) return
  if (lesson.id) await courseStore.deleteLesson(lesson.id)
  section.lessons.splice(idx, 1)
}
</script>

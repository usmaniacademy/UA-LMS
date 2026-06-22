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
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="badge text-uppercase small"
                :class="lesson.contentType === 'zoom' ? 'bg-primary' : lesson.contentType === 'video' ? 'bg-warning text-dark' : 'bg-light text-dark'">
                {{ lesson.contentType === 'zoom' ? '📹 Zoom' : lesson.contentType === 'video' ? '🎬 Video' : '📄 Text' }}
              </span>
              <span>{{ lesson.title }}</span>
              <span v-if="lesson.zoomStartTime" class="text-muted small">
                · {{ new Date(lesson.zoomStartTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }}
              </span>
              <span v-if="lesson.isFree" class="badge bg-success-soft text-success small">Free preview</span>
            </div>
            <div class="d-flex gap-2">
              <a v-if="lesson.contentType === 'zoom' && lesson.contentUrl" :href="lesson.contentUrl"
                target="_blank" class="btn btn-sm btn-outline-success">Join Link</a>
              <b-button size="sm" variant="outline-primary" @click="openEditLesson(section, lesson)">Edit</b-button>
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
    <b-modal v-model="lessonModal" :title="editingLesson ? 'Edit Lesson' : 'Add Lesson'"
      @ok="saveLesson" :ok-disabled="zoomSaving" ok-title="Save Lesson" size="lg">

      <div v-if="zoomError" class="alert alert-danger py-2 mb-3">{{ zoomError }}</div>

      <b-form class="d-flex flex-column gap-3">
        <b-form-group label="Lesson title *">
          <b-form-input v-model="lessonForm.title" placeholder="e.g. Introduction to Islamic Finance" />
        </b-form-group>

        <b-form-group label="Content type">
          <b-form-select v-model="lessonForm.contentType">
            <option value="video">🎬 Video</option>
            <option value="text">📄 Text / Reading</option>
            <option value="zoom">📹 Zoom Live Class</option>
          </b-form-select>
        </b-form-group>

        <!-- Video / Text fields -->
        <template v-if="lessonForm.contentType !== 'zoom'">
          <b-form-group label="Content URL">
            <b-form-input v-model="lessonForm.contentUrl" placeholder="https://..." />
          </b-form-group>
          <b-form-group label="Duration (minutes)">
            <b-form-input v-model.number="lessonForm.durationMin" type="number" min="0" />
          </b-form-group>
        </template>

        <!-- Zoom class fields -->
        <template v-else>
          <div class="bg-light border rounded-3 p-3">
            <h6 class="mb-3 text-primary">📹 Zoom Class Details</h6>
            <b-row class="g-3">
              <b-col cols="12">
                <b-form-group label="Class topic / title">
                  <b-form-input v-model="lessonForm.zoomTopic" :placeholder="lessonForm.title || 'e.g. Live Q&A Session Week 1'" />
                  <div class="form-text">Leave blank to use the lesson title above.</div>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Date & Time *">
                  <b-form-input v-model="lessonForm.zoomStartTime" type="datetime-local" />
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Duration (min)">
                  <b-form-input v-model.number="lessonForm.durationMin" type="number" min="15" max="480" />
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Timezone">
                  <b-form-select v-model="lessonForm.zoomTimezone">
                    <option value="America/Chicago">CDT (Wichita)</option>
                    <option value="America/New_York">EDT (New York)</option>
                    <option value="America/Los_Angeles">PDT (Los Angeles)</option>
                    <option value="Asia/Karachi">PKT (Karachi)</option>
                    <option value="Asia/Dubai">GST (Dubai)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="UTC">UTC</option>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Agenda / description (optional)">
                  <b-form-textarea v-model="lessonForm.zoomAgenda" rows="2" placeholder="What will be covered in this class?" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="waitingRoom" v-model="lessonForm.zoomWaitingRoom">
                  <label class="form-check-label" for="waitingRoom">Enable waiting room</label>
                </div>
              </b-col>
              <b-col md="6">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="autoRec" v-model="lessonForm.zoomAutoRecording">
                  <label class="form-check-label" for="autoRec">Auto cloud recording</label>
                </div>
              </b-col>
            </b-row>
            <div v-if="lessonForm.zoomJoinUrl" class="alert alert-success mt-3 mb-0 py-2 small">
              ✅ Zoom meeting created — <a :href="lessonForm.zoomJoinUrl" target="_blank">Join link</a>
            </div>
          </div>
        </template>

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
import { useZoomStore } from '@/stores/zoom'

const props = defineProps<{
  courseId: string | null
  nextPage: () => void
  previousPage: () => void
}>()

const courseStore = useCourseStore()
const zoomStore = useZoomStore()

const localSections = ref<any[]>([])
const newSectionTitle = ref('')
const lessonModal = ref(false)
const editingLesson = ref(false)
const activeSectionRef = ref<any>(null)
const activeLessonRef = ref<any>(null)
const zoomSaving = ref(false)
const zoomError = ref('')

const lessonForm = reactive({
  title: '',
  contentType: 'video',
  contentUrl: '',
  durationMin: 60,
  isFree: false,
  // Zoom-specific
  zoomTopic: '',
  zoomStartTime: '',
  zoomTimezone: 'America/Chicago',
  zoomAgenda: '',
  zoomWaitingRoom: true,
  zoomAutoRecording: false,
  zoomJoinUrl: '',
  zoomMeetingId: ''
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
  zoomError.value = ''
  Object.assign(lessonForm, {
    title: '', contentType: 'video', contentUrl: '', durationMin: 60, isFree: false,
    zoomTopic: '', zoomStartTime: '', zoomTimezone: 'America/Chicago',
    zoomAgenda: '', zoomWaitingRoom: true, zoomAutoRecording: false,
    zoomJoinUrl: '', zoomMeetingId: ''
  })
  lessonModal.value = true
}

function openEditLesson(section: any, lesson: any) {
  activeSectionRef.value = section
  activeLessonRef.value = lesson
  editingLesson.value = true
  zoomError.value = ''
  Object.assign(lessonForm, {
    title: lesson.title,
    contentType: lesson.contentType,
    contentUrl: lesson.contentUrl || '',
    durationMin: lesson.duration ? Math.round(lesson.duration / 60) : 60,
    isFree: lesson.isFree,
    zoomTopic: lesson.zoomTopic || '',
    zoomStartTime: lesson.zoomStartTime ? toLocalInput(lesson.zoomStartTime) : '',
    zoomTimezone: lesson.zoomTimezone || 'America/Chicago',
    zoomAgenda: lesson.zoomAgenda || '',
    zoomWaitingRoom: true,
    zoomAutoRecording: false,
    zoomJoinUrl: lesson.contentUrl || '',
    zoomMeetingId: lesson.zoomMeetingId || ''
  })
  lessonModal.value = true
}

async function saveLesson(evt: Event) {
  evt.preventDefault()
  zoomError.value = ''
  zoomSaving.value = true

  try {
    let contentUrl = lessonForm.contentUrl || undefined
    let zoomMeetingId = lessonForm.zoomMeetingId || undefined

    // Create / update Zoom meeting if this is a Zoom lesson
    if (lessonForm.contentType === 'zoom') {
      if (!lessonForm.zoomStartTime) {
        zoomError.value = 'Please set a date and time for the Zoom class.'
        zoomSaving.value = false
        return
      }
      const zoomPayload = {
        courseId: props.courseId!,
        topic: lessonForm.zoomTopic || lessonForm.title,
        startTime: new Date(lessonForm.zoomStartTime).toISOString(),
        duration: lessonForm.durationMin,
        timezone: lessonForm.zoomTimezone,
        agenda: lessonForm.zoomAgenda || undefined,
        waitingRoom: lessonForm.zoomWaitingRoom,
        autoRecording: lessonForm.zoomAutoRecording
      }

      const meeting = editingLesson.value && lessonForm.zoomMeetingId
        ? await zoomStore.updateMeeting(lessonForm.zoomMeetingId, zoomPayload)
        : await zoomStore.createMeeting(zoomPayload)

      contentUrl = meeting.joinUrl
      zoomMeetingId = meeting.id
    }

    const payload: any = {
      title: lessonForm.title,
      contentType: lessonForm.contentType,
      contentUrl,
      duration: lessonForm.durationMin * 60,
      isFree: lessonForm.isFree,
      orderIndex: activeSectionRef.value.lessons?.length ?? 0
    }

    // Attach zoom metadata if zoom lesson
    if (lessonForm.contentType === 'zoom') {
      payload.zoomMeetingId = zoomMeetingId
      payload.zoomTopic = lessonForm.zoomTopic || lessonForm.title
      payload.zoomStartTime = new Date(lessonForm.zoomStartTime).toISOString()
      payload.zoomTimezone = lessonForm.zoomTimezone
    }

    if (editingLesson.value && activeLessonRef.value?.id) {
      const updated = await courseStore.updateLesson(activeLessonRef.value.id, payload)
      Object.assign(activeLessonRef.value, updated)
    } else {
      const lesson = await courseStore.createLesson(activeSectionRef.value.id, payload)
      if (!activeSectionRef.value.lessons) activeSectionRef.value.lessons = []
      activeSectionRef.value.lessons.push(lesson)
    }

    lessonModal.value = false
  } catch (e: any) {
    zoomError.value = e.message || 'Failed to save lesson'
  } finally {
    zoomSaving.value = false
  }
}

async function removeLesson(section: any, lesson: any, idx: number) {
  if (!confirm('Delete this lesson?')) return
  if (lesson.id) await courseStore.deleteLesson(lesson.id)
  section.lessons.splice(idx, 1)
}

function toLocalInput(iso: string) {
  return new Date(iso).toISOString().slice(0, 16)
}
</script>

<template>
  <InstructorLayout>
    <b-col xl="9">
      <!-- Header -->
      <b-card no-body class="border bg-transparent rounded-3 mb-4">
        <b-card-header class="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h3 class="mb-0">Zoom Classes</h3>
            <p class="text-muted small mb-0">Schedule and manage live classes for your courses</p>
          </div>
          <b-button variant="primary" @click="openCreate">+ Schedule Class</b-button>
        </b-card-header>

        <b-card-body>
          <!-- Course selector -->
          <b-form-group label="Filter by course" class="mb-4">
            <b-form-select v-model="selectedCourseId" @change="loadMeetings">
              <option value="">— Select a course —</option>
              <option v-for="c in courseStore.myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
            </b-form-select>
          </b-form-group>

          <!-- Loading -->
          <div v-if="zoomStore.loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- No course selected -->
          <div v-else-if="!selectedCourseId" class="text-center py-4 text-muted">
            Select a course above to see its Zoom classes.
          </div>

          <!-- Empty -->
          <div v-else-if="activeMeetings.length === 0" class="text-center py-4 text-muted">
            No Zoom classes scheduled for this course yet.
          </div>

          <!-- Meetings list -->
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="meeting in activeMeetings" :key="meeting.id"
              class="border rounded-3 p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="badge" :class="{
                    'bg-success': meeting.status === 'live',
                    'bg-primary': meeting.status === 'scheduled',
                    'bg-secondary': meeting.status === 'completed'
                  }">{{ meeting.status }}</span>
                  <h6 class="mb-0 fw-bold">{{ meeting.topic }}</h6>
                </div>
                <div class="text-muted small">
                  📅 {{ formatDate(meeting.startTime) }} &nbsp;·&nbsp;
                  ⏱ {{ meeting.duration }} min &nbsp;·&nbsp;
                  🌍 {{ meeting.timezone }}
                </div>
                <div v-if="meeting.agenda" class="text-muted small mt-1">{{ meeting.agenda }}</div>
              </div>

              <div class="d-flex gap-2 flex-wrap">
                <!-- Start class (instructor) -->
                <b-button variant="success" size="sm" @click="startClass(meeting)">
                  ▶ Start Class
                </b-button>
                <b-button variant="outline-primary" size="sm" @click="openEdit(meeting)">Edit</b-button>
                <b-button variant="outline-danger" size="sm" @click="cancelMeeting(meeting.id)">Cancel</b-button>
              </div>
            </div>
          </div>

          <!-- Completed with recordings -->
          <div v-if="completedMeetings.length > 0" class="mt-5">
            <h5 class="mb-3">Past Classes & Recordings</h5>
            <div v-for="meeting in completedMeetings" :key="meeting.id"
              class="border rounded-3 p-3 d-flex justify-content-between align-items-center mb-2 bg-light">
              <div>
                <div class="fw-semibold">{{ meeting.topic }}</div>
                <div class="text-muted small">{{ formatDate(meeting.startTime) }} · {{ meeting.duration }} min</div>
              </div>
              <a v-if="meeting.recordingUrl" :href="meeting.recordingUrl" target="_blank" class="btn btn-sm btn-outline-primary">
                🎬 Recording
              </a>
              <span v-else class="text-muted small">No recording</span>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Create / Edit modal -->
    <b-modal v-model="modalOpen" :title="editingMeeting ? 'Edit Zoom Class' : 'Schedule Zoom Class'"
      size="lg" @ok="saveMeeting" ok-title="Save Class" :ok-disabled="saving">

      <div v-if="formError" class="alert alert-danger py-2 mb-3">{{ formError }}</div>

      <b-form class="d-flex flex-column gap-3">
        <b-form-group label="Course *">
          <b-form-select v-model="form.courseId" :disabled="!!editingMeeting">
            <option value="">— Select course —</option>
            <option v-for="c in courseStore.myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Class title / topic *">
          <b-form-input v-model="form.topic" placeholder="e.g. Live Forex Analysis — Week 1" />
        </b-form-group>

        <b-row class="g-3">
          <b-col md="6">
            <b-form-group label="Date & Time *">
              <b-form-input v-model="form.startTime" type="datetime-local" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Duration (min) *">
              <b-form-input v-model.number="form.duration" type="number" min="15" max="480" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Timezone">
              <b-form-select v-model="form.timezone">
                <option value="Asia/Karachi">PKT (Karachi)</option>
                <option value="Asia/Dubai">GST (Dubai)</option>
                <option value="Asia/Riyadh">AST (Riyadh)</option>
                <option value="America/New_York">EST (New York)</option>
                <option value="Europe/London">GMT (London)</option>
                <option value="UTC">UTC</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group label="Agenda / description (optional)">
          <b-form-textarea v-model="form.agenda" rows="3" placeholder="What will be covered in this class?" />
        </b-form-group>

        <b-form-group label="Meeting password (optional)">
          <b-form-input v-model="form.password" placeholder="Leave blank for no password" />
        </b-form-group>

        <b-row class="g-3">
          <b-col md="6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="waitingRoom" v-model="form.waitingRoom">
              <label class="form-check-label" for="waitingRoom">Enable waiting room</label>
            </div>
          </b-col>
          <b-col md="6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="autoRec" v-model="form.autoRecording">
              <label class="form-check-label" for="autoRec">Auto cloud recording</label>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </InstructorLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import InstructorLayout from '@/layouts/InstructorLayout.vue'
import { useCourseStore } from '@/stores/course'
import { useZoomStore } from '@/stores/zoom'
import type { ZoomMeeting } from '@/stores/zoom'

const courseStore = useCourseStore()
const zoomStore = useZoomStore()

const selectedCourseId = ref('')
const modalOpen = ref(false)
const editingMeeting = ref<ZoomMeeting | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  courseId: '',
  topic: '',
  startTime: '',
  duration: 60,
  timezone: 'Asia/Karachi',
  password: '',
  waitingRoom: true,
  autoRecording: false,
  agenda: ''
})

const activeMeetings = computed(() =>
  zoomStore.meetings.filter((m) => m.status !== 'completed' && m.status !== 'cancelled')
)
const completedMeetings = computed(() =>
  zoomStore.meetings.filter((m) => m.status === 'completed')
)

onMounted(() => courseStore.fetchMyCourses())

async function loadMeetings() {
  if (selectedCourseId.value) await zoomStore.fetchMeetingsByCourse(selectedCourseId.value)
}

function openCreate() {
  editingMeeting.value = null
  formError.value = ''
  Object.assign(form, {
    courseId: selectedCourseId.value || '',
    topic: '', startTime: '', duration: 60,
    timezone: 'Asia/Karachi', password: '',
    waitingRoom: true, autoRecording: false, agenda: ''
  })
  modalOpen.value = true
}

function openEdit(meeting: ZoomMeeting) {
  editingMeeting.value = meeting
  formError.value = ''
  Object.assign(form, {
    courseId: meeting.courseId,
    topic: meeting.topic,
    startTime: toLocalDatetimeInput(meeting.startTime),
    duration: meeting.duration,
    timezone: meeting.timezone,
    password: meeting.password || '',
    waitingRoom: true,
    autoRecording: false,
    agenda: meeting.agenda || ''
  })
  modalOpen.value = true
}

async function saveMeeting(evt: Event) {
  evt.preventDefault()
  formError.value = ''
  saving.value = true

  try {
    const payload = {
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      password: form.password || undefined,
      agenda: form.agenda || undefined
    }

    if (editingMeeting.value) {
      await zoomStore.updateMeeting(editingMeeting.value.id, payload)
    } else {
      await zoomStore.createMeeting(payload)
      if (selectedCourseId.value !== form.courseId) {
        selectedCourseId.value = form.courseId
      }
    }
    modalOpen.value = false
  } catch (e: any) {
    formError.value = e.message || 'Failed to save class'
  } finally {
    saving.value = false
  }
}

async function startClass(meeting: ZoomMeeting) {
  try {
    const data = await zoomStore.getStartUrl(meeting.id)
    window.open(data.startUrl, '_blank')
  } catch (e: any) {
    alert(e.message)
  }
}

async function cancelMeeting(meetingId: string) {
  if (!confirm('Cancel this Zoom class? This will also delete it in Zoom.')) return
  try {
    await zoomStore.deleteMeeting(meetingId)
  } catch (e: any) {
    alert(e.message)
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function toLocalDatetimeInput(iso: string) {
  const d = new Date(iso)
  return d.toISOString().slice(0, 16)
}
</script>

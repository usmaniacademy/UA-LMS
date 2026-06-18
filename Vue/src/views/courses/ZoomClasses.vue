<template>
  <div class="mt-5">
    <h4 class="mb-4">Live Zoom Classes</h4>

    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
    </div>

    <div v-else-if="meetings.length === 0" class="text-muted">
      No Zoom classes scheduled yet. Check back soon.
    </div>

    <div v-else class="d-flex flex-column gap-3">
      <div v-for="meeting in meetings" :key="meeting.id"
        class="border rounded-3 p-4"
        :class="{
          'border-success bg-success bg-opacity-10': meeting.status === 'live',
          'border-secondary bg-light': meeting.status === 'completed'
        }">

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span v-if="meeting.status === 'live'" class="badge bg-success">🔴 LIVE NOW</span>
              <span v-else-if="meeting.status === 'completed'" class="badge bg-secondary">Completed</span>
              <span v-else class="badge bg-primary">Upcoming</span>
              <h6 class="mb-0 fw-bold">{{ meeting.topic }}</h6>
            </div>

            <div class="text-muted small">
              📅 {{ formatDate(meeting.startTime) }} &nbsp;·&nbsp;
              ⏱ {{ meeting.duration }} min
            </div>

            <div v-if="meeting.agenda" class="text-muted small mt-1">{{ meeting.agenda }}</div>

            <!-- Countdown for upcoming -->
            <div v-if="meeting.status === 'scheduled'" class="mt-2">
              <CountdownTimer :targetTime="meeting.startTime" />
            </div>
          </div>

          <div class="d-flex gap-2 align-items-center">
            <!-- Join button (appears 10 min before) -->
            <template v-if="meeting.status === 'live' || canJoin(meeting.startTime)">
              <b-button v-if="isEnrolled" variant="success" @click="joinClass(meeting.id)" :disabled="joining === meeting.id">
                <span v-if="joining === meeting.id" class="spinner-border spinner-border-sm me-1" />
                Join Class
              </b-button>
              <div v-else class="text-muted small">Enroll to join</div>
            </template>

            <!-- Recording link for completed -->
            <a v-if="meeting.status === 'completed' && meeting.recordingUrl && isEnrolled"
              :href="meeting.recordingUrl" target="_blank"
              class="btn btn-sm btn-outline-primary">
              🎬 Watch Recording
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useZoomStore } from '@/stores/zoom'
import type { ZoomMeeting } from '@/stores/zoom'
import CountdownTimer from './CountdownTimer.vue'

const props = defineProps<{ courseId: string; isEnrolled: boolean }>()

const zoomStore = useZoomStore()
const meetings = ref<ZoomMeeting[]>([])
const loading = ref(false)
const joining = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  await zoomStore.fetchMeetingsByCourse(props.courseId)
  meetings.value = zoomStore.meetings
  loading.value = false
})

function canJoin(startTime: string): boolean {
  const diff = new Date(startTime).getTime() - Date.now()
  return diff <= 10 * 60 * 1000 // 10 minutes before
}

async function joinClass(meetingId: string) {
  joining.value = meetingId
  try {
    const data = await zoomStore.getJoinUrl(meetingId)
    window.open(data.joinUrl, '_blank')
  } catch (e: any) {
    alert(e.message)
  } finally {
    joining.value = null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

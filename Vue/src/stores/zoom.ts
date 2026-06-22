import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface ZoomMeeting {
  id: string
  courseId: string
  zoomMeetingId: string
  topic: string
  startTime: string
  duration: number
  timezone: string
  joinUrl: string
  startUrl: string
  password?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  recordingUrl?: string
  agenda?: string
  instructor?: { firstName: string; lastName: string; avatarUrl?: string }
}

export const useZoomStore = defineStore('zoom_store', () => {
  const meetings = ref<ZoomMeeting[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchMeetingsByCourse(courseId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/zoom/meetings/course/${courseId}`)
      meetings.value = data.meetings
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createMeeting(payload: {
    courseId: string
    topic: string
    startTime: string
    duration: number
    timezone: string
    password?: string
    waitingRoom?: boolean
    autoRecording?: boolean
    agenda?: string
  }) {
    const data = await api.post('/zoom/meetings', payload)
    meetings.value.push(data.meeting)
    return data.meeting
  }

  async function updateMeeting(meetingId: string, payload: Partial<ZoomMeeting>) {
    const data = await api.patch(`/zoom/meetings/${meetingId}`, payload)
    const idx = meetings.value.findIndex((m) => m.id === meetingId)
    if (idx !== -1) meetings.value[idx] = { ...meetings.value[idx], ...data.meeting }
    return data.meeting
  }

  async function deleteMeeting(meetingId: string) {
    await api.delete(`/zoom/meetings/${meetingId}`)
    const idx = meetings.value.findIndex((m) => m.id === meetingId)
    if (idx !== -1) meetings.value[idx].status = 'cancelled'
  }

  async function getJoinUrl(meetingId: string) {
    return api.get(`/zoom/meetings/${meetingId}/join`)
  }

  async function getStartUrl(meetingId: string) {
    return api.get(`/zoom/meetings/${meetingId}/start`)
  }

  return {
    meetings, loading, error,
    fetchMeetingsByCourse, createMeeting, updateMeeting, deleteMeeting,
    getJoinUrl, getStartUrl
  }
})

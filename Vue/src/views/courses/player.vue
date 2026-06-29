<template>
  <div class="lms-player">
    <!-- Top bar -->
    <header class="lms-player__top">
      <div class="d-flex align-items-center gap-2">
        <router-link :to="{ name: 'course.detail.slug', params: { slug } }" class="btn btn-sm btn-light mb-0">
          <BIconArrowLeft /> Curriculum
        </router-link>
        <span class="text-muted small d-none d-md-inline">Course:</span>
        <strong class="text-truncate" style="max-width: 50vw">{{ course?.title }}</strong>
      </div>
      <ProfileDropdown v-if="isAuthed" />
      <router-link v-else :to="{ name: 'auth.sign-in' }" class="btn btn-sm btn-dark mb-0">Login</router-link>
    </header>

    <div v-if="store.loading && !course" class="text-center py-5 w-100">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!course" class="text-center py-5 w-100">
      <h5 class="text-muted">Course not found</h5>
      <router-link :to="{ name: 'courses.list' }" class="btn btn-primary mt-2">Browse courses</router-link>
    </div>

    <div v-else class="lms-player__body">
      <!-- Curriculum sidebar -->
      <aside class="lms-player__sidebar">
        <div class="p-3 border-bottom">
          <h6 class="mb-0">Course Curriculum</h6>
          <small class="text-muted">{{ accessibleCount }}/{{ totalLessons }} accessible</small>
        </div>
        <div v-for="section in course.sections" :key="section.id" class="lms-section">
          <div class="lms-section__title">{{ section.title }}</div>
          <button
            v-for="lesson in section.lessons"
            :key="lesson.id"
            class="lms-lesson"
            :class="{ active: selected?.id === lesson.id, locked: !canAccess(lesson) }"
            @click="selectLesson(lesson)"
          >
            <span class="lms-lesson__icon">
              <BIconCameraVideoFill v-if="lesson.contentType === 'zoom'" />
              <BIconPlayCircle v-else-if="lesson.contentType === 'video'" />
              <BIconFileTextFill v-else />
            </span>
            <span class="lms-lesson__title">{{ lesson.title }}</span>
            <span class="lms-lesson__meta">
              <span v-if="lesson.isFree" class="badge bg-success-subtle text-success">Free</span>
              <BIconLockFill v-else-if="!canAccess(lesson)" class="text-muted" />
              <small v-if="lesson.duration" class="text-muted">{{ Math.round(lesson.duration / 60) }}m</small>
            </span>
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="lms-player__content">
        <div v-if="!selected" class="text-center text-muted py-5">
          Select a lesson from the curriculum to begin.
        </div>

        <!-- Locked -->
        <div v-else-if="!canAccess(selected)" class="lms-locked text-center">
          <BIconLockFill class="display-5 text-muted mb-3" />
          <h4>This lesson is locked</h4>
          <p class="text-muted mb-4">Subscribe to this course to unlock all lessons and live classes.</p>
          <router-link :to="{ name: 'course.detail.slug', params: { slug } }" class="btn btn-primary">
            View subscription options
          </router-link>
        </div>

        <!-- Accessible lesson -->
        <template v-else>
          <p class="text-uppercase small text-primary mb-1">
            {{ selected.contentType === 'zoom' ? 'Live Zoom class' : selected.contentType === 'video' ? 'Video lesson' : 'Lesson' }}
          </p>
          <h3 class="mb-4">{{ selected.title }}</h3>

          <!-- VIDEO -->
          <div v-if="selected.contentType === 'video'">
            <div v-if="embedUrl" class="ratio ratio-16x9 rounded overflow-hidden bg-dark">
              <iframe :src="embedUrl" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0"></iframe>
            </div>
            <video v-else-if="selected.contentUrl" :src="selected.contentUrl" controls class="w-100 rounded bg-dark"></video>
            <div v-else class="alert alert-warning">No video has been added to this lesson yet.</div>
          </div>

          <!-- ZOOM -->
          <div v-else-if="selected.contentType === 'zoom'">
            <div v-if="zoomMeeting" class="zoom-card p-4 rounded-3">
              <div class="row align-items-center g-4">
                <div class="col-md-5">
                  <p class="text-muted small mb-2">Class starts in</p>
                  <ZoomCountdown :targetTime="zoomMeeting.startTime" :compact="false" />
                </div>
                <div class="col-md-7">
                  <table class="table table-borderless mb-3">
                    <tbody>
                      <tr>
                        <td class="zoom-lbl">Meeting date</td>
                        <td class="fw-semibold">{{ formatDate(zoomMeeting.startTime) }}</td>
                      </tr>
                      <tr>
                        <td class="zoom-lbl">Add to</td>
                        <td>
                          <a :href="googleCalUrl" target="_blank" class="text-primary">Google Calendar</a>
                          <span class="text-muted mx-1">·</span>
                          <a href="#" class="text-primary" @click.prevent="downloadIcs">iCal Export</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="zoom-lbl">Duration</td>
                        <td>{{ zoomMeeting.duration }} min</td>
                      </tr>
                      <tr v-if="zoomMeeting.password">
                        <td class="zoom-lbl">Password</td>
                        <td><code>{{ zoomMeeting.password }}</code></td>
                      </tr>
                      <tr>
                        <td class="zoom-lbl">Status</td>
                        <td class="text-capitalize">
                          <span class="badge"
                            :class="zoomMeeting.status === 'live' ? 'bg-success' : zoomMeeting.status === 'completed' ? 'bg-secondary' : 'bg-primary'">
                            {{ zoomMeeting.status === 'live' ? '🔴 Live now' : zoomMeeting.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="d-flex gap-2 flex-wrap">
                    <b-button variant="outline-primary" @click="join('browser')" :disabled="joining">
                      Join In Browser
                    </b-button>
                    <b-button variant="primary" @click="join('app')" :disabled="joining">
                      <span v-if="joining" class="spinner-border spinner-border-sm me-1" />
                      Join In Zoom App
                    </b-button>
                  </div>
                  <p class="text-muted small mt-2 mb-0">
                    The Join buttons become active when the host starts the class.
                  </p>
                </div>
              </div>

              <div v-if="zoomMeeting.agenda" class="mt-3 pt-3 border-top">
                <h6 class="mb-1">Agenda</h6>
                <p class="text-muted mb-0">{{ zoomMeeting.agenda }}</p>
              </div>

              <a v-if="zoomMeeting.status === 'completed' && zoomMeeting.recordingUrl"
                :href="zoomMeeting.recordingUrl" target="_blank" class="btn btn-outline-primary mt-3">
                🎬 Watch Recording
              </a>
            </div>
            <div v-else class="alert alert-info">
              This Zoom class hasn't been scheduled yet. Please check back soon.
            </div>
          </div>

          <!-- TEXT -->
          <div v-else>
            <div v-if="selected.contentUrl" class="lesson-text" v-html="selected.contentUrl"></div>
            <div v-else class="text-muted">No content added to this lesson yet.</div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { useZoomStore } from '@/stores/zoom'
import { useAuthStore } from '@/stores/auth'
import ProfileDropdown from '@/components/ProfileDropdown.vue'
import ZoomCountdown from './CountdownTimer.vue'
import {
  BIconArrowLeft, BIconPlayCircle, BIconCameraVideoFill,
  BIconFileTextFill, BIconLockFill
} from 'bootstrap-icons-vue'

const route = useRoute()
const store = useCourseStore()
const zoomStore = useZoomStore()
const auth = useAuthStore()

const slug = route.params.slug as string
const course = computed(() => store.currentCourse)
const isAuthed = computed(() => auth.isAuthenticated())
const selected = ref<any>(null)
const joining = ref(false)

const allLessons = computed(() =>
  (course.value?.sections || []).flatMap((s: any) => s.lessons || [])
)
const totalLessons = computed(() => allLessons.value.length)
const accessibleCount = computed(() => allLessons.value.filter((l: any) => canAccess(l)).length)

function canAccess(lesson: any) {
  return !!(course.value?.isEnrolled || lesson.isFree)
}

function selectLesson(lesson: any) {
  selected.value = lesson
}

const zoomMeeting = computed(() => {
  if (!selected.value || selected.value.contentType !== 'zoom') return null
  return zoomStore.meetings.find((m) => m.id === selected.value.zoomMeetingId) || null
})

// ─── Add to calendar ─────────────────────────────────────────────────────────
function toCalDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + 'T' + p(d.getUTCHours()) + p(d.getUTCMinutes()) + '00Z'
}
const googleCalUrl = computed(() => {
  const m = zoomMeeting.value
  if (!m) return '#'
  const start = new Date(m.startTime)
  const end = new Date(start.getTime() + (m.duration || 60) * 60000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: m.topic || selected.value?.title || 'Live Zoom Class',
    dates: `${toCalDate(start)}/${toCalDate(end)}`,
    details: m.agenda || ''
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
})
function downloadIcs() {
  const m = zoomMeeting.value
  if (!m) return
  const start = new Date(m.startTime)
  const end = new Date(start.getTime() + (m.duration || 60) * 60000)
  const esc = (s: string) => (s || '').replace(/([,;])/g, '\\$1')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Usmani Academy//EN', 'BEGIN:VEVENT',
    `UID:${m.id}@usmaniacademy`,
    `DTSTAMP:${toCalDate(new Date())}`,
    `DTSTART:${toCalDate(start)}`,
    `DTEND:${toCalDate(end)}`,
    `SUMMARY:${esc(m.topic || selected.value?.title || 'Live Zoom Class')}`,
    `DESCRIPTION:${esc(m.agenda || '')}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'zoom-class.ics'
  a.click()
  URL.revokeObjectURL(url)
}

// Convert YouTube / Vimeo links to embeddable URLs
const embedUrl = computed(() => {
  const url: string = selected.value?.contentUrl || ''
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return ''
})

async function join(_mode: 'browser' | 'app') {
  if (!zoomMeeting.value) return
  joining.value = true
  try {
    // Enrollment-checked join URL
    const data = await zoomStore.getJoinUrl(zoomMeeting.value.id)
    window.open(data.joinUrl || zoomMeeting.value.joinUrl, '_blank')
  } catch (e: any) {
    // Fall back to the meeting's join URL if available
    if (zoomMeeting.value.joinUrl) window.open(zoomMeeting.value.joinUrl, '_blank')
    else alert(e.message || 'Unable to join the class right now.')
  } finally {
    joining.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(async () => {
  const c = await store.fetchCourseBySlug(slug)
  if (c?.id) zoomStore.fetchMeetingsByCourse(c.id)
  // Open the requested lesson, else the first accessible one
  const requestedId = route.query.lesson as string | undefined
  const requested = requestedId ? allLessons.value.find((l: any) => l.id === requestedId) : null
  const first = requested || allLessons.value.find((l: any) => canAccess(l)) || allLessons.value[0]
  if (first) selected.value = first
})
</script>

<style scoped>
.lms-player { min-height: 100vh; background: var(--bs-body-bg); display: flex; flex-direction: column; }
.lms-player__top {
  display: flex; align-items: center; justify-content: space-between;
  padding: .6rem 1rem; border-bottom: 1px solid var(--bs-border-color);
  position: sticky; top: 0; background: var(--bs-body-bg); z-index: 10;
}
.lms-player__body { display: flex; flex: 1; align-items: stretch; }
.lms-player__sidebar {
  width: 320px; flex-shrink: 0; border-right: 1px solid var(--bs-border-color);
  background: var(--bs-tertiary-bg); overflow-y: auto; max-height: calc(100vh - 56px);
}
.lms-player__content { flex: 1; padding: 2rem; overflow-y: auto; max-height: calc(100vh - 56px); }
.lms-section__title {
  padding: .75rem 1rem; font-weight: 600; font-size: .9rem;
  background: var(--bs-dark); color: #fff;
}
.lms-lesson {
  display: flex; align-items: center; gap: .5rem; width: 100%;
  padding: .65rem 1rem; border: 0; background: transparent; text-align: left;
  border-bottom: 1px solid var(--bs-border-color); cursor: pointer; color: var(--bs-body-color);
}
.lms-lesson:hover { background: var(--bs-primary-bg-subtle); }
.lms-lesson.active { background: var(--bs-primary-bg-subtle); border-left: 3px solid var(--bs-primary); }
.lms-lesson.locked { opacity: .65; }
.lms-lesson__icon { color: var(--bs-primary); flex-shrink: 0; }
.lms-lesson__title { flex: 1; font-size: .9rem; }
.lms-lesson__meta { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.zoom-card { background: #F5F7F9; border: 1px solid var(--bs-border-color); }
.zoom-lbl { color: #454545; white-space: nowrap; }
.lms-locked { padding: 4rem 1rem; }
@media (max-width: 768px) {
  .lms-player__body { flex-direction: column; }
  .lms-player__sidebar { width: 100%; max-height: 300px; }
}
</style>

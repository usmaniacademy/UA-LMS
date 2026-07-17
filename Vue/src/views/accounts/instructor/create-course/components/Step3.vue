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

      <!-- Quizzes -->
      <hr class="my-4">
      <h5 class="mb-3">Quizzes</h5>
      <div v-for="quiz in quizStore.courseQuizzes" :key="quiz.id" class="border rounded-3 mb-3 overflow-hidden">
        <div class="bg-light px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h6 class="mb-0 fw-semibold">{{ quiz.title }}</h6>
            <small class="text-muted">
              {{ quiz.questions.length }} question{{ quiz.questions.length !== 1 ? 's' : '' }} · Pass at {{ quiz.passPercentage }}%
            </small>
          </div>
          <div class="d-flex gap-2">
            <b-button size="sm" variant="outline-primary" @click="openQuestions(quiz)">Manage Questions</b-button>
            <b-button size="sm" variant="outline-danger" @click="removeQuiz(quiz.id)">Delete</b-button>
          </div>
        </div>
      </div>

      <div class="border border-dashed rounded-3 p-3 mb-4">
        <div class="d-flex gap-2 flex-wrap">
          <b-form-input v-model="newQuizTitle" placeholder="New quiz title (e.g. Module 1 Check)" class="flex-fill" />
          <b-input-group prepend="Pass %" style="max-width:160px">
            <b-form-input v-model.number="newQuizPass" type="number" min="1" max="100" />
          </b-input-group>
          <b-button variant="primary" @click="addQuiz" :disabled="!newQuizTitle.trim()">Add Quiz</b-button>
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

        <!-- Video fields -->
        <template v-if="lessonForm.contentType === 'video'">
          <b-form-group label="Video URL">
            <b-form-input v-model="lessonForm.contentUrl" placeholder="https://..." />
          </b-form-group>
          <b-form-group label="Duration (minutes)">
            <b-form-input v-model.number="lessonForm.durationMin" type="number" min="0" />
          </b-form-group>
        </template>

        <!-- Text / reading fields -->
        <template v-else-if="lessonForm.contentType === 'text'">
          <b-form-group label="Lesson content" description="Write the reading material. Use the toolbar for headings, bold, italic, and bullet lists.">
            <RichTextEditor v-model="lessonForm.textContent" :upload-fn="courseStore.uploadImage" :min-height="260"
              placeholder="Write the lesson text here..." />
          </b-form-group>
          <b-form-group label="Estimated reading time (minutes)">
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

    <!-- Quiz questions modal -->
    <b-modal v-model="questionsModal" :title="activeQuiz ? `Questions — ${activeQuiz.title}` : 'Questions'" hide-footer size="lg">
      <div v-if="activeQuiz">
        <div v-if="!activeQuiz.questions.length" class="text-muted small mb-3">No questions yet — add the first one below.</div>
        <div v-for="(q, qi) in activeQuiz.questions" :key="q.id" class="border rounded-3 p-3 mb-2">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-fill">
              <div class="fw-semibold mb-2">{{ qi + 1 }}. {{ q.questionText }}</div>
              <ul class="list-unstyled mb-0 small">
                <li v-for="opt in q.options" :key="opt" :class="opt === q.correctAnswer ? 'text-success fw-semibold' : 'text-muted'">
                  <BIconCheckCircleFill v-if="opt === q.correctAnswer" class="me-1" />
                  {{ opt }}
                </li>
              </ul>
            </div>
            <b-button size="sm" variant="outline-danger" @click="removeQuestion(q.id)">✕</b-button>
          </div>
        </div>

        <hr>
        <h6 class="mb-3">Add a question</h6>
        <div v-if="questionError" class="alert alert-danger py-2 mb-3">{{ questionError }}</div>
        <b-form-group label="Question text">
          <b-form-textarea v-model="newQuestionText" rows="2" placeholder="e.g. What is the first pillar of Islam?" />
        </b-form-group>
        <b-form-group label="Options (select the correct one)">
          <div v-for="(opt, oi) in newQuestionOptions" :key="oi" class="d-flex align-items-center gap-2 mb-2">
            <input type="radio" class="form-check-input mt-0" name="correct-opt"
              :checked="newQuestionCorrectIdx === oi" @change="newQuestionCorrectIdx = oi">
            <b-form-input v-model="newQuestionOptions[oi]" :placeholder="`Option ${oi + 1}`" />
            <b-button v-if="newQuestionOptions.length > 2" size="sm" variant="outline-danger" @click="removeOption(oi)">✕</b-button>
          </div>
          <b-button v-if="newQuestionOptions.length < 6" size="sm" variant="outline-primary" @click="addQuestionOption">+ Add option</b-button>
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button variant="primary" @click="submitQuestion" :disabled="questionSaving">
            <span v-if="questionSaving" class="spinner-border spinner-border-sm me-1" />
            Add Question
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useCourseStore } from '@/stores/course'
import { useZoomStore } from '@/stores/zoom'
import { useQuizStore } from '@/stores/quiz'
import { BIconCheckCircleFill } from 'bootstrap-icons-vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps<{
  courseId: string | null
  initialSections?: any[]
  nextPage: () => void
  previousPage: () => void
}>()

const courseStore = useCourseStore()
const zoomStore = useZoomStore()
const quizStore = useQuizStore()

const localSections = ref<any[]>([])
const newSectionTitle = ref('')

// ─── Quizzes ────────────────────────────────────────────────────────────────
const newQuizTitle = ref('')
const newQuizPass = ref(70)
const questionsModal = ref(false)
const activeQuiz = ref<any>(null)
const newQuestionText = ref('')
const newQuestionOptions = ref<string[]>(['', ''])
const newQuestionCorrectIdx = ref(0)
const questionSaving = ref(false)
const questionError = ref('')

watch(
  () => props.courseId,
  (id) => { if (id) quizStore.fetchCourseQuizzes(id) },
  { immediate: true }
)

async function addQuiz() {
  if (!props.courseId || !newQuizTitle.value.trim()) return
  await quizStore.createQuiz(props.courseId, { title: newQuizTitle.value.trim(), passPercentage: newQuizPass.value || 70 })
  newQuizTitle.value = ''
  newQuizPass.value = 70
}

async function removeQuiz(quizId: string) {
  if (!confirm('Delete this quiz and all its questions?')) return
  await quizStore.deleteQuiz(quizId)
}

function resetQuestionForm() {
  newQuestionText.value = ''
  newQuestionOptions.value = ['', '']
  newQuestionCorrectIdx.value = 0
  questionError.value = ''
}

function openQuestions(quiz: any) {
  activeQuiz.value = quiz
  resetQuestionForm()
  questionsModal.value = true
}

function addQuestionOption() {
  if (newQuestionOptions.value.length < 6) newQuestionOptions.value.push('')
}

function removeOption(idx: number) {
  if (newQuestionOptions.value.length <= 2) return
  newQuestionOptions.value.splice(idx, 1)
  if (newQuestionCorrectIdx.value >= newQuestionOptions.value.length) newQuestionCorrectIdx.value = 0
}

async function submitQuestion() {
  questionError.value = ''
  const options = newQuestionOptions.value.map((o) => o.trim()).filter(Boolean)
  if (!newQuestionText.value.trim() || options.length < 2) {
    questionError.value = 'Add a question and at least 2 options.'
    return
  }
  const correctAnswer = newQuestionOptions.value[newQuestionCorrectIdx.value]?.trim()
  if (!correctAnswer) {
    questionError.value = 'Select which option is correct.'
    return
  }
  questionSaving.value = true
  try {
    await quizStore.addQuestion(activeQuiz.value.id, { questionText: newQuestionText.value.trim(), options, correctAnswer })
    resetQuestionForm()
  } catch (e: any) {
    questionError.value = e.message || 'Failed to add question'
  } finally {
    questionSaving.value = false
  }
}

async function removeQuestion(questionId: string) {
  if (!confirm('Delete this question?')) return
  await quizStore.deleteQuestion(questionId, activeQuiz.value.id)
}

// Populate curriculum when editing an existing course
watch(
  () => props.initialSections,
  (sections) => {
    if (sections && sections.length) {
      localSections.value = sections.map((s: any) => ({
        ...s,
        editing: false,
        lessons: (s.lessons || []).map((l: any) => ({ ...l }))
      }))
    }
  },
  { immediate: true }
)
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
  textContent: '',
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
    title: '', contentType: 'video', contentUrl: '', textContent: '', durationMin: 60, isFree: false,
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
  // Zoom scheduling details live on the linked ZoomMeeting (attached as lesson.zoomMeeting)
  const zm = lesson.zoomMeeting
  Object.assign(lessonForm, {
    title: lesson.title,
    contentType: lesson.contentType,
    contentUrl: lesson.contentUrl || '',
    textContent: lesson.textContent || '',
    durationMin: zm?.duration || (lesson.duration ? Math.round(lesson.duration / 60) : 60),
    isFree: lesson.isFree,
    zoomTopic: zm?.topic || '',
    zoomStartTime: zm?.startTime ? toLocalInput(zm.startTime) : '',
    zoomTimezone: zm?.timezone || 'America/Chicago',
    zoomAgenda: zm?.agenda || '',
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
      textContent: lessonForm.contentType === 'text' ? lessonForm.textContent : undefined,
      duration: lessonForm.durationMin * 60,
      isFree: lessonForm.isFree,
      orderIndex: editingLesson.value
        ? (activeLessonRef.value?.orderIndex ?? 0)
        : (activeSectionRef.value.lessons?.length ?? 0)
    }

    // Persist the link to the Zoom meeting (its schedule lives in the ZoomMeeting table)
    if (lessonForm.contentType === 'zoom') {
      payload.zoomMeetingId = zoomMeetingId
    }

    // Keep the Zoom schedule on the local lesson so reopening it this session pre-fills correctly
    const localZoomMeeting = lessonForm.contentType === 'zoom'
      ? {
          topic: lessonForm.zoomTopic || lessonForm.title,
          startTime: new Date(lessonForm.zoomStartTime).toISOString(),
          timezone: lessonForm.zoomTimezone,
          duration: lessonForm.durationMin,
          agenda: lessonForm.zoomAgenda
        }
      : null

    if (editingLesson.value && activeLessonRef.value?.id) {
      const updated = await courseStore.updateLesson(activeLessonRef.value.id, payload)
      Object.assign(activeLessonRef.value, updated)
      activeLessonRef.value.zoomMeeting = localZoomMeeting || undefined
    } else {
      const lesson = await courseStore.createLesson(activeSectionRef.value.id, payload)
      if (localZoomMeeting) lesson.zoomMeeting = localZoomMeeting
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

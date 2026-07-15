<template>
  <StudentLayout>
    <b-col xl="9">
      <b-card no-body class="border bg-transparent rounded-3">
        <b-card-header class="bg-transparent border-bottom">
          <h3 class="mb-0">My Quizzes</h3>
        </b-card-header>
        <b-card-body>
          <div v-if="quizStore.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="quizStore.myQuizzes.length === 0" class="text-center py-5 text-muted">
            <p class="mb-1">No quizzes available yet.</p>
            <p class="small mb-0">Quizzes from your enrolled courses will appear here.</p>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <div v-for="quiz in quizStore.myQuizzes" :key="quiz.id" class="border rounded-3 overflow-hidden">
              <div class="bg-light px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h6 class="mb-0 fw-semibold">{{ quiz.title }}</h6>
                  <small class="text-muted">
                    {{ quiz.course?.title }} · {{ quiz.questions.length }} question{{ quiz.questions.length !== 1 ? 's' : '' }}
                    · Pass at {{ quiz.passPercentage }}%
                  </small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span v-if="quiz.attempts?.length" class="badge"
                    :class="quiz.attempts[0].passed ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                    Best: {{ bestScore(quiz) }}% · {{ quiz.attempts.some((a: any) => a.passed) ? 'Passed' : 'Not yet passed' }}
                  </span>
                  <b-button v-if="takingQuizId !== quiz.id" size="sm" variant="primary"
                    :disabled="!quiz.questions.length" @click="startQuiz(quiz)">
                    {{ quiz.attempts?.length ? 'Retake Quiz' : 'Start Quiz' }}
                  </b-button>
                  <b-button v-else size="sm" variant="outline-secondary" @click="cancelQuiz">Cancel</b-button>
                </div>
              </div>

              <!-- Taking the quiz -->
              <div v-if="takingQuizId === quiz.id" class="p-4">
                <div v-if="!quiz.questions.length" class="text-muted small">This quiz has no questions yet.</div>
                <div v-else class="d-flex flex-column gap-4">
                  <div v-for="(q, qi) in quiz.questions" :key="q.id">
                    <p class="fw-semibold mb-2">{{ qi + 1 }}. {{ q.questionText }}</p>
                    <div v-for="opt in q.options" :key="opt" class="form-check mb-1">
                      <input class="form-check-input" type="radio" :name="`q-${q.id}`" :id="`q-${q.id}-${opt}`"
                        :value="opt" v-model="answers[q.id]">
                      <label class="form-check-label" :for="`q-${q.id}-${opt}`">{{ opt }}</label>
                    </div>
                  </div>

                  <div v-if="submitError" class="alert alert-danger py-2 mb-0">{{ submitError }}</div>

                  <div>
                    <b-button variant="primary" @click="submitQuiz(quiz)" :disabled="submitting || answeredCount < quiz.questions.length">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-1" />
                      Submit Quiz
                    </b-button>
                    <span class="text-muted small ms-2">{{ answeredCount }} / {{ quiz.questions.length }} answered</span>
                  </div>
                </div>
              </div>

              <!-- Result just after submitting -->
              <div v-if="lastResult && lastResult.quizId === quiz.id" class="px-4 pb-4">
                <div class="alert py-2 mb-0" :class="lastResult.passed ? 'alert-success' : 'alert-danger'">
                  Scored {{ lastResult.score }}% ({{ lastResult.correctCount }}/{{ lastResult.total }} correct) —
                  {{ lastResult.passed ? 'Passed!' : `Needs ${quiz.passPercentage}% to pass` }}
                </div>
              </div>

              <!-- Past attempts -->
              <div v-if="quiz.attempts?.length && takingQuizId !== quiz.id" class="px-4 pb-3 pt-0">
                <div class="small text-muted">
                  Attempts: {{ quiz.attempts.length }} · Last taken {{ formatDate(quiz.attempts[0].takenAt) }}
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </StudentLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import StudentLayout from '@/layouts/StudentLayout.vue';
import { useQuizStore } from '@/stores/quiz';
import type { Quiz } from '@/stores/quiz';

const quizStore = useQuizStore();

onMounted(() => quizStore.fetchMyQuizzes());

const takingQuizId = ref<string | null>(null);
const answers = ref<Record<string, string>>({});
const submitting = ref(false);
const submitError = ref('');
const lastResult = ref<{ quizId: string; score: number; passed: boolean; correctCount: number; total: number } | null>(null);

const answeredCount = computed(() => Object.values(answers.value).filter(Boolean).length);

function bestScore(quiz: Quiz) {
  if (!quiz.attempts?.length) return 0;
  return Math.max(...quiz.attempts.map((a) => a.score));
}

function startQuiz(quiz: Quiz) {
  takingQuizId.value = quiz.id;
  answers.value = {};
  submitError.value = '';
  lastResult.value = null;
}

function cancelQuiz() {
  takingQuizId.value = null;
  answers.value = {};
}

async function submitQuiz(quiz: Quiz) {
  submitError.value = '';
  submitting.value = true;
  try {
    const result = await quizStore.submitAttempt(quiz.id, answers.value);
    lastResult.value = { quizId: quiz.id, ...result };
    takingQuizId.value = null;
    answers.value = {};
  } catch (e: any) {
    submitError.value = e.message || 'Failed to submit quiz';
  } finally {
    submitting.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

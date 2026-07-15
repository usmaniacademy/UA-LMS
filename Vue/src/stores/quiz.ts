import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface QuizQuestion {
  id: string
  questionText: string
  options: string[]
  correctAnswer?: string // only present in instructor/admin authoring views
}

export interface QuizAttempt {
  id: string
  score: number
  passed: boolean
  takenAt: string
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  passPercentage: number
  createdAt: string
  course?: { id: string; title: string; slug?: string }
  questions: QuizQuestion[]
  attempts?: QuizAttempt[]
}

export const useQuizStore = defineStore('quiz', () => {
  const courseQuizzes = ref<Quiz[]>([])      // instructor/admin: quizzes for the course being edited
  const instructorQuizzes = ref<Quiz[]>([])  // instructor "My Quizzes" overview
  const myQuizzes = ref<Quiz[]>([])          // student: quizzes across enrolled courses
  const loading = ref(false)

  // ─── Instructor / Admin authoring ──────────────────────────────────────────

  async function fetchCourseQuizzes(courseId: string) {
    loading.value = true
    try {
      const data = await api.get(`/quizzes/courses/${courseId}/manage`)
      courseQuizzes.value = data.quizzes
      return data.quizzes as Quiz[]
    } finally {
      loading.value = false
    }
  }

  async function createQuiz(courseId: string, payload: { title: string; passPercentage: number }) {
    const data = await api.post(`/quizzes/courses/${courseId}`, payload)
    courseQuizzes.value.push({ ...data.quiz, questions: [] })
    return data.quiz as Quiz
  }

  async function updateQuiz(quizId: string, payload: { title?: string; passPercentage?: number }) {
    const data = await api.put(`/quizzes/${quizId}`, payload)
    const quiz = courseQuizzes.value.find((q) => q.id === quizId)
    if (quiz) Object.assign(quiz, data.quiz)
    return data.quiz as Quiz
  }

  async function deleteQuiz(quizId: string) {
    await api.delete(`/quizzes/${quizId}`)
    courseQuizzes.value = courseQuizzes.value.filter((q) => q.id !== quizId)
  }

  async function addQuestion(quizId: string, payload: { questionText: string; options: string[]; correctAnswer: string }) {
    const data = await api.post(`/quizzes/${quizId}/questions`, payload)
    const quiz = courseQuizzes.value.find((q) => q.id === quizId)
    if (quiz) quiz.questions.push(data.question)
    return data.question as QuizQuestion
  }

  async function updateQuestion(questionId: string, quizId: string, payload: Partial<QuizQuestion>) {
    const data = await api.put(`/quizzes/questions/${questionId}`, payload)
    const quiz = courseQuizzes.value.find((q) => q.id === quizId)
    if (quiz) {
      const idx = quiz.questions.findIndex((qq) => qq.id === questionId)
      if (idx !== -1) Object.assign(quiz.questions[idx], data.question)
    }
    return data.question as QuizQuestion
  }

  async function deleteQuestion(questionId: string, quizId: string) {
    await api.delete(`/quizzes/questions/${questionId}`)
    const quiz = courseQuizzes.value.find((q) => q.id === quizId)
    if (quiz) quiz.questions = quiz.questions.filter((qq) => qq.id !== questionId)
  }

  async function fetchInstructorQuizzes() {
    loading.value = true
    try {
      const data = await api.get('/quizzes/instructor/my-quizzes')
      instructorQuizzes.value = data.quizzes
      return data.quizzes as Quiz[]
    } finally {
      loading.value = false
    }
  }

  // ─── Student ────────────────────────────────────────────────────────────────

  async function fetchMyQuizzes() {
    loading.value = true
    try {
      const data = await api.get('/quizzes/student/my-quizzes')
      myQuizzes.value = data.quizzes
      return data.quizzes as Quiz[]
    } finally {
      loading.value = false
    }
  }

  async function submitAttempt(quizId: string, answers: Record<string, string>) {
    const result = await api.post(`/quizzes/${quizId}/attempt`, { answers })
    const quiz = myQuizzes.value.find((q) => q.id === quizId)
    if (quiz) {
      if (!quiz.attempts) quiz.attempts = []
      quiz.attempts.unshift(result.attempt)
    }
    return result as { score: number; passed: boolean; correctCount: number; total: number }
  }

  return {
    courseQuizzes, instructorQuizzes, myQuizzes, loading,
    fetchCourseQuizzes, createQuiz, updateQuiz, deleteQuiz,
    addQuestion, updateQuestion, deleteQuestion,
    fetchInstructorQuizzes,
    fetchMyQuizzes, submitAttempt
  }
})

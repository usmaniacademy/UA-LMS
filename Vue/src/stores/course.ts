import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  thumbnailUrl?: string
  category?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isFree: boolean
  status: 'draft' | 'published' | 'archived'
  isPublished: boolean
  totalStudents: number
  ratingAvg?: number
  instructor?: { id: string; firstName: string; lastName: string; avatarUrl?: string }
  sections?: Section[]
  isEnrolled?: boolean
}

export interface Section {
  id: string
  title: string
  orderIndex: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  contentType: 'video' | 'text' | 'zoom'
  contentUrl?: string
  duration?: number
  orderIndex: number
  isFree: boolean
}

export interface InstructorStats {
  totalCourses: number
  totalStudents: number
  activeSubs: number
  mrr: number
  totalEarnings: number
  currentMonthEarnings: number
  lastMonthEarnings: number
  monthly: { label: string; earnings: number }[]
  topCourses: {
    id: string
    title: string
    thumbnailUrl?: string
    status: string
    students: number
    subscriptions: number
    revenue: number
  }[]
}

export const useCourseStore = defineStore('course_store', () => {
  const courses = ref<Course[]>([])
  const currentCourse = ref<Course | null>(null)
  const myCourses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref('')
  const pagination = ref({ total: 0, page: 1, totalPages: 1 })

  async function fetchPublicCourses(params: Record<string, string | number> = {}) {
    loading.value = true
    error.value = ''
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const data = await api.get(`/courses${query ? `?${query}` : ''}`)
      courses.value = data.courses
      pagination.value = { total: data.total, page: data.page, totalPages: data.totalPages }
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchCourseBySlug(slug: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/courses/${slug}`)
      currentCourse.value = data.course
      return data.course
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMyCourses() {
    loading.value = true
    try {
      const data = await api.get('/courses/instructor/my-courses')
      myCourses.value = data.courses
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const instructorStats = ref<InstructorStats | null>(null)

  async function fetchInstructorStats() {
    loading.value = true
    try {
      const data = await api.get('/courses/instructor/stats')
      instructorStats.value = data.stats
      return data.stats
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const instructorStudents = ref<any[]>([])

  async function fetchInstructorStudents() {
    loading.value = true
    try {
      const data = await api.get('/courses/instructor/students')
      instructorStudents.value = data.students
      return data.students
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const enrolledCourses = ref<any[]>([])

  async function fetchEnrolledCourses() {
    loading.value = true
    try {
      const data = await api.get('/courses/student/my-courses')
      enrolledCourses.value = data.enrollments
      return data.enrollments
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Fetch a course (any status) with full curriculum for editing — owner or admin
  async function fetchManageCourse(id: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/courses/manage/${id}`)
      currentCourse.value = data.course
      return data.course
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCourse(payload: Partial<Course>) {
    const data = await api.post('/courses', payload)
    myCourses.value.unshift(data.course)
    return data.course
  }

  async function updateCourse(id: string, payload: Partial<Course>) {
    const data = await api.put(`/courses/${id}`, payload)
    const idx = myCourses.value.findIndex((c) => c.id === id)
    if (idx !== -1) myCourses.value[idx] = { ...myCourses.value[idx], ...data.course }
    return data.course
  }

  async function publishCourse(id: string) {
    const data = await api.post(`/courses/${id}/publish`, {})
    const idx = myCourses.value.findIndex((c) => c.id === id)
    if (idx !== -1) myCourses.value[idx] = { ...myCourses.value[idx], ...data.course }
    return data.course
  }

  async function archiveCourse(id: string) {
    await api.delete(`/courses/${id}`)
    const idx = myCourses.value.findIndex((c) => c.id === id)
    if (idx !== -1) myCourses.value[idx].status = 'archived'
  }

  // ─── Sections ───────────────────────────────────────────────────────────────

  async function createSection(courseId: string, title: string, orderIndex = 0) {
    const data = await api.post(`/courses/${courseId}/sections`, { title, orderIndex })
    return data.section
  }

  async function updateSection(sectionId: string, payload: Partial<Section>) {
    const data = await api.put(`/courses/sections/${sectionId}`, payload)
    return data.section
  }

  async function deleteSection(sectionId: string) {
    await api.delete(`/courses/sections/${sectionId}`)
  }

  // ─── Lessons ────────────────────────────────────────────────────────────────

  async function createLesson(sectionId: string, payload: Partial<Lesson>) {
    const data = await api.post(`/courses/sections/${sectionId}/lessons`, payload)
    return data.lesson
  }

  async function updateLesson(lessonId: string, payload: Partial<Lesson>) {
    const data = await api.put(`/courses/lessons/${lessonId}`, payload)
    return data.lesson
  }

  async function deleteLesson(lessonId: string) {
    await api.delete(`/courses/lessons/${lessonId}`)
  }

  return {
    courses, currentCourse, myCourses, loading, error, pagination,
    instructorStats, enrolledCourses, instructorStudents,
    fetchPublicCourses, fetchCourseBySlug, fetchMyCourses, fetchInstructorStats, fetchManageCourse, fetchEnrolledCourses, fetchInstructorStudents,
    createCourse, updateCourse, publishCourse, archiveCourse,
    createSection, updateSection, deleteSection,
    createLesson, updateLesson, deleteLesson
  }
})

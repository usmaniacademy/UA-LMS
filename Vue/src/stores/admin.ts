import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'

export interface AdminStats {
  totalStudents: number
  totalInstructors: number
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  activeSubs: number
  mrr: number
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  avatarUrl?: string
  createdAt: string
  _count: { enrollments: number }
}

export interface AdminCourse {
  id: string
  title: string
  slug: string
  status: string
  level: string
  isFree: boolean
  thumbnailUrl?: string
  category?: string
  createdAt: string
  instructor: { id: string; firstName: string; lastName: string; avatarUrl?: string }
  _count: { enrollments: number }
}

export interface RevenueData {
  mrr: number
  totalRevenue: number
  byCourse: { course: { id: string; title: string }; count: number; revenue: number }[]
  monthly: { month: string; revenue: number; subscriptions: number }[]
}

export const useAdminStore = defineStore('admin_store', () => {
  const stats = ref<AdminStats | null>(null)
  const users = ref<AdminUser[]>([])
  const instructors = ref<AdminUser[]>([])
  const courses = ref<AdminCourse[]>([])
  const revenue = ref<RevenueData | null>(null)
  const loading = ref(false)
  const error = ref('')
  const usersPagination = ref({ total: 0, page: 1, totalPages: 1 })
  const coursesPagination = ref({ total: 0, page: 1, totalPages: 1 })

  // Admin creates an instructor account (sets their password; gives credentials to the teacher)
  async function createInstructor(payload: { firstName: string; lastName: string; email: string; password: string }) {
    const data = await api.post('/admin/instructors', payload)
    return data.user
  }

  // Admin creates a content_writer account for the blog portal
  async function createContentWriter(payload: { firstName: string; lastName: string; email: string; password: string }) {
    const data = await api.post('/admin/content-writers', payload)
    return data.user
  }

  // Admin creates a student account manually
  async function createStudent(payload: { firstName: string; lastName: string; email: string; password: string }) {
    const data = await api.post('/admin/students', payload)
    return data.user
  }

  // Admin manually enrolls a student in a course
  async function manualEnroll(payload: { studentId: string; courseId: string }) {
    const data = await api.post('/admin/enrollments', payload)
    return data.enrollment
  }

  // Instructors for the "assign course" dropdown (kept separate from `users`)
  async function fetchInstructors() {
    try {
      const data = await api.get('/admin/users?role=instructor&limit=100')
      instructors.value = data.users
    } catch (e: any) { error.value = e.message }
  }

  // Admin creates a course assigned to an instructor
  async function createCourse(payload: Record<string, unknown>) {
    const data = await api.post('/courses', payload)
    return data.course
  }

  // Admin removes (archives) a course — drop it from the visible list
  async function deleteCourse(courseId: string) {
    await api.delete(`/courses/${courseId}`)
    courses.value = courses.value.filter(c => c.id !== courseId)
    coursesPagination.value.total = Math.max(0, coursesPagination.value.total - 1)
  }

  async function fetchStats() {
    loading.value = true
    try { stats.value = await api.get('/admin/stats') }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchUsers(params: { role?: string; search?: string; page?: number } = {}) {
    loading.value = true
    try {
      const q = new URLSearchParams()
      if (params.role) q.set('role', params.role)
      if (params.search) q.set('search', params.search)
      if (params.page) q.set('page', String(params.page))
      const data = await api.get(`/admin/users?${q}`)
      users.value = data.users
      usersPagination.value = { total: data.total, page: data.page, totalPages: data.totalPages }
    } catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function toggleUserActive(userId: string) {
    const data = await api.patch(`/admin/users/${userId}/toggle-active`, {})
    const idx = users.value.findIndex(u => u.id === userId)
    if (idx !== -1) users.value[idx].isActive = data.isActive
  }

  // Full detail for one user (profile + enrolled courses + taught courses)
  async function fetchUserDetail(userId: string) {
    return await api.get(`/admin/users/${userId}`)
  }

  // Full detail for one course (info + instructor + sections/lessons) for the admin detail page
  async function fetchCourseForAdmin(courseId: string) {
    const data = await api.get(`/courses/manage/${courseId}`)
    return data.course
  }

  async function fetchCourses(params: { status?: string; search?: string; page?: number } = {}) {
    loading.value = true
    try {
      const q = new URLSearchParams()
      if (params.status) q.set('status', params.status)
      if (params.search) q.set('search', params.search)
      if (params.page) q.set('page', String(params.page))
      const data = await api.get(`/admin/courses?${q}`)
      courses.value = data.courses
      coursesPagination.value = { total: data.total, page: data.page, totalPages: data.totalPages }
    } catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function approveCourse(courseId: string) {
    await api.patch(`/admin/courses/${courseId}/approve`, {})
    const idx = courses.value.findIndex(c => c.id === courseId)
    if (idx !== -1) courses.value[idx].status = 'published'
  }

  async function rejectCourse(courseId: string) {
    await api.patch(`/admin/courses/${courseId}/reject`, {})
    const idx = courses.value.findIndex(c => c.id === courseId)
    if (idx !== -1) courses.value[idx].status = 'draft'
  }

  async function fetchRevenue() {
    loading.value = true
    try { revenue.value = await api.get('/admin/revenue') }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function removeUser(userId: string) {
    await api.delete(`/admin/users/${userId}`)
    users.value = users.value.filter(u => u.id !== userId)
    usersPagination.value.total = Math.max(0, usersPagination.value.total - 1)
  }

  async function exportStudentsCSV() {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const auth = JSON.parse(localStorage.getItem('UA_AUTH') || '{}')
    const res = await fetch(`${base}/admin/users/export.csv`, {
      headers: { Authorization: `Bearer ${auth?.accessToken || ''}` }
    })
    if (!res.ok) throw new Error('Failed to export CSV')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    stats, users, instructors, courses, revenue, loading, error,
    usersPagination, coursesPagination,
    fetchStats, fetchUsers, toggleUserActive, fetchUserDetail,
    fetchCourses, fetchCourseForAdmin, approveCourse, rejectCourse, fetchRevenue,
    fetchInstructors, createInstructor, createContentWriter, createStudent, createCourse, deleteCourse,
    removeUser, exportStudentsCSV, manualEnroll
  }
})

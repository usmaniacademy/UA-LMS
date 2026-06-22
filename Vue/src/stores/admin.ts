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

  // Admin removes (archives) a course
  async function deleteCourse(courseId: string) {
    await api.delete(`/courses/${courseId}`)
    const idx = courses.value.findIndex(c => c.id === courseId)
    if (idx !== -1) courses.value[idx].status = 'archived'
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

  return {
    stats, users, instructors, courses, revenue, loading, error,
    usersPagination, coursesPagination,
    fetchStats, fetchUsers, toggleUserActive,
    fetchCourses, approveCourse, rejectCourse, fetchRevenue,
    fetchInstructors, createCourse, deleteCourse
  }
})

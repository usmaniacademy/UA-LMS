import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '@/router/router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
  scrollBehavior: () => ({ top: 0 })
})

// Set page title
router.beforeEach((to) => {
  if (to.meta.title) document.title = String(to.meta.title)
})

// Auth + role guard
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((r) => r.meta.authRequired || r.meta.requiresAuth)
  const requiredRole = to.meta.role as string | undefined

  if (!requiresAuth) return next()

  if (!auth.isAuthenticated()) {
    return next({ name: 'auth.sign-in', query: { redirectedFrom: to.fullPath } })
  }

  if (requiredRole && auth.userRole() !== requiredRole) {
    // Redirect to correct dashboard for their role
    const role = auth.userRole()
    if (role === 'admin') return next({ name: 'admin.dashboard' })
    if (role === 'instructor') return next({ name: 'instructor.dashboard' })
    return next({ name: 'student.dashboard' })
  }

  next()
})

export default router

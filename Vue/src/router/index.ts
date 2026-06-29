import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '@/router/router'
import { useAuthStore } from '@/stores/auth'

// ─── Role-based access ──────────────────────────────────────────────────────
// Inject authRequired + role onto every account route by name prefix so each
// area (admin / instructor / student) is locked to its own role. A few routes
// are shared between an instructor and an admin (the course builder).
const ROLE_BY_PREFIX: Record<string, string> = {
  'admin.': 'admin',
  'instructor.': 'instructor',
  'student.': 'student'
}
const SHARED_INSTRUCTOR_ADMIN = new Set(['instructor.create.course', 'instructor.edit.course'])

function applyRoleMeta(routes: any[]) {
  for (const r of routes) {
    const name = typeof r.name === 'string' ? r.name : ''
    if (name) {
      if (SHARED_INSTRUCTOR_ADMIN.has(name)) {
        r.meta = { ...r.meta, authRequired: true, role: ['instructor', 'admin'] }
      } else {
        for (const [prefix, role] of Object.entries(ROLE_BY_PREFIX)) {
          if (name.startsWith(prefix)) {
            r.meta = { ...r.meta, authRequired: true, role }
            break
          }
        }
      }
    }
    if (r.children) applyRoleMeta(r.children)
  }
}
applyRoleMeta(allRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
  scrollBehavior: () => ({ top: 0 })
})

function dashboardForRole(role: string | null) {
  if (role === 'admin') return { name: 'admin.dashboard' }
  if (role === 'instructor') return { name: 'instructor.dashboard' }
  return { name: 'student.dashboard' }
}

// Set page title
router.beforeEach((to) => {
  if (to.meta.title) document.title = String(to.meta.title)
})

// Auth + role guard
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((r) => r.meta.authRequired || r.meta.requiresAuth)
  const requiredRole = to.meta.role as string | string[] | undefined

  if (!requiresAuth) return next()

  if (!auth.isAuthenticated()) {
    return next({ name: 'auth.sign-in', query: { redirectedFrom: to.fullPath } })
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const userRole = auth.userRole()
    // No role on the session (corrupt/expired) — force a fresh sign-in (avoids redirect loops)
    if (!userRole) {
      return next({ name: 'auth.sign-in', query: { redirectedFrom: to.fullPath } })
    }
    // Wrong area for this role — send them to their own dashboard
    if (!roles.includes(userRole)) {
      return next(dashboardForRole(userRole))
    }
  }

  next()
})

export default router

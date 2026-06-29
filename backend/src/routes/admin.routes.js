import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import * as ctrl from '../controllers/admin.controller.js'

const router = Router()

router.use(authenticate, authorize('admin'))

router.get('/stats', ctrl.getStats)
router.get('/revenue', ctrl.getRevenue)
router.get('/users', ctrl.listUsers)
router.post('/instructors', ctrl.createInstructor)
router.patch('/users/:userId/toggle-active', ctrl.toggleUserActive)
router.patch('/users/:userId/role', ctrl.changeUserRole)
router.get('/courses', ctrl.listCourses)
router.patch('/courses/:courseId/approve', ctrl.approveCourse)
router.patch('/courses/:courseId/reject', ctrl.rejectCourse)

export default router

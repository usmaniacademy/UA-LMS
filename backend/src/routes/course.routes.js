import { Router } from 'express'
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  listCourses, getCourse,
  myCourseslist, createCourse, updateCourse, publishCourse, archiveCourse,
  createSection, updateSection, deleteSection,
  createLesson, updateLesson, deleteLesson,
  enrollFree, myEnrolledCourses
} from '../controllers/course.controller.js'
import {
  createCourseSchema, updateCourseSchema,
  createSectionSchema, updateSectionSchema,
  createLessonSchema, updateLessonSchema
} from '../validators/course.js'

const router = Router()

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', listCourses)

// ─── Instructor (must come BEFORE /:slug to avoid conflict) ──────────────────
router.get('/instructor/my-courses', authenticate, authorize('instructor', 'admin'), myCourseslist)
router.post('/', authenticate, authorize('instructor', 'admin'), validate(createCourseSchema), createCourse)
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(updateCourseSchema), updateCourse)
router.post('/:id/publish', authenticate, authorize('instructor', 'admin'), publishCourse)
router.delete('/:id', authenticate, authorize('instructor', 'admin'), archiveCourse)

// ─── Sections ─────────────────────────────────────────────────────────────────
router.post('/:courseId/sections', authenticate, authorize('instructor', 'admin'), validate(createSectionSchema), createSection)
router.put('/sections/:sectionId', authenticate, authorize('instructor', 'admin'), validate(updateSectionSchema), updateSection)
router.delete('/sections/:sectionId', authenticate, authorize('instructor', 'admin'), deleteSection)

// ─── Lessons ──────────────────────────────────────────────────────────────────
router.post('/sections/:sectionId/lessons', authenticate, authorize('instructor', 'admin'), validate(createLessonSchema), createLesson)
router.put('/lessons/:lessonId', authenticate, authorize('instructor', 'admin'), validate(updateLessonSchema), updateLesson)
router.delete('/lessons/:lessonId', authenticate, authorize('instructor', 'admin'), deleteLesson)

// ─── Student ──────────────────────────────────────────────────────────────────
router.post('/:id/enroll', authenticate, authorize('student'), enrollFree)
router.get('/student/my-courses', authenticate, authorize('student'), myEnrolledCourses)

// ─── Public course detail (slug — keep LAST to avoid catching static routes) ─
router.get('/:slug', optionalAuth, getCourse)

export default router

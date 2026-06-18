import * as CourseService from '../services/course.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ─── Public ───────────────────────────────────────────────────────────────────

export const listCourses = asyncHandler(async (req, res) => {
  const { category, level, search, page, limit } = req.query
  const result = await CourseService.listPublishedCourses({
    category, level, search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 12
  })
  res.json(result)
})

export const getCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.getCourseBySlug(req.params.slug, req.user?.id)
  res.json({ course })
})

// ─── Instructor ───────────────────────────────────────────────────────────────

export const myCourseslist = asyncHandler(async (req, res) => {
  const { search, status } = req.query
  const courses = await CourseService.getInstructorCourses(req.user.id, { search, status })
  res.json({ courses })
})

export const createCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.createCourse(req.user.id, req.body)
  res.status(201).json({ message: 'Course created', course })
})

export const updateCourse = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin'
  const course = await CourseService.updateCourse(req.params.id, req.user.id, req.body, isAdmin)
  res.json({ message: 'Course updated', course })
})

export const publishCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.publishCourse(req.params.id, req.user.id)
  res.json({ message: 'Course published', course })
})

export const archiveCourse = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin'
  const course = await CourseService.archiveCourse(req.params.id, req.user.id, isAdmin)
  res.json({ message: 'Course archived', course })
})

// ─── Sections ─────────────────────────────────────────────────────────────────

export const createSection = asyncHandler(async (req, res) => {
  const section = await CourseService.createSection(req.params.courseId, req.user.id, req.body)
  res.status(201).json({ message: 'Section created', section })
})

export const updateSection = asyncHandler(async (req, res) => {
  const section = await CourseService.updateSection(req.params.sectionId, req.user.id, req.body)
  res.json({ message: 'Section updated', section })
})

export const deleteSection = asyncHandler(async (req, res) => {
  await CourseService.deleteSection(req.params.sectionId, req.user.id)
  res.json({ message: 'Section deleted' })
})

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await CourseService.createLesson(req.params.sectionId, req.user.id, req.body)
  res.status(201).json({ message: 'Lesson created', lesson })
})

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await CourseService.updateLesson(req.params.lessonId, req.user.id, req.body)
  res.json({ message: 'Lesson updated', lesson })
})

export const deleteLesson = asyncHandler(async (req, res) => {
  await CourseService.deleteLesson(req.params.lessonId, req.user.id)
  res.json({ message: 'Lesson deleted' })
})

export const enrollFree = asyncHandler(async (req, res) => {
  const enrollment = await CourseService.enrollFree(req.params.id, req.user.id)
  res.status(201).json({ message: 'Enrolled successfully', enrollment })
})

// ─── Student ──────────────────────────────────────────────────────────────────

export const myEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await CourseService.getStudentCourses(req.user.id)
  res.json({ enrollments })
})

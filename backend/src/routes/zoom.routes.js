import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createMeeting, updateMeeting, deleteMeeting,
  getMeetingsByCourse, getJoinUrl, getStartUrl, webhook
} from '../controllers/zoom.controller.js'
import { createMeetingSchema, updateMeetingSchema } from '../validators/zoom.js'

const router = Router()

// Webhook — no auth, Zoom calls this directly
router.post('/webhook', webhook)

// Instructor routes
router.post('/meetings', authenticate, authorize('instructor', 'admin'), validate(createMeetingSchema), createMeeting)
router.patch('/meetings/:meetingId', authenticate, authorize('instructor', 'admin'), validate(updateMeetingSchema), updateMeeting)
router.delete('/meetings/:meetingId', authenticate, authorize('instructor', 'admin'), deleteMeeting)
router.get('/meetings/:meetingId/start', authenticate, authorize('instructor', 'admin'), getStartUrl)

// Shared (instructor + student) — get all classes for a course
router.get('/meetings/course/:courseId', authenticate, getMeetingsByCourse)

// Student — get join URL (checks enrollment)
router.get('/meetings/:meetingId/join', authenticate, authorize('student'), getJoinUrl)

export default router

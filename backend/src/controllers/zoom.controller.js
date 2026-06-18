import * as ZoomService from '../services/zoom.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { env } from '../config/env.js'
import crypto from 'crypto'

export const createMeeting = asyncHandler(async (req, res) => {
  const meeting = await ZoomService.createMeeting({ ...req.body, instructorId: req.user.id })
  res.status(201).json({ message: 'Zoom class created', meeting })
})

export const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await ZoomService.updateMeeting(req.params.meetingId, req.user.id, req.body)
  res.json({ message: 'Zoom class updated', meeting })
})

export const deleteMeeting = asyncHandler(async (req, res) => {
  await ZoomService.deleteMeeting(req.params.meetingId, req.user.id)
  res.json({ message: 'Zoom class cancelled' })
})

export const getMeetingsByCourse = asyncHandler(async (req, res) => {
  const meetings = await ZoomService.getMeetingsByCourse(req.params.courseId)
  res.json({ meetings })
})

export const getJoinUrl = asyncHandler(async (req, res) => {
  const data = await ZoomService.getStudentJoinUrl(req.params.meetingId, req.user.id)
  res.json(data)
})

export const getStartUrl = asyncHandler(async (req, res) => {
  const data = await ZoomService.getInstructorStartUrl(req.params.meetingId, req.user.id)
  res.json(data)
})

// M4.5 — Webhook handler
export const webhook = asyncHandler(async (req, res) => {
  const { event, payload } = req.body

  // Zoom webhook verification handshake
  if (event === 'endpoint.url_validation') {
    const hashForValidate = crypto
      .createHmac('sha256', env.zoom.webhookSecretToken)
      .update(payload.plainToken)
      .digest('hex')
    return res.json({ plainToken: payload.plainToken, encryptedToken: hashForValidate })
  }

  // Verify Zoom webhook signature
  const signature = req.headers['x-zm-signature']
  const timestamp = req.headers['x-zm-request-timestamp']
  if (signature && timestamp) {
    const message = `v0:${timestamp}:${JSON.stringify(req.body)}`
    const expected = 'v0=' + crypto.createHmac('sha256', env.zoom.webhookSecretToken).update(message).digest('hex')
    if (signature !== expected) return res.status(401).json({ error: 'Invalid webhook signature' })
  }

  await ZoomService.handleWebhookEvent(event, payload)
  res.json({ received: true })
})

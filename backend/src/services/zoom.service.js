import { env } from '../config/env.js'
import prisma from '../config/prisma.js'
import { ApiError } from '../utils/ApiError.js'

// ─── Token cache (in-memory, refreshed 5 min before expiry) ──────────────────

let _token = null
let _tokenExpiresAt = 0

async function getAccessToken() {
  if (_token && Date.now() < _tokenExpiresAt - 5 * 60 * 1000) return _token

  const credentials = Buffer.from(`${env.zoom.clientId}:${env.zoom.clientSecret}`).toString('base64')

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${env.zoom.accountId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Zoom token error: ${err}`)
  }

  const data = await res.json()
  _token = data.access_token
  _tokenExpiresAt = Date.now() + data.expires_in * 1000
  return _token
}

async function zoomApi(method, path, body = null) {
  const token = await getAccessToken()
  const res = await fetch(`https://api.zoom.us/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (res.status === 204) return null

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Zoom API error ${res.status}`)
  return data
}

// ─── Meeting CRUD ─────────────────────────────────────────────────────────────

export async function createMeeting({ courseId, instructorId, topic, startTime, duration, timezone, password, waitingRoom, autoRecording, agenda }) {
  const zoomPayload = {
    topic,
    type: 2, // scheduled meeting
    start_time: startTime,
    duration,
    timezone,
    password: password || undefined,
    agenda: agenda || undefined,
    settings: {
      waiting_room: waitingRoom ?? true,
      auto_recording: autoRecording ? 'cloud' : 'none',
      join_before_host: false,
      mute_upon_entry: true
    }
  }

  const zoomMeeting = await zoomApi('POST', '/users/me/meetings', zoomPayload)

  const meeting = await prisma.zoomMeeting.create({
    data: {
      courseId,
      instructorId,
      zoomMeetingId: String(zoomMeeting.id),
      topic,
      startTime: new Date(startTime),
      duration,
      timezone,
      joinUrl: zoomMeeting.join_url,
      startUrl: zoomMeeting.start_url,
      password: zoomMeeting.password || null,
      agenda: agenda || null,
      status: 'scheduled'
    }
  })

  return meeting
}

export async function updateMeeting(meetingId, instructorId, updates) {
  const meeting = await prisma.zoomMeeting.findUnique({ where: { id: meetingId } })
  if (!meeting) throw ApiError.notFound('Meeting not found')
  if (meeting.instructorId !== instructorId) throw ApiError.forbidden()

  const zoomPayload = {}
  if (updates.topic) zoomPayload.topic = updates.topic
  if (updates.startTime) zoomPayload.start_time = updates.startTime
  if (updates.duration) zoomPayload.duration = updates.duration
  if (updates.timezone) zoomPayload.timezone = updates.timezone
  if (updates.agenda !== undefined) zoomPayload.agenda = updates.agenda

  await zoomApi('PATCH', `/meetings/${meeting.zoomMeetingId}`, zoomPayload)

  return prisma.zoomMeeting.update({
    where: { id: meetingId },
    data: {
      ...(updates.topic && { topic: updates.topic }),
      ...(updates.startTime && { startTime: new Date(updates.startTime) }),
      ...(updates.duration && { duration: updates.duration }),
      ...(updates.timezone && { timezone: updates.timezone }),
      ...(updates.agenda !== undefined && { agenda: updates.agenda })
    }
  })
}

export async function deleteMeeting(meetingId, instructorId) {
  const meeting = await prisma.zoomMeeting.findUnique({ where: { id: meetingId } })
  if (!meeting) throw ApiError.notFound('Meeting not found')
  if (meeting.instructorId !== instructorId) throw ApiError.forbidden()

  await zoomApi('DELETE', `/meetings/${meeting.zoomMeetingId}`)

  return prisma.zoomMeeting.update({
    where: { id: meetingId },
    data: { status: 'cancelled' }
  })
}

export async function getMeetingsByCourse(courseId) {
  return prisma.zoomMeeting.findMany({
    where: { courseId, status: { not: 'cancelled' } },
    orderBy: { startTime: 'asc' },
    include: {
      instructor: { select: { firstName: true, lastName: true, avatarUrl: true } }
    }
  })
}

export async function getStudentJoinUrl(meetingId, studentId) {
  // Verify student is enrolled in the course this meeting belongs to
  const meeting = await prisma.zoomMeeting.findUnique({ where: { id: meetingId } })
  if (!meeting) throw ApiError.notFound('Meeting not found')
  if (meeting.status === 'cancelled') throw ApiError.badRequest('This class has been cancelled')

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId: meeting.courseId } }
  })
  if (!enrollment) throw ApiError.forbidden('You must be enrolled to join this class')

  return { joinUrl: meeting.joinUrl, password: meeting.password, topic: meeting.topic, startTime: meeting.startTime }
}

export async function getInstructorStartUrl(meetingId, instructorId) {
  const meeting = await prisma.zoomMeeting.findUnique({ where: { id: meetingId } })
  if (!meeting) throw ApiError.notFound('Meeting not found')
  if (meeting.instructorId !== instructorId) throw ApiError.forbidden()

  // Zoom's start_url embeds a host token that expires ~2 hours after it's
  // generated, so the copy saved at creation time is dead for any class
  // scheduled further ahead. Re-fetch the meeting to get a fresh start_url
  // with a valid token every time the instructor starts the class.
  let startUrl = meeting.startUrl
  try {
    const fresh = await zoomApi('GET', `/meetings/${meeting.zoomMeetingId}`)
    if (fresh?.start_url) {
      startUrl = fresh.start_url
      if (fresh.start_url !== meeting.startUrl) {
        await prisma.zoomMeeting.update({ where: { id: meeting.id }, data: { startUrl: fresh.start_url } })
      }
    }
  } catch {
    // Zoom unreachable — fall back to the stored URL rather than blocking the host
  }

  return { startUrl, topic: meeting.topic, startTime: meeting.startTime }
}

// ─── Webhook event handling ───────────────────────────────────────────────────

export async function handleWebhookEvent(event, payload) {
  const zoomMeetingId = String(payload?.object?.id || payload?.id || '')
  if (!zoomMeetingId) return

  const meeting = await prisma.zoomMeeting.findUnique({ where: { zoomMeetingId } })
  if (!meeting) return // Meeting not managed by this platform

  if (event === 'meeting.started') {
    await prisma.zoomMeeting.update({ where: { id: meeting.id }, data: { status: 'live' } })
  }

  if (event === 'meeting.ended') {
    const recordingUrl = payload?.object?.recording_files?.[0]?.download_url || null
    await prisma.zoomMeeting.update({
      where: { id: meeting.id },
      data: { status: 'completed', ...(recordingUrl && { recordingUrl }) }
    })
  }
}

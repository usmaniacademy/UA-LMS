import * as adminService from '../services/admin.service.js'

export async function getStats(req, res, next) {
  try {
    const data = await adminService.getStats()
    res.json(data)
  } catch (e) { next(e) }
}

export async function listUsers(req, res, next) {
  try {
    const { role, search, page, limit } = req.query
    const data = await adminService.listUsers({
      role, search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    })
    res.json(data)
  } catch (e) { next(e) }
}

export async function toggleUserActive(req, res, next) {
  try {
    const data = await adminService.toggleUserActive(req.params.userId)
    res.json(data)
  } catch (e) { next(e) }
}

export async function changeUserRole(req, res, next) {
  try {
    const data = await adminService.changeUserRole(req.params.userId, req.body.role)
    res.json(data)
  } catch (e) { next(e) }
}

export async function listCourses(req, res, next) {
  try {
    const { status, search, page, limit } = req.query
    const data = await adminService.listCourses({
      status, search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    })
    res.json(data)
  } catch (e) { next(e) }
}

export async function approveCourse(req, res, next) {
  try {
    const data = await adminService.approveCourse(req.params.courseId)
    res.json(data)
  } catch (e) { next(e) }
}

export async function rejectCourse(req, res, next) {
  try {
    const data = await adminService.rejectCourse(req.params.courseId)
    res.json(data)
  } catch (e) { next(e) }
}

export async function getRevenue(req, res, next) {
  try {
    const data = await adminService.getRevenue()
    res.json(data)
  } catch (e) { next(e) }
}

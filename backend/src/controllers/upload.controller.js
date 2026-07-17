import { uploadDataUrl } from '../services/storage.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Generic image upload for authenticated staff (instructors, admins, content
// writers) — used by the course builder and any other in-app image field.
export const uploadImage = asyncHandler(async (req, res) => {
  const { dataUrl, filename } = req.body
  const result = await uploadDataUrl(dataUrl, filename, 'uploads')
  res.status(201).json(result)
})

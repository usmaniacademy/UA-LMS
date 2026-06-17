import { ApiError } from '../utils/ApiError.js'

// Validate a request part (body/query/params) against a Zod schema.
// On success, replaces the request part with the parsed (typed/coerced) data.
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source])
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message
    }))
    return next(ApiError.badRequest('Validation failed', details))
  }
  req[source] = result.data
  next()
}

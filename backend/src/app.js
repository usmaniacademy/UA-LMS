import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { env, isProduction } from './config/env.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { notFoundHandler, errorHandler } from './middleware/error.js'
import apiRoutes from './routes/index.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true
  })
)
app.use(morgan(isProduction ? 'combined' : 'dev'))

// Stripe webhook needs raw body — skip JSON parsing for that route only.
// Larger limit so base64 profile-image uploads fit.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') return next()
  express.json({ limit: '5mb' })(req, res, next)
})
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

app.use('/api', apiLimiter)
app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app

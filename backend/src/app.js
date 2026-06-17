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

// NOTE: Stripe webhook needs the raw body for signature verification.
// Its route (mounted under /api/stripe/webhook) must register express.raw()
// BEFORE this JSON parser. That will be wired up in Milestone 5.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiLimiter)
app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app

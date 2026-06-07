import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes  from './routes/auth.js'
import taskRoutes  from './routes/tasks.js'
import userRoutes  from './routes/users.js'
import moodRoutes  from './routes/moods.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ── Routes ──
app.use('/api/auth',  authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes)
app.use('/api/moods', moodRoutes)

// ── Health check ──
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }))

// ── 404 ──
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }))

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅ Kitchen Cleaning API running on port ${PORT}`)
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
})

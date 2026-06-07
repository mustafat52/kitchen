import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// ── POST /api/moods  — volunteer submits mood for today
router.post('/', requireRole('volunteer'), async (req, res) => {
  const { rating, day_number = 1 } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO moods (user_id, rating, day_number)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, day_number) DO UPDATE SET rating = EXCLUDED.rating, submitted_at = NOW()
       RETURNING *`,
      [req.user.id, rating, day_number]
    )
    res.status(201).json({ mood: rows[0] })
  } catch (err) {
    console.error('POST /moods error:', err.message)
    res.status(500).json({ error: 'Could not submit mood' })
  }
})

// ── GET /api/moods/my  — volunteer checks their own submission
router.get('/my', requireRole('volunteer'), async (req, res) => {
  const day_number = parseInt(req.query.day || 1)
  try {
    const { rows } = await pool.query(
      `SELECT * FROM moods WHERE user_id = $1 AND day_number = $2`,
      [req.user.id, day_number]
    )
    res.json({ mood: rows[0] || null })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch mood' })
  }
})

// ── GET /api/moods/summary  — zone admin sees aggregate
router.get('/summary', requireRole('zone_admin'), async (req, res) => {
  const day_number = parseInt(req.query.day || 1)
  try {
    const { rows } = await pool.query(
      `SELECT rating, COUNT(*)::int AS count
       FROM moods
       WHERE day_number = $1
       GROUP BY rating
       ORDER BY rating`,
      [day_number]
    )

    const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let total = 0, weightedSum = 0
    rows.forEach(({ rating, count }) => {
      summary[rating] = count
      total       += count
      weightedSum += rating * count
    })
    const avg = total > 0 ? (weightedSum / total).toFixed(1) : null

    res.json({ summary, total, avg })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch mood summary' })
  }
})

export default router

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/pool.js'

const router = Router()

// POST /api/auth/login
// Body: { its, password }   — password is same as ITS number for now
router.post('/login', async (req, res) => {
  const { its, password } = req.body

  if (!its || !password) {
    return res.status(400).json({ error: 'ITS number and password are required.' })
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, its, name, initials, phone, city, role, zone_id, is_active, password_hash
       FROM users WHERE its = $1`,
      [its.trim()]
    )

    const user = rows[0]

    if (!user) {
      return res.status(401).json({ error: 'ITS number not found. Please check and try again.' })
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'This account has been disabled. Contact your admin.' })
    }

    const valid = await bcrypt.compare(password.trim(), user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password.' })
    }

    const payload = {
      id:      user.id,
      its:     user.its,
      name:    user.name,
      initials:user.initials,
      role:    user.role,
      zone_id: user.zone_id,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })

    // Return user (without hash) + token
    const { password_hash, ...safeUser } = user
    res.json({ user: safeUser, token })

  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// GET /api/auth/me  — verify token & return fresh user data
import { requireAuth } from '../middleware/auth.js'

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, its, name, initials, phone, city, role, zone_id, is_active, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json({ user: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

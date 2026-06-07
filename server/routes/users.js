import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// ── GET /api/users/zone  — all users in the logged-in admin's zone
// Used by CreateTaskForm assign dropdown
router.get('/zone', requireRole('zone_admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, its, name, initials, phone, city, role, zone_id, is_active
       FROM users
       WHERE zone_id = $1 AND is_active = TRUE
       ORDER BY role DESC, name ASC`,
      [req.user.zone_id]
    )
    res.json({ users: rows })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users' })
  }
})

// ── GET /api/users/templates  — active task templates
router.get('/templates', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM templates WHERE is_active = TRUE ORDER BY display_order ASC`
    )
    res.json({ templates: rows })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch templates' })
  }
})

export default router

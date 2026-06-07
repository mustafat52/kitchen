import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// ── GET /api/tasks
// zone_admin → all tasks in their zone
// volunteer  → only their own tasks
router.get('/', async (req, res) => {
  try {
    let query, params

    if (req.user.role === 'zone_admin') {
      query = `
        SELECT t.*,
               u.name  AS volunteer_name,
               u.initials AS volunteer_initials
        FROM tasks t
        JOIN users u ON u.id = t.assigned_to
        WHERE t.zone_id = $1
        ORDER BY t.day_number DESC, t.created_at DESC
      `
      params = [req.user.zone_id]
    } else {
      query = `
        SELECT t.*,
               u.name AS volunteer_name,
               u.initials AS volunteer_initials
        FROM tasks t
        JOIN users u ON u.id = t.assigned_to
        WHERE t.assigned_to = $1
        ORDER BY t.day_number DESC, t.created_at DESC
      `
      params = [req.user.id]
    }

    const { rows } = await pool.query(query, params)
    res.json({ tasks: rows })
  } catch (err) {
    console.error('GET /tasks error:', err.message)
    res.status(500).json({ error: 'Could not fetch tasks' })
  }
})

// ── POST /api/tasks  (zone_admin only)
router.post('/', requireRole('zone_admin'), async (req, res) => {
  const { title, assigned_to, priority = 'medium', notes, template_id, day_number = 1 } = req.body

  if (!title?.trim())  return res.status(400).json({ error: 'Title is required' })
  if (!assigned_to)    return res.status(400).json({ error: 'assigned_to is required' })

  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, zone_id, assigned_to, assigned_by, template_id, priority, notes, day_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title.trim(), req.user.zone_id, assigned_to, req.user.id, template_id || null, priority, notes?.trim() || null, day_number]
    )
    res.status(201).json({ task: rows[0] })
  } catch (err) {
    console.error('POST /tasks error:', err.message)
    res.status(500).json({ error: 'Could not create task' })
  }
})

// ── PATCH /api/tasks/:id/status
// zone_admin can update any task in their zone
// volunteer  can only mark their own tasks done (retroactive)
router.patch('/:id/status', async (req, res) => {
  const taskId = parseInt(req.params.id)
  const { status, completed_at, retroactive = false } = req.body

  const VALID = ['pending', 'in_progress', 'done']
  if (!VALID.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID.join(', ')}` })
  }

  try {
    // Fetch task first to check ownership
    const { rows: existing } = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId])
    if (!existing[0]) return res.status(404).json({ error: 'Task not found' })

    const task = existing[0]

    // Volunteers can only update their own tasks
    if (req.user.role === 'volunteer' && task.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own tasks' })
    }

    // Zone admins can only update tasks in their zone
    if (req.user.role === 'zone_admin' && task.zone_id !== req.user.zone_id) {
      return res.status(403).json({ error: 'Task is not in your zone' })
    }

    const now = new Date().toISOString()
    const completedAtValue = status === 'done' ? (completed_at || now) : null
    const markedAtValue    = status === 'done' ? now : null

    const { rows } = await pool.query(
      `UPDATE tasks
       SET status = $1, completed_at = $2, marked_at = $3, retroactive = $4
       WHERE id = $5
       RETURNING *`,
      [status, completedAtValue, markedAtValue, status === 'done' ? retroactive : false, taskId]
    )

    res.json({ task: rows[0] })
  } catch (err) {
    console.error('PATCH /tasks/:id/status error:', err.message)
    res.status(500).json({ error: 'Could not update task' })
  }
})

// ── DELETE /api/tasks/:id  (zone_admin only)
router.delete('/:id', requireRole('zone_admin'), async (req, res) => {
  const taskId = parseInt(req.params.id)
  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND zone_id = $2 RETURNING id',
      [taskId, req.user.zone_id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Task not found in your zone' })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete task' })
  }
})

export default router

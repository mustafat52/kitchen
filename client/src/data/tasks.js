export const tasks = [
  // ── CMZ — Day 1 sample tasks ──
  { id: 1,  title: 'Sweep and mop floor',                   zone_id: 1, assigned_to: 2, assigned_by: 1, template_id: 2,  priority: 'high',   status: 'done',        notes: null, day_number: 1, created_at: '2025-01-01T05:00:00Z', completed_at: '2025-01-01T05:45:00Z', marked_at: '2025-01-01T05:45:00Z', retroactive: false },
  { id: 2,  title: 'Clean sinks and drains',                zone_id: 1, assigned_to: 2, assigned_by: 1, template_id: 13, priority: 'high',   status: 'in_progress', notes: null, day_number: 1, created_at: '2025-01-01T05:00:00Z', completed_at: null,                   marked_at: null,                   retroactive: false },
  { id: 3,  title: 'Empty bins, rinse and re-line',         zone_id: 1, assigned_to: 2, assigned_by: 1, template_id: 11, priority: 'medium', status: 'pending',     notes: 'Check bin near back door too', day_number: 1, created_at: '2025-01-01T05:00:00Z', completed_at: null, marked_at: null, retroactive: false },
  { id: 4,  title: 'Wipe all touch points',                 zone_id: 1, assigned_to: 2, assigned_by: 1, template_id: 12, priority: 'high',   status: 'pending',     notes: null, day_number: 1, created_at: '2025-01-01T05:00:00Z', completed_at: null, marked_at: null, retroactive: false },
]

export const getTasksByZone       = (zoneId)       => tasks.filter((t) => t.zone_id === zoneId)
export const getTasksByVolunteer  = (userId)        => tasks.filter((t) => t.assigned_to === userId)
export const getTasksByAdmin      = (adminId)       => tasks.filter((t) => t.assigned_by === adminId)
export const getTasksByZoneAndDay = (zoneId, day)   => tasks.filter((t) => t.zone_id === zoneId && t.day_number === day)

export const getZoneStats = (zoneId) => {
  const zoneTasks  = getTasksByZone(zoneId)
  const done       = zoneTasks.filter((t) => t.status === 'done').length
  const inProgress = zoneTasks.filter((t) => t.status === 'in_progress').length
  const pending    = zoneTasks.filter((t) => t.status === 'pending').length
  const total      = zoneTasks.length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, inProgress, pending, pct }
}

export const getOverallStats = () => {
  const done       = tasks.filter((t) => t.status === 'done').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const pending    = tasks.filter((t) => t.status === 'pending').length
  const total      = tasks.length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, inProgress, pending, pct }
}

export let nextTaskId = 10

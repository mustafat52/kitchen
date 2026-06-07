import { create } from 'zustand'
import { api } from '../lib/api'

const useTaskStore = create((set, get) => ({
  tasks:     [],
  filter:    'all',
  isLoading: false,
  error:     null,

  // ── Fetch all tasks for the logged-in user ──
  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const { tasks } = await api.get('/api/tasks')
      set({ tasks, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err.message })
    }
  },

  // ── Selectors (pure — work on in-memory tasks) ──

  getAllTasks: () => get().tasks,

  getTasksByZone: (zoneId) =>
    get().tasks.filter((t) => t.zone_id === zoneId),

  getTasksByVolunteer: (userId) =>
    get().tasks.filter((t) => t.assigned_to === userId),

  getFilteredTasks: (zoneId = null, userId = null) => {
    const { tasks, filter } = get()
    let result = tasks
    if (zoneId) result = result.filter((t) => t.zone_id === zoneId)
    if (userId) result = result.filter((t) => t.assigned_to === userId)
    if (filter !== 'all') result = result.filter((t) => t.status === filter)
    return result
  },

  getZoneStats: (zoneId) => {
    const zoneTasks  = get().tasks.filter((t) => t.zone_id === zoneId)
    const done       = zoneTasks.filter((t) => t.status === 'done').length
    const inProgress = zoneTasks.filter((t) => t.status === 'in_progress').length
    const pending    = zoneTasks.filter((t) => t.status === 'pending').length
    const total      = zoneTasks.length
    const pct        = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, inProgress, pending, pct }
  },

  getVolunteerStats: (userId) => {
    const myTasks = get().tasks.filter((t) => t.assigned_to === userId)
    const done    = myTasks.filter((t) => t.status === 'done').length
    const total   = myTasks.length
    const pct     = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, pct }
  },

  getVolunteerDays: (userId) => {
    const days = get().tasks
      .filter((t) => t.assigned_to === userId)
      .map((t) => t.day_number)
    return [...new Set(days)].sort((a, b) => a - b)
  },

  getVolunteerDayStats: (userId, dayNumber) => {
    const dayTasks = get().tasks.filter(
      (t) => t.assigned_to === userId && t.day_number === dayNumber
    )
    const done  = dayTasks.filter((t) => t.status === 'done').length
    const total = dayTasks.length
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, pct }
  },

  setFilter: (filter) => set({ filter }),

  // ── Mutations ──

  createTask: async ({ title, assignedTo, priority, notes, templateId, dayNumber = 1 }) => {
    try {
      const { task } = await api.post('/api/tasks', {
        title,
        assigned_to: assignedTo,
        priority,
        notes,
        template_id: templateId || null,
        day_number:  dayNumber,
      })
      set((state) => ({ tasks: [task, ...state.tasks] }))
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },

  markDone: async (taskId) => {
    try {
      const { task } = await api.patch(`/api/tasks/${taskId}/status`, {
        status: 'done',
        retroactive: false,
      })
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? task : t),
      }))
    } catch (err) {
      console.error('markDone failed:', err.message)
    }
  },

  markDoneRetroactive: async (taskId, completedAt) => {
    try {
      const { task } = await api.patch(`/api/tasks/${taskId}/status`, {
        status:       'done',
        completed_at: completedAt,
        retroactive:  true,
      })
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? task : t),
      }))
    } catch (err) {
      console.error('markDoneRetroactive failed:', err.message)
    }
  },

  unmarkDone: async (taskId) => {
    try {
      const { task } = await api.patch(`/api/tasks/${taskId}/status`, { status: 'pending' })
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? task : t),
      }))
    } catch (err) {
      console.error('unmarkDone failed:', err.message)
    }
  },

  markInProgress: async (taskId) => {
    try {
      const { task } = await api.patch(`/api/tasks/${taskId}/status`, { status: 'in_progress' })
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? task : t),
      }))
    } catch (err) {
      console.error('markInProgress failed:', err.message)
    }
  },
}))

export default useTaskStore

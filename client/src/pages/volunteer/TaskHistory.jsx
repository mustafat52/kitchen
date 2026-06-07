import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import useAuthStore from '../../store/authStore'
import useTaskStore from '../../store/taskStore'

const ASHARA_START = new Date('2025-01-01')
const TOTAL_DAYS   = 10

const dayLabel = (dayNum) => {
  const d = new Date(ASHARA_START)
  d.setDate(d.getDate() + dayNum - 1)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

const fmtTime = (iso) => iso
  ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  : null

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
  : null

export default function TaskHistory() {
  const { user } = useAuthStore()
  const {
    getTasksByVolunteerAndDay,
    getVolunteerDayStats,
    markDoneRetroactive,
    unmarkDone,
  } = useTaskStore()

  const [selectedDay, setSelectedDay] = useState(1)
  const [confirmTask, setConfirmTask] = useState(null)
  const [toast, setToast]             = useState('')

  if (!user) return null

  const dayTasks = getTasksByVolunteerAndDay(user.id, selectedDay)
  const dayStats = getVolunteerDayStats(user.id, selectedDay)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleMarkDone = (taskId) => {
    // completed_at = noon on the selected day (approximate time they did it)
    const d = new Date(ASHARA_START)
    d.setDate(d.getDate() + selectedDay - 1)
    d.setHours(12, 0, 0, 0)
    markDoneRetroactive(taskId, d.toISOString())
    setConfirmTask(null)
    showToast('Task marked as done')
  }

  const handleUnmark = (taskId) => {
    unmarkDone(taskId)
    showToast('Task reverted to pending')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-primary)', color: '#fff',
          padding: '8px 20px', borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)', fontWeight: 600,
          zIndex: 500, whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md) var(--space-lg)', color: '#fff',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginBottom: 4 }}>Task history</p>
        <p style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>
          Day {selectedDay} — {dayLabel(selectedDay)}
        </p>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.75, marginTop: 2 }}>
          {dayStats.done}/{dayStats.total} tasks done
        </p>
      </div>

      {/* Day pills */}
      <div>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-sm)',
        }}>
          Select a day
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', overflowX: 'auto', paddingBottom: 4 }}>
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
            const stats   = getVolunteerDayStats(user.id, day)
            const isActive = selectedDay === day
            const allDone  = stats.total > 0 && stats.done === stats.total
            const hasTask  = stats.total > 0
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 10px', borderRadius: 'var(--radius-md)',
                border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface)',
                cursor: 'pointer', minWidth: 52,
              }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-primary)' }}>
                  Day {day}
                </span>
                <span style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>
                  {dayLabel(day).split(',')[0]}
                </span>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', marginTop: 2,
                  background: !hasTask ? 'var(--color-border)' : allDone ? 'var(--color-done)' : stats.done > 0 ? 'var(--color-progress)' : 'var(--color-high)',
                }} />
              </button>
            )
          })}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
          {[
            { color: 'var(--color-done)',     label: 'All done'  },
            { color: 'var(--color-progress)', label: 'Partial'   },
            { color: 'var(--color-high)',      label: 'None done' },
            { color: 'var(--color-border)',    label: 'No tasks'  },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-sm)',
        }}>
          Tasks for Day {selectedDay}
        </p>

        {dayTasks.length === 0 ? (
          <div style={{
            background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>📭</p>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              No tasks assigned on Day {selectedDay}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Tasks will appear here once your admin assigns them
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {dayTasks
              .sort((a, b) => {
                const order = { pending: 0, in_progress: 1, done: 2 }
                return order[a.status] - order[b.status]
              })
              .map((task) => {
                const isConfirming = confirmTask === task.id
                return (
                  <div key={task.id} style={{
                    background: 'var(--color-surface)',
                    border: `0.5px solid ${task.status === 'done' ? 'var(--color-done)' : 'var(--color-border)'}`,
                    borderLeft: `3px solid ${
                      task.status === 'done' ? 'var(--color-done)' :
                      task.priority === 'high' ? 'var(--color-high)' :
                      task.priority === 'medium' ? 'var(--color-medium)' : 'var(--color-low)'
                    }`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-md)',
                    boxShadow: 'var(--shadow-card)',
                    opacity: task.status === 'done' ? 0.8 : 1,
                  }}>
                    {/* Title */}
                    <p style={{
                      fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      marginBottom: 6, lineHeight: 1.4,
                    }}>
                      {task.title}
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 6 }}>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>

                    {/* Completion info */}
                    {task.status === 'done' && (
                      <div style={{
                        background: task.retroactive ? 'var(--color-progress-bg)' : 'var(--color-primary-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        marginBottom: 6,
                      }}>
                        {task.retroactive ? (
                          <>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-progress)', fontWeight: 600 }}>
                              ⚠️ Logged retroactively
                            </p>
                            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                              Task was on Day {task.day_number} · Marked on {fmtDate(task.marked_at)}
                            </p>
                          </>
                        ) : (
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-dark)', fontWeight: 500 }}>
                            ✓ Completed at {fmtTime(task.completed_at)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mark done action */}
                    {task.status !== 'done' && !isConfirming && (
                      <button onClick={() => setConfirmTask(task.id)} style={{
                        height: 32, padding: '0 14px',
                        borderRadius: 'var(--radius-md)', border: 'none',
                        background: 'var(--color-primary)', color: '#fff',
                        fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                      }}>
                        ✓ Mark as done
                      </button>
                    )}

                    {/* Confirm flow */}
                    {task.status !== 'done' && isConfirming && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-progress)', fontWeight: 500 }}>
                          ⚠️ This will be logged as completed on Day {selectedDay} but marked today.
                          The PDF report will note this.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <button onClick={() => handleMarkDone(task.id)} style={{
                            height: 32, padding: '0 14px', borderRadius: 'var(--radius-md)',
                            border: 'none', background: 'var(--color-primary)',
                            color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                          }}>
                            Yes, confirm
                          </button>
                          <button onClick={() => setConfirmTask(null)} style={{
                            height: 32, padding: '0 12px', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                            color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer',
                          }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Undo for done tasks */}
                    {task.status === 'done' && (
                      <button onClick={() => handleUnmark(task.id)} style={{
                        height: 26, padding: '0 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)', background: 'transparent',
                        color: 'var(--color-text-secondary)', fontSize: 10, cursor: 'pointer',
                      }}>
                        Undo
                      </button>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Info note */}
      <div style={{
        background: 'var(--color-bg)', border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: 'var(--space-md)',
        display: 'flex', gap: 'var(--space-sm)',
      }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Tasks marked from a previous day are flagged as <strong>retroactive</strong> in the daily PDF report so your admin is aware.
        </p>
      </div>
    </div>
  )
}
import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import Avatar from '../../components/Avatar'
import ProgressBar from '../../components/ProgressBar'
import EmptyState from '../../components/EmptyState'
import useTaskStore from '../../store/taskStore'
import useUserStore from '../../store/userStore'
import { displayName } from '../../data/users'

export default function LiveTaskBoard() {
  const { getAllTasks, getZoneStats } = useTaskStore()
  const { zones, getUserById }        = useUserStore()
  const [openZone, setOpenZone]       = useState(null)

  const allTasks = getAllTasks()

  const formatTime = (iso) => iso
    ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {zones.map((zone) => {
        const stats     = getZoneStats(zone.id)
        const isOpen    = openZone === zone.id
        const zoneTasks = allTasks
          .filter((t) => t.zone_id === zone.id)
          .sort((a, b) => {
            const order = { pending: 0, in_progress: 1, done: 2 }
            return order[a.status] - order[b.status]
          })

        const barColor =
          stats.pct >= 80 ? 'var(--color-done)'     :
          stats.pct >= 40 ? 'var(--color-progress)' :
          'var(--color-high)'

        return (
          <div key={zone.id} style={{
            background: 'var(--color-surface)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}>
            {/* Zone header — tappable */}
            <div
              onClick={() => setOpenZone(isOpen ? null : zone.id)}
              style={{
                padding: 'var(--space-md)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {zone.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: barColor }}>
                    {stats.pct}%
                  </span>
                  <span style={{
                    fontSize: 16,
                    color: 'var(--color-text-secondary)',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                  }}>›</span>
                </div>
              </div>

              {/* Progress bar */}
              <ProgressBar pct={stats.pct} height={5} color={barColor} />

              {/* Stats strip */}
              <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                {[
                  { label: 'Done',     value: stats.done,       color: 'var(--color-done)'     },
                  { label: 'Active',   value: stats.inProgress, color: 'var(--color-progress)' },
                  { label: 'Pending',  value: stats.pending,    color: 'var(--color-pending)'  },
                  { label: 'Total',    value: stats.total,      color: 'var(--color-text-secondary)' },
                ].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable task list */}
            {isOpen && (
              <div style={{ borderTop: '0.5px solid var(--color-border)' }}>
                {zoneTasks.length === 0 ? (
                  <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    No tasks assigned yet
                  </div>
                ) : (
                  zoneTasks.map((task, i) => {
                    const volunteer = getUserById(task.assigned_to)
                    return (
                      <div key={task.id} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                        padding: '10px var(--space-md)',
                        borderTop: i === 0 ? 'none' : '0.5px solid var(--color-border)',
                        opacity: task.status === 'done' ? 0.65 : 1,
                        background: task.status === 'in_progress' ? 'var(--color-progress-bg)' : 'transparent',
                      }}>
                        {volunteer && <Avatar user={volunteer} size="sm" />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 'var(--text-xs)', fontWeight: 500,
                            color: 'var(--color-text-primary)', lineHeight: 1.4,
                            textDecoration: task.status === 'done' ? 'line-through' : 'none',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {task.title}
                          </p>
                          {volunteer && (
                            <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                              {displayName(volunteer.name)}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                          <StatusBadge status={task.status} />
                          {task.status === 'done' && task.completed_at && (
                            <p style={{ fontSize: 9, color: 'var(--color-primary)' }}>✓ {formatTime(task.completed_at)}</p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}

      {allTasks.length === 0 && (
        <EmptyState icon="📋" title="No tasks yet" subtitle="Tasks will appear here once assigned" />
      )}
    </div>
  )
}
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import Avatar from './Avatar'
import useUserStore from '../store/userStore'

// showActions: show "Mark done" / "Mark in progress" buttons (zone admin only)
// onMarkDone: callback when admin marks done
// onMarkInProgress: callback when admin marks in progress
export default function TaskCard({ task, showActions = false, onMarkDone, onMarkInProgress }) {
  const { getUserById, getZoneById } = useUserStore()

  const volunteer = getUserById(task.assigned_to)
  const zone      = getZoneById(task.zone_id)

  const formatTime = (iso) => {
    if (!iso) return null
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Left border color by priority
  const borderColor = {
    high:   'var(--color-high)',
    medium: 'var(--color-medium)',
    low:    'var(--color-low)',
  }[task.priority] || 'var(--color-border)'

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--color-border)',
        borderLeft: `3px solid ${borderColor}`,
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        opacity: task.status === 'done' ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          lineHeight: 1.45,
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </p>

      {/* Badges row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.template_id === null && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-progress)',
            background: 'var(--color-progress-bg)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}>
            Ad hoc
          </span>
        )}
      </div>

      {/* Meta row — zone + assignee + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          {volunteer && <Avatar user={volunteer} size="sm" />}
          <div>
            {volunteer && (
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                {volunteer.name}
              </p>
            )}
            {zone && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                {zone.name}
              </p>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {task.status === 'done' && task.completed_at && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 500 }}>
              ✓ {formatTime(task.completed_at)}
            </p>
          )}
          {task.status !== 'done' && task.created_at && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              {formatTime(task.created_at)}
            </p>
          )}
        </div>
      </div>

      {/* Optional note */}
      {task.notes && (
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 8px',
          lineHeight: 1.4,
        }}>
          📝 {task.notes}
        </p>
      )}

      {/* Admin action buttons */}
      {showActions && task.status !== 'done' && (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
          {task.status === 'pending' && onMarkInProgress && (
            <button
              onClick={() => onMarkInProgress(task.id)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
              }}
            >
              Start
            </button>
          )}
          {onMarkDone && (
            <button
              onClick={() => onMarkDone(task.id)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--color-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Mark done ✓
            </button>
          )}
        </div>
      )}
    </div>
  )
}
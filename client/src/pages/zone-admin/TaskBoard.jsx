import TaskCard from '../../components/TaskCard'
import EmptyState from '../../components/EmptyState'
import useTaskStore from '../../store/taskStore'
import useAuthStore from '../../store/authStore'

const FILTERS = [
  { id: 'all',         label: 'All'         },
  { id: 'pending',     label: 'Pending'     },
  { id: 'in_progress', label: 'In progress' },
  { id: 'done',        label: 'Done'        },
]

export default function TaskBoard() {
  const { user } = useAuthStore()
  const { filter, setFilter, getFilteredTasks, markDone, markInProgress, getZoneStats } = useTaskStore()

  if (!user) return null

  const tasks = getFilteredTasks(user.zone_id)
  const stats = getZoneStats(user.zone_id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Stats strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-xs)',
      }}>
        {[
          { label: 'Total',       value: stats.total,      color: 'var(--color-text-primary)' },
          { label: 'Pending',     value: stats.pending,    color: 'var(--color-pending)'       },
          { label: 'In progress', value: stats.inProgress, color: 'var(--color-progress)'      },
          { label: 'Done',        value: stats.done,       color: 'var(--color-done)'          },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--color-surface)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px var(--space-sm)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)', overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink: 0,
                height: 32,
                padding: '0 14px',
                borderRadius: 'var(--radius-full)',
                border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState icon="✅" title="No tasks here" subtitle="Try a different filter" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showActions
              onMarkDone={(id) => markDone(id, user.id)}
              onMarkInProgress={(id) => markInProgress(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
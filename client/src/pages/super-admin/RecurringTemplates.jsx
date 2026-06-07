import useUserStore from '../../store/userStore'
import useTaskStore from '../../store/taskStore'

const PRIORITY_COLORS = {
  high:   { bg: 'var(--color-high-bg)',   color: 'var(--color-high)'   },
  medium: { bg: 'var(--color-medium-bg)', color: 'var(--color-medium)' },
  low:    { bg: 'var(--color-low-bg)',    color: 'var(--color-low)'    },
}

export default function RecurringTemplates() {
  const { getActiveTemplates, templates, toggleTemplateActive, zones } = useUserStore()
  const { createTask } = useTaskStore()

  const activeTemplates   = templates.filter((t) => t.is_active)
  const inactiveTemplates = templates.filter((t) => !t.is_active)

  const getZoneName = (id) => zones.find((z) => z.id === id)?.name || '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Summary + push-all button */}
      <div style={{
        background: 'var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: '#fff',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Recurring tasks</p>
        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '4px 0 var(--space-sm)' }}>
          {activeTemplates.length} active
        </p>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
          These tasks will appear in zone admin dashboards when pushed each day.
        </p>
        <button
          onClick={() => alert('In production this pushes all active templates as Day tasks to each zone admin.')}
          style={{
            width: '100%', height: 40,
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid rgba(255,255,255,0.6)',
            background: 'transparent',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🚀 Push all tasks for today
        </button>
      </div>

      {/* Active templates */}
      <p style={{
        fontSize: 'var(--text-xs)', fontWeight: 600,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        Active ({activeTemplates.length})
      </p>

      {activeTemplates.map((t) => {
        const pc = PRIORITY_COLORS[t.default_priority] || PRIORITY_COLORS.medium
        return (
          <div key={t.id} style={{
            background: 'var(--color-surface)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: 6 }}>
                {t.title}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 7px',
                  borderRadius: 'var(--radius-full)', background: pc.bg, color: pc.color,
                }}>
                  {t.default_priority}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {getZoneName(t.default_zone_id)}
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleTemplateActive(t.id)}
              style={{
                height: 28, padding: '0 10px', flexShrink: 0,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                fontSize: 10, fontWeight: 600,
                color: 'var(--color-high)', cursor: 'pointer',
              }}
            >
              Disable
            </button>
          </div>
        )
      })}

      {/* Inactive templates */}
      {inactiveTemplates.length > 0 && (
        <>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginTop: 'var(--space-sm)',
          }}>
            Inactive ({inactiveTemplates.length})
          </p>
          {inactiveTemplates.map((t) => (
            <div key={t.id} style={{
              background: 'var(--color-bg)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              opacity: 0.6,
            }}>
              <p style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {t.title}
              </p>
              <button
                onClick={() => toggleTemplateActive(t.id)}
                style={{
                  height: 28, padding: '0 10px', flexShrink: 0,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-primary)',
                  background: 'var(--color-primary-light)',
                  fontSize: 10, fontWeight: 600,
                  color: 'var(--color-primary-dark)', cursor: 'pointer',
                }}
              >
                Enable
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
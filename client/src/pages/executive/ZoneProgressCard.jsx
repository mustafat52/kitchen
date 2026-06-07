import ProgressBar from '../../components/ProgressBar'
import useTaskStore from '../../store/taskStore'

export default function ZoneProgressCard({ zone }) {
  const { getZoneStats } = useTaskStore()
  const stats = getZoneStats(zone.id)

  // Color the progress bar based on completion
  const barColor =
    stats.pct >= 80 ? 'var(--color-done)'    :
    stats.pct >= 40 ? 'var(--color-progress)' :
    'var(--color-high)'

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '0.5px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-md)',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Zone name + pct */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {zone.name}
        </p>
        <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: barColor,
        }}>
          {stats.pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <ProgressBar pct={stats.pct} height={6} color={barColor} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        {[
          { label: 'Done',     value: stats.done,       color: 'var(--color-done)'     },
          { label: 'Active',   value: stats.inProgress, color: 'var(--color-progress)' },
          { label: 'Pending',  value: stats.pending,    color: 'var(--color-pending)'  },
          { label: 'Total',    value: stats.total,      color: 'var(--color-text-secondary)' },
        ].map((s) => (
          <div key={s.label}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
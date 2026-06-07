import useMoodStore from '../../store/moodStore'

export default function MoodSummary() {
  const { getSummary, MOOD_OPTIONS } = useMoodStore()
  const { summary, total, avg } = getSummary(1)

  const maxCount = Math.max(...Object.values(summary), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Average score card */}
      <div style={{
        background: 'var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Team mood today</p>
          <p style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{total} submissions</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 40, lineHeight: 1 }}>
            {avg >= 4.5 ? '😊' : avg >= 3.5 ? '🙂' : avg >= 2.5 ? '😐' : avg >= 1.5 ? '😔' : '😓'}
          </p>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginTop: 4 }}>
            {avg ? `${avg} / 5` : '—'}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{
        background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 600,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 'var(--space-md)',
        }}>
          Breakdown
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {MOOD_OPTIONS.map((opt) => {
            const count = summary[opt.rating] || 0
            const barPct = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={opt.rating} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                {/* Emoji */}
                <span style={{ fontSize: 20, width: 28, flexShrink: 0, textAlign: 'center' }}>
                  {opt.emoji}
                </span>

                {/* Label + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {count}
                    </span>
                  </div>
                  <div style={{
                    height: 6,
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${barPct}%`,
                      background: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease',
                      opacity: 0.4 + (opt.rating / 5) * 0.6,
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Privacy note */}
      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        🔒 Individual ratings are private. Only this aggregate is visible.
      </p>
    </div>
  )
}
const CONFIG = {
  high:   { label: 'High',   bg: 'var(--color-high-bg)',   color: 'var(--color-high)'   },
  medium: { label: 'Med',    bg: 'var(--color-medium-bg)', color: 'var(--color-medium)' },
  low:    { label: 'Low',    bg: 'var(--color-low-bg)',    color: 'var(--color-low)'    },
}

export default function PriorityBadge({ priority }) {
  const cfg = CONFIG[priority] || CONFIG.medium
  return (
    <span
      style={{
        display: 'inline-block',
        background: cfg.bg,
        color: cfg.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}
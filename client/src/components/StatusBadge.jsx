const CONFIG = {
  pending:     { label: 'Pending',     bg: 'var(--color-pending-bg)',  color: 'var(--color-pending)'  },
  in_progress: { label: 'In progress', bg: 'var(--color-progress-bg)', color: 'var(--color-progress)' },
  done:        { label: 'Done',        bg: 'var(--color-done-bg)',     color: 'var(--color-done)'     },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.pending
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
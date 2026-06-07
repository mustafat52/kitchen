// pct: 0–100
// height: px value, default 5
// color: css color string, default primary green
export default function ProgressBar({ pct = 0, height = 5, color = 'var(--color-primary)' }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'var(--color-border)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          height: '100%',
          width: `${clamped}%`,
          background: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}
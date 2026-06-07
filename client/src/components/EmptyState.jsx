export default function EmptyState({ icon = '📋', title = 'Nothing here', subtitle = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px var(--space-lg)',
        gap: 'var(--space-sm)',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 36, lineHeight: 1 }}>{icon}</span>
      <p
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginTop: 'var(--space-xs)',
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
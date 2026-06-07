import useAuthStore from '../store/authStore'
import Avatar from './Avatar'

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuthStore()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'var(--max-width)',
        height: 'var(--topbar-height)',
        background: 'var(--color-surface)',
        borderBottom: '0.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)',
        zIndex: 100,
      }}
    >
      {/* Left — brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          🧹
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.2, fontFamily: 'var(--font-sans)' }}>
            {title || 'Kitchen Cleaning'}
          </div>
          {subtitle && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.2 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right — user pill */}
      {user && (
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            background: 'var(--color-bg)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px 4px 4px',
            cursor: 'pointer',
            minHeight: 36,
          }}
          title="Tap to log out"
        >
          <Avatar user={user} size="sm" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </span>
          <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>✕</span>
        </button>
      )}
    </header>
  )
}

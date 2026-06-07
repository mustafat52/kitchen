export default function BottomNav({ tabs, activeTab, onChange }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'var(--max-width)',
        height: 'var(--bottomnav-height)',
        background: 'var(--color-surface)',
        borderTop: '0.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              position: 'relative',
              minHeight: 44,
            }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  background: 'var(--color-primary)',
                  borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                }}
              />
            )}
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, lineHeight: 1 }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

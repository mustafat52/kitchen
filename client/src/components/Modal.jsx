import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
        }}
      />

      {/* Sheet — slides up from bottom, mobile native feel */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 'var(--max-width)',
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          zIndex: 201,
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-border)',
          }} />
        </div>

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '0.5px solid var(--color-border)',
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: 'var(--color-text-secondary)',
                flexShrink: 0,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 'var(--space-lg)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
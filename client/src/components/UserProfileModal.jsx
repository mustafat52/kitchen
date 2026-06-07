import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Avatar from './Avatar'
import { displayName } from '../data/users'

const ROLE_LABELS = {
  zone_admin: 'Zone Admin',
  volunteer:  'Volunteer',
}

const Row = ({ icon, label, value }) => {
  if (!value) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px 0',
      borderBottom: '0.5px solid var(--color-border)',
    }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

export default function UserProfileModal({ user, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !user) return null

  const modal = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        background: 'var(--color-surface)',
        borderRadius: '20px 20px 0 0',
        maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-modal)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--color-border)' }} />
        </div>

        <div style={{ overflowY: 'auto', padding: '0 20px 40px' }}>

          {/* Avatar + name */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, padding: '16px 0 20px',
            borderBottom: '0.5px solid var(--color-border)',
            marginBottom: 4,
          }}>
            <Avatar user={user} size="xl" />
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
              {displayName(user.name)}
            </p>
            <span style={{
              fontSize: 11, fontWeight: 600,
              padding: '3px 14px', borderRadius: 99,
              background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)',
            }}>
              {ROLE_LABELS[user.role] || user.role}
            </span>
          </div>

          <Row icon="🪪" label="ITS Number" value={user.its} />
          <Row icon="📞" label="Contact"    value={user.phone} />
          <Row icon="🏙️" label="City"       value={user.city} />
          <Row icon="🏷️" label="Role"       value={ROLE_LABELS[user.role]} />

          {user.phone && (
            <a href={`tel:${user.phone}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginTop: 20,
              width: '100%', height: 48,
              borderRadius: 10,
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}>
              📞 Call {user.name.split(' ')[0]}
            </a>
          )}

          <button onClick={onClose} style={{
            width: '100%', height: 44, marginTop: 10,
            borderRadius: 10,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            fontSize: 13, fontWeight: 500,
            color: 'var(--color-text-secondary)', cursor: 'pointer',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useUserStore from '../../store/userStore'
import Avatar from '../../components/Avatar'
import { displayName } from '../../data/users'

const ROLE_LABELS = {
  zone_admin: 'Zone Admin',
  volunteer:  'Volunteer',
}

const ROLE_HOME = {
  zone_admin: '/zone-admin',
  volunteer:  '/volunteer',
}

const Row = ({ icon, label, value }) => {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-md) 0', borderBottom: '0.5px solid var(--color-border)' }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const { getZoneById, getAdminsByZone } = useUserStore()
  const navigate = useNavigate()

  if (!user) return null

  const zone       = user.zone_id ? getZoneById(user.zone_id) : null
  const admins     = user.zone_id ? getAdminsByZone(user.zone_id) : []
  const adminNames = admins
    .filter((a) => a.id !== user.id)
    .map((a) => displayName(a.name))
    .join(', ')

  const handleBack = () => navigate(ROLE_HOME[user.role] || '/login')

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>

      <header style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 'var(--max-width)',
        height: 'var(--topbar-height)',
        background: 'var(--color-surface)',
        borderBottom: '0.5px solid var(--color-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 var(--space-lg)', gap: 'var(--space-md)',
        zIndex: 100,
      }}>
        <button onClick={handleBack} style={{
          width: 36, height: 36, borderRadius: 'var(--radius-full)',
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, cursor: 'pointer', color: 'var(--color-text-primary)',
          flexShrink: 0,
        }}>‹</button>
        <p style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>My Profile</p>
      </header>

      <div style={{ paddingTop: 'var(--topbar-height)' }}>
        <div className="scroll-area fade-in">

          {/* Hero */}
          <div style={{
            background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl) var(--space-lg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)',
            color: '#fff',
          }}>
            <Avatar user={user} size="xl" />
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{displayName(user.name)}</h2>
              <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginTop: 4 }}>
                {ROLE_LABELS[user.role]}{zone ? ` · ${zone.name}` : ''}
              </p>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '0 var(--space-md)', boxShadow: 'var(--shadow-card)' }}>
            <Row icon="🪪" label="ITS Number"  value={user.its} />
            <Row icon="📞" label="Contact"     value={user.phone} />
            <Row icon="🏙️" label="City"        value={user.city} />
            <Row icon="🏷️" label="Role"        value={ROLE_LABELS[user.role]} />
            <Row icon="📍" label="Zone"        value={zone?.name} />
            {user.role === 'volunteer' && adminNames && (
              <Row icon="👤" label="Reports to" value={adminNames} />
            )}
            <div style={{ height: 'var(--space-md)' }} />
          </div>

          {/* Event tag */}
          <div style={{
            background: 'var(--color-primary-light)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              🕌 Ashara 1448H London
            </p>
          </div>

          {/* Sign out */}
          <button onClick={() => { logout(); navigate('/login') }} style={{
            width: '100%', height: 48, borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-high)',
            background: 'var(--color-high-bg)',
            color: 'var(--color-high)',
            fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import Avatar from '../../components/Avatar'
import UserProfileModal from '../../components/UserProfileModal'
import useAuthStore from '../../store/authStore'
import useUserStore from '../../store/userStore'
import { displayName } from '../../data/users'

const inputStyle = {
  width: '100%', height: 44, borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)', background: 'var(--color-surface)',
  padding: '0 var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
}
const labelStyle = {
  fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)',
  display: 'block', marginBottom: 'var(--space-xs)',
}

export default function ZoneTeamManager() {
  const { user } = useAuthStore()
  const { createUser, changeRole, toggleUserActive, getVolunteersByZone, getAdminsByZone } = useUserStore()

  const [showForm, setShowForm]       = useState(false)
  const [its, setIts]                 = useState('')
  const [name, setName]               = useState('')
  const [phone, setPhone]             = useState('')
  const [city, setCity]               = useState('')
  const [role, setRole]               = useState('volunteer')
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  if (!user) return null

  const myZoneId    = user.zone_id
  const volunteers  = getVolunteersByZone(myZoneId)
  const admins      = getAdminsByZone(myZoneId)
  const myZoneUsers = [...admins, ...volunteers]

  const handleCreate = () => {
    setError('')
    if (!its.trim() || its.trim().length !== 8) return setError('ITS number must be exactly 8 digits.')
    if (!name.trim()) return setError('Name is required.')
    const result = createUser({ its: its.trim(), name: name.trim(), phone, city, role, zoneId: myZoneId })
    if (result?.error) return setError(result.error)
    setIts(''); setName(''); setPhone(''); setCity(''); setRole('volunteer')
    setSuccess(true); setShowForm(false)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            {myZoneUsers.length} members · tap to view profile
          </p>
          <button onClick={() => setShowForm((s) => !s)} style={{
            height: 34, padding: '0 var(--space-md)', borderRadius: 'var(--radius-full)',
            border: 'none', background: 'var(--color-primary)', color: '#fff',
            fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ Add member'}
          </button>
        </div>

        {success && (
          <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            ✅ Member added to your zone
          </div>
        )}

        {showForm && (
          <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Add member to your zone</p>
            <div>
              <label style={labelStyle}>ITS Number <span style={{ color: 'var(--color-high)' }}>*</span></label>
              <input style={{ ...inputStyle, letterSpacing: '0.08em' }} placeholder="8-digit ITS number" maxLength={8}
                value={its} onChange={(e) => setIts(e.target.value.replace(/\D/g, ''))} />
              <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 3 }}>This will be their login ID and password</p>
            </div>
            <div>
              <label style={labelStyle}>Full name <span style={{ color: 'var(--color-high)' }}>*</span></label>
              <input style={inputStyle} placeholder="e.g. Hussain Plumber" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} placeholder="9100000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="volunteer">Volunteer</option>
                <option value="zone_admin">Zone Admin</option>
              </select>
            </div>
            {error && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-high)' }}>⚠️ {error}</p>}
            <button onClick={handleCreate} style={{ width: '100%', height: 44, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>
              Add to zone →
            </button>
          </div>
        )}

        {myZoneUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            No members in your zone yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {myZoneUsers.map((u) => {
              const isAdmin = u.role === 'zone_admin'
              const isSelf  = u.id === user.id
              return (
                <div key={u.id} style={{
                  background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)',
                  opacity: u.is_active ? 1 : 0.55, boxShadow: 'var(--shadow-card)',
                }}>
                  {/* Tappable top row */}
                  <div
                    onClick={() => setSelectedUser(u)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: isSelf ? 0 : 'var(--space-sm)', cursor: 'pointer' }}
                  >
                    <Avatar user={u} size="md" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {displayName(u.name)} {isSelf ? <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>(you)</span> : ''}
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 3, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 'var(--radius-full)',
                          background: isAdmin ? 'var(--color-progress-bg)' : 'var(--color-bg)',
                          color: isAdmin ? 'var(--color-progress)' : 'var(--color-text-secondary)',
                        }}>
                          {isAdmin ? 'Zone Admin' : 'Volunteer'}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {u.city}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>›</span>
                  </div>

                  {/* Action buttons — not for self */}
                  {!isSelf && (
                    <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                      {u.role === 'volunteer' && (
                        <button onClick={() => changeRole(u.id, 'zone_admin')} style={{
                          height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--color-progress)', background: 'var(--color-progress-bg)',
                          fontSize: 10, fontWeight: 600, color: 'var(--color-progress)', cursor: 'pointer',
                        }}>↑ Make Zone Admin</button>
                      )}
                      {u.role === 'zone_admin' && (
                        <button onClick={() => changeRole(u.id, 'volunteer')} style={{
                          height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--color-pending)', background: 'var(--color-pending-bg)',
                          fontSize: 10, fontWeight: 600, color: 'var(--color-pending)', cursor: 'pointer',
                        }}>↓ Demote to Volunteer</button>
                      )}
                      <button onClick={() => toggleUserActive(u.id)} style={{
                        height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                        fontSize: 10, fontWeight: 600,
                        color: u.is_active ? 'var(--color-progress)' : 'var(--color-primary)', cursor: 'pointer',
                      }}>
                        {u.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  )
}
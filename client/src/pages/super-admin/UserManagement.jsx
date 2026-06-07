import { useState } from 'react'
import Avatar from '../../components/Avatar'
import useUserStore from '../../store/userStore'
import { displayName } from '../../data/users'
import UserProfileModal from '../../components/UserProfileModal'

const inputStyle = {
  width: '100%', height: 44, borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)', background: 'var(--color-surface)',
  padding: '0 var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
}
const labelStyle = {
  fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)',
  display: 'block', marginBottom: 'var(--space-xs)',
}

const ROLE_OPTIONS = [
  { value: 'volunteer',  label: 'Volunteer'  },
  { value: 'zone_admin', label: 'Zone Admin' },
  { value: 'executive',  label: 'Executive'  },
]
const ROLE_COLORS = {
  super_admin: { bg: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' },
  executive:   { bg: '#E6F1FB', color: '#0C447C' },
  zone_admin:  { bg: 'var(--color-progress-bg)', color: 'var(--color-progress)' },
  volunteer:   { bg: 'var(--color-bg)', color: 'var(--color-text-secondary)' },
}

export default function UserManagement() {
  const { users, zones, createUser, toggleUserActive, changeRole, deleteUser } = useUserStore()
  const [showForm, setShowForm]           = useState(false)
  const [filterRole, setFilterRole]       = useState('all')
  const [its, setIts]                     = useState('')
  const [name, setName]                   = useState('')
  const [phone, setPhone]                 = useState('')
  const [city, setCity]                   = useState('')
  const [role, setRole]                   = useState('volunteer')
  const [zoneId, setZoneId]               = useState('')
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedUser, setSelectedUser]   = useState(null)

  const needsZone = role === 'zone_admin' || role === 'volunteer'

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter((u) => u.role === filterRole)

  const handleCreate = () => {
    setError('')
    if (!its.trim() || its.trim().length !== 8) return setError('ITS number must be exactly 8 digits.')
    if (!name.trim()) return setError('Name is required.')
    if (needsZone && !zoneId) return setError('Please select a zone.')
    const result = createUser({ its: its.trim(), name: name.trim(), phone, city, role, zoneId: zoneId ? parseInt(zoneId) : null })
    if (result?.error) return setError(result.error)
    setIts(''); setName(''); setPhone(''); setCity(''); setRole('volunteer'); setZoneId('')
    setSuccess(true); setShowForm(false)
    setTimeout(() => setSuccess(false), 2500)
  }

  const handleDelete = (e, userId) => {
    e.stopPropagation()
    deleteUser(userId)
    setConfirmDelete(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{users.length} total users</p>
        <button onClick={() => setShowForm((s) => !s)} style={{
          height: 34, padding: '0 var(--space-md)', borderRadius: 'var(--radius-full)',
          border: 'none', background: 'var(--color-primary)', color: '#fff',
          fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add user'}
        </button>
      </div>

      {success && (
        <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
          ✅ User created successfully
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>New user</p>
          <div>
            <label style={labelStyle}>ITS Number <span style={{ color: 'var(--color-high)' }}>*</span></label>
            <input style={{ ...inputStyle, letterSpacing: '0.08em', fontSize: 'var(--text-md)' }}
              placeholder="8-digit ITS number" maxLength={8} value={its}
              onChange={(e) => setIts(e.target.value.replace(/\D/g, ''))} />
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 3 }}>This will be their login ID and password</p>
          </div>
          <div>
            <label style={labelStyle}>Full name <span style={{ color: 'var(--color-high)' }}>*</span></label>
            <input style={inputStyle} placeholder="e.g. Hussain Plumber" value={name} onChange={(e) => setName(e.target.value)} />
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 3 }}>Will display as "Hussain Bhai Plumber"</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: needsZone ? '1fr 1fr' : '1fr', gap: 'var(--space-sm)' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={role} onChange={(e) => { setRole(e.target.value); setZoneId('') }} style={{ ...inputStyle, cursor: 'pointer' }}>
                {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            {needsZone && (
              <div>
                <label style={labelStyle}>Zone</label>
                <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select…</option>
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
            )}
          </div>
          {error && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-high)' }}>⚠️ {error}</p>}
          <button onClick={handleCreate} style={{ width: '100%', height: 44, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>
            Create user →
          </button>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)', overflowX: 'auto', paddingBottom: 2 }}>
        {['all', 'zone_admin', 'volunteer', 'executive'].map((r) => {
          const isActive = filterRole === r
          return (
            <button key={r} onClick={() => setFilterRole(r)} style={{
              flexShrink: 0, height: 30, padding: '0 12px', borderRadius: 'var(--radius-full)',
              border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-xs)', fontWeight: isActive ? 600 : 400, cursor: 'pointer',
            }}>
              {r === 'all' ? 'All' : r === 'zone_admin' ? 'Zone admins' : r === 'volunteer' ? 'Volunteers' : 'Executive'}
            </button>
          )
        })}
      </div>

      {/* User list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {filteredUsers.map((u) => {
          const rc   = ROLE_COLORS[u.role] || ROLE_COLORS.volunteer
          const zone = zones.find((z) => z.id === u.zone_id)
          const isConfirmingDelete = confirmDelete === u.id

          return (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              style={{
                background: u.is_active ? 'var(--color-surface)' : 'var(--color-bg)',
                border: '0.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                opacity: u.is_active ? 1 : 0.55,
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: u.role !== 'super_admin' ? 'var(--space-sm)' : 0 }}>
                <Avatar user={u} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {displayName(u.name)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 'var(--radius-full)', background: rc.bg, color: rc.color }}>
                      {u.role.replace('_', ' ')}
                    </span>
                    {zone && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{zone.name}</span>}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ITS: {u.its}</span>
                  </div>
                </div>
                <span style={{ fontSize: 16, color: 'var(--color-text-secondary)', flexShrink: 0 }}>›</span>
              </div>

              {/* Action buttons — stopPropagation so card click doesn't fire */}
              {u.role !== 'super_admin' && (
                <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                  {u.role === 'volunteer' && (
                    <button onClick={(e) => { e.stopPropagation(); changeRole(u.id, 'zone_admin') }} style={{
                      height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-progress)', background: 'var(--color-progress-bg)',
                      fontSize: 10, fontWeight: 600, color: 'var(--color-progress)', cursor: 'pointer',
                    }}>↑ Make Zone Admin</button>
                  )}
                  {u.role === 'zone_admin' && (
                    <button onClick={(e) => { e.stopPropagation(); changeRole(u.id, 'volunteer') }} style={{
                      height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-pending)', background: 'var(--color-pending-bg)',
                      fontSize: 10, fontWeight: 600, color: 'var(--color-pending)', cursor: 'pointer',
                    }}>↓ Demote to Volunteer</button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleUserActive(u.id) }} style={{
                    height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                    fontSize: 10, fontWeight: 600,
                    color: u.is_active ? 'var(--color-progress)' : 'var(--color-primary)', cursor: 'pointer',
                  }}>
                    {u.is_active ? 'Disable' : 'Enable'}
                  </button>
                  {!isConfirmingDelete ? (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(u.id) }} style={{
                      height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-high)', background: 'var(--color-high-bg)',
                      fontSize: 10, fontWeight: 600, color: 'var(--color-high)', cursor: 'pointer',
                    }}>Delete</button>
                  ) : (
                    <>
                      <button onClick={(e) => handleDelete(e, u.id)} style={{
                        height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                        border: 'none', background: 'var(--color-high)',
                        fontSize: 10, fontWeight: 600, color: '#fff', cursor: 'pointer',
                      }}>Confirm delete</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null) }} style={{
                        height: 28, padding: '0 10px', borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                        fontSize: 10, fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer',
                      }}>Cancel</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import useUserStore from '../../store/userStore'
import { displayName } from '../../data/users'

export default function ZoneAssignment() {
  const { zones, getAllAdmins, assignAdminToZone, createZone } = useUserStore()
  const [newZoneName, setNewZoneName] = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [error, setError]             = useState('')

  const admins = getAllAdmins()

  const handleCreateZone = () => {
    if (!newZoneName.trim()) return setError('Zone name is required.')
    createZone(newZoneName.trim())
    setNewZoneName(''); setShowForm(false); setError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          {zones.length} zones · multiple admins per zone allowed
        </p>
        <button onClick={() => setShowForm((s) => !s)} style={{
          height: 34, padding: '0 var(--space-md)', borderRadius: 'var(--radius-full)',
          border: 'none', background: 'var(--color-primary)', color: '#fff',
          fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ New zone'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Create new zone</p>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Zone name</label>
            <input
              style={{ width: '100%', height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', padding: '0 var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}
              placeholder="e.g. Cold Storage"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
          </div>
          {error && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-high)' }}>⚠️ {error}</p>}
          <button onClick={handleCreateZone} style={{ width: '100%', height: 44, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>
            Create zone →
          </button>
        </div>
      )}

      {zones.map((zone) => {
        const zoneAdmins = admins.filter((a) => a.zone_id === zone.id)

        return (
          <div key={zone.id} style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', boxShadow: 'var(--shadow-card)' }}>

            {/* Zone name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: zoneAdmins.length > 0 ? 'var(--color-primary)' : 'var(--color-pending)', flexShrink: 0 }} />
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{zone.name}</p>
            </div>

            {/* Current admins */}
            {zoneAdmins.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
                {zoneAdmins.map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <Avatar user={a} size="sm" />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{displayName(a.name)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-pending)', marginBottom: 'var(--space-sm)' }}>No admin assigned</p>
            )}

            {/* Assign additional admin */}
            <select
              value=""
              onChange={(e) => { const id = parseInt(e.target.value); if (id) assignAdminToZone(id, zone.id) }}
              style={{ width: '100%', height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', padding: '0 var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            >
              <option value="">+ Assign another admin to this zone…</option>
              {admins.filter((a) => a.zone_id !== zone.id).map((a) => (
                <option key={a.id} value={a.id}>{displayName(a.name)}</option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}
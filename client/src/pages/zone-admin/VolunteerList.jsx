import { useState } from 'react'
import Avatar from '../../components/Avatar'
import ProgressBar from '../../components/ProgressBar'
import EmptyState from '../../components/EmptyState'
import UserProfileModal from '../../components/UserProfileModal'
import useAuthStore from '../../store/authStore'
import useUserStore from '../../store/userStore'
import useTaskStore from '../../store/taskStore'
import { displayName } from '../../data/users'

export default function VolunteerList() {
  const { user } = useAuthStore()
  const { getVolunteersByZone } = useUserStore()
  const { getVolunteerStats, getTasksByVolunteer } = useTaskStore()
  const [selectedUser, setSelectedUser] = useState(null)

  if (!user) return null

  const volunteers = getVolunteersByZone(user.zone_id)

  if (volunteers.length === 0) {
    return <EmptyState icon="👥" title="No volunteers yet" subtitle="Add volunteers from the Team tab" />
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {volunteers.map((v) => {
          const stats   = getVolunteerStats(v.id)
          const tasks   = getTasksByVolunteer(v.id)
          const pending = tasks.filter((t) => t.status === 'pending').length
          const inProg  = tasks.filter((t) => t.status === 'in_progress').length

          return (
            <div
              key={v.id}
              onClick={() => setSelectedUser(v)}
              style={{
                background: 'var(--color-surface)',
                border: '0.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                <Avatar user={v} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {displayName(v.name)}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 2 }}>
                    {pending > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-pending)' }}>{pending} pending</span>}
                    {inProg  > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-progress)' }}>{inProg} in progress</span>}
                    {pending === 0 && inProg === 0 && stats.total > 0 && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-done)', fontWeight: 600 }}>All done ✓</span>
                    )}
                    {stats.total === 0 && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>No tasks assigned</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {stats.pct}%
                  </p>
                  <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    {stats.done}/{stats.total}
                  </p>
                </div>
              </div>
              <ProgressBar pct={stats.pct} height={4} />
            </div>
          )
        })}
      </div>

      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  )
}
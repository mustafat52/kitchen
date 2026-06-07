export const users = [
  {
    id: 1,
    its: '20346916',
    name: 'Mustafa Hamid',
    initials: 'MH',
    phone: null,
    city: 'London',
    role: 'zone_admin',
    zone_id: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    its: '40481762',
    name: 'Aamir Hazari',
    initials: 'AH',
    phone: null,
    city: 'London',
    role: 'volunteer',
    zone_id: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
]

export const getUserById         = (id)     => users.find((u) => u.id === id)      || null
export const getUserByIts        = (its)    => users.find((u) => u.its === its)     || null
export const getVolunteersByZone = (zoneId) => users.filter((u) => u.role === 'volunteer'  && u.zone_id === zoneId)
export const getAdminsByZone     = (zoneId) => users.filter((u) => u.role === 'zone_admin' && u.zone_id === zoneId)
export const displayName         = (name)   => name?.trim() || ''
export const getAvatarColor      = (id)     => {
  const index = (id - 1) % 8
  return { bg: `var(--av-${index}-bg)`, fg: `var(--av-${index}-fg)` }
}
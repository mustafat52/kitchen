export const users = [
  // ── Zone Admin ──
  {
    id: 1,
    its: '10000001',
    name: 'Zone Admin',
    initials: 'ZA',
    phone: null,
    city: 'London',
    role: 'zone_admin',
    zone_id: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  // ── Volunteer ──
  {
    id: 2,
    its: '10000002',
    name: 'Volunteer',
    initials: 'VL',
    phone: null,
    city: 'London',
    role: 'volunteer',
    zone_id: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
]

export const getUserById      = (id)  => users.find((u) => u.id === id)   || null
export const getUserByIts     = (its) => users.find((u) => u.its === its)  || null
export const getVolunteersByZone = (zoneId) => users.filter((u) => u.role === 'volunteer'  && u.zone_id === zoneId)
export const getAdminsByZone     = (zoneId) => users.filter((u) => u.role === 'zone_admin' && u.zone_id === zoneId)

// Display name helper — just use name as-is (no "Bhai" prefix for generic names)
export const displayName = (name) => {
  if (!name) return ''
  return name.trim()
}

export const getAvatarColor = (id) => {
  const index = (id - 1) % 8
  return { bg: `var(--av-${index}-bg)`, fg: `var(--av-${index}-fg)` }
}

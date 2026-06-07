import { create } from 'zustand'
import { api } from '../lib/api'
import { getAvatarColor, displayName } from '../data/users'
import { zones as seedZones } from '../data/zones'
import { templates as seedTemplates } from '../data/templates'

// zones and templates stay as static data — they don't change at runtime
// Only the zone users list is fetched from the server

const useUserStore = create((set, get) => ({
  // Zone users (fetched from /api/users/zone)
  zoneUsers:  [],
  zones:      [...seedZones],
  templates:  [...seedTemplates],
  isLoading:  false,

  // ── Fetch zone users (called on zone-admin mount) ──
  fetchZoneUsers: async () => {
    set({ isLoading: true })
    try {
      const { users } = await api.get('/api/users/zone')
      set({ zoneUsers: users, isLoading: false })
    } catch (err) {
      console.error('fetchZoneUsers failed:', err.message)
      set({ isLoading: false })
    }
  },

  // Fetch templates from server
  fetchTemplates: async () => {
    try {
      const { templates } = await api.get('/api/users/templates')
      set({ templates })
    } catch (err) {
      console.error('fetchTemplates failed:', err.message)
      // Fall back to seed templates
    }
  },

  // ── Selectors ──
  getUserById: (id) => get().zoneUsers.find((u) => u.id === id) || null,

  getVolunteersByZone: (zoneId) =>
    get().zoneUsers.filter((u) => u.role === 'volunteer' && u.zone_id === zoneId && u.is_active),

  getAdminsByZone: (zoneId) =>
    get().zoneUsers.filter((u) => u.role === 'zone_admin' && u.zone_id === zoneId),

  getZoneById: (id) => get().zones.find((z) => z.id === id) || null,

  getActiveTemplates: () =>
    get().templates.filter((t) => t.is_active).sort((a, b) => a.display_order - b.display_order),

  getAvatarColor,
  displayName,
}))

export default useUserStore

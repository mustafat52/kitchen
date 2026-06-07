import { create } from 'zustand'
import { api } from '../lib/api'

const useAuthStore = create((set, get) => ({
  user:        JSON.parse(localStorage.getItem('kc_user') || 'null'),
  isLoading:   false,
  loginError:  '',

  // ITS login — password is same as ITS number
  loginWithIts: async (its) => {
    set({ isLoading: true, loginError: '' })
    try {
      const { user, token } = await api.post('/api/auth/login', {
        its:      its.trim(),
        password: its.trim(),  // ITS = password
      })
      localStorage.setItem('kc_token', token)
      localStorage.setItem('kc_user',  JSON.stringify(user))
      set({ user, isLoading: false, loginError: '' })
    } catch (err) {
      set({ isLoading: false, loginError: err.message })
    }
  },

  // Quick-access login by user id (uses same API — password = ITS)
  login: async (userId) => {
    set({ isLoading: true, loginError: '' })
    // We need the ITS for this user — passed in from the login page user list
    // The login page calls loginWithIts(user.its) directly for quick access
    set({ isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('kc_token')
    localStorage.removeItem('kc_user')
    set({ user: null, loginError: '' })
  },

  clearError: () => set({ loginError: '' }),

  // Re-hydrate user from server (call on app mount)
  refreshUser: async () => {
    try {
      const { user } = await api.get('/api/auth/me')
      localStorage.setItem('kc_user', JSON.stringify(user))
      set({ user })
    } catch {
      // Token expired — log out
      get().logout()
    }
  },
}))

export default useAuthStore

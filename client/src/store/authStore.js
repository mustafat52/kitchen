import { create } from 'zustand'
import { api } from '../lib/api'

const useAuthStore = create((set, get) => ({
  user:        JSON.parse(localStorage.getItem('kc_user') || 'null'),
  isLoading:   false,
  loginError:  '',

  // Returns { user, token } on success so LoginPage can show animation before redirect
  loginWithIts: async (its) => {
    set({ isLoading: true, loginError: '' })
    try {
      const { user, token } = await api.post('/api/auth/login', {
        its:      its.trim(),
        password: its.trim(),
      })
      localStorage.setItem('kc_token', token)
      localStorage.setItem('kc_user',  JSON.stringify(user))
      set({ user, isLoading: false, loginError: '' })
      return { user }   // ← return user so LoginPage can trigger animation
    } catch (err) {
      set({ isLoading: false, loginError: err.message })
      return null
    }
  },

  logout: () => {
    localStorage.removeItem('kc_token')
    localStorage.removeItem('kc_user')
    set({ user: null, loginError: '' })
  },

  clearError: () => set({ loginError: '' }),

  refreshUser: async () => {
    try {
      const { user } = await api.get('/api/auth/me')
      localStorage.setItem('kc_user', JSON.stringify(user))
      set({ user })
    } catch {
      get().logout()
    }
  },
}))

export default useAuthStore
import { create } from 'zustand'
import { api } from '../lib/api'

export const MOOD_OPTIONS = [
  { rating: 5, emoji: '😊', label: 'Very satisfied' },
  { rating: 4, emoji: '🙂', label: 'Satisfied'      },
  { rating: 3, emoji: '😐', label: 'Neutral'        },
  { rating: 2, emoji: '😔', label: 'Tired'          },
  { rating: 1, emoji: '😓', label: 'Overwhelmed'    },
]

const useMoodStore = create((set, get) => ({
  myMood:    null,   // { rating, day_number, submitted_at } | null
  summary:   null,   // { summary, total, avg } | null
  MOOD_OPTIONS,
  isLoading: false,

  // ── Volunteer: fetch own mood for today ──
  fetchMyMood: async (dayNumber = 1) => {
    try {
      const { mood } = await api.get(`/api/moods/my?day=${dayNumber}`)
      set({ myMood: mood })
    } catch (err) {
      console.error('fetchMyMood failed:', err.message)
    }
  },

  // ── Volunteer: check if submitted ──
  hasSubmitted: () => get().myMood !== null,

  getMyRating: () => get().myMood?.rating || null,

  // ── Volunteer: submit mood ──
  submitMood: async (rating, dayNumber = 1) => {
    set({ isLoading: true })
    try {
      const { mood } = await api.post('/api/moods', { rating, day_number: dayNumber })
      set({ myMood: mood, isLoading: false })
      return { ok: true }
    } catch (err) {
      set({ isLoading: false })
      return { ok: false, error: err.message }
    }
  },

  // ── Zone admin: fetch mood summary ──
  fetchSummary: async (dayNumber = 1) => {
    try {
      const data = await api.get(`/api/moods/summary?day=${dayNumber}`)
      set({ summary: data })
    } catch (err) {
      console.error('fetchSummary failed:', err.message)
    }
  },

  // Used by DailyReport — returns cached summary or empty
  getSummary: (dayNumber = 1) => {
    return get().summary || { summary: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0, avg: null }
  },
}))

export default useMoodStore

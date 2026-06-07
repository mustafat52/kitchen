// One entry per volunteer submission
// Rating: 1 = overwhelmed, 2 = tired, 3 = neutral, 4 = satisfied, 5 = very satisfied

export const moods = []

// ── Mood config — single source of truth for labels and emojis ──
export const MOOD_OPTIONS = [
  { rating: 5, emoji: '😊', label: 'Very satisfied' },
  { rating: 4, emoji: '🙂', label: 'Satisfied'      },
  { rating: 3, emoji: '😐', label: 'Neutral'        },
  { rating: 2, emoji: '😔', label: 'Tired'          },
  { rating: 1, emoji: '😓', label: 'Overwhelmed'    },
]

// ── Helpers ──

export const getMoodSummary = (dayNumber = 1) => {
  const dayMoods = moods.filter((m) => m.day_number === dayNumber)
  const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  dayMoods.forEach((m) => { summary[m.rating] += 1 })
  const total = dayMoods.length
  const avg = total > 0
    ? (dayMoods.reduce((sum, m) => sum + m.rating, 0) / total).toFixed(1)
    : null
  return { summary, total, avg }
}

export const hasSubmittedMood = (userId, dayNumber = 1) =>
  moods.some((m) => m.user_id === userId && m.day_number === dayNumber)

export let nextMoodId = 1

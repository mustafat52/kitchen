import { useState } from 'react'
import useMoodStore from '../../store/moodStore'
import useAuthStore from '../../store/authStore'

export default function MoodMeter() {
  const { user } = useAuthStore()
  const { MOOD_OPTIONS, hasSubmitted, getMyRating, submitMood } = useMoodStore()

  const [selected, setSelected]   = useState(null)
  const [submitted, setSubmitted] = useState(hasSubmitted(user?.id))
  const myRating = getMyRating(user?.id)

  const handleSelect = (rating) => {
    if (submitted) return
    setSelected(rating)
  }

  const handleSubmit = () => {
    if (!selected || !user) return
    submitMood(user.id, selected)
    setSubmitted(true)
  }

  const currentRating = submitted ? myRating : selected
  const currentMood   = MOOD_OPTIONS.find((m) => m.rating === currentRating)

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <p style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-xs)',
      }}>
        How do you feel about your khidmat today?
      </p>
      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-md)',
      }}>
        Your rating is private — only a summary is shared with leadership.
      </p>

      {/* Emoji buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-xs)',
        marginBottom: 'var(--space-md)',
      }}>
        {MOOD_OPTIONS.slice().reverse().map((opt) => {
          const isActive = currentRating === opt.rating
          return (
            <button
              key={opt.rating}
              onClick={() => handleSelect(opt.rating)}
              disabled={submitted}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 'var(--radius-md)',
                border: isActive
                  ? '2px solid var(--color-primary)'
                  : '1.5px solid var(--color-border)',
                background: isActive ? 'var(--color-primary-light)' : 'var(--color-bg)',
                fontSize: 24,
                cursor: submitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
              }}
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={isActive}
            >
              {opt.emoji}
            </button>
          )
        })}
      </div>

      {/* Selected label */}
      <div style={{ minHeight: 20, marginBottom: 'var(--space-md)', textAlign: 'center' }}>
        {currentMood && (
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-primary)' }}>
            {currentMood.emoji} {currentMood.label}
          </p>
        )}
      </div>

      {/* Submit / submitted state */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: selected ? 'var(--color-primary)' : 'var(--color-border)',
            color: selected ? '#fff' : 'var(--color-text-secondary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          Submit
        </button>
      ) : (
        <div style={{
          height: 44,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-xs)',
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            Submitted — Jazakallah Khair
          </span>
        </div>
      )}
    </div>
  )
}
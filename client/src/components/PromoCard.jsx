import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const STORAGE_KEY = 'ha_promo_last_shown'
const DURATION    = 5 // seconds

function hasShownToday() {
  const last = localStorage.getItem(STORAGE_KEY)
  if (!last) return false
  const lastDate = new Date(last).toDateString()
  const today    = new Date().toDateString()
  return lastDate === today
}

function markShownToday() {
  localStorage.setItem(STORAGE_KEY, new Date().toISOString())
}

export default function PromoCard() {
  const [visible,   setVisible]   = useState(false)
  const [countdown, setCountdown] = useState(DURATION)
  const [leaving,   setLeaving]   = useState(false)

  useEffect(() => {
    if (hasShownToday()) return
    // Show after 1.5s so dashboard has loaded
    const t = setTimeout(() => {
      setVisible(true)
      markShownToday()
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    if (countdown <= 0) {
      setLeaving(true)
      setTimeout(() => setVisible(false), 400)
      return
    }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [visible, countdown])

  if (!visible) return null

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.45)',
      padding: 'var(--space-xl)',
      opacity: leaving ? 0 : 1,
      transition: 'opacity 0.4s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 340,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-modal)',
        border: '0.5px solid var(--color-border)',
        overflow: 'hidden',
        transform: leaving ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.4s ease',
        animation: 'cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* Brown header strip */}
        <div style={{
          background: 'var(--color-primary)',
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Hussaini Automations
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
              Smart software for your business
            </p>
          </div>
          {/* Countdown ring */}
          <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
            <svg width="32" height="32" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"
                strokeDasharray={`${2 * Math.PI * 13}`}
                strokeDashoffset={`${2 * Math.PI * 13 * (1 - countdown / DURATION)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>{countdown}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-lg)' }}>

          {/* Headline */}
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-sans)', lineHeight: 1.3, marginBottom: 'var(--space-sm)' }}>
            You run the business.<br />
            <span style={{ color: 'var(--color-primary)' }}>We handle the tech. 🤝</span>
          </p>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
            We build custom software & AI systems that automate your daily workflows — without the complexity.
          </p>

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 'var(--space-md)' }}>
            {['Custom Software', 'AI Automations', 'Inventory & Management Systems', 'CRM & Business Tools'].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <a href="tel:+919550253852" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none',
            }}>
              📞 +91 9550253852
            </a>
            <a href="mailto:hussainiautomations72@gmail.com" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none',
            }}>
              ✉️ hussainiautomations72@gmail.com
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { transform: scale(0.88); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const GREETINGS = ['Welcome back', 'Marhaba', 'Ahlan wa Sahlan']
const AVATAR_COLORS = Array.from({ length: 8 }, (_, i) => ({
  bg: `var(--av-${i}-bg)`, fg: `var(--av-${i}-fg)`,
}))

function WelcomeOverlay({ user, onDone }) {
  const [phase, setPhase] = useState('in')
  const color     = AVATAR_COLORS[(user.id - 1) % 8]
  const firstName = user.name.split(' ')[0]
  const greeting  = GREETINGS[user.id % GREETINGS.length]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100)
    const t2 = setTimeout(() => setPhase('out'),  2200)
    const t3 = setTimeout(() => onDone(),          2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-primary)',
      opacity: phase === 'in' ? 0 : phase === 'out' ? 0 : 1,
      transform: phase === 'in' ? 'scale(1.04)' : phase === 'out' ? 'scale(0.96)' : 'scale(1)',
      transition: phase === 'in'
        ? 'opacity 0.35s ease, transform 0.35s ease'
        : 'opacity 0.5s ease, transform 0.5s ease',
      gap: 20,
    }}>
      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: 'absolute', width: 120, height: 120, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.25)',
            animation: `ripple 1.8s ease-out ${i * 0.4}s infinite`,
          }} />
        ))}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: color.bg, color: color.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700,
          boxShadow: '0 0 0 4px rgba(255,255,255,0.3)',
          zIndex: 1,
          animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
        }}>
          {user.initials}
        </div>
      </div>

      <div style={{ textAlign: 'center', animation: 'slideUp 0.4s ease 0.25s both' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6, letterSpacing: '0.08em' }}>
          {greeting}
        </p>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>
          {firstName} Bhai
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
          Ashara 1448H London
        </p>
      </div>

      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s both',
      }}>
        <span style={{ fontSize: 20, color: '#fff' }}>✓</span>
      </div>

      <style>{`
        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  const { loginWithIts, isLoading, loginError, clearError } = useAuthStore()
  const navigate = useNavigate()

  const [its, setIts]                = useState('')
  const [pendingUser, setPendingUser] = useState(null)

  // Called when animation finishes — NOW redirect
  const handleAnimDone = () => {
    redirectByRole(pendingUser.role, navigate)
  }

  const handleLogin = async () => {
    if (!its.trim()) return
    // Call API directly here so we control the flow
    const result = await loginWithIts(its, { returnUser: true })
    if (result?.user) {
      // Show animation FIRST, redirect only after it finishes
      setPendingUser(result.user)
    }
  }

  return (
    <>
      {pendingUser && <WelcomeOverlay user={pendingUser} onDone={handleAnimDone} />}

      <div className="fade-in" style={{
        minHeight: '100dvh',
        background: 'var(--color-bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 var(--space-lg) var(--space-xl)',
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto var(--space-md)',
            boxShadow: '0 8px 24px rgba(124,92,62,0.3)',
          }}>🧹</div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-sans)' }}>
            Kitchen Cleaning
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Task Manager · Ashara 1448H London
          </p>
        </div>

        {/* Login card */}
        <div style={{
          width: '100%', maxWidth: 380,
          background: 'var(--color-surface)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
        }}>
          <div>
            <label style={{
              fontSize: 'var(--text-xs)', fontWeight: 600,
              color: 'var(--color-text-secondary)',
              display: 'block', marginBottom: 8,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              ITS Number
            </label>
            <input
              type="number"
              placeholder="Enter your 8-digit ITS number"
              value={its}
              onChange={(e) => { setIts(e.target.value); clearError && clearError() }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
              style={{
                width: '100%', height: 56,
                borderRadius: 'var(--radius-md)',
                border: loginError
                  ? '1.5px solid var(--color-high)'
                  : '1.5px solid var(--color-border)',
                background: 'var(--color-bg)',
                padding: '0 var(--space-md)',
                fontSize: 22, letterSpacing: '0.2em',
                color: 'var(--color-text-primary)',
                transition: 'border-color 0.2s',
              }}
            />
            {loginError && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-high)', marginTop: 6 }}>
                ⚠️ {loginError}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading || !its.trim()}
            style={{
              width: '100%', height: 52,
              borderRadius: 'var(--radius-md)', border: 'none',
              background: its.trim() ? 'var(--color-primary)' : 'var(--color-border)',
              color: its.trim() ? '#fff' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-md)', fontWeight: 600,
              cursor: its.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
              boxShadow: its.trim() ? '0 4px 12px rgba(124,92,62,0.3)' : 'none',
            }}
          >
            {isLoading ? '⏳ Signing in…' : 'Sign in →'}
          </button>
        </div>
      </div>
    </>
  )
}

export function redirectByRole(role, navigate) {
  const routes = { zone_admin: '/zone-admin', volunteer: '/volunteer' }
  navigate(routes[role] || '/login', { replace: true })
}
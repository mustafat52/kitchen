import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { users, displayName } from '../../data/users'

const AVATAR_COLORS = Array.from({ length: 8 }, (_, i) => ({
  bg: `var(--av-${i}-bg)`, fg: `var(--av-${i}-fg)`,
}))

const GREETINGS = ['Welcome back', 'Marhaba', 'Ahlan wa Sahlan']

// ── Welcome overlay shown after login ──
function WelcomeOverlay({ user, onDone }) {
  const [phase, setPhase] = useState('in')
  const color    = AVATAR_COLORS[(user.id - 1) % 8]
  const firstName = user.name.split(' ')[0]
  const greeting  = GREETINGS[user.id % GREETINGS.length]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100)
    const t2 = setTimeout(() => setPhase('out'),  2000)
    const t3 = setTimeout(() => onDone(),          2600)
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
        : 'opacity 0.45s ease, transform 0.45s ease',
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
          background: color.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: color.fg,
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
          {firstName}
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
          100% { transform: scale(1.8); opacity: 0;   }
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
  const { loginWithIts, user, isLoading, loginError, clearError } = useAuthStore()
  const navigate = useNavigate()

  const [its, setIts]               = useState('')
  const [tab, setTab]               = useState('its')
  const [pendingUser, setPendingUser] = useState(null)

  const handleAnimDone = () => {
    if (pendingUser) redirectByRole(pendingUser.role, navigate)
  }

  useEffect(() => {
    if (user && !pendingUser) redirectByRole(user.role, navigate)
  }, [user])

  useEffect(() => {
    if (user && !pendingUser) setPendingUser(user)
  }, [user])

  const handleItsLogin = () => {
    if (!its.trim()) return
    loginWithIts(its)
  }

  const handleQuickLogin = (userIts) => {
    loginWithIts(userIts)
  }

  return (
    <>
      {pendingUser && <WelcomeOverlay user={pendingUser} onDone={handleAnimDone} />}

      <div className="fade-in" style={{
        minHeight: '100dvh',
        background: 'var(--color-bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 var(--space-lg) var(--space-xl)',
        overflowY: 'auto',
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0 var(--space-lg)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto var(--space-md)',
            boxShadow: '0 8px 24px rgba(124,92,62,0.3)',
          }}>🧹</div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-sans)' }}>
            Kitchen Cleaning
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Task Manager · Ashara 1448H London
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Tab toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'var(--color-surface)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 3, marginBottom: 'var(--space-lg)',
          }}>
            {[['its', '🔑 ITS Login'], ['quick', '👤 Quick Access']].map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); clearError && clearError() }} style={{
                height: 38, borderRadius: 'var(--radius-sm)', border: 'none',
                background: tab === t ? 'var(--color-primary)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)', fontWeight: tab === t ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          {/* ── ITS Login ── */}
          {tab === 'its' && (
            <div style={{
              background: 'var(--color-surface)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
            }}>
              <div>
                <label style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  display: 'block', marginBottom: 6,
                }}>
                  ITS Number
                </label>
                <input
                  type="number"
                  placeholder="Enter your 8-digit ITS number"
                  value={its}
                  onChange={(e) => { setIts(e.target.value); clearError && clearError() }}
                  onKeyDown={(e) => e.key === 'Enter' && handleItsLogin()}
                  style={{
                    width: '100%', height: 52,
                    borderRadius: 'var(--radius-md)',
                    border: loginError
                      ? '1.5px solid var(--color-high)'
                      : '1.5px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    padding: '0 var(--space-md)',
                    fontSize: 20, letterSpacing: '0.15em',
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
                onClick={handleItsLogin}
                disabled={isLoading || !its.trim()}
                style={{
                  width: '100%', height: 50,
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
          )}

          {/* ── Quick Access — flat list, no role labels ── */}
          {tab === 'quick' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {users.map((u) => {
                const color = AVATAR_COLORS[(u.id - 1) % 8]
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.its)}
                    disabled={isLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                      background: 'var(--color-surface)',
                      border: '0.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-md)', cursor: 'pointer',
                      textAlign: 'left', width: '100%', minHeight: 64,
                      boxShadow: 'var(--shadow-card)',
                      transition: 'transform 0.15s',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e)   => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%',
                      background: color.bg, color: color.fg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, flexShrink: 0,
                    }}>
                      {u.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {displayName(u.name)}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        ITS: {u.its}
                      </p>
                    </div>
                    <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>›</span>
                  </button>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export function redirectByRole(role, navigate) {
  const routes = {
    zone_admin: '/zone-admin',
    volunteer:  '/volunteer',
  }
  navigate(routes[role] || '/login', { replace: true })
}
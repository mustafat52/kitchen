import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import ProgressBar from '../../components/ProgressBar'
import ZoneProgressCard from './ZoneProgressCard'
import LiveTaskBoard from './LiveTaskBoard'
import MoodSummary from './MoodSummary'
import useTaskStore from '../../store/taskStore'
import useUserStore from '../../store/userStore'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'tasks',    label: 'Tasks',    icon: '📋' },
  { id: 'mood',     label: 'Mood',     icon: '😊' },
  { id: 'profile',  label: 'Profile',  icon: '👤' },
]

export default function ExecutivePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()
  const { getOverallStats } = useTaskStore()
  const { zones } = useUserStore()

  const overall = getOverallStats()

  const handleTabChange = (tab) => {
    if (tab === 'profile') { navigate('/profile'); return }
    setActiveTab(tab)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
      <TopBar title="Nazafat" subtitle="Executive View · Ashara 1448H" />
      <div className="page-content">
        <div className="scroll-area fade-in">

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Overall hero */}
              <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', color: '#fff' }}>
                <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Overall completion · Day 1</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '8px 0 var(--space-sm)' }}>
                  <p style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{overall.pct}%</p>
                  <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, textAlign: 'right' }}>
                    {overall.done} done<br />{overall.total} total
                  </p>
                </div>
                <ProgressBar pct={overall.pct} color="rgba(255,255,255,0.9)" />
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
                {[
                  { label: 'Pending',     value: overall.pending,    color: 'var(--color-pending)'  },
                  { label: 'In progress', value: overall.inProgress, color: 'var(--color-progress)' },
                  { label: 'Done',        value: overall.done,       color: 'var(--color-done)'     },
                ].map((s) => (
                  <div key={s.label} style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md) var(--space-sm)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
                    <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Zone breakdown */}
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                By zone
              </p>
              {zones.map((zone) => <ZoneProgressCard key={zone.id} zone={zone} />)}
            </div>
          )}

          {activeTab === 'tasks' && <LiveTaskBoard />}
          {activeTab === 'mood'  && <MoodSummary />}
        </div>
      </div>
      <BottomNav tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
    </div>
  )
}
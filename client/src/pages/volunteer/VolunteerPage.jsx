import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import TaskCard from '../../components/TaskCard'
import ProgressBar from '../../components/ProgressBar'
import EmptyState from '../../components/EmptyState'
import MoodMeter from './MoodMeter'
import TaskHistory from './TaskHistory'
import useAuthStore from '../../store/authStore'
import useTaskStore from '../../store/taskStore'
import useUserStore from '../../store/userStore'
import { displayName } from '../../data/users'

const TABS = [
  { id: 'tasks',   label: 'My Tasks', icon: '✅' },
  { id: 'history', label: 'History',  icon: '📅' },
  { id: 'mood',    label: 'My Mood',  icon: '😊' },
  { id: 'profile', label: 'Profile',  icon: '👤' },
]

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function VolunteerPage() {
  const [activeTab, setActiveTab] = useState('tasks')
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getTasksByVolunteer, getVolunteerStats, fetchTasks, isLoading } = useTaskStore()
  const { getZoneById } = useUserStore()

  if (!user) return null

  useEffect(() => { fetchTasks() }, [user?.id])

  const handleTabChange = (tab) => {
    if (tab === 'profile') { navigate('/profile'); return }
    setActiveTab(tab)
  }

  const myTasks = getTasksByVolunteer(user.id)
    .filter((t) => t.day_number === 1)
    .slice()
    .sort((a, b) => {
      const statusOrder = { pending: 0, in_progress: 1, done: 2 }
      if (statusOrder[a.status] !== statusOrder[b.status])
        return statusOrder[a.status] - statusOrder[b.status]
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })

  const stats = getVolunteerStats(user.id)
  const zone  = getZoneById(user.zone_id)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
      <TopBar subtitle="Ashara 1448H London" />

      <div className="page-content">

        {activeTab === 'tasks' && (
          <div className="scroll-area fade-in">
            {/* Hero */}
            <div style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              color: '#fff',
            }}>
              <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginBottom: 4 }}>
                {zone ? zone.name : 'CMZ'} · Day 1
              </p>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-sans)' }}>
                Marhaba, {displayName(user.name)} 👋
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>
                  {stats.done} of {stats.total} tasks done
                </span>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{stats.pct}%</span>
              </div>
              <ProgressBar pct={stats.pct} color="rgba(255,255,255,0.9)" />
            </div>

            {/* Task list */}
            <div>
              <p style={{
                fontSize: 'var(--text-xs)', fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 'var(--space-sm)',
              }}>
                Today's tasks
              </p>

              {myTasks.length === 0 ? (
                <EmptyState icon="🌙" title="No tasks yet" subtitle="Your zone admin will assign tasks soon" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {myTasks.map((task) => (
                    <TaskCard key={task.id} task={task} showActions={false} />
                  ))}
                </div>
              )}
            </div>

            {/* Info notice */}
            <div style={{
              background: 'var(--color-bg)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                When you finish a task, let your zone admin know verbally. They will mark it done on the app.
                Use the <strong>History</strong> tab to update tasks from previous days.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="scroll-area fade-in">
            <TaskHistory />
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="scroll-area fade-in">
            <MoodMeter />
          </div>
        )}
      </div>

      <BottomNav tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
    </div>
  )
}

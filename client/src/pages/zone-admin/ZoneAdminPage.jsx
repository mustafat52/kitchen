import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import PromoCard from '../../components/PromoCard'
import BottomNav from '../../components/BottomNav'
import TaskBoard from './TaskBoard'
import CreateTaskForm from './CreateTaskForm'
import VolunteerList from './VolunteerList'
import DailyReport from './DailyReport'
import useAuthStore from '../../store/authStore'
import useTaskStore  from '../../store/taskStore'
import useUserStore from '../../store/userStore'

const TABS = [
  { id: 'tasks',      label: 'Tasks',      icon: '📋' },
  { id: 'assign',     label: 'Assign',     icon: '➕' },
  { id: 'volunteers', label: 'Volunteer',  icon: '👥' },
  { id: 'report',     label: 'Report',     icon: '📄' },
  { id: 'profile',    label: 'Profile',    icon: '👤' },
]

export default function ZoneAdminPage() {
  const [activeTab, setActiveTab] = useState('tasks')
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const { getZoneById, fetchZoneUsers, fetchTemplates } = useUserStore()
  const { fetchTasks } = useTaskStore()

  if (!user) return null

  useEffect(() => {
    fetchTasks()
    fetchZoneUsers()
    fetchTemplates()
  }, [user?.id])

  const zone = getZoneById(user.zone_id)

  const handleTabChange = (tab) => {
    if (tab === 'profile') { navigate('/profile'); return }
    setActiveTab(tab)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
      <TopBar title={zone ? zone.name : 'CMZ'} subtitle="Zone Admin · Ashara 1448H London" />
      <div className="page-content">
        <div className="scroll-area fade-in">
          {activeTab === 'tasks'      && <TaskBoard />}
          {activeTab === 'assign'     && <CreateTaskForm onCreated={() => setActiveTab('tasks')} />}
          {activeTab === 'volunteers' && <VolunteerList />}
          {activeTab === 'report'     && <DailyReport />}
        </div>
      </div>
      <BottomNav tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
      <PromoCard />
    </div>
  )
}
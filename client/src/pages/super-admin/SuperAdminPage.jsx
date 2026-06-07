import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import UserManagement from './UserManagement'
import ZoneAssignment from './ZoneAssignment'
import RecurringTemplates from './RecurringTemplates'
import LiveTaskBoard from '../executive/LiveTaskBoard'

const TABS = [
  { id: 'tasks',     label: 'All Tasks',  icon: '📋' },
  { id: 'users',     label: 'Users',      icon: '👥' },
  { id: 'zones',     label: 'Zones',      icon: '🗂️' },
  { id: 'templates', label: 'Templates',  icon: '🔁' },
  { id: 'profile',   label: 'Profile',    icon: '👤' },
]

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState('tasks')
  const navigate = useNavigate()

  const handleTabChange = (tab) => {
    if (tab === 'profile') { navigate('/profile'); return }
    setActiveTab(tab)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
      <TopBar title="Nazafat" subtitle="Super Admin · Ashara 1448H" />
      <div className="page-content">
        <div className="scroll-area fade-in">
          {activeTab === 'tasks'     && <LiveTaskBoard />}
          {activeTab === 'users'     && <UserManagement />}
          {activeTab === 'zones'     && <ZoneAssignment />}
          {activeTab === 'templates' && <RecurringTemplates />}
        </div>
      </div>
      <BottomNav tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
    </div>
  )
}
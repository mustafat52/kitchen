import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

import LoginPage, { redirectByRole } from './pages/login/LoginPage'
import VolunteerPage  from './pages/volunteer/VolunteerPage'
import ZoneAdminPage  from './pages/zone-admin/ZoneAdminPage'
import ProfilePage    from './pages/profile/ProfilePage'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()
  const navigate  = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      redirectByRole(user.role, navigate)
    }
  }, [user, allowedRoles, navigate])

  if (!user) return null
  if (allowedRoles && !allowedRoles.includes(user.role)) return null
  return children
}

function AppRoutes() {
  const { user, refreshUser } = useAuthStore()

  // On app mount, verify token is still valid
  useEffect(() => {
    if (user) refreshUser()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/volunteer"  element={<ProtectedRoute allowedRoles={['volunteer']} ><VolunteerPage /></ProtectedRoute>} />
      <Route path="/zone-admin" element={<ProtectedRoute allowedRoles={['zone_admin']}><ZoneAdminPage /></ProtectedRoute>} />

      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['volunteer','zone_admin']}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        user
          ? <Navigate to={user.role === 'volunteer' ? '/volunteer' : '/zone-admin'} replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

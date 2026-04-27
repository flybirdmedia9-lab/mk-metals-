import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { canAccess } from '../utils/roles.js'

export default function RoleRoute({ minRole = 'viewer', children }) {
  const { admin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  if (!canAccess(admin.role, minRole)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

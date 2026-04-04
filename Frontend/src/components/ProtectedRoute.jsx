import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

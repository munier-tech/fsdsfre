import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useAuthStore from './store/authStore'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import UserManagement from './pages/UserManagement'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <DashboardLayout>{children}</DashboardLayout>
}

// Admin Only Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return <DashboardLayout>{children}</DashboardLayout>
}

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setIsLoading(false)
    }
    
    initAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Al-Qayim Management System...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        }
      />

      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Teachers Management</h2>
                <p className="text-gray-600">This page will contain teacher management functionality.</p>
                <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🚧 Under Development - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Classes Management</h2>
                <p className="text-gray-600">This page will contain class management functionality.</p>
                <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🚧 Under Development - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance Management</h2>
                <p className="text-gray-600">This page will contain attendance tracking functionality.</p>
                <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🚧 Under Development - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Finance Management</h2>
                <p className="text-gray-600">This page will contain financial management functionality.</p>
                <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🚧 Under Development - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
                <p className="text-gray-600">This page will contain system settings and preferences.</p>
                <div className="mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🚧 Under Development - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  )
}

export default App

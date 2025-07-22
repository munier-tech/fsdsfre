import { create } from 'zustand'
import axios from '../config/axios'
import toast from 'react-hot-toast'

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const response = await axios.post('/auth/login', credentials)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
      
      toast.success('Login successful!')
      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      set({ isLoading: false })
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  },

  signup: async (userData) => {
    set({ isLoading: true })
    try {
      const response = await axios.post('/auth/signUp', userData)
      const { user, token } = response.data
      
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        set({ isLoading: false })
      }
      
      toast.success('Account created successfully!')
      return { success: true, user }
    } catch (error) {
      console.error('Signup error:', error)
      set({ isLoading: false })
      return { success: false, message: error.response?.data?.message || 'Signup failed' }
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
      toast.success('Logged out successfully!')
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }

    try {
      const response = await axios.get('/auth/WhoAmI')
      const { user } = response.data
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axios.post('/auth/changePassword', passwordData)
      toast.success('Password changed successfully!')
      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      const message = error.response?.data?.message || 'Failed to change password'
      toast.error(message)
      return { success: false, message }
    }
  },

  clearAuth: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    })
  }
}))

export default useAuthStore
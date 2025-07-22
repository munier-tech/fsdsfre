import { create } from 'zustand'
import axios from '../config/axios'
import toast from 'react-hot-toast'

const useStudentsStore = create((set, get) => ({
  // State
  students: [],
  selectedStudent: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  // Actions
  fetchStudents: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/students/getAll')
      set({ 
        students: response.data.students || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to fetch students')
      set({ loading: false })
    }
  },

  fetchStudentById: async (id) => {
    set({ loading: true })
    try {
      const response = await axios.get(`/students/getId/${id}`)
      set({ 
        selectedStudent: response.data.student,
        loading: false 
      })
      return { success: true, student: response.data.student }
    } catch (error) {
      console.error('Error fetching student:', error)
      toast.error('Failed to fetch student details')
      set({ loading: false })
      return { success: false, message: error.response?.data?.message }
    }
  },

  createStudent: async (studentData) => {
    set({ creating: true })
    try {
      const response = await axios.post('/students/create', studentData)
      
      set(state => ({
        students: [...state.students, response.data.student],
        creating: false
      }))
      
      toast.success('Student created successfully')
      return { success: true, student: response.data.student }
    } catch (error) {
      console.error('Error creating student:', error)
      const message = error.response?.data?.message || 'Failed to create student'
      toast.error(message)
      set({ creating: false })
      return { success: false, message }
    }
  },

  updateStudent: async (id, studentData) => {
    set({ updating: true })
    try {
      const response = await axios.put(`/students/update/${id}`, studentData)
      const updatedStudent = response.data.student
      
      set(state => ({
        students: state.students.map(student => 
          student._id === id ? updatedStudent : student
        ),
        selectedStudent: state.selectedStudent?._id === id ? updatedStudent : state.selectedStudent,
        updating: false
      }))
      
      toast.success('Student updated successfully')
      return { success: true, student: updatedStudent }
    } catch (error) {
      console.error('Error updating student:', error)
      const message = error.response?.data?.message || 'Failed to update student'
      toast.error(message)
      set({ updating: false })
      return { success: false, message }
    }
  },

  deleteStudent: async (id) => {
    set({ deleting: true })
    try {
      await axios.delete(`/students/delete/${id}`)
      
      set(state => ({
        students: state.students.filter(student => student._id !== id),
        selectedStudent: state.selectedStudent?._id === id ? null : state.selectedStudent,
        deleting: false
      }))
      
      toast.success('Student deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Error deleting student:', error)
      const message = error.response?.data?.message || 'Failed to delete student'
      toast.error(message)
      set({ deleting: false })
      return { success: false, message }
    }
  },

  assignStudentToClass: async (studentId, classId) => {
    try {
      const response = await axios.post(`/students/${studentId}/${classId}`)
      
      set(state => ({
        students: state.students.map(student =>
          student._id === studentId 
            ? { ...student, class: response.data.class }
            : student
        )
      }))
      
      toast.success('Student assigned to class successfully')
      return { success: true }
    } catch (error) {
      console.error('Error assigning student to class:', error)
      const message = error.response?.data?.message || 'Failed to assign student to class'
      toast.error(message)
      return { success: false, message }
    }
  },

  trackFeePayment: async (id, feeData) => {
    try {
      const response = await axios.patch(`/students/track-fee/${id}`, feeData)
      
      set(state => ({
        students: state.students.map(student =>
          student._id === id 
            ? { ...student, fee: response.data.fee }
            : student
        )
      }))
      
      toast.success('Fee payment tracked successfully')
      return { success: true }
    } catch (error) {
      console.error('Error tracking fee payment:', error)
      const message = error.response?.data?.message || 'Failed to track fee payment'
      toast.error(message)
      return { success: false, message }
    }
  },

  getFeeStatus: async (id) => {
    try {
      const response = await axios.get(`/students/fee-status/${id}`)
      return { success: true, feeStatus: response.data.feeStatus }
    } catch (error) {
      console.error('Error getting fee status:', error)
      return { success: false, message: error.response?.data?.message }
    }
  },

  updateFeeInfo: async (id, feeData) => {
    try {
      const response = await axios.patch(`/students/update-fee/${id}`, feeData)
      
      set(state => ({
        students: state.students.map(student =>
          student._id === id 
            ? { ...student, fee: response.data.fee }
            : student
        )
      }))
      
      toast.success('Fee information updated successfully')
      return { success: true }
    } catch (error) {
      console.error('Error updating fee info:', error)
      const message = error.response?.data?.message || 'Failed to update fee information'
      toast.error(message)
      return { success: false, message }
    }
  },

  resetFee: async (id) => {
    try {
      await axios.delete(`/students/reset-fee/${id}`)
      
      set(state => ({
        students: state.students.map(student =>
          student._id === id 
            ? { ...student, fee: { total: 0, paid: 0 } }
            : student
        )
      }))
      
      toast.success('Fee reset successfully')
      return { success: true }
    } catch (error) {
      console.error('Error resetting fee:', error)
      const message = error.response?.data?.message || 'Failed to reset fee'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Utility functions
  clearSelectedStudent: () => set({ selectedStudent: null }),
  
  searchStudents: (query) => {
    const { students } = get()
    return students.filter(student =>
      student.fullname?.toLowerCase().includes(query.toLowerCase()) ||
      student.class?.name?.toLowerCase().includes(query.toLowerCase()) ||
      student.motherNumber?.includes(query) ||
      student.fatherNumber?.includes(query)
    )
  },

  getStudentsByClass: (classId) => {
    const { students } = get()
    return students.filter(student => student.class?._id === classId)
  },

  getStudentsByGender: (gender) => {
    const { students } = get()
    return students.filter(student => student.gender === gender)
  },

  getStudentsWithPendingFees: () => {
    const { students } = get()
    return students.filter(student => (student.fee?.paid || 0) < (student.fee?.total || 0))
  },

  getTotalStudents: () => {
    const { students } = get()
    return students.length
  },

  getStudentsStatistics: () => {
    const { students } = get()
    return {
      total: students.length,
      male: students.filter(s => s.gender === 'male').length,
      female: students.filter(s => s.gender === 'female').length,
      withFees: students.filter(s => (s.fee?.total || 0) > 0).length,
      pendingFees: students.filter(s => (s.fee?.paid || 0) < (s.fee?.total || 0)).length,
    }
  }
}))

export default useStudentsStore
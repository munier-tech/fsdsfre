import { create } from 'zustand'
import axios from '../config/axios'
import toast from 'react-hot-toast'

const useTeachersStore = create((set, get) => ({
  // State
  teachers: [],
  selectedTeacher: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  // Actions
  fetchTeachers: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/teachers/getAll')
      set({ 
        teachers: response.data.teachers || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching teachers:', error)
      toast.error('Failed to fetch teachers')
      set({ loading: false })
    }
  },

  fetchTeacherById: async (id) => {
    set({ loading: true })
    try {
      const response = await axios.get(`/teachers/getById/${id}`)
      set({ 
        selectedTeacher: response.data.teacher,
        loading: false 
      })
      return { success: true, teacher: response.data.teacher }
    } catch (error) {
      console.error('Error fetching teacher:', error)
      toast.error('Failed to fetch teacher details')
      set({ loading: false })
      return { success: false, message: error.response?.data?.message }
    }
  },

  createTeacher: async (teacherData) => {
    set({ creating: true })
    try {
      const response = await axios.post('/teachers/create', teacherData)
      
      set(state => ({
        teachers: [...state.teachers, response.data.teacher],
        creating: false
      }))
      
      toast.success('Teacher created successfully')
      return { success: true, teacher: response.data.teacher }
    } catch (error) {
      console.error('Error creating teacher:', error)
      const message = error.response?.data?.message || 'Failed to create teacher'
      toast.error(message)
      set({ creating: false })
      return { success: false, message }
    }
  },

  updateTeacher: async (id, teacherData) => {
    set({ updating: true })
    try {
      const response = await axios.put(`/teachers/update/${id}`, teacherData)
      const updatedTeacher = response.data.teacher
      
      set(state => ({
        teachers: state.teachers.map(teacher => 
          teacher._id === id ? updatedTeacher : teacher
        ),
        selectedTeacher: state.selectedTeacher?._id === id ? updatedTeacher : state.selectedTeacher,
        updating: false
      }))
      
      toast.success('Teacher updated successfully')
      return { success: true, teacher: updatedTeacher }
    } catch (error) {
      console.error('Error updating teacher:', error)
      const message = error.response?.data?.message || 'Failed to update teacher'
      toast.error(message)
      set({ updating: false })
      return { success: false, message }
    }
  },

  deleteTeacher: async (id) => {
    set({ deleting: true })
    try {
      await axios.delete(`/teachers/delete/${id}`)
      
      set(state => ({
        teachers: state.teachers.filter(teacher => teacher._id !== id),
        selectedTeacher: state.selectedTeacher?._id === id ? null : state.selectedTeacher,
        deleting: false
      }))
      
      toast.success('Teacher deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Error deleting teacher:', error)
      const message = error.response?.data?.message || 'Failed to delete teacher'
      toast.error(message)
      set({ deleting: false })
      return { success: false, message }
    }
  },

  // Utility functions
  clearSelectedTeacher: () => set({ selectedTeacher: null }),
  
  searchTeachers: (query) => {
    const { teachers } = get()
    return teachers.filter(teacher =>
      teacher.fullname?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.phone?.includes(query)
    )
  },

  getTeachersBySubject: (subject) => {
    const { teachers } = get()
    return teachers.filter(teacher => teacher.subject === subject)
  },

  getTotalTeachers: () => {
    const { teachers } = get()
    return teachers.length
  },

  getTeachersStatistics: () => {
    const { teachers } = get()
    const subjects = [...new Set(teachers.map(t => t.subject).filter(Boolean))]
    
    return {
      total: teachers.length,
      subjects: subjects.length,
      active: teachers.filter(t => t.isActive !== false).length,
      inactive: teachers.filter(t => t.isActive === false).length,
    }
  }
}))

export default useTeachersStore
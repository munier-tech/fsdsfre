import React, { useState, useEffect } from 'react'
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  RefreshCw,
  Plus,
  Activity,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useStudentsStore from '../store/studentsStore'
import useTeachersStore from '../store/teachersStore'
import useClassesStore from '../store/classesStore'
import useAttendanceStore from '../store/attendanceStore'

function Dashboard() {
  const { user } = useAuthStore()
  const { students, fetchStudents, loading: studentsLoading } = useStudentsStore()
  const { teachers, fetchTeachers, loading: teachersLoading } = useTeachersStore()
  const { classes, fetchClasses, loading: classesLoading } = useClassesStore()
  const { attendance, fetchAttendance, loading: attendanceLoading } = useAttendanceStore()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAllData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchStudents(),
        fetchTeachers(),
        fetchClasses(),
        fetchAttendance()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => (
    <div className={`card p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${color === 'border-l-4 border-blue-500' ? 'bg-blue-100' : 
                         color === 'border-l-4 border-green-500' ? 'bg-green-100' :
                         color === 'border-l-4 border-purple-500' ? 'bg-purple-100' :
                         'bg-orange-100'}`}>
          <Icon className={`w-8 h-8 ${color === 'border-l-4 border-blue-500' ? 'text-blue-600' : 
                           color === 'border-l-4 border-green-500' ? 'text-green-600' :
                           color === 'border-l-4 border-purple-500' ? 'text-purple-600' :
                           'text-orange-600'}`} />
        </div>
      </div>
    </div>
  )

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="card p-6 hover:shadow-lg transition-all duration-200 text-left w-full group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  )

  const RecentActivityItem = ({ icon: Icon, title, description, time, color }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-full ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at Al-Qayim Management System today.
          </p>
        </div>
        <button
          onClick={fetchAllData}
          disabled={isRefreshing}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={Users}
          color="border-l-4 border-blue-500"
          trend="+12% from last month"
          loading={studentsLoading}
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={GraduationCap}
          color="border-l-4 border-green-500"
          trend="+5% from last month"
          loading={teachersLoading}
        />
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon={BookOpen}
          color="border-l-4 border-purple-500"
          trend="+8% from last month"
          loading={classesLoading}
        />
        <StatCard
          title="Attendance Records"
          value={attendance.length}
          icon={Calendar}
          color="border-l-4 border-orange-500"
          trend="+15% from last month"
          loading={attendanceLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">System Online</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionCard
                title="Add New Student"
                description="Register a new student"
                icon={Plus}
                color="bg-blue-500"
                onClick={() => {/* Navigate to add student */}}
              />
              <QuickActionCard
                title="Add New Teacher"
                description="Register a new teacher"
                icon={Plus}
                color="bg-green-500"
                onClick={() => {/* Navigate to add teacher */}}
              />
              <QuickActionCard
                title="Create Class"
                description="Set up a new class"
                icon={Plus}
                color="bg-purple-500"
                onClick={() => {/* Navigate to create class */}}
              />
              <QuickActionCard
                title="Mark Attendance"
                description="Record today's attendance"
                icon={Calendar}
                color="bg-orange-500"
                onClick={() => {/* Navigate to attendance */}}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1">
            <RecentActivityItem
              icon={Users}
              title="New Student Registered"
              description="Ahmed Ali joined Class 10A"
              time="2 hours ago"
              color="bg-blue-500"
            />
            <RecentActivityItem
              icon={Calendar}
              title="Attendance Marked"
              description="Class 10A - 25/30 present"
              time="3 hours ago"
              color="bg-green-500"
            />
            <RecentActivityItem
              icon={BookOpen}
              title="New Class Created"
              description="Mathematics Grade 9"
              time="5 hours ago"
              color="bg-purple-500"
            />
            <RecentActivityItem
              icon={GraduationCap}
              title="Teacher Profile Updated"
              description="Mrs. Fatima updated her profile"
              time="1 day ago"
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">System Health</h3>
            <p className="text-green-600 text-sm">All services operational</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className="text-green-600 text-sm">Excellent response time</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Database</h3>
            <p className="text-green-600 text-sm">Healthy & optimized</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
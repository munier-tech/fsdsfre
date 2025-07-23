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
  Clock,
  UserPlus,
  BookMarked,
  CalendarCheck,
  Server,
  Gauge,
  Database
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useStudentsStore from '../store/studentsStore'
import useTeachersStore from '../store/teachersStore'
import useClassesStore from '../store/classesStore'
import useAttendanceStore from '../store/attendanceStore'

// Qaababka kaadhka
const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => {
  const colorMap = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-100',
      text: 'text-blue-600'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-100',
      text: 'text-green-600'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-100',
      text: 'text-purple-600'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-100',
      text: 'text-orange-600'
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${colorMap[color].border}`}>
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
        <div className={`p-3 rounded-lg ${colorMap[color].bg}`}>
          <Icon className={`w-6 h-6 ${colorMap[color].text}`} />
        </div>
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 text-left w-full group border border-gray-100"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colorMap[color]} group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  )
}

const RecentActivityItem = ({ icon: Icon, title, description, time, color }) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-full ${colorMap[color]} mt-1`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
      <div className="flex items-center text-xs text-gray-400 whitespace-nowrap">
        <Clock className="w-3 h-3 mr-1" />
        {time}
      </div>
    </div>
  )
}

const SystemStatusCard = ({ icon: Icon, title, status, statusColor, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
    <div className={`w-16 h-16 ${statusColor === 'green' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`w-6 h-6 ${statusColor === 'green' ? 'text-green-600' : 'text-red-600'}`} />
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className={`text-sm font-medium ${statusColor === 'green' ? 'text-green-600' : 'text-red-600'} mb-2`}>
      {status}
    </p>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
)

function Dashboard() {
  const { user } = useAuthStore()
  const { students, fetchStudents, loading: studentsLoading } = useStudentsStore()
  const { teachers, fetchTeachers, loading: teachersLoading } = useTeachersStore()
  const { classes, fetchClasses, loading: classesLoading } = useClassesStore()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAllData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchStudents(),
        fetchTeachers(),
        fetchClasses(),
      ])
    } catch (error) {
      console.error('Khalad ka dhacay markii la soo dejinaayo xogta dashboard-ka:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Madaxa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Ku soo dhawoow, <span className="text-blue-600">{user?.username}</span>!
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Halkan waxa ku yaal waxyaabaha ka dhacaya Maamulka Al-Qayim maanta.
          </p>
        </div>
        <button
          onClick={fetchAllData}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Cusboonaysii Xogta</span>
        </button>
      </div>

      {/* Kaadhka Xogta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wadarta Ardayda"
          value={students.length}
          icon={Users}
          color="blue"
          trend="+12% bishii la soo dhaafay"
          loading={studentsLoading}
        />
        <StatCard
          title="Wadarta Barayaasha"
          value={teachers.length}
          icon={GraduationCap}
          color="green"
          trend="+5% bishii la soo dhaafay"
          loading={teachersLoading}
        />
        <StatCard
          title="Wadarta Fasallada"
          value={classes.length}
          icon={BookOpen}
          color="purple"
          trend="+8% bishii la soo dhaafay"
          loading={classesLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ficilal Degdeg ah */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Ficilal Degdeg ah</h2>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Nidaamka Online ah</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickActionCard
                title="Ku Dar Arday Cusub"
                description="Diiwaan geli arday cusub"
                icon={UserPlus}
                color="blue"
                onClick={() => {/* Navigate to add student */}}
              />
              <QuickActionCard
                title="Ku Dar Barre Cusub"
                description="Diiwaan geli bare cusub"
                icon={UserPlus}
                color="green"
                onClick={() => {/* Navigate to add teacher */}}
              />
              <QuickActionCard
                title="Abuur Fasalka"
                description="Deji fasalka cusub"
                icon={BookMarked}
                color="purple"
                onClick={() => {/* Navigate to create class */}}
              />
              <QuickActionCard
                title="Qor Haddaha"
                description="Qor haddaha maanta"
                icon={CalendarCheck}
                color="orange"
                onClick={() => {/* Navigate to attendance */}}
              />
            </div>
          </div>
        </div>

        {/* Waxqabadka Ugu Danbeeyay */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Waxqabadka Ugu Danbeeyay</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <RecentActivityItem
              icon={Users}
              title="Arday Cusub oo Diiwaan Gashay"
              description="Axmed Cali waxa uu ku biiray Fasalka 10A"
              time="2h kahor"
              color="blue"
            />
            <RecentActivityItem
              icon={Calendar}
              title="Haddaha la Qoray"
              description="Fasalka 10A - 25/30 halkaa joogay"
              time="3h kahor"
              color="green"
            />
            <RecentActivityItem
              icon={BookOpen}
              title="Fasalka Cusub la Abuuro"
              description="Xisaab Fasalka 9aad"
              time="5h kahor"
              color="purple"
            />
            <RecentActivityItem
              icon={GraduationCap}
              title="Baraha Profile-ka la Cusboonaysiiyay"
              description="Xaawa waxay cusboonaysiisay profile-keeda"
              time="1d kahor"
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Muuqaalka Nidaamka */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Muuqaalka Nidaamka</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SystemStatusCard
            icon={Server}
            title="Caafimaadka Nidaamka"
            status="Dhammaan adeegyada shaqeeya"
            statusColor="green"
            description="Lama ogaan dhibaatooyin"
          />
          <SystemStatusCard
            icon={Gauge}
            title="Waxqabadka"
            status="Jawaab degdeg ah"
            statusColor="green"
            description="Celcelis ahaan 120ms jawaab celin"
          />
          <SystemStatusCard
            icon={Database}
            title="Xoghaynta"
            status="Fiiro gaar ah & la hagaajiyay"
            statusColor="green"
            description="Kaydinta ugu dambeysay: Maanta 02:00"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  UserPlus, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  BookOpen,
  Bell
} from 'lucide-react'

export const revalidate = 30

export default async function TutorDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, center_id')
    .eq('id', user?.id)
    .single()

  const centerId = profile?.center_id

  // Fetch all data in parallel
  const [studentsResult, plansResult, eventsResult, pendingLinksResult, recentStudentsResult] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('center_id', centerId),
    supabase.from('plans').select('id', { count: 'exact', head: true }).eq('center_id', centerId).eq('status', 'active'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('center_id', centerId).eq('status', 'published').gte('start_datetime', new Date().toISOString()),
    supabase.from('guardian_links').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('students')
      .select('id, current_grade, profiles!students_profile_id_fkey(first_name, last_name)')
      .eq('center_id', centerId)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const stats = [
    { label: 'Alumnos', value: studentsResult.count || 0, icon: Users, gradient: 'from-blue-500 to-cyan-500', href: '/app/tutor/students' },
    { label: 'Planes activos', value: plansResult.count || 0, icon: ClipboardList, gradient: 'from-purple-500 to-pink-500', href: '/app/tutor/plans' },
    { label: 'Eventos próximos', value: eventsResult.count || 0, icon: Calendar, gradient: 'from-orange-500 to-red-500', href: '/app/tutor/events' },
    { label: 'Vínculos pendientes', value: pendingLinksResult.count || 0, icon: UserPlus, gradient: 'from-green-500 to-emerald-500', href: '/app/tutor/students/links' },
  ]

  const recentStudents = recentStudentsResult.data

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-sm mb-2">
              <Sparkles className="h-4 w-4" />
              Panel de orientación
            </div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Hola, {profile?.first_name}! 👋
            </h1>
            <p className="text-purple-100 max-w-lg">
              Gestiona la orientación de tus alumnos. Tienes {pendingLinksResult.count || 0} vínculos familiares pendientes de aprobar.
            </p>
          </div>
          {(pendingLinksResult.count || 0) > 0 && (
            <Link
              href="/app/tutor/students/links"
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">{pendingLinksResult.count} pendientes</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Alumnos recientes</h2>
              </div>
              <Link 
                href="/app/tutor/students" 
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {recentStudents && recentStudents.length > 0 ? (
              <div className="space-y-2">
                {recentStudents.map((student, index) => {
                  const studentProfile = student.profiles as any
                  const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-green-500 to-emerald-500', 'from-indigo-500 to-violet-500']
                  return (
                    <div 
                      key={student.id} 
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-11 h-11 bg-gradient-to-br ${colors[index % colors.length]} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold">
                          {studentProfile?.first_name?.[0]}{studentProfile?.last_name?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {studentProfile?.first_name} {studentProfile?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{student.current_grade}</p>
                      </div>
                      <Link
                        href={`/app/tutor/plans/new?student=${student.id}`}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Crear plan
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No hay alumnos registrados</p>
                <Link 
                  href="/app/tutor/invitations"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Invitar alumnos
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/app/tutor/invitations"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg shadow-purple-500/25">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Invitar alumno</p>
                <p className="text-sm text-gray-500">Genera un código de invitación</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/app/tutor/plans/new"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white shadow-lg shadow-blue-500/25">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Nuevo plan</p>
                <p className="text-sm text-gray-500">Plan de orientación para alumno</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/app/tutor/resources/new"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-green-500/25">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Crear recurso</p>
                <p className="text-sm text-gray-500">Guía, artículo o material</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/app/tutor/events"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-lg shadow-orange-500/25">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Gestionar eventos</p>
                <p className="text-sm text-gray-500">Charlas, talleres y visitas</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tip Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex items-center gap-6">
        <div className="p-4 bg-white/20 rounded-2xl">
          <TrendingUp className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Consejo del día</h3>
          <p className="text-indigo-100">
            Recuerda revisar periódicamente el progreso de los planes de orientación y actualizar los objetivos según las necesidades de cada alumno.
          </p>
        </div>
      </div>
    </div>
  )
}

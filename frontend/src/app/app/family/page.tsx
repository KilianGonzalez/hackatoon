import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  BookOpen, 
  UserPlus, 
  ChevronRight, 
  Sparkles,
  Heart,
  TrendingUp,
  MessageSquare
} from 'lucide-react'

export const revalidate = 30

export default async function FamilyDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Parallel fetch profile and guardian links
  const [profileResult, guardianLinksResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user?.id)
      .single(),
    supabase
      .from('guardian_links')
      .select(`
        id,
        students!guardian_links_student_id_fkey(
          id,
          current_grade,
          profiles!students_profile_id_fkey(first_name, last_name)
        )
      `)
      .eq('guardian_id', user?.id)
      .eq('status', 'approved')
  ])

  const profile = profileResult.data
  const linkedStudents = guardianLinksResult.data || []
  const studentIds = linkedStudents.map(l => (l.students as any)?.id).filter(Boolean)
  
  // Parallel fetch plans and events (only if there are linked students)
  let plans: any[] = []
  let upcomingEvents: any[] = []
  
  if (studentIds.length > 0) {
    const [plansResult, eventsResult] = await Promise.all([
      supabase
        .from('plans')
        .select('id, title, progress_percentage, student_id, students!plans_student_id_fkey(profiles!students_profile_id_fkey(first_name, last_name))')
        .in('student_id', studentIds)
        .eq('status', 'active'),
      supabase
        .from('event_registrations')
        .select('id, events(id, title, start_datetime), students!event_registrations_student_id_fkey(profiles!students_profile_id_fkey(first_name))')
        .in('student_id', studentIds)
        .eq('status', 'registered')
        .limit(5)
    ])
    plans = plansResult.data || []
    upcomingEvents = eventsResult.data || []
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-2">
            <Heart className="h-4 w-4" />
            Portal de familias
          </div>
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {profile?.first_name}! 👋
          </h1>
          <p className="text-green-100 max-w-lg">
            {linkedStudents.length > 0 
              ? `Tienes ${linkedStudents.length} hijo${linkedStudents.length > 1 ? 's' : ''} vinculado${linkedStudents.length > 1 ? 's' : ''}. Sigue su progreso de orientación.`
              : 'Vincula a tus hijos para seguir su progreso de orientación académica.'
            }
          </p>
        </div>
      </div>

      {linkedStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sin hijos vinculados</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Vincula a tus hijos para ver su progreso de orientación, eventos y comunicarte con sus tutores
          </p>
          <Link
            href="/app/family/children/link"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            <UserPlus className="h-5 w-5" />
            Vincular hijo/a
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Children Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Mis Hijos</h2>
                  </div>
                  <Link 
                    href="/app/family/children" 
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {linkedStudents.map((link, index) => {
                  const student = link.students as any
                  const studentProfile = student?.profiles as any
                  const studentPlan = plans.find(p => p.student_id === student?.id)
                  const colors = ['from-green-500 to-emerald-600', 'from-blue-500 to-cyan-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600']
                  
                  return (
                    <Link
                      key={link.id}
                      href={`/app/family/children/${student?.id}`}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all group"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${colors[index % colors.length]} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">
                          {studentProfile?.first_name?.[0]}{studentProfile?.last_name?.[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {studentProfile?.first_name} {studentProfile?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{student?.current_grade}</p>
                      </div>
                      {studentPlan ? (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{studentPlan.progress_percentage}%</div>
                          <div className="text-xs text-gray-500">del plan</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                          Sin plan activo
                        </div>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Plans */}
            {plans.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ClipboardList className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Planes de Orientación</h2>
                  </div>
                  <Link 
                    href="/app/family/plans" 
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {plans.map((plan) => {
                    const studentProfile = (plan.students as any)?.profiles as any
                    return (
                      <div key={plan.id} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{plan.title}</p>
                            <p className="text-sm text-gray-500">
                              {studentProfile?.first_name} {studentProfile?.last_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600">{plan.progress_percentage}%</span>
                            <p className="text-xs text-gray-500">completado</p>
                          </div>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${plan.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones rápidas</h2>
              <div className="space-y-3">
                <Link
                  href="/app/family/resources"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Guías para familias</span>
                    <p className="text-xs text-gray-500">Recursos y materiales</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
                <Link
                  href="/app/family/messages"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Contactar tutor</span>
                    <p className="text-xs text-gray-500">Enviar mensaje</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </Link>
                <Link
                  href="/app/family/children/link"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <UserPlus className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Vincular otro hijo</span>
                    <p className="text-xs text-gray-500">Añadir estudiante</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-900">Próximos eventos</h2>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((reg) => {
                    const event = reg.events as any
                    const studentProfile = (reg.students as any)?.profiles as any
                    const eventDate = new Date(event?.start_datetime)
                    return (
                      <div key={reg.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {eventDate.getDate()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{event?.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {studentProfile?.first_name} · {eventDate.toLocaleDateString('es-ES', { month: 'short' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tip Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Consejo</h3>
              <p className="text-sm text-green-100">
                Revisa periódicamente el progreso de tus hijos y comunícate con sus tutores para apoyar su orientación.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

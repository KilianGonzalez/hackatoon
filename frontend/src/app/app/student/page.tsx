import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  ClipboardList, 
  Calendar, 
  BookOpen, 
  Target, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Rocket
} from 'lucide-react'

export const revalidate = 30

export default async function StudentDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Parallel fetch for better performance
  const [profileResult, studentResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user?.id)
      .single(),
    supabase
      .from('students')
      .select('id, center_id')
      .eq('profile_id', user?.id)
      .single()
  ])

  const profile = profileResult.data
  const student = studentResult.data

  // Second batch of parallel queries (depend on student.id)
  const [planResult, registrationsResult, recommendedEventsResult] = await Promise.all([
    supabase
      .from('plans')
      .select('id, title, progress_percentage, plan_items(id, title, status)')
      .eq('student_id', student?.id)
      .eq('status', 'active')
      .single(),
    supabase
      .from('event_registrations')
      .select('id, events(id, title, start_datetime, location)')
      .eq('student_id', student?.id)
      .eq('status', 'registered')
      .limit(3),
    supabase
      .from('events')
      .select('id, title, start_datetime, event_type')
      .eq('center_id', student?.center_id)
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .limit(3)
  ])

  const plan = planResult.data
  const registrations = registrationsResult.data
  const recommendedEvents = recommendedEventsResult.data

  const planItems = (plan?.plan_items as any[]) || []
  const completedItems = planItems.filter(i => i.status === 'completed').length
  const inProgressItems = planItems.filter(i => i.status === 'in_progress').length

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
            <Sparkles className="h-4 w-4" />
            Tu portal de orientación
          </div>
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {profile?.first_name || 'estudiante'}! 👋
          </h1>
          <p className="text-blue-100 max-w-lg">
            Continúa explorando tu camino profesional. Tienes {recommendedEvents?.length || 0} eventos disponibles y {planItems.length - completedItems} objetivos pendientes.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Progress */}
          {plan ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Mi Plan de Orientación</h2>
                      <p className="text-sm text-gray-500">{plan.title}</p>
                    </div>
                  </div>
                  <Link 
                    href="/app/student/plan" 
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver completo
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{planItems.length}</div>
                    <div className="text-xs text-gray-500">Objetivos</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{completedItems}</div>
                    <div className="text-xs text-gray-500">Completados</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{inProgressItems}</div>
                    <div className="text-xs text-gray-500">En progreso</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso general</span>
                    <span className="text-sm font-bold text-blue-600">{plan.progress_percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${plan.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Next tasks */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Próximos objetivos</p>
                  <div className="space-y-2">
                    {planItems.filter(i => i.status !== 'completed').slice(0, 3).map((item: any) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          item.status === 'in_progress' 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          item.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                          {item.status === 'in_progress' ? (
                            <Clock className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Target className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{item.title}</span>
                          {item.status === 'in_progress' && (
                            <span className="ml-2 text-xs text-blue-600 font-medium">En progreso</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sin plan activo</h3>
              <p className="text-gray-500 mb-4">Tu tutor creará un plan de orientación personalizado para ti</p>
              <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                <Sparkles className="h-4 w-4" />
                Mientras tanto, explora los recursos disponibles
              </div>
            </div>
          )}

          {/* My Events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mis Eventos</h2>
              </div>
              <Link 
                href="/app/student/events" 
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {registrations && registrations.length > 0 ? (
              <div className="space-y-3">
                {registrations.map((reg) => {
                  const event = reg.events as any
                  const eventDate = new Date(event?.start_datetime)
                  return (
                    <Link
                      key={reg.id}
                      href={`/app/student/events/${event?.id}`}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all group"
                    >
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex flex-col items-center justify-center text-white">
                        <span className="text-lg font-bold">{eventDate.getDate()}</span>
                        <span className="text-xs uppercase">{eventDate.toLocaleDateString('es-ES', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {event?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          {event?.location && ` · ${event.location}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Inscrito
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-3">No estás inscrito en ningún evento</p>
                <Link 
                  href="/app/student/events"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explorar eventos disponibles
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones rápidas</h2>
            <div className="space-y-3">
              <Link
                href="/app/student/events"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Explorar eventos</span>
                  <p className="text-xs text-gray-500">Charlas, talleres y más</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>
              <Link
                href="/app/student/resources"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Ver recursos</span>
                  <p className="text-xs text-gray-500">Guías y materiales</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </Link>
              <Link
                href="/app/student/profile"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Mis intereses</span>
                  <p className="text-xs text-gray-500">Actualiza tu perfil</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recommended Events */}
          {recommendedEvents && recommendedEvents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Recomendados</h2>
              </div>
              <div className="space-y-3">
                {recommendedEvents.map((event) => {
                  const eventDate = new Date(event.start_datetime)
                  return (
                    <Link
                      key={event.id}
                      href={`/app/student/events/${event.id}`}
                      className="block p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {eventDate.getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-2">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {eventDate.toLocaleDateString('es-ES', { month: 'short' })} · {event.event_type}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Motivation Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
            <h3 className="font-bold text-lg mb-2">¡Sigue así!</h3>
            <p className="text-sm text-indigo-100">
              Cada paso que das te acerca más a descubrir tu vocación ideal. ¡No te rindas!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

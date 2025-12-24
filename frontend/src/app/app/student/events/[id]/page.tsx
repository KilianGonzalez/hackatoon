import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Clock, Users, Video } from 'lucide-react'
import EventRegistrationButton from './EventRegistrationButton'

export default async function StudentEventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: student } = await supabase
    .from('students')
    .select('id, center_id')
    .eq('profile_id', user?.id)
    .single()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, companies(company_name), centers(name)')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Check if already registered
  const { data: registration } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', params.id)
    .eq('student_id', student?.id)
    .single()

  // Get registration count
  const { count: registrationCount } = await supabase
    .from('event_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', params.id)
    .eq('status', 'registered')

  const eventDate = new Date(event.start_datetime)
  const endDate = new Date(event.end_datetime)
  const isPast = eventDate < new Date()
  const isFull = event.max_attendees && (registrationCount || 0) >= event.max_attendees

  return (
    <div>
      <Link
        href="/app/student/events"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {event.event_type === 'talk' ? 'Charla' :
                 event.event_type === 'workshop' ? 'Taller' :
                 event.event_type === 'visit' ? 'Visita' :
                 event.event_type === 'open_day' ? 'Jornada de puertas abiertas' :
                 event.event_type === 'fair' ? 'Feria' : 'Tutoría'}
              </span>
              {isPast && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Evento pasado
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
            
            {(event.companies as any)?.company_name && (
              <p className="text-gray-600 mb-4">
                Organizado por: <span className="font-medium">{(event.companies as any).company_name}</span>
              </p>
            )}

            {event.description && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del evento</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {eventDate.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {event.is_online ? (
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Evento online</p>
                    {registration && event.online_url && (
                      <a 
                        href={event.online_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Acceder a la reunión
                      </a>
                    )}
                  </div>
                </div>
              ) : event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {registrationCount || 0} inscritos
                    {event.max_attendees && ` / ${event.max_attendees} plazas`}
                  </p>
                  {isFull && !registration && (
                    <p className="text-red-600 text-sm">Evento completo</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <EventRegistrationButton 
              eventId={event.id}
              studentId={student?.id}
              isRegistered={!!registration}
              isPast={isPast}
              isFull={isFull && !registration}
            />

            {registration && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">¡Estás inscrito!</p>
                <p className="text-green-700 text-sm mt-1">
                  Inscrito el {new Date(registration.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
          </div>

          {event.target_grades && event.target_grades.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Dirigido a</h3>
              <div className="flex flex-wrap gap-2">
                {event.target_grades.map((grade: string) => (
                  <span key={grade} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {grade}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

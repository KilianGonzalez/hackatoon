import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

export default async function StudentEventsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  // Get available events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('center_id', student?.center_id)
    .eq('status', 'published')
    .gte('start_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true })

  // Get user registrations
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('event_id, status')
    .eq('student_id', student?.id)

  const registeredEventIds = new Set(registrations?.map(r => r.event_id) || [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Eventos</h1>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar eventos: {error.message}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => {
            const isRegistered = registeredEventIds.has(event.id)
            const eventDate = new Date(event.start_datetime)
            
            return (
              <div key={event.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {event.event_type === 'talk' ? 'Charla' :
                     event.event_type === 'workshop' ? 'Taller' :
                     event.event_type === 'visit' ? 'Visita' :
                     event.event_type === 'open_day' ? 'Jornada' :
                     event.event_type === 'fair' ? 'Feria' : 'Tutoría'}
                  </span>
                  {isRegistered && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Inscrito
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                
                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                      {' · '}
                      {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.max_attendees && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Máx. {event.max_attendees} asistentes</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/app/student/events/${event.id}`}
                  className={`block w-full text-center py-2 rounded-lg font-medium transition-colors ${
                    isRegistered
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRegistered ? 'Ver detalles' : 'Inscribirme'}
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos próximos</h3>
          <p className="text-gray-500">Los eventos aparecerán aquí cuando estén disponibles</p>
        </div>
      )}
    </div>
  )
}

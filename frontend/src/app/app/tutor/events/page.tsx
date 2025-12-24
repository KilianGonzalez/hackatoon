import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react'

export default async function TutorEventsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('center_id', profile?.center_id)
    .order('start_datetime', { ascending: true })

  const upcomingEvents = events?.filter(e => new Date(e.start_datetime) >= new Date()) || []
  const pastEvents = events?.filter(e => new Date(e.start_datetime) < new Date()) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <Link
          href="/app/tutor/events/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo evento
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar eventos: {error.message}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos eventos</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-8 text-center">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay eventos próximos</p>
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Eventos pasados</h2>
              <div className="grid md:grid-cols-2 gap-4 opacity-75">
                {pastEvents.slice(0, 4).map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  const eventDate = new Date(event.start_datetime)
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    published: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  }

  return (
    <Link
      href={`/app/tutor/events/${event.id}`}
      className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status] || statusColors.draft}`}>
          {event.status === 'draft' ? 'Borrador' :
           event.status === 'pending_approval' ? 'Pendiente' :
           event.status === 'approved' ? 'Aprobado' :
           event.status === 'published' ? 'Publicado' :
           event.status === 'cancelled' ? 'Cancelado' : 'Completado'}
        </span>
        <span className="text-xs text-gray-500">
          {event.event_type === 'talk' ? 'Charla' :
           event.event_type === 'workshop' ? 'Taller' :
           event.event_type === 'visit' ? 'Visita' :
           event.event_type === 'open_day' ? 'Jornada' :
           event.event_type === 'fair' ? 'Feria' : 'Tutoría'}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {eventDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
            {' · '}
            {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        {event.max_attendees && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Máx. {event.max_attendees} asistentes</span>
          </div>
        )}
      </div>
    </Link>
  )
}

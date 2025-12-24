import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Calendar, Users, MapPin, Clock } from 'lucide-react'

export default async function CompanyEventsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase
    .from('companies')
    .select('id, status')
    .eq('profile_id', user?.id)
    .single()

  const { data: events, error } = await supabase
    .from('events')
    .select('*, event_registrations(id)')
    .eq('company_id', company?.id)
    .order('start_datetime', { ascending: false })

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Borrador' },
    pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Aprobado' },
    published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Publicado' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Completado' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Eventos</h1>
        {company?.status === 'approved' && (
          <Link
            href="/app/company/events/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Proponer evento
          </Link>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar eventos: {error.message}
        </div>
      ) : events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => {
            const status = statusColors[event.status] || statusColors.draft
            const eventDate = new Date(event.start_datetime)
            const isPast = eventDate < new Date()
            
            return (
              <Link
                key={event.id}
                href={`/app/company/events/${event.id}`}
                className={`block bg-white rounded-xl border p-6 hover:shadow-md transition-shadow ${isPast ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {event.event_type === 'talk' ? 'Charla' :
                       event.event_type === 'workshop' ? 'Taller' :
                       event.event_type === 'visit' ? 'Visita' :
                       event.event_type === 'open_day' ? 'Jornada' : event.event_type}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {eventDate.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {' · '}
                      {eventDate.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {(event.event_registrations as any[])?.length || 0} inscritos
                      {event.max_attendees && ` / ${event.max_attendees} máx.`}
                    </span>
                  </div>
                </div>

                {event.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin eventos</h3>
          <p className="text-gray-500 mb-4">Propón charlas, talleres o visitas para los estudiantes</p>
          {company?.status === 'approved' && (
            <Link
              href="/app/company/events/new"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              <Plus className="h-5 w-5" />
              Proponer evento
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

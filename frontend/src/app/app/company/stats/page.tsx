import { createClient } from '@/lib/supabase/server'
import { BarChart3, Calendar, Users, Eye, TrendingUp } from 'lucide-react'

export default async function CompanyStatsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('profile_id', user?.id)
    .single()

  // Get events with registrations
  const { data: events } = await supabase
    .from('events')
    .select('*, event_registrations(id, status)')
    .eq('company_id', company?.id)

  // Get resources with views
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('company_id', company?.id)

  const totalEvents = events?.length || 0
  const publishedEvents = events?.filter(e => e.status === 'published').length || 0
  const totalRegistrations = events?.reduce((acc, e) => acc + ((e.event_registrations as any[])?.length || 0), 0) || 0
  const totalResources = resources?.length || 0
  const totalViews = resources?.reduce((acc, r) => acc + (r.view_count || 0), 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas</h1>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              <p className="text-sm text-gray-500">Eventos totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
              <p className="text-sm text-gray-500">Inscripciones</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
              <p className="text-sm text-gray-500">Recursos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              <p className="text-sm text-gray-500">Vistas recursos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Performance */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Eventos</h2>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const registrations = (event.event_registrations as any[])?.length || 0
              const maxAttendees = event.max_attendees || 100
              const percentage = Math.min((registrations / maxAttendees) * 100, 100)
              
              return (
                <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.start_datetime).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{registrations}</p>
                      <p className="text-xs text-gray-500">
                        {event.max_attendees ? `de ${event.max_attendees}` : 'inscritos'}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay eventos para mostrar estadísticas</p>
        )}
      </div>

      {/* Resources Performance */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Recursos</h2>
        {resources && resources.length > 0 ? (
          <div className="space-y-3">
            {resources.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{resource.title}</p>
                  <p className="text-sm text-gray-500">
                    {resource.resource_type === 'guide' ? 'Guía' :
                     resource.resource_type === 'article' ? 'Artículo' :
                     resource.resource_type === 'video' ? 'Vídeo' : 'Enlace'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{resource.view_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay recursos para mostrar estadísticas</p>
        )}
      </div>
    </div>
  )
}

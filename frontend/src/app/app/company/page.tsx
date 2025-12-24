import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, BookOpen, Users, Eye, AlertCircle, CheckCircle } from 'lucide-react'

export default async function CompanyDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  // Get company stats
  const [eventsResult, resourcesResult] = await Promise.all([
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('company_id', company?.id),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('company_id', company?.id),
  ])

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*, event_registrations(id)')
    .eq('company_id', company?.id)
    .order('start_datetime', { ascending: false })
    .limit(5)

  const isApproved = company?.status === 'approved'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        ¡Bienvenido! 👋
      </h1>
      <p className="text-gray-600 mb-6">{company?.company_name}</p>

      {/* Status Banner */}
      {!isApproved && (
        <div className={`rounded-xl p-4 mb-6 ${
          company?.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          company?.status === 'rejected' ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 ${
              company?.status === 'pending' ? 'text-yellow-600' :
              company?.status === 'rejected' ? 'text-red-600' : 'text-gray-600'
            }`} />
            <div>
              <h3 className={`font-medium ${
                company?.status === 'pending' ? 'text-yellow-800' :
                company?.status === 'rejected' ? 'text-red-800' : 'text-gray-800'
              }`}>
                {company?.status === 'pending' ? 'Cuenta pendiente de aprobación' :
                 company?.status === 'rejected' ? 'Cuenta rechazada' : 'Cuenta suspendida'}
              </h3>
              <p className={`text-sm mt-1 ${
                company?.status === 'pending' ? 'text-yellow-700' :
                company?.status === 'rejected' ? 'text-red-700' : 'text-gray-700'
              }`}>
                {company?.status === 'pending' 
                  ? 'Un administrador revisará tu solicitud pronto. Mientras tanto, puedes completar tu perfil de empresa.'
                  : company?.status === 'rejected'
                  ? 'Tu solicitud ha sido rechazada. Contacta con soporte para más información.'
                  : 'Tu cuenta ha sido suspendida. Contacta con soporte.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {isApproved ? (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{eventsResult.count || 0}</p>
                  <p className="text-sm text-gray-500">Eventos creados</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{resourcesResult.count || 0}</p>
                  <p className="text-sm text-gray-500">Recursos compartidos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentEvents?.reduce((acc, e) => acc + ((e.event_registrations as any[])?.length || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-500">Inscripciones totales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mis Eventos</h2>
              <Link href="/app/company/events" className="text-sm text-orange-600 hover:underline">
                Ver todos
              </Link>
            </div>
            {recentEvents && recentEvents.length > 0 ? (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.start_datetime).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {(event.event_registrations as any[])?.length || 0}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-700' :
                        event.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        event.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status === 'published' ? 'Publicado' :
                         event.status === 'approved' ? 'Aprobado' :
                         event.status === 'pending_approval' ? 'Pendiente' :
                         event.status === 'draft' ? 'Borrador' : event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No has creado ningún evento</p>
                <Link
                  href="/app/company/events/new"
                  className="inline-block mt-3 text-orange-600 hover:underline"
                >
                  Crear primer evento
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link
                href="/app/company/events/new"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Proponer evento</p>
                  <p className="text-sm text-gray-500">Charla, taller o visita</p>
                </div>
              </Link>
              <Link
                href="/app/company/resources/new"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Compartir recurso</p>
                  <p className="text-sm text-gray-500">Guía, vídeo o artículo</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      ) : (
        /* Pending/Rejected state - show profile completion */
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completa tu perfil</h2>
          <p className="text-gray-600 mb-4">
            Mientras esperas la aprobación, asegúrate de completar toda la información de tu empresa.
          </p>
          <Link
            href="/app/company/settings"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Editar perfil de empresa
          </Link>
        </div>
      )}
    </div>
  )
}

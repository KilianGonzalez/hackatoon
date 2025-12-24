import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, User, Target, ClipboardList, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ChildDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Verify guardian has access to this student
  const { data: guardianLink } = await supabase
    .from('guardian_links')
    .select('*')
    .eq('guardian_id', user?.id)
    .eq('student_id', params.id)
    .eq('status', 'approved')
    .single()

  if (!guardianLink) {
    notFound()
  }

  // Get student details
  const { data: student } = await supabase
    .from('students')
    .select('*, profiles!students_profile_id_fkey(*)')
    .eq('id', params.id)
    .single()

  if (!student) {
    notFound()
  }

  const profile = student.profiles as any

  // Get student's plan
  const { data: plan } = await supabase
    .from('plans')
    .select('*, plan_items(*)')
    .eq('student_id', params.id)
    .eq('status', 'active')
    .single()

  // Get student's event registrations
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*, events(*)')
    .eq('student_id', params.id)
    .eq('status', 'registered')
    .limit(5)

  return (
    <div>
      <Link
        href="/app/family/children"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Hijos
      </Link>

      {/* Student Header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-2xl">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <p className="text-gray-600">{student.current_grade}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interests */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Intereses</h2>
          </div>
          {student.interests?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest: string) => (
                <span key={interest} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Sin intereses definidos</p>
          )}

          {student.preferred_path && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Itinerario preferido:</p>
              <p className="font-medium text-gray-900">{student.preferred_path}</p>
            </div>
          )}
        </div>

        {/* Plan Progress */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Plan de Orientación</h2>
          </div>
          {plan ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{plan.title}</span>
                <span className="text-green-600 font-bold">{plan.progress_percentage}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${plan.progress_percentage}%` }}
                />
              </div>
              {plan.plan_items && (
                <div className="space-y-2">
                  {(plan.plan_items as any[]).slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className={item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Sin plan activo</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Eventos Inscritos</h2>
          </div>
          {registrations && registrations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {registrations.map((reg) => {
                const event = reg.events as any
                return (
                  <div key={reg.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900">{event?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event?.start_datetime).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {event?.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No está inscrito en ningún evento</p>
          )}
        </div>
      </div>
    </div>
  )
}

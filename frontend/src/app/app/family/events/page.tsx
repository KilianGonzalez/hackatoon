import { createClient } from '@/lib/supabase/server'
import { Calendar } from 'lucide-react'

export default async function FamilyEventsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get linked students
  const { data: guardianLinks } = await supabase
    .from('guardian_links')
    .select('student_id')
    .eq('guardian_id', user?.id)
    .eq('status', 'approved')

  const studentIds = guardianLinks?.map(l => l.student_id) || []

  let registrations: any[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(*),
        students!event_registrations_student_id_fkey(
          profiles!students_profile_id_fkey(first_name)
        )
      `)
      .in('student_id', studentIds)
      .eq('status', 'registered')
      .order('created_at', { ascending: false })
    registrations = data || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Eventos</h1>

      {registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const event = reg.events as any
            const student = reg.students as any
            const eventDate = new Date(event?.start_datetime)
            
            return (
              <div key={reg.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event?.title}</h3>
                    <p className="text-sm text-gray-500">
                      Inscrito: {student?.profiles?.first_name}
                    </p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        {eventDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p>
                        {eventDate.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {event?.location && ` · ${event.location}`}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Inscrito
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin eventos</h3>
          <p className="text-gray-500">Los eventos de tus hijos aparecerán aquí cuando se inscriban</p>
        </div>
      )}
    </div>
  )
}

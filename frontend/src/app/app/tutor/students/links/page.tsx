import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react'
import LinkActions from './LinkActions'

export default async function PendingLinksPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  // Get pending guardian links for students in this center
  const { data: pendingLinks, error } = await supabase
    .from('guardian_links')
    .select(`
      *,
      students!guardian_links_student_id_fkey(
        id,
        current_grade,
        profiles!students_profile_id_fkey(first_name, last_name, email)
      ),
      profiles!guardian_links_guardian_id_fkey(first_name, last_name, email)
    `)
    .eq('status', 'pending')

  // Filter by center (need to check student's center)
  const filteredLinks = pendingLinks?.filter(link => {
    const student = link.students as any
    return student?.center_id === profile?.center_id
  }) || []

  return (
    <div>
      <Link
        href="/app/tutor/students"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a alumnos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vínculos Familiares Pendientes</h1>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar vínculos: {error.message}
        </div>
      ) : filteredLinks.length > 0 ? (
        <div className="space-y-4">
          {filteredLinks.map((link) => {
            const student = link.students as any
            const studentProfile = student?.profiles as any
            const guardianProfile = link.profiles as any
            
            const relationshipLabels: Record<string, string> = {
              father: 'Padre',
              mother: 'Madre',
              guardian: 'Tutor legal',
              other: 'Otro familiar',
            }

            return (
              <div key={link.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <UserPlus className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600 font-medium">Pendiente de aprobación</span>
                      </div>
                      <p className="text-gray-900">
                        <span className="font-semibold">{guardianProfile?.first_name} {guardianProfile?.last_name}</span>
                        {' '}solicita vincularse como{' '}
                        <span className="font-medium">{relationshipLabels[link.relationship] || link.relationship}</span>
                        {' '}de{' '}
                        <span className="font-semibold">{studentProfile?.first_name} {studentProfile?.last_name}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Email familiar: {guardianProfile?.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Alumno: {studentProfile?.email} ({student?.current_grade})
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Solicitado: {new Date(link.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>

                <LinkActions linkId={link.id} />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin solicitudes pendientes</h3>
          <p className="text-gray-500">No hay vínculos familiares pendientes de aprobación</p>
        </div>
      )}
    </div>
  )
}

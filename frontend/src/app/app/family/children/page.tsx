import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, UserPlus } from 'lucide-react'

export default async function FamilyChildrenPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: guardianLinks, error } = await supabase
    .from('guardian_links')
    .select(`
      *,
      students!guardian_links_student_id_fkey(
        id,
        current_grade,
        academic_year,
        interests,
        profiles!students_profile_id_fkey(first_name, last_name, email)
      )
    `)
    .eq('guardian_id', user?.id)
    .eq('status', 'approved')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Hijos</h1>
        <Link
          href="/app/family/children/link"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Vincular hijo/a
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar hijos: {error.message}
        </div>
      ) : guardianLinks && guardianLinks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {guardianLinks.map((link) => {
            const student = link.students as any
            const profile = student?.profiles as any
            return (
              <Link
                key={link.id}
                href={`/app/family/children/${student?.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </h3>
                    <p className="text-gray-600">{student?.current_grade}</p>
                    <p className="text-sm text-gray-500">
                      {link.relationship === 'father' ? 'Padre' :
                       link.relationship === 'mother' ? 'Madre' :
                       link.relationship === 'guardian' ? 'Tutor legal' : 'Otro'}
                    </p>
                  </div>
                </div>
                
                {student?.interests?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Intereses:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.interests.slice(0, 4).map((interest: string) => (
                        <span key={interest} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin hijos vinculados</h3>
          <p className="text-gray-500 mb-4">Vincula a tus hijos para ver su progreso</p>
          <Link
            href="/app/family/children/link"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <UserPlus className="h-5 w-5" />
            Vincular hijo/a
          </Link>
        </div>
      )}
    </div>
  )
}

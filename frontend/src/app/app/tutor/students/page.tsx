import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Users, GraduationCap, UserPlus } from 'lucide-react'

export default async function TutorStudentsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  const { data: students, error } = await supabase
    .from('students')
    .select('*, profiles!students_profile_id_fkey(first_name, last_name, email, avatar_url)')
    .eq('center_id', profile?.center_id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumnos</h1>
        <Link
          href="/app/tutor/invitations/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Invitar alumno
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alumnos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Todos los cursos</option>
            <option value="3eso">3º ESO</option>
            <option value="4eso">4º ESO</option>
            <option value="1bach">1º Bachillerato</option>
            <option value="2bach">2º Bachillerato</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar alumnos: {error.message}
        </div>
      ) : students && students.length > 0 ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Alumno</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Curso</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Grupo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Intereses</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => {
                const studentProfile = student.profiles as any
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {studentProfile?.first_name?.[0]}{studentProfile?.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {studentProfile?.first_name} {studentProfile?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{studentProfile?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.current_grade || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.group_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.interests?.slice(0, 3).map((interest: string) => (
                          <span key={interest} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                        {student.interests?.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{student.interests.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/app/tutor/students/${student.id}`}
                          className="text-purple-600 hover:underline text-sm"
                        >
                          Ver perfil
                        </Link>
                        <Link
                          href={`/app/tutor/plans/new?student=${student.id}`}
                          className="text-purple-600 hover:underline text-sm"
                        >
                          Crear plan
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alumnos</h3>
          <p className="text-gray-500 mb-4">Invita a tus alumnos a registrarse</p>
          <Link
            href="/app/tutor/invitations/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <UserPlus className="h-5 w-5" />
            Invitar alumno
          </Link>
        </div>
      )}
    </div>
  )
}

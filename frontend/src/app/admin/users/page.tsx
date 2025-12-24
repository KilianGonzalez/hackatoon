import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Users, GraduationCap, Building2, UserCog } from 'lucide-react'

const roleLabels: Record<string, { label: string; color: string; icon: any }> = {
  student: { label: 'Alumno', color: 'bg-blue-100 text-blue-700', icon: GraduationCap },
  family: { label: 'Familia', color: 'bg-green-100 text-green-700', icon: Users },
  tutor: { label: 'Tutor', color: 'bg-purple-100 text-purple-700', icon: UserCog },
  company: { label: 'Empresa', color: 'bg-orange-100 text-orange-700', icon: Building2 },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700', icon: UserCog },
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { role?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from('profiles')
    .select('*, centers(name)')
    .order('created_at', { ascending: false })

  if (searchParams.role) {
    query = query.eq('role', searchParams.role)
  }

  const { data: users, error } = await query.limit(50)

  const roles = ['student', 'family', 'tutor', 'company', 'admin']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/users"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !searchParams.role ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </Link>
            {roles.map((role) => (
              <Link
                key={role}
                href={`/admin/users?role=${role}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  searchParams.role === role ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {roleLabels[role].label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar usuarios: {error.message}
        </div>
      ) : users && users.length > 0 ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Usuario</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Rol</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Centro</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const roleInfo = roleLabels[user.role] || roleLabels.student
                const RoleIcon = roleInfo.icon
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(user.centers as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
          <p className="text-gray-500">Los usuarios aparecerán aquí cuando se registren</p>
        </div>
      )}
    </div>
  )
}

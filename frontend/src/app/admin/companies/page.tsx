import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Building, CheckCircle, XCircle, Clock } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Aprobada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-700', icon: XCircle },
  suspended: { label: 'Suspendida', color: 'bg-gray-100 text-gray-700', icon: XCircle },
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from('companies')
    .select('*, profiles!companies_profile_id_fkey(first_name, last_name, email)')
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: companies, error } = await query

  const statuses = ['pending', 'approved', 'rejected', 'suspended']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Empresas Colaboradoras</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar empresas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/companies"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !searchParams.status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </Link>
            {statuses.map((status) => (
              <Link
                key={status}
                href={`/admin/companies?status=${status}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  searchParams.status === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {statusLabels[status].label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Companies List */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar empresas: {error.message}
        </div>
      ) : companies && companies.length > 0 ? (
        <div className="space-y-4">
          {companies.map((company) => {
            const statusInfo = statusLabels[company.status] || statusLabels.pending
            const StatusIcon = statusInfo.icon
            const profile = company.profiles as any
            return (
              <div key={company.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Building className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.company_name}</h3>
                      {company.trade_name && (
                        <p className="text-sm text-gray-500">{company.trade_name}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Contacto: {profile?.first_name} {profile?.last_name} ({profile?.email})
                      </p>
                      {company.sector && (
                        <p className="text-sm text-gray-500">Sector: {company.sector}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </span>
                </div>

                {company.description && (
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{company.description}</p>
                )}

                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver detalles
                  </Link>
                  {company.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empresas</h3>
          <p className="text-gray-500">Las empresas aparecerán aquí cuando se registren</p>
        </div>
      )}
    </div>
  )
}

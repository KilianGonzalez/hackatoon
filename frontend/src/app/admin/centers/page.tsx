import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search, Building2, MapPin, Users } from 'lucide-react'

export default async function CentersPage() {
  const supabase = createClient()

  const { data: centers, error } = await supabase
    .from('centers')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centros Educativos</h1>
        <Link
          href="/admin/centers/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo centro
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar centros..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Centers Grid */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar centros: {error.message}
        </div>
      ) : centers && centers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center) => (
            <Link
              key={center.id}
              href={`/admin/centers/${center.id}`}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{center.name}</h3>
                  <p className="text-sm text-gray-500">{center.code || 'Sin código'}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{center.city || 'Sin ciudad'}, {center.province || ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{center.type === 'secondary' ? 'Secundaria' : center.type === 'vocational' ? 'FP' : 'Mixto'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  center.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {center.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay centros</h3>
          <p className="text-gray-500 mb-4">Añade el primer centro educativo</p>
          <Link
            href="/admin/centers/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo centro
          </Link>
        </div>
      )}
    </div>
  )
}

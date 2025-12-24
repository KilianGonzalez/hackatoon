import { createClient } from '@/lib/supabase/server'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default async function ErrorsPage() {
  const supabase = createClient()

  const { data: errors, error } = await supabase
    .from('error_reports')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Errores Reportados</h1>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar reportes: {error.message}
        </div>
      ) : errors && errors.length > 0 ? (
        <div className="space-y-4">
          {errors.map((err) => (
            <div key={err.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                      err.status === 'new' 
                        ? 'bg-red-100 text-red-700' 
                        : err.status === 'investigating'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {err.status === 'new' && <Clock className="h-3 w-3" />}
                      {err.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                      {err.status === 'new' ? 'Nuevo' : err.status === 'investigating' ? 'Investigando' : 'Resuelto'}
                    </span>
                    <p className="font-medium text-gray-900">{err.error_type || 'Error'}</p>
                    <p className="text-sm text-gray-600 mt-1">{err.message}</p>
                    {err.url && (
                      <p className="text-xs text-gray-400 mt-1">URL: {err.url}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(err.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay errores</h3>
          <p className="text-gray-500">Los errores reportados aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

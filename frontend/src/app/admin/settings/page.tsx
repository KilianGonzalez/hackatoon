import { Settings, Bell, Shield, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la plataforma
              </label>
              <input
                type="text"
                defaultValue="OVOC"
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contacto
              </label>
              <input
                type="email"
                defaultValue="soporte@ovoc.com"
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Notificar nuevos registros de empresas</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Notificar errores críticos</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Resumen semanal de actividad</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Requerir verificación de email</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Aprobar empresas manualmente</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Aprobar vínculos familiares por tutor</span>
            </label>
          </div>
        </div>

        {/* Database */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Base de datos</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Proyecto Supabase:</strong> ovoc</p>
            <p><strong>Región:</strong> West EU</p>
            <p><strong>Estado:</strong> <span className="text-green-600">Conectado</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Guardar cambios
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

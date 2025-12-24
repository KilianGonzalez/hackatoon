'use client'

import { useState, useEffect } from 'react'
import { Building2, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [company, setCompany] = useState<any>(null)
  const [formData, setFormData] = useState({
    company_name: '',
    trade_name: '',
    cif: '',
    sector: '',
    description: '',
    website: '',
    address: '',
    city: '',
    postal_code: '',
    contact_phone: '',
  })

  useEffect(() => {
    loadCompany()
  }, [])

  const loadCompany = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (data) {
        setCompany(data)
        setFormData({
          company_name: data.company_name || '',
          trade_name: data.trade_name || '',
          cif: data.cif || '',
          sector: data.sector || '',
          description: data.description || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          contact_phone: data.contact_phone || '',
        })
      }
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()

    const { error } = await supabase
      .from('companies')
      .update(formData)
      .eq('id', company.id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  const sectors = [
    'Tecnología e Informática',
    'Sanidad y Salud',
    'Educación',
    'Industria y Manufactura',
    'Comercio y Retail',
    'Hostelería y Turismo',
    'Construcción',
    'Transporte y Logística',
    'Servicios Financieros',
    'Marketing y Comunicación',
    'Consultoría',
    'Energía y Medio Ambiente',
    'Agricultura y Alimentación',
    'Arte y Cultura',
    'Deportes',
    'Otro',
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Perfil de Empresa</h1>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* Company Status */}
        <div className={`p-4 rounded-lg ${
          company?.status === 'approved' ? 'bg-green-50 border border-green-200' :
          company?.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <Building2 className={`h-5 w-5 ${
              company?.status === 'approved' ? 'text-green-600' :
              company?.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
            }`} />
            <span className={`font-medium ${
              company?.status === 'approved' ? 'text-green-800' :
              company?.status === 'pending' ? 'text-yellow-800' : 'text-red-800'
            }`}>
              Estado: {company?.status === 'approved' ? 'Aprobada' :
                       company?.status === 'pending' ? 'Pendiente de aprobación' :
                       company?.status === 'rejected' ? 'Rechazada' : 'Suspendida'}
            </span>
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información básica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón social *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre comercial
                </label>
                <input
                  type="text"
                  value={formData.trade_name}
                  onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CIF
                </label>
                <input
                  type="text"
                  value={formData.cif}
                  onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="B12345678"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecciona un sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de la empresa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Describe tu empresa, qué hacéis, qué perfiles buscáis..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio web
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://www.tuempresa.com"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección y contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código postal
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <Check className="h-5 w-5" />
              Guardado
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </div>
  )
}

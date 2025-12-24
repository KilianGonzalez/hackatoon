import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building, Globe, MapPin, Phone, Mail } from 'lucide-react'
import CompanyActions from './CompanyActions'

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select('*, profiles!companies_profile_id_fkey(*)')
    .eq('id', params.id)
    .single()

  if (error || !company) {
    notFound()
  }

  const profile = company.profiles as any

  return (
    <div>
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-xl">
                <Building className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.company_name}</h1>
                {company.trade_name && (
                  <p className="text-gray-500">{company.trade_name}</p>
                )}
                {company.sector && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {company.sector}
                  </span>
                )}
              </div>
            </div>

            {company.description && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Descripción</h2>
                <p className="text-gray-700">{company.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {company.cif && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">CIF</h3>
                  <p className="text-gray-900">{company.cif}</p>
                </div>
              )}
              {company.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sitio web</h3>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contacto principal</p>
                  <p className="text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
              </div>
              {company.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-gray-900">{company.contact_phone}</p>
                  </div>
                </div>
              )}
              {(company.address || company.city) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="text-gray-900">
                      {company.address}
                      {company.address && company.city && ', '}
                      {company.city}
                      {company.postal_code && ` ${company.postal_code}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <CompanyActions company={company} />

          {/* Metadata */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Registrada</span>
                <span className="text-gray-900">
                  {new Date(company.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
              {company.approved_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Aprobada</span>
                  <span className="text-gray-900">
                    {new Date(company.approved_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

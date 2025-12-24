import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BookOpen, FileText, Video, Link as LinkIcon, Eye } from 'lucide-react'

const typeIcons: Record<string, any> = {
  guide: FileText,
  article: FileText,
  video: Video,
  faq: BookOpen,
  external_link: LinkIcon,
}

export default async function CompanyResourcesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase
    .from('companies')
    .select('id, status')
    .eq('profile_id', user?.id)
    .single()

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Borrador' },
    pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Publicado' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazado' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Recursos</h1>
        {company?.status === 'approved' && (
          <Link
            href="/app/company/resources/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo recurso
          </Link>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar recursos: {error.message}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = typeIcons[resource.resource_type] || FileText
            const status = statusColors[resource.status] || statusColors.draft
            
            return (
              <Link
                key={resource.id}
                href={`/app/company/resources/${resource.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                
                <span className="text-xs text-gray-500 uppercase">
                  {resource.resource_type === 'guide' ? 'Guía' :
                   resource.resource_type === 'article' ? 'Artículo' :
                   resource.resource_type === 'video' ? 'Vídeo' :
                   resource.resource_type === 'faq' ? 'FAQ' : 'Enlace'}
                </span>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
                  {resource.title}
                </h3>
                
                {resource.summary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{resource.summary}</p>
                )}

                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {resource.view_count} vistas
                  </div>
                  <span>
                    {new Date(resource.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin recursos</h3>
          <p className="text-gray-500 mb-4">Comparte guías, vídeos o artículos con los estudiantes</p>
          {company?.status === 'approved' && (
            <Link
              href="/app/company/resources/new"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              <Plus className="h-5 w-5" />
              Nuevo recurso
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

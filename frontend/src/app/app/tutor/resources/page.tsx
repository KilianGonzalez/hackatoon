import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react'

const typeIcons: Record<string, any> = {
  guide: FileText,
  article: FileText,
  video: Video,
  faq: BookOpen,
  external_link: LinkIcon,
}

export default async function TutorResourcesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .or(`center_id.eq.${profile?.center_id},center_id.is.null`)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recursos</h1>
        <Link
          href="/app/tutor/resources/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo recurso
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar recursos: {error.message}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = typeIcons[resource.resource_type] || FileText
            return (
              <Link
                key={resource.id}
                href={`/app/tutor/resources/${resource.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-500 uppercase">
                      {resource.resource_type === 'guide' ? 'Guía' :
                       resource.resource_type === 'article' ? 'Artículo' :
                       resource.resource_type === 'video' ? 'Vídeo' :
                       resource.resource_type === 'faq' ? 'FAQ' : 'Enlace'}
                    </span>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                {resource.summary && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{resource.summary}</p>
                )}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    resource.audience === 'all' ? 'bg-gray-100 text-gray-700' :
                    resource.audience === 'students' ? 'bg-blue-100 text-blue-700' :
                    resource.audience === 'families' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {resource.audience === 'all' ? 'Todos' :
                     resource.audience === 'students' ? 'Alumnos' :
                     resource.audience === 'families' ? 'Familias' : 'Tutores'}
                  </span>
                  <span className="text-gray-500">{resource.view_count} vistas</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos</h3>
          <p className="text-gray-500 mb-4">Crea recursos para compartir con alumnos y familias</p>
          <Link
            href="/app/tutor/resources/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo recurso
          </Link>
        </div>
      )}
    </div>
  )
}

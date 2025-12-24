import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react'

const typeIcons: Record<string, any> = {
  guide: FileText,
  article: FileText,
  video: Video,
  faq: BookOpen,
  external_link: LinkIcon,
}

export default async function FamilyResourcesPage() {
  const supabase = createClient()

  // Get published resources for families
  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .in('audience', ['all', 'families'])
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recursos para Familias</h1>

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
                href={`/app/family/resources/${resource.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Icon className="h-6 w-6 text-green-600" />
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
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin recursos</h3>
          <p className="text-gray-500">Los recursos para familias aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

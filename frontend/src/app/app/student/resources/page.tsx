import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, FileText, Video, Link as LinkIcon, Bookmark } from 'lucide-react'

const typeIcons: Record<string, any> = {
  guide: FileText,
  article: FileText,
  video: Video,
  faq: BookOpen,
  external_link: LinkIcon,
}

export default async function StudentResourcesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  // Get published resources for students
  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .or(`center_id.eq.${student?.center_id},center_id.is.null`)
    .eq('status', 'published')
    .in('audience', ['all', 'students'])
    .order('created_at', { ascending: false })

  // Get saved resources
  const { data: savedResources } = await supabase
    .from('saved_resources')
    .select('resource_id')
    .eq('profile_id', user?.id)

  const savedIds = new Set(savedResources?.map(s => s.resource_id) || [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recursos</h1>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar recursos: {error.message}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = typeIcons[resource.resource_type] || FileText
            const isSaved = savedIds.has(resource.id)
            
            return (
              <Link
                key={resource.id}
                href={`/app/student/resources/${resource.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow relative"
              >
                {isSaved && (
                  <div className="absolute top-4 right-4">
                    <Bookmark className="h-5 w-5 text-blue-600 fill-blue-600" />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos</h3>
          <p className="text-gray-500">Los recursos aparecerán aquí cuando estén disponibles</p>
        </div>
      )}
    </div>
  )
}

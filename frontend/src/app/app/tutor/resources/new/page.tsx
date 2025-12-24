'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewTutorResourcePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    resource_type: 'article',
    external_url: '',
    audience: 'students',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('center_id')
      .eq('id', user?.id)
      .single()

    const { error } = await supabase.from('resources').insert({
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      resource_type: formData.resource_type,
      external_url: formData.external_url || null,
      audience: formData.audience,
      center_id: profile?.center_id,
      created_by: user?.id,
      status: 'published',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/app/tutor/resources')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/app/tutor/resources"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a recursos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Recurso</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Guía: Cómo elegir carrera universitaria"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de recurso *
            </label>
            <select
              value={formData.resource_type}
              onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="article">Artículo</option>
              <option value="guide">Guía</option>
              <option value="video">Vídeo</option>
              <option value="faq">FAQ</option>
              <option value="external_link">Enlace externo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audiencia *
            </label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="students">Estudiantes</option>
              <option value="families">Familias</option>
              <option value="tutors">Tutores</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resumen *
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Breve descripción del recurso..."
          />
        </div>

        {formData.resource_type === 'external_link' || formData.resource_type === 'video' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              value={formData.external_url}
              onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Escribe el contenido del recurso..."
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Publicando...
              </>
            ) : (
              'Publicar recurso'
            )}
          </button>
          <Link
            href="/app/tutor/resources"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

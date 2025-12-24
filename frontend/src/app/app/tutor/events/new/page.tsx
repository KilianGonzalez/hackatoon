'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'talk',
    start_date: '',
    start_time: '',
    end_time: '',
    location: '',
    is_online: false,
    online_url: '',
    max_attendees: '',
    target_grades: [] as string[],
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

    if (!profile?.center_id) {
      setError('No se encontró el centro asociado')
      setLoading(false)
      return
    }

    const startDatetime = new Date(`${formData.start_date}T${formData.start_time}`)
    const endDatetime = new Date(`${formData.start_date}T${formData.end_time}`)

    const { error } = await supabase.from('events').insert({
      title: formData.title,
      description: formData.description,
      event_type: formData.event_type,
      start_datetime: startDatetime.toISOString(),
      end_datetime: endDatetime.toISOString(),
      location: formData.location || null,
      is_online: formData.is_online,
      online_url: formData.online_url || null,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      target_grades: formData.target_grades,
      center_id: profile.center_id,
      created_by: user?.id,
      status: 'draft',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/app/tutor/events')
    router.refresh()
  }

  const grades = ['3eso', '4eso', '1bach', '2bach', '1fp', '2fp']
  const gradeLabels: Record<string, string> = {
    '3eso': '3º ESO',
    '4eso': '4º ESO',
    '1bach': '1º Bach',
    '2bach': '2º Bach',
    '1fp': '1º FP',
    '2fp': '2º FP',
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/app/tutor/events"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Evento</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del evento *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Charla: Conoce la FP de Informática"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe el evento..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de evento *
            </label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="talk">Charla</option>
              <option value="workshop">Taller</option>
              <option value="visit">Visita</option>
              <option value="open_day">Jornada de puertas abiertas</option>
              <option value="fair">Feria</option>
              <option value="tutoring">Tutoría grupal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aforo máximo
            </label>
            <input
              type="number"
              value={formData.max_attendees}
              onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Sin límite"
              min="1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora inicio *
            </label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora fin *
            </label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={formData.is_online}
              onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Evento online</span>
          </label>
          
          {formData.is_online ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la reunión
              </label>
              <input
                type="url"
                value={formData.online_url}
                onChange={(e) => setFormData({ ...formData, online_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://meet.google.com/..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Salón de actos"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cursos objetivo
          </label>
          <div className="flex flex-wrap gap-2">
            {grades.map((grade) => (
              <label
                key={grade}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                  formData.target_grades.includes(grade)
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.target_grades.includes(grade)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, target_grades: [...formData.target_grades, grade] })
                    } else {
                      setFormData({ ...formData, target_grades: formData.target_grades.filter(g => g !== grade) })
                    }
                  }}
                  className="sr-only"
                />
                {gradeLabels[grade]}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear evento'
            )}
          </button>
          <Link
            href="/app/tutor/events"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

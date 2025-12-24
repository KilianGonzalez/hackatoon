'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewCompanyEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [centers, setCenters] = useState<any[]>([])
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
    center_id: '',
  })

  useEffect(() => {
    loadCenters()
  }, [])

  const loadCenters = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('centers')
      .select('id, name')
      .eq('is_active', true)
    setCenters(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('profile_id', user?.id)
      .single()

    if (!company) {
      setError('No se encontró la empresa')
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
      center_id: formData.center_id || null,
      company_id: company.id,
      created_by: user?.id,
      status: 'pending_approval',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/app/company/events')
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
        href="/app/company/events"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Proponer Evento</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Los eventos propuestos por empresas requieren aprobación de un administrador antes de ser publicados.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del evento *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Charla: Conoce nuestra empresa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Describe el evento, qué aprenderán los estudiantes..."
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="talk">Charla</option>
              <option value="workshop">Taller práctico</option>
              <option value="visit">Visita a empresa</option>
              <option value="open_day">Jornada de puertas abiertas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Centro educativo
            </label>
            <select
              value={formData.center_id}
              onChange={(e) => setFormData({ ...formData, center_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos los centros</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>{center.name}</option>
              ))}
            </select>
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
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://meet.google.com/..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required={!formData.is_online}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Dirección o nombre del lugar"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aforo máximo
          </label>
          <input
            type="number"
            value={formData.max_attendees}
            onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Sin límite"
            min="1"
          />
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
                    ? 'bg-orange-100 border-orange-300 text-orange-700'
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
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar propuesta'
            )}
          </button>
          <Link
            href="/app/company/events"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

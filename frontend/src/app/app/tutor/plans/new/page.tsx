'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PlanItem {
  title: string
  description: string
  order_index: number
}

export default function NewPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedStudent = searchParams.get('student')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    student_id: preselectedStudent || '',
    target_end_date: '',
  })
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    { title: '', description: '', order_index: 0 }
  ])

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('center_id')
      .eq('id', user?.id)
      .single()

    if (profile?.center_id) {
      const { data } = await supabase
        .from('students')
        .select('id, current_grade, profiles!students_profile_id_fkey(first_name, last_name)')
        .eq('center_id', profile.center_id)
      setStudents(data || [])
    }
  }

  const addPlanItem = () => {
    setPlanItems([...planItems, { title: '', description: '', order_index: planItems.length }])
  }

  const removePlanItem = (index: number) => {
    if (planItems.length > 1) {
      const newItems = planItems.filter((_, i) => i !== index)
      setPlanItems(newItems.map((item, i) => ({ ...item, order_index: i })))
    }
  }

  const updatePlanItem = (index: number, field: keyof PlanItem, value: string) => {
    const newItems = [...planItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setPlanItems(newItems)
  }

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

    // Create plan
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .insert({
        title: formData.title,
        description: formData.description,
        student_id: formData.student_id,
        center_id: profile.center_id,
        created_by: user?.id,
        target_end_date: formData.target_end_date || null,
        status: 'active',
        progress_percentage: 0,
      })
      .select()
      .single()

    if (planError) {
      setError(planError.message)
      setLoading(false)
      return
    }

    // Create plan items
    const validItems = planItems.filter(item => item.title.trim())
    if (validItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('plan_items')
        .insert(validItems.map(item => ({
          plan_id: plan.id,
          title: item.title,
          description: item.description,
          order_index: item.order_index,
          status: 'pending',
        })))

      if (itemsError) {
        console.error('Error creating plan items:', itemsError)
      }
    }

    router.push('/app/tutor/plans')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/app/tutor/plans"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a planes
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Plan de Orientación</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alumno *
            </label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecciona un alumno</option>
              {students.map((student) => {
                const profile = student.profiles as any
                return (
                  <option key={student.id} value={student.id}>
                    {profile?.first_name} {profile?.last_name} ({student.current_grade})
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del plan *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Plan de orientación 4º ESO"
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
              placeholder="Objetivos y descripción del plan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha objetivo de finalización
            </label>
            <input
              type="date"
              value={formData.target_end_date}
              onChange={(e) => setFormData({ ...formData, target_end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Plan Items */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Objetivos del plan</h2>
            <button
              type="button"
              onClick={addPlanItem}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Añadir objetivo
            </button>
          </div>

          <div className="space-y-4">
            {planItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Objetivo {index + 1}</span>
                  {planItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlanItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updatePlanItem(index, 'title', e.target.value)}
                    placeholder="Título del objetivo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updatePlanItem(index, 'description', e.target.value)}
                    placeholder="Descripción (opcional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear plan'
            )}
          </button>
          <Link
            href="/app/tutor/plans"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

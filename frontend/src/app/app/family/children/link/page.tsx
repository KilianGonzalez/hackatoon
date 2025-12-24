'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LinkChildPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    studentEmail: '',
    relationship: 'father',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Find student by email
    const { data: studentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', formData.studentEmail)
      .eq('role', 'student')
      .single()

    if (profileError || !studentProfile) {
      setError('No se encontró ningún alumno con ese email')
      setLoading(false)
      return
    }

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('profile_id', studentProfile.id)
      .single()

    if (studentError || !student) {
      setError('No se encontró el registro del alumno')
      setLoading(false)
      return
    }

    // Check if link already exists
    const { data: existingLink } = await supabase
      .from('guardian_links')
      .select('id, status')
      .eq('guardian_id', user?.id)
      .eq('student_id', student.id)
      .single()

    if (existingLink) {
      if (existingLink.status === 'approved') {
        setError('Ya tienes un vínculo aprobado con este alumno')
      } else if (existingLink.status === 'pending') {
        setError('Ya tienes una solicitud pendiente para este alumno')
      } else {
        setError('Ya existe un vínculo con este alumno')
      }
      setLoading(false)
      return
    }

    // Create guardian link (pending approval)
    const { error: linkError } = await supabase
      .from('guardian_links')
      .insert({
        guardian_id: user?.id,
        student_id: student.id,
        relationship: formData.relationship,
        status: 'pending',
      })

    if (linkError) {
      setError(linkError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h1>
          <p className="text-gray-600 mb-6">
            Tu solicitud de vinculación ha sido enviada. El tutor del alumno debe aprobarla para que puedas ver su información.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSuccess(false)
                setFormData({ studentEmail: '', relationship: 'father' })
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Vincular otro
            </button>
            <Link
              href="/app/family/children"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Ver mis hijos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <Link
        href="/app/family/children"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis hijos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vincular Hijo/a</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Introduce el email con el que tu hijo/a se registró en la plataforma. 
            La solicitud deberá ser aprobada por el tutor del centro.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email del alumno *
          </label>
          <input
            type="email"
            value={formData.studentEmail}
            onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="alumno@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relación *
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="father">Padre</option>
            <option value="mother">Madre</option>
            <option value="guardian">Tutor legal</option>
            <option value="other">Otro familiar</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando solicitud...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Enviar solicitud de vinculación
            </>
          )}
        </button>
      </form>
    </div>
  )
}

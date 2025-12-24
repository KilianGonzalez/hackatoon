'use client'

import { useState, useEffect } from 'react'
import { User, Target, BookOpen, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const interestOptions = [
  { id: 'informatica', label: 'Informática y Tecnología' },
  { id: 'sanidad', label: 'Sanidad y Salud' },
  { id: 'administracion', label: 'Administración y Gestión' },
  { id: 'comercio', label: 'Comercio y Marketing' },
  { id: 'educacion', label: 'Educación' },
  { id: 'arte', label: 'Arte y Diseño' },
  { id: 'ciencias', label: 'Ciencias' },
  { id: 'ingenieria', label: 'Ingeniería' },
  { id: 'derecho', label: 'Derecho y Ciencias Sociales' },
  { id: 'turismo', label: 'Turismo y Hostelería' },
  { id: 'deporte', label: 'Deporte y Actividad Física' },
  { id: 'comunicacion', label: 'Comunicación y Periodismo' },
]

const pathOptions = [
  { id: 'bachillerato', label: 'Bachillerato' },
  { id: 'fp_medio', label: 'FP Grado Medio' },
  { id: 'fp_superior', label: 'FP Grado Superior' },
  { id: 'universidad', label: 'Universidad' },
  { id: 'trabajo', label: 'Incorporación laboral' },
  { id: 'indeciso', label: 'Aún no lo sé' },
]

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [preferredPath, setPreferredPath] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      setProfile(profileData)
      setStudent(studentData)
      setInterests(studentData?.interests || [])
      setPreferredPath(studentData?.preferred_path || '')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    if (student) {
      await supabase
        .from('students')
        .update({
          interests,
          preferred_path: preferredPath,
        })
        .eq('id', student.id)
    }

    setSaving(false)
  }

  const toggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter(i => i !== interestId))
    } else {
      setInterests([...interests, interestId])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={profile?.first_name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input
              type="text"
              value={profile?.last_name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
            <input
              type="text"
              value={student?.current_grade || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Mis intereses</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona las áreas que más te interesan para recibir recomendaciones personalizadas
        </p>
        
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                interests.includes(interest.id)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Path */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Itinerario preferido</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          ¿Qué camino te gustaría seguir después de este curso?
        </p>
        
        <div className="grid md:grid-cols-2 gap-2">
          {pathOptions.map((path) => (
            <button
              key={path.id}
              onClick={() => setPreferredPath(path.id)}
              className={`px-4 py-3 rounded-lg border text-left transition-colors ${
                preferredPath === path.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {path.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          'Guardar cambios'
        )}
      </button>
    </div>
  )
}

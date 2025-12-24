'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Copy, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewInvitationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    role: 'student',
    email: '',
    expiresInDays: '30',
  })

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
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

    const code = generateCode()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresInDays))

    const { error } = await supabase.from('invitations').insert({
      role: formData.role,
      email: formData.email || null,
      code,
      center_id: profile.center_id,
      created_by: user?.id,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setGeneratedCode(code)
    setLoading(false)
  }

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (generatedCode) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Invitación creada!</h1>
          <p className="text-gray-600 mb-6">
            Comparte este código con el {formData.role === 'student' ? 'alumno' : formData.role === 'family' ? 'familiar' : 'tutor'}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Código de invitación</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-3xl font-mono font-bold text-purple-600 tracking-wider">
                {generatedCode}
              </code>
              <button
                onClick={copyCode}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copiar código"
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            El código expira en {formData.expiresInDays} días
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setGeneratedCode(null)
                setFormData({ role: 'student', email: '', expiresInDays: '30' })
              }}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Crear otra
            </button>
            <Link
              href="/app/tutor/invitations"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Ver todas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <Link
        href="/app/tutor/invitations"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a invitaciones
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Invitación</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de usuario *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="student">Alumno</option>
            <option value="family">Familia</option>
            <option value="tutor">Tutor/Orientador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (opcional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="alumno@email.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si lo dejas vacío, se generará un código genérico
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Validez
          </label>
          <select
            value={formData.expiresInDays}
            onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7">7 días</option>
            <option value="14">14 días</option>
            <option value="30">30 días</option>
            <option value="90">90 días</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generando...
            </>
          ) : (
            'Generar invitación'
          )}
        </button>
      </form>
    </div>
  )
}

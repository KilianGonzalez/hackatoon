'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Users, BookOpen, Building2 } from 'lucide-react'

type UserType = 'student' | 'family' | 'company' | null

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<UserType>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">OVOC</span>
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Ya tengo cuenta
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {!selectedType ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¿Cómo quieres registrarte?
              </h1>
              <p className="text-gray-600 mb-8">
                Selecciona tu tipo de cuenta para continuar
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <UserTypeCard
                  icon={<GraduationCap className="h-10 w-10" />}
                  title="Alumno"
                  description="Soy estudiante y quiero orientación"
                  color="blue"
                  onClick={() => setSelectedType('student')}
                />
                <UserTypeCard
                  icon={<Users className="h-10 w-10" />}
                  title="Familia"
                  description="Soy padre/madre/tutor de un alumno"
                  color="green"
                  onClick={() => setSelectedType('family')}
                />
                <UserTypeCard
                  icon={<Building2 className="h-10 w-10" />}
                  title="Empresa"
                  description="Quiero colaborar con charlas/talleres"
                  color="orange"
                  onClick={() => setSelectedType('company')}
                />
              </div>

              <p className="mt-8 text-sm text-gray-500">
                ¿Eres tutor/orientador de un centro?{' '}
                <span className="text-blue-600">
                  Contacta con tu centro para recibir una invitación.
                </span>
              </p>
            </div>
          ) : (
            <RegisterForm type={selectedType} onBack={() => setSelectedType(null)} />
          )}
        </div>
      </main>
    </div>
  )
}

function UserTypeCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'green' | 'orange'
  onClick: () => void
}) {
  const colorClasses = {
    blue: 'hover:border-blue-500 hover:bg-blue-50 text-blue-600',
    green: 'hover:border-green-500 hover:bg-green-50 text-green-600',
    orange: 'hover:border-orange-500 hover:bg-orange-50 text-orange-600',
  }

  return (
    <button
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border-2 border-gray-200 transition-all ${colorClasses[color]} text-left`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}

function RegisterForm({ type, onBack }: { type: UserType; onBack: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
    companyName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const titles = {
    student: 'Registro de Alumno',
    family: 'Registro de Familia',
    company: 'Registro de Empresa',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    
    // TODO: Implement registration logic with Supabase
    // For now, just show a message
    setTimeout(() => {
      setLoading(false)
      alert('Registro en desarrollo. Por favor, contacta con el administrador.')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {titles[type!]}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {type === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de invitación *
            </label>
            <input
              type="text"
              value={formData.invitationCode}
              onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce el código de tu centro"
            />
            <p className="text-xs text-gray-500 mt-1">
              Solicita el código a tu tutor/orientador
            </p>
          </div>
        )}

        {type === 'company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de tu empresa"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" required className="mt-1 rounded border-gray-300" />
          <span className="text-sm text-gray-600">
            Acepto los{' '}
            <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>
            {' '}y la{' '}
            <a href="#" className="text-blue-600 hover:underline">política de privacidad</a>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  )
}

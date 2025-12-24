'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Eye, EyeOff, Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email o contraseña incorrectos' 
        : error.message)
      setLoading(false)
      return
    }

    router.push('/app')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/30 transition-colors">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">OVOC</span>
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Sparkles className="h-4 w-4" />
              Orientación con IA
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Tu futuro<br />
              empieza aquí
            </h1>
            <p className="text-xl text-blue-100 max-w-md">
              Accede a tu plan de orientación personalizado y descubre las mejores opciones para tu carrera profesional.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white" />
            </div>
            <p className="text-sm text-blue-100">
              +2,000 estudiantes ya orientados
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-white p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OVOC</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido de nuevo!
                </h1>
                <p className="text-gray-500">
                  Inicia sesión para continuar con tu orientación
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Recordarme</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-500">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Regístrate gratis
                  </Link>
                </p>
              </div>
            </div>

            {/* Quick access for demo */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-700 font-medium mb-2">Acceso rápido (demo)</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button 
                  onClick={() => { setEmail('tutor@test.com'); setPassword('tutor123'); }}
                  className="px-3 py-1.5 bg-white rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  Tutor
                </button>
                <button 
                  onClick={() => { setEmail('alumno@test.com'); setPassword('alumno123'); }}
                  className="px-3 py-1.5 bg-white rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  Alumno
                </button>
                <button 
                  onClick={() => { setEmail('familia@test.com'); setPassword('familia123'); }}
                  className="px-3 py-1.5 bg-white rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  Familia
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

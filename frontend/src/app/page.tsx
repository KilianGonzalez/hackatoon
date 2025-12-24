import Link from 'next/link'
import { GraduationCap, Users, Building2, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">OVOC</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Orienta tu futuro académico
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plataforma de orientación académico-profesional personalizada para estudiantes, 
          familias y centros educativos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Comenzar ahora
          </Link>
          <Link 
            href="#features" 
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Saber más
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          ¿Qué ofrecemos?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<GraduationCap className="h-10 w-10 text-blue-600" />}
            title="Para Alumnos"
            description="Plan personalizado de orientación, test de intereses y recomendaciones de itinerarios formativos."
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-green-600" />}
            title="Para Familias"
            description="Seguimiento del progreso de tus hijos, guías explicativas y comunicación directa con tutores."
          />
          <FeatureCard 
            icon={<BookOpen className="h-10 w-10 text-purple-600" />}
            title="Para Centros"
            description="Gestión de planes, eventos de orientación y analíticas de participación."
          />
          <FeatureCard 
            icon={<Building2 className="h-10 w-10 text-orange-600" />}
            title="Para Empresas"
            description="Colabora con charlas, talleres y visitas para acercar el mundo profesional a los estudiantes."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para orientar tu futuro?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Únete a nuestra plataforma y accede a todas las herramientas de orientación académica.
          </p>
          <Link 
            href="/register" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors inline-block"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 OVOC - Orientación Académica. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

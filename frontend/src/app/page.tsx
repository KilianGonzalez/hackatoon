import Link from 'next/link'
import { 
  GraduationCap, 
  Users, 
  Building2, 
  BookOpen, 
  Sparkles, 
  Target, 
  Calendar, 
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                OVOC
              </span>
              <span className="hidden sm:block text-xs text-gray-500">Orientación Vocacional</span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
            >
              Comenzar gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500" />
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Plataforma de orientación académica #1 en España
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Descubre tu
              <span className="relative mx-3">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  camino
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#2563eb"/>
                      <stop offset="1" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              profesional
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Orientación personalizada con IA para estudiantes de ESO, Bachillerato y FP. 
              Conectamos alumnos, familias, centros y empresas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/register" 
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                Empezar ahora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#como-funciona" 
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Ver cómo funciona
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>100% gratuito para alumnos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>+50 centros educativos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Orientación con IA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-gray-500 mb-8">Colaboran con nosotros</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
            <div className="text-2xl font-bold text-gray-400">IES Madrid</div>
            <div className="text-2xl font-bold text-gray-400">Colegio San José</div>
            <div className="text-2xl font-bold text-gray-400">Academia Norte</div>
            <div className="text-2xl font-bold text-gray-400">FP Digital</div>
          </div>
        </div>
      </section>

      {/* Features for each role */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Una plataforma, múltiples beneficios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diseñada para conectar a todos los actores del proceso de orientación académica
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <RoleCard 
              icon={<GraduationCap className="h-8 w-8" />}
              title="Para Estudiantes"
              color="blue"
              features={[
                "Test de intereses vocacionales con IA",
                "Plan de orientación personalizado",
                "Explorador de carreras y profesiones",
                "Eventos y charlas de empresas"
              ]}
            />
            <RoleCard 
              icon={<Users className="h-8 w-8" />}
              title="Para Familias"
              color="green"
              features={[
                "Seguimiento del progreso de tus hijos",
                "Guías explicativas de itinerarios",
                "Comunicación directa con tutores",
                "Alertas de eventos importantes"
              ]}
            />
            <RoleCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Para Centros Educativos"
              color="purple"
              features={[
                "Gestión de planes por alumno",
                "Organización de eventos",
                "Analíticas de participación",
                "Invitaciones y control de acceso"
              ]}
            />
            <RoleCard 
              icon={<Building2 className="h-8 w-8" />}
              title="Para Empresas"
              color="orange"
              features={[
                "Proponer charlas y talleres",
                "Compartir recursos formativos",
                "Conectar con futuros talentos",
                "Visibilidad en centros educativos"
              ]}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              En 3 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard 
              number="1"
              icon={<Target className="h-6 w-6" />}
              title="Regístrate"
              description="Crea tu cuenta gratuita con el código de invitación de tu centro educativo"
            />
            <StepCard 
              number="2"
              icon={<Sparkles className="h-6 w-6" />}
              title="Descubre"
              description="Completa el test de intereses y recibe tu plan de orientación personalizado"
            />
            <StepCard 
              number="3"
              icon={<Calendar className="h-6 w-6" />}
              title="Participa"
              description="Asiste a eventos, explora recursos y avanza en tu camino profesional"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen de nosotros
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="OVOC me ayudó a descubrir que mi vocación estaba en la ingeniería. Ahora estudio en la universidad que siempre soñé."
              author="María García"
              role="Estudiante de 2º Bach"
            />
            <TestimonialCard 
              quote="Como padre, poder seguir el progreso de mi hijo y comunicarme con los tutores ha sido fundamental."
              author="Carlos Rodríguez"
              role="Padre de familia"
            />
            <TestimonialCard 
              quote="La plataforma nos ha permitido organizar mejor la orientación y llegar a más alumnos."
              author="Ana Martínez"
              role="Orientadora escolar"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para descubrir tu futuro?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Únete a miles de estudiantes que ya están construyendo su camino profesional con OVOC
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="group inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Crear cuenta gratis
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">OVOC</span>
              </div>
              <p className="text-sm">
                Plataforma de orientación académico-profesional para el futuro de los estudiantes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Registrarse</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Características</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Guía de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 OVOC - Orientación Vocacional. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function RoleCard({ 
  icon, 
  title, 
  color,
  features
}: { 
  icon: React.ReactNode
  title: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  features: string[]
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    green: 'from-green-500 to-green-600 shadow-green-500/25',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
  }

  const bgColors = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
  }

  const checkColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  }

  return (
    <div className={`relative p-8 rounded-3xl border-2 ${bgColors[color]} hover:shadow-xl transition-all duration-300 group`}>
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg mb-6 text-white`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className={`h-5 w-5 ${checkColors[color]} mt-0.5 flex-shrink-0`} />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ 
  number,
  icon, 
  title, 
  description 
}: { 
  number: string
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="relative text-center group">
      <div className="relative inline-flex mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center text-sm font-bold text-blue-600">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ 
  quote, 
  author, 
  role 
}: { 
  quote: string
  author: string
  role: string 
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">"{quote}"</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
}

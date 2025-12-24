import { createClient } from '@/lib/supabase/server'
import { Building2, Users, Building, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch stats
  const [centersResult, usersResult, companiesResult, errorsResult] = await Promise.all([
    supabase.from('centers').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('companies').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('error_reports').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const stats = [
    { 
      label: 'Centros', 
      value: centersResult.count || 0, 
      icon: Building2,
      color: 'blue'
    },
    { 
      label: 'Usuarios', 
      value: usersResult.count || 0, 
      icon: Users,
      color: 'green'
    },
    { 
      label: 'Empresas', 
      value: companiesResult.count || 0, 
      icon: Building,
      color: 'purple'
    },
    { 
      label: 'Errores', 
      value: errorsResult.count || 0, 
      icon: AlertCircle,
      color: 'red'
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction 
            href="/admin/centers/new" 
            title="Nuevo centro" 
            description="Añadir un centro educativo"
          />
          <QuickAction 
            href="/admin/companies?status=pending" 
            title="Empresas pendientes" 
            description="Revisar solicitudes de empresas"
          />
          <QuickAction 
            href="/admin/feedback" 
            title="Ver feedback" 
            description="Revisar comentarios de usuarios"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ 
  href, 
  title, 
  description 
}: { 
  href: string
  title: string
  description: string
}) {
  return (
    <a 
      href={href}
      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Building2, 
  LayoutDashboard, 
  Calendar,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

const menuItems = [
  { href: '/app/company', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/company/events', icon: Calendar, label: 'Mis Eventos' },
  { href: '/app/company/resources', icon: BookOpen, label: 'Recursos' },
  { href: '/app/company/stats', icon: BarChart3, label: 'Estadísticas' },
  { href: '/app/company/messages', icon: MessageSquare, label: 'Mensajes' },
  { href: '/app/company/settings', icon: Settings, label: 'Perfil Empresa' },
]

interface CompanySidebarProps {
  profile: Profile
  company: any
}

export default function CompanySidebar({ profile, company }: CompanySidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente de aprobación' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprobada' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada' },
    suspended: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Suspendida' },
  }

  const status = statusColors[company?.status] || statusColors.pending

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/app/company" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-orange-600" />
          <div>
            <span className="text-xl font-bold text-gray-900">OVOC</span>
            <span className="text-xs text-gray-500 block">Portal Empresa</span>
          </div>
        </Link>
      </div>

      {/* Company Status */}
      <div className={`px-4 py-3 ${status.bg} border-b`}>
        <p className="text-xs font-medium text-gray-600">Estado</p>
        <p className={`text-sm font-medium ${status.text}`}>{status.label}</p>
      </div>

      {/* Warning if not approved */}
      {company?.status !== 'approved' && (
        <div className="px-4 py-3 bg-yellow-50 border-b">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-700">
              {company?.status === 'pending' 
                ? 'Tu cuenta está pendiente de aprobación. Algunas funciones están limitadas.'
                : company?.status === 'rejected'
                ? 'Tu cuenta ha sido rechazada. Contacta con soporte.'
                : 'Tu cuenta está suspendida.'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/app/company' && pathname.startsWith(item.href))
            const isDisabled = company?.status !== 'approved' && 
              !['/', '/app/company', '/app/company/settings', '/app/company/messages'].includes(item.href)
            
            return (
              <li key={item.href}>
                <Link
                  href={isDisabled ? '#' : item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isDisabled 
                      ? 'text-gray-400 cursor-not-allowed'
                      : isActive 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={(e) => isDisabled && e.preventDefault()}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900 truncate">
            {company?.company_name || 'Empresa'}
          </p>
          <p className="text-xs text-gray-500 truncate">{profile.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors w-full px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

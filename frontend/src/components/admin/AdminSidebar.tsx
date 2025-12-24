'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  LayoutDashboard, 
  Building2, 
  Users, 
  Building, 
  MessageSquare,
  AlertCircle,
  Settings,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/centers', icon: Building2, label: 'Centros' },
  { href: '/admin/users', icon: Users, label: 'Usuarios' },
  { href: '/admin/companies', icon: Building, label: 'Empresas' },
  { href: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  { href: '/admin/errors', icon: AlertCircle, label: 'Errores' },
  { href: '/admin/settings', icon: Settings, label: 'Configuración' },
]

export default function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <span className="text-xl font-bold text-gray-900">OVOC</span>
            <span className="text-xs text-gray-500 block">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {profile.first_name[0]}{profile.last_name[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
          </div>
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

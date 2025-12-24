'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users,
  ClipboardList,
  Calendar,
  BookOpen,
  MessageSquare,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

const menuItems = [
  { href: '/app/family', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/family/children', icon: Users, label: 'Mis Hijos' },
  { href: '/app/family/plans', icon: ClipboardList, label: 'Planes' },
  { href: '/app/family/events', icon: Calendar, label: 'Eventos' },
  { href: '/app/family/resources', icon: BookOpen, label: 'Recursos' },
  { href: '/app/family/messages', icon: MessageSquare, label: 'Mensajes' },
]

interface FamilySidebarProps {
  profile: Profile
  linkedStudents: any[]
}

export default function FamilySidebar({ profile, linkedStudents }: FamilySidebarProps) {
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
        <Link href="/app/family" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-green-600" />
          <div>
            <span className="text-xl font-bold text-gray-900">OVOC</span>
            <span className="text-xs text-gray-500 block">Portal Familia</span>
          </div>
        </Link>
      </div>

      {/* Linked Children */}
      {linkedStudents.length > 0 && (
        <div className="px-4 py-3 bg-green-50 border-b">
          <p className="text-xs text-green-600 font-medium mb-2">Hijos vinculados</p>
          <div className="space-y-1">
            {linkedStudents.map((link) => {
              const student = link.students as any
              const studentProfile = student?.profiles as any
              return (
                <div key={link.id} className="text-sm text-gray-900">
                  {studentProfile?.first_name} {studentProfile?.last_name}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/app/family' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-green-50 text-green-600' 
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
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium">
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

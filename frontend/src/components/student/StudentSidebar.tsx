'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  LayoutDashboard, 
  ClipboardList,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Student } from '@/types/database'

const menuItems = [
  { href: '/app/student', icon: LayoutDashboard, label: 'Dashboard', color: 'blue' },
  { href: '/app/student/plan', icon: ClipboardList, label: 'Mi Plan', color: 'indigo' },
  { href: '/app/student/events', icon: Calendar, label: 'Eventos', color: 'orange' },
  { href: '/app/student/resources', icon: BookOpen, label: 'Recursos', color: 'purple' },
  { href: '/app/student/messages', icon: MessageSquare, label: 'Mensajes', color: 'green' },
  { href: '/app/student/profile', icon: User, label: 'Mi Perfil', color: 'pink' },
]

interface StudentSidebarProps {
  profile: Profile & { centers?: { name: string } | null }
  student: Student | null
}

export default function StudentSidebar({ profile, student }: StudentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const gradeLabels: Record<string, string> = {
    '3eso': '3º ESO',
    '4eso': '4º ESO',
    '1bach': '1º Bachillerato',
    '2bach': '2º Bachillerato',
    '1fp': '1º FP',
    '2fp': '2º FP',
  }

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-50 to-white border-r min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/app/student" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              OVOC
            </span>
            <span className="text-xs text-gray-500 block">Portal Alumno</span>
          </div>
        </Link>
      </div>

      {/* Center & Grade Info */}
      <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white">
        <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
          <Sparkles className="h-3 w-3" />
          Tu centro
        </div>
        <p className="font-semibold truncate">
          {(profile.centers as any)?.name || 'Sin centro'}
        </p>
        {student?.current_grade && (
          <p className="text-sm text-blue-100 mt-1">
            {gradeLabels[student.current_grade] || student.current_grade}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Menú
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/app/student' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? '' : 'text-gray-400 group-hover:text-blue-600'}`} />
                  <span className="font-medium flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 m-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-lg">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 transition-all w-full px-4 py-2.5 rounded-xl hover:bg-red-50 border border-gray-100 hover:border-red-100"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

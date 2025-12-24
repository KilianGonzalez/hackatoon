import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const StudentSidebar = dynamic(() => import('@/components/student/StudentSidebar'), {
  loading: () => <aside className="w-72 bg-gray-50 border-r min-h-screen animate-pulse" />,
})

export const revalidate = 60

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const [profileResult, studentResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, centers(name)')
      .eq('id', user.id)
      .single(),
    supabase
      .from('students')
      .select('*')
      .eq('profile_id', user.id)
      .single()
  ])

  const profile = profileResult.data
  const student = studentResult.data

  if (!profile || profile.role !== 'student') {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar profile={profile} student={student} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const FamilySidebar = dynamic(() => import('@/components/family/FamilySidebar'), {
  loading: () => <aside className="w-64 bg-gray-50 border-r min-h-screen animate-pulse" />,
})

export const revalidate = 60

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const [profileResult, guardianLinksResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('guardian_links')
      .select(`
        id,
        students!guardian_links_student_id_fkey(
          id,
          current_grade,
          profiles!students_profile_id_fkey(first_name, last_name)
        )
      `)
      .eq('guardian_id', user.id)
      .eq('status', 'approved')
  ])

  const profile = profileResult.data
  const guardianLinks = guardianLinksResult.data

  if (!profile || profile.role !== 'family') {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <FamilySidebar profile={profile} linkedStudents={guardianLinks || []} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

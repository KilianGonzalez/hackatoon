import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const TutorSidebar = dynamic(() => import('@/components/tutor/TutorSidebar'), {
  loading: () => <aside className="w-64 bg-gray-50 border-r min-h-screen animate-pulse" />,
})

export const revalidate = 60

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, centers(name)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'tutor') {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TutorSidebar profile={profile} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

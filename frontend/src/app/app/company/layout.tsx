import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const CompanySidebar = dynamic(() => import('@/components/company/CompanySidebar'), {
  loading: () => <aside className="w-64 bg-gray-50 border-r min-h-screen animate-pulse" />,
})

export const revalidate = 60

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const [profileResult, companyResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('companies')
      .select('*')
      .eq('profile_id', user.id)
      .single()
  ])

  const profile = profileResult.data
  const company = companyResult.data

  if (!profile || profile.role !== 'company') {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CompanySidebar profile={profile} company={company} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

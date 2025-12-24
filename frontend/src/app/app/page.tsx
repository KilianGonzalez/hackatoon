import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AppPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Redirect based on role
  switch (profile.role) {
    case 'student':
      redirect('/app/student')
    case 'family':
      redirect('/app/family')
    case 'tutor':
      redirect('/app/tutor')
    case 'company':
      redirect('/app/company')
    case 'admin':
      redirect('/admin')
    default:
      redirect('/login')
  }
}

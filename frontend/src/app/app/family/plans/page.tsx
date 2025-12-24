import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

export default async function FamilyPlansPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get linked students
  const { data: guardianLinks } = await supabase
    .from('guardian_links')
    .select('student_id')
    .eq('guardian_id', user?.id)
    .eq('status', 'approved')

  const studentIds = guardianLinks?.map(l => l.student_id) || []

  let plans: any[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('plans')
      .select(`
        *,
        students!plans_student_id_fkey(
          profiles!students_profile_id_fkey(first_name, last_name)
        )
      `)
      .in('student_id', studentIds)
      .order('updated_at', { ascending: false })
    plans = data || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Planes de Orientación</h1>

      {plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan) => {
            const student = plan.students as any
            const profile = student?.profiles as any
            return (
              <div key={plan.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                    <p className="text-sm text-gray-500">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.status === 'active' ? 'bg-green-100 text-green-700' :
                    plan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {plan.status === 'active' ? 'Activo' :
                     plan.status === 'completed' ? 'Completado' :
                     plan.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-medium text-green-600">{plan.progress_percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${plan.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {plan.description && (
                  <p className="text-sm text-gray-600">{plan.description}</p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin planes</h3>
          <p className="text-gray-500">Los planes de orientación de tus hijos aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

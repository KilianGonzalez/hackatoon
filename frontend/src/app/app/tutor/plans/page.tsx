import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ClipboardList, User, Calendar } from 'lucide-react'

export default async function TutorPlansPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  const { data: plans, error } = await supabase
    .from('plans')
    .select(`
      *,
      students!plans_student_id_fkey(
        id,
        current_grade,
        profiles!students_profile_id_fkey(first_name, last_name)
      )
    `)
    .eq('center_id', profile?.center_id)
    .order('updated_at', { ascending: false })

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    archived: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Planes de Orientación</h1>
        <Link
          href="/app/tutor/plans/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo plan
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar planes: {error.message}
        </div>
      ) : plans && plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan) => {
            const student = plan.students as any
            const studentProfile = student?.profiles as any
            return (
              <Link
                key={plan.id}
                href={`/app/tutor/plans/${plan.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[plan.status]}`}>
                          {plan.status === 'draft' ? 'Borrador' :
                           plan.status === 'active' ? 'Activo' :
                           plan.status === 'completed' ? 'Completado' : 'Archivado'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{studentProfile?.first_name} {studentProfile?.last_name}</span>
                          {student?.current_grade && (
                            <span className="text-gray-400">({student.current_grade})</span>
                          )}
                        </div>
                        {plan.target_end_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Hasta {new Date(plan.target_end_date).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{plan.progress_percentage}%</div>
                    <div className="text-xs text-gray-500">completado</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${plan.progress_percentage}%` }}
                  />
                </div>

                {plan.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-1">{plan.description}</p>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes</h3>
          <p className="text-gray-500 mb-4">Crea planes de orientación para tus alumnos</p>
          <Link
            href="/app/tutor/plans/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo plan
          </Link>
        </div>
      )}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, CheckCircle, Circle, Clock, Plus } from 'lucide-react'
import PlanItemActions from './PlanItemActions'

export default async function TutorPlanDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: plan, error } = await supabase
    .from('plans')
    .select(`
      *,
      students!plans_student_id_fkey(
        id,
        current_grade,
        profiles!students_profile_id_fkey(first_name, last_name, email)
      ),
      plan_items(
        *,
        plan_tasks(*)
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !plan) {
    notFound()
  }

  const student = plan.students as any
  const studentProfile = student?.profiles as any
  const planItems = ((plan.plan_items as any[]) || []).sort((a, b) => a.order_index - b.order_index)

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    archived: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <Link
        href="/app/tutor/plans"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a planes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[plan.status]}`}>
                {plan.status === 'draft' ? 'Borrador' :
                 plan.status === 'active' ? 'Activo' :
                 plan.status === 'completed' ? 'Completado' : 'Archivado'}
              </span>
            </div>
            {plan.description && (
              <p className="text-gray-600">{plan.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{plan.progress_percentage}%</div>
            <div className="text-sm text-gray-500">completado</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-purple-600 rounded-full transition-all"
            style={{ width: `${plan.progress_percentage}%` }}
          />
        </div>

        {/* Student & Date Info */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {studentProfile?.first_name} {studentProfile?.last_name} ({student?.current_grade})
            </span>
          </div>
          {plan.target_end_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                Objetivo: {new Date(plan.target_end_date).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Objetivos ({planItems.length})</h2>
          <Link
            href={`/app/tutor/plans/${plan.id}/items/new`}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Añadir objetivo
          </Link>
        </div>

        {planItems.length > 0 ? (
          planItems.map((item, index) => {
            const tasks = (item.plan_tasks as any[]) || []
            const completedTasks = tasks.filter(t => t.status === 'completed').length
            
            return (
              <div key={item.id} className="bg-white rounded-xl border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      item.status === 'completed' ? 'bg-green-100' :
                      item.status === 'in_progress' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : item.status === 'in_progress' ? (
                        <Clock className="h-6 w-6 text-purple-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Objetivo {index + 1}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <PlanItemActions itemId={item.id} currentStatus={item.status} planId={plan.id} />
                      </div>
                      {item.description && (
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      )}
                      {tasks.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          {completedTasks} de {tasks.length} tareas completadas
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                {tasks.length > 0 && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            task.status === 'completed' ? 'bg-green-50' : 'bg-white border'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            task.status === 'completed' 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {task.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${
                              task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-gray-500">No hay objetivos definidos</p>
            <Link
              href={`/app/tutor/plans/${plan.id}/items/new`}
              className="inline-flex items-center gap-1 mt-3 text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Añadir primer objetivo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

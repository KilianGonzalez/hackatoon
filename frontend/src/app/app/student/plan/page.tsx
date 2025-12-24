import { createClient } from '@/lib/supabase/server'
import { ClipboardList, CheckCircle, Circle, Clock } from 'lucide-react'

export default async function StudentPlanPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  const { data: plan, error } = await supabase
    .from('plans')
    .select(`
      *,
      plan_items(
        *,
        plan_tasks(*)
      )
    `)
    .eq('student_id', student?.id)
    .eq('status', 'active')
    .single()

  if (error || !plan) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Plan de Orientación</h1>
        <div className="bg-white rounded-xl border p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin plan activo</h3>
          <p className="text-gray-500">Tu tutor creará un plan de orientación personalizado para ti</p>
        </div>
      </div>
    )
  }

  const planItems = (plan.plan_items as any[]) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
          {plan.description && (
            <p className="text-gray-600 mt-1">{plan.description}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{plan.progress_percentage}%</div>
          <div className="text-sm text-gray-500">completado</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso general</span>
          <span className="text-sm text-gray-500">
            {planItems.filter(i => i.status === 'completed').length} de {planItems.length} objetivos
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${plan.progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Plan Items */}
      <div className="space-y-4">
        {planItems.map((item, index) => {
          const tasks = (item.plan_tasks as any[]) || []
          const completedTasks = tasks.filter(t => t.status === 'completed').length
          
          return (
            <div key={item.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100' :
                    item.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : item.status === 'in_progress' ? (
                      <Clock className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Objetivo {index + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status === 'completed' ? 'Completado' :
                         item.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.title}</h3>
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
                          {task.task_type !== 'general' && (
                            <span className="text-xs text-gray-500">
                              {task.task_type === 'reading' ? '📖 Lectura' :
                               task.task_type === 'questionnaire' ? '📝 Cuestionario' :
                               task.task_type === 'event' ? '📅 Evento' :
                               task.task_type === 'deliverable' ? '📎 Entregable' :
                               task.task_type === 'meeting' ? '👥 Reunión' : ''}
                            </span>
                          )}
                        </div>
                        {task.status !== 'completed' && (
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Completar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { MessageSquare, CheckCircle, Clock } from 'lucide-react'

export default async function FeedbackPage() {
  const supabase = createClient()

  const { data: feedbacks, error } = await supabase
    .from('feedback_reports')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback de Usuarios</h1>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar feedback: {error.message}
        </div>
      ) : feedbacks && feedbacks.length > 0 ? (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                      feedback.status === 'new' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : feedback.status === 'reviewed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {feedback.status === 'new' && <Clock className="h-3 w-3" />}
                      {feedback.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                      {feedback.status === 'new' ? 'Nuevo' : feedback.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                    </span>
                    <p className="text-gray-900">{feedback.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(feedback.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay feedback</h3>
          <p className="text-gray-500">El feedback de usuarios aparecerá aquí</p>
        </div>
      )}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, Plus } from 'lucide-react'

export default async function StudentMessagesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: threads, error } = await supabase
    .from('thread_participants')
    .select(`
      thread_id,
      last_read_at,
      threads(
        id,
        subject,
        last_message_at,
        messages(content, created_at, sender_id)
      )
    `)
    .eq('profile_id', user?.id)
    .limit(20)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <Link
          href="/app/student/messages/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo mensaje
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar mensajes: {error.message}
        </div>
      ) : threads && threads.length > 0 ? (
        <div className="bg-white rounded-xl border divide-y">
          {threads.map((tp) => {
            const thread = tp.threads as any
            const lastMessage = thread?.messages?.[0]
            const hasUnread = tp.last_read_at && thread?.last_message_at 
              ? new Date(thread.last_message_at) > new Date(tp.last_read_at)
              : false

            return (
              <Link
                key={tp.thread_id}
                href={`/app/student/messages/${tp.thread_id}`}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${hasUnread ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <MessageSquare className={`h-5 w-5 ${hasUnread ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {thread?.subject || 'Sin asunto'}
                    </p>
                    {thread?.last_message_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(thread.last_message_at).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {lastMessage.content}
                    </p>
                  )}
                </div>
                {hasUnread && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
          <p className="text-gray-500 mb-4">Contacta con tu tutor si tienes dudas</p>
          <Link
            href="/app/student/messages/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo mensaje
          </Link>
        </div>
      )}
    </div>
  )
}

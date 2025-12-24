import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, UserPlus, Copy, Clock, CheckCircle, XCircle } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  accepted: { label: 'Aceptada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Expirada', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  revoked: { label: 'Revocada', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default async function InvitationsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('center_id')
    .eq('id', user?.id)
    .single()

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('center_id', profile?.center_id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitaciones</h1>
        <Link
          href="/app/tutor/invitations/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nueva invitación
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error al cargar invitaciones: {error.message}
        </div>
      ) : invitations && invitations.length > 0 ? (
        <div className="space-y-4">
          {invitations.map((invitation) => {
            const statusInfo = statusLabels[invitation.status] || statusLabels.pending
            const StatusIcon = statusInfo.icon
            const isExpired = new Date(invitation.expires_at) < new Date()
            
            return (
              <div key={invitation.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <UserPlus className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {isExpired && invitation.status === 'pending' ? 'Expirada' : statusInfo.label}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {invitation.role === 'student' ? 'Alumno' : invitation.role === 'family' ? 'Familia' : 'Tutor'}
                        </span>
                      </div>
                      
                      {invitation.email ? (
                        <p className="text-gray-900">Enviada a: {invitation.email}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1 bg-gray-100 rounded font-mono text-lg">
                            {invitation.code}
                          </code>
                          <button className="p-1 text-gray-500 hover:text-gray-700" title="Copiar código">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-500 mt-2">
                        Creada: {new Date(invitation.created_at).toLocaleDateString('es-ES')}
                        {' · '}
                        Expira: {new Date(invitation.expires_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay invitaciones</h3>
          <p className="text-gray-500 mb-4">Crea invitaciones para que los alumnos se registren</p>
          <Link
            href="/app/tutor/invitations/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Nueva invitación
          </Link>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Ban, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente de aprobación', icon: Clock },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprobada', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada', icon: XCircle },
  suspended: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Suspendida', icon: Ban },
}

export default function CompanyActions({ company }: { company: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const updateData: any = { status: newStatus }
    if (newStatus === 'approved') {
      updateData.approved_by = user?.id
      updateData.approved_at = new Date().toISOString()
    }

    await supabase
      .from('companies')
      .update(updateData)
      .eq('id', company.id)

    setLoading(null)
    router.refresh()
  }

  const status = statusConfig[company.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>
      
      <div className={`flex items-center gap-2 p-3 rounded-lg ${status.bg} mb-4`}>
        <StatusIcon className={`h-5 w-5 ${status.text}`} />
        <span className={`font-medium ${status.text}`}>{status.label}</span>
      </div>

      <div className="space-y-2">
        {company.status === 'pending' && (
          <>
            <button
              onClick={() => updateStatus('approved')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading === 'approved' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              Aprobar empresa
            </button>
            <button
              onClick={() => updateStatus('rejected')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading === 'rejected' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              Rechazar empresa
            </button>
          </>
        )}

        {company.status === 'approved' && (
          <button
            onClick={() => updateStatus('suspended')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading === 'suspended' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Ban className="h-5 w-5" />
            )}
            Suspender empresa
          </button>
        )}

        {company.status === 'rejected' && (
          <button
            onClick={() => updateStatus('approved')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading === 'approved' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            Aprobar empresa
          </button>
        )}

        {company.status === 'suspended' && (
          <button
            onClick={() => updateStatus('approved')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading === 'approved' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            Reactivar empresa
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LinkActions({ linkId }: { linkId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (newStatus: 'approved' | 'rejected') => {
    setLoading(newStatus)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from('guardian_links')
      .update({ 
        status: newStatus,
        approved_by: newStatus === 'approved' ? user?.id : null,
        approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', linkId)

    setLoading(null)
    router.refresh()
  }

  return (
    <div className="mt-4 pt-4 border-t flex gap-2">
      <button
        onClick={() => updateStatus('approved')}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading === 'approved' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Aprobar
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading === 'rejected' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        Rechazar
      </button>
    </div>
  )
}

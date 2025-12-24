'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Clock, Circle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PlanItemActionsProps {
  itemId: string
  currentStatus: string
  planId: string
}

export default function PlanItemActions({ itemId, currentStatus, planId }: PlanItemActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    const supabase = createClient()

    await supabase
      .from('plan_items')
      .update({ status: newStatus })
      .eq('id', itemId)

    // Recalculate plan progress
    const { data: items } = await supabase
      .from('plan_items')
      .select('status')
      .eq('plan_id', planId)

    if (items) {
      const completed = items.filter(i => i.status === 'completed').length
      const progress = Math.round((completed / items.length) * 100)
      
      await supabase
        .from('plans')
        .update({ progress_percentage: progress })
        .eq('id', planId)
    }

    setLoading(false)
    router.refresh()
  }

  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus !== 'pending' && (
        <button
          onClick={() => updateStatus('pending')}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="Marcar como pendiente"
        >
          <Circle className="h-4 w-4" />
        </button>
      )}
      {currentStatus !== 'in_progress' && (
        <button
          onClick={() => updateStatus('in_progress')}
          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
          title="Marcar en progreso"
        >
          <Clock className="h-4 w-4" />
        </button>
      )}
      {currentStatus !== 'completed' && (
        <button
          onClick={() => updateStatus('completed')}
          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
          title="Marcar como completado"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

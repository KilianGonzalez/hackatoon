'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EventRegistrationButtonProps {
  eventId: string
  studentId: string | undefined
  isRegistered: boolean
  isPast: boolean
  isFull: boolean
}

export default function EventRegistrationButton({
  eventId,
  studentId,
  isRegistered,
  isPast,
  isFull,
}: EventRegistrationButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!studentId) return
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
      student_id: studentId,
      status: 'registered',
    })

    setLoading(false)
    if (!error) {
      router.refresh()
    }
  }

  const handleCancel = async () => {
    if (!studentId) return
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('event_registrations')
      .update({ status: 'cancelled' })
      .eq('event_id', eventId)
      .eq('student_id', studentId)

    setLoading(false)
    if (!error) {
      router.refresh()
    }
  }

  if (isPast) {
    return (
      <button
        disabled
        className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
      >
        Evento finalizado
      </button>
    )
  }

  if (isRegistered) {
    return (
      <button
        onClick={handleCancel}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        Cancelar inscripción
      </button>
    )
  }

  if (isFull) {
    return (
      <button
        disabled
        className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
      >
        Evento completo
      </button>
    )
  }

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <CheckCircle className="h-5 w-5" />
      )}
      Inscribirme
    </button>
  )
}

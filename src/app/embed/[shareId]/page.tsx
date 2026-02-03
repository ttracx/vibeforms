'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormRenderer } from '@/components/form-renderer'
import { FormField, FormSettings } from '@/types/form'
import { Loader2 } from 'lucide-react'

interface FormData {
  id: string
  name: string
  fields: FormField[]
  settings: FormSettings
}

export default function EmbedFormPage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [shareId])

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/public/${shareId}`)
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Form not found</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <FormRenderer
        formId={form.id}
        fields={form.fields}
        settings={form.settings}
        embedded
      />
    </div>
  )
}

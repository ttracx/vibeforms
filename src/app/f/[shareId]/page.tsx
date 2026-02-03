'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormRenderer } from '@/components/form-renderer'
import { FormField, FormSettings } from '@/types/form'
import { Zap, Loader2 } from 'lucide-react'

interface FormData {
  id: string
  name: string
  description: string | null
  fields: FormField[]
  settings: FormSettings
}

export default function PublicFormPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">This form may have been deleted or is not published.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.name}</h1>
          {form.description && <p className="text-gray-600">{form.description}</p>}
        </div>

        {/* Form */}
        <FormRenderer
          formId={form.id}
          fields={form.fields}
          settings={form.settings}
        />

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Powered by
            <Zap className="h-4 w-4" />
            VibeForms
          </a>
        </div>
      </div>
    </div>
  )
}

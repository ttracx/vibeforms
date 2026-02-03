'use client'

import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormField as FormFieldType, FormSettings } from '@/types/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, Upload } from 'lucide-react'

interface FormRendererProps {
  formId: string
  fields: FormFieldType[]
  settings: FormSettings
  onSubmit?: (data: Record<string, any>) => Promise<void>
  embedded?: boolean
}

export function FormRenderer({ formId, fields, settings, onSubmit, embedded }: FormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const formValues = watch()

  // Evaluate conditional visibility
  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.conditional) return true
      
      const { fieldId, operator, value, action } = field.conditional
      const targetValue = formValues[fieldId]
      
      let conditionMet = false
      switch (operator) {
        case 'equals':
          conditionMet = targetValue === value
          break
        case 'not_equals':
          conditionMet = targetValue !== value
          break
        case 'contains':
          conditionMet = String(targetValue || '').includes(value)
          break
        case 'greater_than':
          conditionMet = Number(targetValue) > Number(value)
          break
        case 'less_than':
          conditionMet = Number(targetValue) < Number(value)
          break
      }

      return action === 'show' ? conditionMet : !conditionMet
    })
  }, [fields, formValues])

  const handleFormSubmit = useCallback(async (data: Record<string, any>) => {
    setIsSubmitting(true)
    try {
      // Handle file uploads
      const fileData: Record<string, string[]> = {}
      for (const [fieldId, fieldFiles] of Object.entries(files)) {
        const uploadedUrls: string[] = []
        for (const file of fieldFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('formId', formId)
          
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (res.ok) {
            const { url } = await res.json()
            uploadedUrls.push(url)
          }
        }
        fileData[fieldId] = uploadedUrls
      }

      const submissionData = { ...data, ...fileData }

      if (onSubmit) {
        await onSubmit(submissionData)
      } else {
        // Default submission
        const res = await fetch(`/api/forms/${formId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        })
        
        if (!res.ok) throw new Error('Submission failed')
      }

      setIsSuccess(true)
      
      if (settings.redirectUrl) {
        window.location.href = settings.redirectUrl
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formId, files, onSubmit, settings])

  const handleFileChange = (fieldId: string, newFiles: FileList | null) => {
    if (newFiles) {
      setFiles((prev) => ({ ...prev, [fieldId]: Array.from(newFiles) }))
    }
  }

  if (isSuccess) {
    return (
      <div className={`p-8 text-center ${embedded ? '' : 'bg-white rounded-xl shadow-sm'}`}>
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600">{settings.successMessage || 'Your submission has been received.'}</p>
      </div>
    )
  }

  const renderField = (field: FormFieldType) => {
    const commonProps = {
      ...register(field.id, { required: field.required }),
    }

    switch (field.type) {
      case 'heading':
        return <h2 className="text-2xl font-bold text-gray-900">{field.label}</h2>
      case 'paragraph':
        return <p className="text-gray-600">{field.label}</p>
      case 'text':
      case 'email':
      case 'number':
        return (
          <div>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              {...commonProps}
              className="mt-1"
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        )
      case 'textarea':
        return (
          <div>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              {...commonProps}
              className="mt-1"
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        )
      case 'select':
        return (
          <div>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select
              id={field.id}
              {...commonProps}
              className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select an option...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        )
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              {...commonProps}
              className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        )
      case 'radio':
        return (
          <div>
            <Label className="mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${field.id}-${opt.value}`}
                    value={opt.value}
                    {...register(field.id, { required: field.required })}
                    className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor={`${field.id}-${opt.value}`} className="text-sm">{opt.label}</label>
                </div>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        )
      case 'date':
        return (
          <div>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              {...commonProps}
              className="mt-1"
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        )
      case 'file':
        return (
          <div>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-violet-300 transition-colors cursor-pointer">
              <input
                type="file"
                id={field.id}
                accept={field.accept}
                multiple
                onChange={(e) => handleFileChange(field.id, e.target.files)}
                className="hidden"
              />
              <label htmlFor={field.id} className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                {field.accept && <p className="text-xs text-gray-400 mt-1">Accepts: {field.accept}</p>}
              </label>
              {files[field.id]?.length > 0 && (
                <div className="mt-3 text-left">
                  {files[field.id].map((file, i) => (
                    <p key={i} className="text-sm text-gray-600">{file.name}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={embedded ? '' : 'bg-white rounded-xl shadow-sm p-8'}>
      <div className="space-y-6">
        {visibleFields.map((field) => (
          <div key={field.id}>{renderField(field)}</div>
        ))}
      </div>

      <div className="mt-8">
        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            settings.submitButtonText || 'Submit'
          )}
        </Button>
      </div>
    </form>
  )
}

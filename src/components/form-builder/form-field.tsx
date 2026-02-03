'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Settings, Copy } from 'lucide-react'
import { FormField as FormFieldType } from '@/types/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  field: FormFieldType
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function FormField({ field, isSelected, onSelect, onDelete, onDuplicate }: FormFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'heading':
        return <h2 className="text-xl font-bold text-gray-900">{field.label || 'Heading'}</h2>
      case 'paragraph':
        return <p className="text-gray-600">{field.label || 'Paragraph text'}</p>
      case 'text':
      case 'email':
      case 'number':
        return (
          <div>
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input type={field.type} placeholder={field.placeholder} disabled className="mt-1" />
          </div>
        )
      case 'textarea':
        return (
          <div>
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea placeholder={field.placeholder} disabled className="mt-1" />
          </div>
        )
      case 'select':
        return (
          <div>
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select disabled className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white">
              <option>Select an option...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        )
      case 'radio':
        return (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <input type="radio" disabled className="h-4 w-4 border-gray-300" />
                  <span className="text-sm">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'date':
        return (
          <div>
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input type="date" disabled className="mt-1" />
          </div>
        )
      case 'file':
        return (
          <div>
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Click or drag to upload</p>
              {field.accept && <p className="text-xs text-gray-400 mt-1">Accepts: {field.accept}</p>}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative p-4 bg-white border-2 rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-violet-500 ring-2 ring-violet-100' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="ml-6 pr-20">{renderFieldPreview()}</div>
      
      {isSelected && (
        <div className="absolute right-2 top-2 flex gap-1">
          <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

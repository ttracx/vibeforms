'use client'

import { useDraggable } from '@dnd-kit/core'
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
  Heading,
  FileText,
} from 'lucide-react'
import { FieldType } from '@/types/form'

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'heading', label: 'Heading', icon: <Heading className="h-4 w-4" /> },
  { type: 'paragraph', label: 'Paragraph', icon: <FileText className="h-4 w-4" /> },
  { type: 'text', label: 'Text', icon: <Type className="h-4 w-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  { type: 'number', label: 'Number', icon: <Hash className="h-4 w-4" /> },
  { type: 'textarea', label: 'Textarea', icon: <AlignLeft className="h-4 w-4" /> },
  { type: 'select', label: 'Dropdown', icon: <List className="h-4 w-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="h-4 w-4" /> },
  { type: 'radio', label: 'Radio', icon: <Circle className="h-4 w-4" /> },
  { type: 'date', label: 'Date', icon: <Calendar className="h-4 w-4" /> },
  { type: 'file', label: 'File Upload', icon: <Upload className="h-4 w-4" /> },
]

function DraggableField({ type, label, icon }: { type: FieldType; label: string; icon: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, isNew: true },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-violet-300 hover:bg-violet-50 transition-colors"
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

export function FieldPalette() {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Elements</h3>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableField key={field.type} {...field} />
        ))}
      </div>
    </div>
  )
}

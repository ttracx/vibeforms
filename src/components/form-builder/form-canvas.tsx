'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FormField as FormFieldType } from '@/types/form'
import { FormField } from './form-field'

interface FormCanvasProps {
  fields: FormFieldType[]
  selectedFieldId: string | null
  onSelectField: (id: string | null) => void
  onDeleteField: (id: string) => void
  onDuplicateField: (id: string) => void
}

export function FormCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
}: FormCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] p-6 bg-gray-50 rounded-xl border-2 border-dashed transition-colors ${
        isOver ? 'border-violet-400 bg-violet-50' : 'border-gray-200'
      }`}
      onClick={() => onSelectField(null)}
    >
      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          <p className="text-center">
            Drag and drop form elements here
            <br />
            <span className="text-sm">or click an element to add it</span>
          </p>
        </div>
      ) : (
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id)}
                onDelete={() => onDeleteField(field.id)}
                onDuplicate={() => onDuplicateField(field.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { FormField as FormFieldType, FieldType } from '@/types/form'
import { FieldPalette } from './field-palette'
import { FormCanvas } from './form-canvas'
import { FieldSettings } from './field-settings'
import { generateId } from '@/lib/utils'

interface FormBuilderProps {
  initialFields?: FormFieldType[]
  onChange?: (fields: FormFieldType[]) => void
}

const defaultFieldProps: Record<FieldType, Partial<FormFieldType>> = {
  heading: { label: 'Heading' },
  paragraph: { label: 'Add your paragraph text here...' },
  text: { label: 'Text Field', placeholder: 'Enter text...', required: false },
  email: { label: 'Email', placeholder: 'Enter email...', required: false },
  number: { label: 'Number', placeholder: 'Enter number...', required: false },
  textarea: { label: 'Long Text', placeholder: 'Enter your message...', required: false },
  select: { label: 'Dropdown', required: false, options: [{ label: 'Option 1', value: 'option_1' }] },
  checkbox: { label: 'Checkbox', required: false },
  radio: { label: 'Radio Group', required: false, options: [{ label: 'Option 1', value: 'option_1' }, { label: 'Option 2', value: 'option_2' }] },
  date: { label: 'Date', required: false },
  file: { label: 'File Upload', required: false, accept: '.pdf,.doc,.docx,.jpg,.png', maxSize: 10485760 },
}

export function FormBuilder({ initialFields = [], onChange }: FormBuilderProps) {
  const [fields, setFields] = useState<FormFieldType[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const selectedField = fields.find((f) => f.id === selectedFieldId)

  const updateFields = useCallback(
    (newFields: FormFieldType[]) => {
      setFields(newFields)
      onChange?.(newFields)
    },
    [onChange]
  )

  const createField = (type: FieldType): FormFieldType => ({
    id: generateId(),
    type,
    ...defaultFieldProps[type],
    label: defaultFieldProps[type].label || type,
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeData = active.data.current as { type?: FieldType; isNew?: boolean }

    // Adding new field from palette
    if (activeData?.isNew && activeData.type) {
      const newField = createField(activeData.type)
      updateFields([...fields, newField])
      setSelectedFieldId(newField.id)
      return
    }

    // Reordering existing fields
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        updateFields(arrayMove(fields, oldIndex, newIndex))
      }
    }
  }

  const handleDeleteField = (id: string) => {
    updateFields(fields.filter((f) => f.id !== id))
    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  const handleDuplicateField = (id: string) => {
    const field = fields.find((f) => f.id === id)
    if (!field) return
    const newField = { ...field, id: generateId() }
    const index = fields.findIndex((f) => f.id === id)
    const newFields = [...fields]
    newFields.splice(index + 1, 0, newField)
    updateFields(newFields)
    setSelectedFieldId(newField.id)
  }

  const handleUpdateField = (updates: Partial<FormFieldType>) => {
    if (!selectedFieldId) return
    updateFields(
      fields.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Field Palette */}
        <div className="col-span-3">
          <FieldPalette />
        </div>

        {/* Form Canvas */}
        <div className="col-span-6">
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onDeleteField={handleDeleteField}
            onDuplicateField={handleDuplicateField}
          />
        </div>

        {/* Field Settings */}
        <div className="col-span-3">
          {selectedField ? (
            <FieldSettings
              field={selectedField}
              fields={fields}
              onChange={handleUpdateField}
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-400">
              <p className="text-sm">Select a field to edit its settings</p>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  )
}

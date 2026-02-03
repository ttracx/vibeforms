'use client'

import { FormField as FormFieldType, FieldOption } from '@/types/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface FieldSettingsProps {
  field: FormFieldType
  fields: FormFieldType[]
  onChange: (updates: Partial<FormFieldType>) => void
}

export function FieldSettings({ field, fields, onChange }: FieldSettingsProps) {
  const showLabelSetting = !['heading', 'paragraph'].includes(field.type)
  const showRequiredSetting = !['heading', 'paragraph'].includes(field.type)
  const showPlaceholder = ['text', 'email', 'number', 'textarea'].includes(field.type)
  const showOptions = ['select', 'radio', 'checkbox'].includes(field.type) && field.type !== 'checkbox'
  const showFileSettings = field.type === 'file'
  const showConditional = fields.length > 1

  const addOption = () => {
    const options = field.options || []
    const newOption: FieldOption = {
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
    }
    onChange({ options: [...options, newOption] })
  }

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const options = [...(field.options || [])]
    options[index] = { ...options[index], ...updates }
    onChange({ options })
  }

  const removeOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index)
    onChange({ options })
  }

  const otherFields = fields.filter((f) => f.id !== field.id && !['heading', 'paragraph'].includes(f.type))

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Field Settings</h3>

      {/* Label */}
      <div>
        <Label className="text-xs text-gray-500">
          {field.type === 'heading' ? 'Heading Text' : field.type === 'paragraph' ? 'Paragraph Text' : 'Label'}
        </Label>
        <Input
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="mt-1"
        />
      </div>

      {/* Placeholder */}
      {showPlaceholder && (
        <div>
          <Label className="text-xs text-gray-500">Placeholder</Label>
          <Input
            value={field.placeholder || ''}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            className="mt-1"
          />
        </div>
      )}

      {/* Required */}
      {showRequiredSetting && (
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Required</Label>
          <Switch
            checked={field.required || false}
            onCheckedChange={(checked) => onChange({ required: checked })}
          />
        </div>
      )}

      {/* Options for select/radio */}
      {showOptions && (
        <div>
          <Label className="text-xs text-gray-500 mb-2 block">Options</Label>
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="Option label"
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addOption} className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>
        </div>
      )}

      {/* File settings */}
      {showFileSettings && (
        <>
          <div>
            <Label className="text-xs text-gray-500">Accepted file types</Label>
            <Input
              value={field.accept || ''}
              onChange={(e) => onChange({ accept: e.target.value })}
              placeholder="e.g., .pdf,.doc,.jpg"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max file size (MB)</Label>
            <Input
              type="number"
              value={(field.maxSize || 10485760) / 1048576}
              onChange={(e) => onChange({ maxSize: Number(e.target.value) * 1048576 })}
              className="mt-1"
            />
          </div>
        </>
      )}

      {/* Conditional Logic */}
      {showConditional && otherFields.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-500">Conditional Logic</Label>
            <Switch
              checked={!!field.conditional}
              onCheckedChange={(checked) => {
                if (checked && otherFields.length > 0) {
                  onChange({
                    conditional: {
                      fieldId: otherFields[0].id,
                      operator: 'equals',
                      value: '',
                      action: 'show',
                    },
                  })
                } else {
                  onChange({ conditional: undefined })
                }
              }}
            />
          </div>

          {field.conditional && (
            <div className="space-y-2 mt-2">
              <Select
                value={field.conditional.action}
                onValueChange={(value: 'show' | 'hide') =>
                  onChange({ conditional: { ...field.conditional!, action: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="show">Show this field</SelectItem>
                  <SelectItem value="hide">Hide this field</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-gray-500">when</p>

              <Select
                value={field.conditional.fieldId}
                onValueChange={(value) =>
                  onChange({ conditional: { ...field.conditional!, fieldId: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {otherFields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={field.conditional.operator}
                onValueChange={(value: any) =>
                  onChange({ conditional: { ...field.conditional!, operator: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="not_equals">does not equal</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                  <SelectItem value="greater_than">is greater than</SelectItem>
                  <SelectItem value="less_than">is less than</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={field.conditional.value}
                onChange={(e) =>
                  onChange({ conditional: { ...field.conditional!, value: e.target.value } })
                }
                placeholder="Value"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

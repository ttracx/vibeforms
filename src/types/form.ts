export type FieldType = 
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'heading'
  | 'paragraph'

export interface FieldOption {
  label: string
  value: string
}

export interface ConditionalRule {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string
  action: 'show' | 'hide'
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  conditional?: ConditionalRule
  accept?: string // for file fields
  maxSize?: number // in bytes
}

export interface FormSettings {
  submitButtonText?: string
  successMessage?: string
  redirectUrl?: string
  emailNotifications?: {
    enabled: boolean
    recipients: string[]
    subject?: string
  }
  styling?: {
    primaryColor?: string
    backgroundColor?: string
    fontFamily?: string
  }
}

export interface Form {
  id: string
  name: string
  description?: string
  fields: FormField[]
  settings: FormSettings
  published: boolean
  shareId: string
  createdAt: Date
  updatedAt: Date
}

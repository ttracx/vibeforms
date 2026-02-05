export type FieldType = 'text' | 'email' | 'select' | 'checkbox' | 'textarea' | 'number' | 'date';

export type FormTemplate = 'blank' | 'contact' | 'survey' | 'feedback' | 'registration' | 'order';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select fields
}

export interface Form {
  id: string;
  name: string;
  description: string;
  template: FormTemplate;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  shareUrl?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, string | boolean | number>;
  submittedAt: string;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface FormAnalytics {
  formId: string;
  totalResponses: number;
  responsesByDay: { date: string; count: number }[];
  fieldSummaries: {
    fieldId: string;
    fieldLabel: string;
    fieldType: FieldType;
    responseCounts?: Record<string, number>; // For select/checkbox
    averageValue?: number; // For number
  }[];
}

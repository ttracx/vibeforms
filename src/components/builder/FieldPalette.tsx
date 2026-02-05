'use client';

import { FieldType } from '@/lib/types';

interface FieldOption {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}

const fieldOptions: FieldOption[] = [
  { type: 'text', label: 'Text Input', icon: '📝', description: 'Single line text' },
  { type: 'email', label: 'Email', icon: '📧', description: 'Email address' },
  { type: 'textarea', label: 'Text Area', icon: '📄', description: 'Multi-line text' },
  { type: 'number', label: 'Number', icon: '🔢', description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: '📅', description: 'Date picker' },
  { type: 'select', label: 'Dropdown', icon: '📋', description: 'Select from options' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Yes/No toggle' },
];

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export default function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Field</h3>
      <div className="space-y-2">
        {fieldOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onAddField(option.type)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
          >
            <span className="text-lg">{option.icon}</span>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                {option.label}
              </div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

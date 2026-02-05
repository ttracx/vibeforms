'use client';

import { FormField } from '@/lib/types';

interface FormPreviewProps {
  name: string;
  description: string;
  fields: FormField[];
}

export default function FormPreview({ name, description, fields }: FormPreviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{name || 'Untitled Form'}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Add fields to see a preview</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  placeholder={field.placeholder}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  disabled
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              )}

              {field.type === 'select' && (
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                >
                  <option>Select an option...</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-600">{field.label}</span>
                </div>
              )}
            </div>
          ))}

          <button
            disabled
            className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium opacity-70"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

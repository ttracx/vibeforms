'use client';

import { useState } from 'react';
import { FormField } from '@/lib/types';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function FieldEditor({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: FieldEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabels: Record<string, string> = {
    text: '📝 Text',
    email: '📧 Email',
    textarea: '📄 Text Area',
    number: '🔢 Number',
    date: '📅 Date',
    select: '📋 Dropdown',
    checkbox: '☑️ Checkbox',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
      <div className="flex items-center gap-3 p-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {typeLabels[field.type]}
            </span>
            <span className="text-sm font-medium text-gray-900 truncate">{field.label}</span>
            {field.required && (
              <span className="text-xs text-red-500 font-medium">Required</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
          >
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ ...field, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {field.type !== 'checkbox' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {field.type === 'select' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Options (one per line)</label>
              <textarea
                value={(field.options || []).join('\n')}
                onChange={(e) =>
                  onUpdate({
                    ...field,
                    options: e.target.value.split('\n').filter(Boolean),
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`required-${field.id}`} className="text-sm text-gray-700">
              Required field
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

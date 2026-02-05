'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FieldType, FormTemplate } from '@/lib/types';
import { templateConfigs, getTemplateFields } from '@/lib/templates';
import FieldPalette from '@/components/builder/FieldPalette';
import FieldEditor from '@/components/builder/FieldEditor';
import FormPreview from '@/components/builder/FormPreview';
import Footer from '@/components/shared/Footer';

const defaultFieldConfigs: Record<FieldType, Omit<FormField, 'id'>> = {
  text: { type: 'text', label: 'Text Field', placeholder: 'Enter text...', required: false },
  email: { type: 'email', label: 'Email', placeholder: 'your@email.com', required: false },
  textarea: { type: 'textarea', label: 'Text Area', placeholder: 'Enter your message...', required: false },
  number: { type: 'number', label: 'Number', placeholder: '0', required: false },
  date: { type: 'date', label: 'Date', required: false },
  select: { type: 'select', label: 'Dropdown', required: false, options: ['Option 1', 'Option 2', 'Option 3'] },
  checkbox: { type: 'checkbox', label: 'Checkbox', required: false },
};

export default function BuilderPage() {
  const router = useRouter();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [template, setTemplate] = useState<FormTemplate>('blank');
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'preview'>('build');

  const handleTemplateChange = useCallback((t: FormTemplate) => {
    setTemplate(t);
    const config = templateConfigs[t];
    setFormName(config.name);
    setFormDescription(config.description);
    setFields(getTemplateFields(t));
  }, []);

  const addField = useCallback((type: FieldType) => {
    const config = defaultFieldConfigs[type];
    setFields((prev) => [...prev, { ...config, id: uuidv4() }]);
  }, []);

  const updateField = useCallback((index: number, field: FormField) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = field;
      return next;
    });
  }, []);

  const deleteField = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveField = useCallback((from: number, to: number) => {
    setFields((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const handleSave = async (publish: boolean = false) => {
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }

    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          template,
          fields,
        }),
      });

      const form = await res.json();

      if (publish) {
        await fetch('/api/forms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, published: true }),
        });
      }

      router.push('/dashboard');
    } catch {
      alert('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-gray-500 mt-1">Create your form by adding and configuring fields</p>
          </div>

          {/* Template selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start with a template</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {(Object.entries(templateConfigs) as [FormTemplate, typeof templateConfigs.blank][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateChange(key)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    template === key
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{config.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form name and description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="My Awesome Form"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this form"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('build')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'build' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>

          {activeTab === 'build' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Field palette */}
              <div className="lg:col-span-1">
                <FieldPalette onAddField={addField} />
              </div>

              {/* Field list */}
              <div className="lg:col-span-3">
                {fields.length === 0 ? (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-500">No fields yet</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Click a field type on the left or select a template above to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <FieldEditor
                        key={field.id}
                        field={field}
                        onUpdate={(f) => updateField(index, f)}
                        onDelete={() => deleteField(index)}
                        onMoveUp={() => moveField(index, index - 1)}
                        onMoveDown={() => moveField(index, index + 1)}
                        isFirst={index === 0}
                        isLast={index === fields.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <FormPreview name={formName} description={formDescription} fields={fields} />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2.5 border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Save & Publish'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

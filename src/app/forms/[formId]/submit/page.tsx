'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Form } from '@/lib/types';
import Footer from '@/components/shared/Footer';

export default function SubmitFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    fetch(`/api/forms/${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Form not found');
        return res.json();
      })
      .then((data) => {
        if (!data.published) {
          setError('This form is not currently accepting responses');
        }
        setForm(data);
      })
      .catch(() => setError('Form not found'))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (value === undefined || value === '' || value === false) {
          alert(`"${field.label}" is required`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data: formData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">{error || 'Form not found'}</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500">Your response has been submitted successfully.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Form header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">{form.name}</h1>
              {form.description && (
                <p className="text-indigo-100 mt-1">{form.description}</p>
              )}
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {form.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    >
                      <option value="">Select an option...</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'checkbox' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(formData[field.id] as boolean) || false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{field.label}</span>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Powered by VibeForms
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

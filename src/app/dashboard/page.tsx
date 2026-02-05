'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Form } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Footer from '@/components/shared/Footer';

interface FormWithCount extends Form {
  responseCount: number;
}

export default function DashboardPage() {
  const [forms, setForms] = useState<FormWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchForms = useCallback(async () => {
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      setForms(data);
    } catch {
      console.error('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const togglePublish = async (form: FormWithCount) => {
    try {
      await fetch('/api/forms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id, published: !form.published }),
      });
      fetchForms();
    } catch {
      alert('Failed to update form');
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form and all its responses?')) return;
    try {
      await fetch(`/api/forms?id=${id}`, { method: 'DELETE' });
      fetchForms();
    } catch {
      alert('Failed to delete form');
    }
  };

  const copyShareLink = (formId: string) => {
    const url = `${window.location.origin}/forms/${formId}/submit`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your forms and view responses</p>
            </div>
            <Link
              href="/builder"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Form
            </Link>
          </div>

          {forms.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No forms yet</h3>
              <p className="text-sm text-gray-400 mb-6">Create your first form to start collecting responses</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Create Your First Form
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{form.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{form.description}</p>
                    </div>
                    <span
                      className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {form.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {form.fields.length} fields
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {form.responseCount} responses
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mb-4">
                    Updated {formatDate(form.updatedAt)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => togglePublish(form)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        form.published
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {form.published ? 'Unpublish' : 'Publish'}
                    </button>

                    {form.published && (
                      <button
                        onClick={() => copyShareLink(form.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        {copiedId === form.id ? '✓ Copied!' : 'Share Link'}
                      </button>
                    )}

                    <Link
                      href={`/forms/${form.id}/responses`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      Responses
                    </Link>

                    <Link
                      href={`/forms/${form.id}/analytics`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      Analytics
                    </Link>

                    <button
                      onClick={() => deleteForm(form.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

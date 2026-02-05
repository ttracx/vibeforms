'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Form, FormResponse } from '@/lib/types';
import { formatDate, exportToCSV, downloadCSV } from '@/lib/utils';
import Footer from '@/components/shared/Footer';

export default function ResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/forms/${formId}`).then((r) => r.json()),
      fetch(`/api/responses?formId=${formId}`).then((r) => r.json()),
    ])
      .then(([formData, responseData]) => {
        setForm(formData);
        setResponses(responseData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formId]);

  const handleExportCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = ['Submission Date', ...form.fields.map((f) => f.label)];
    const rows = responses.map((response) => [
      formatDate(response.submittedAt),
      ...form.fields.map((f) => {
        const val = response.data[f.id];
        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        return String(val ?? '');
      }),
    ]);

    const csv = exportToCSV(headers, rows);
    downloadCSV(`${form.name.replace(/\s+/g, '_')}_responses.csv`, csv);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Form not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <span>/</span>
            <span>{form.name}</span>
            <span>/</span>
            <span className="text-gray-900">Responses</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Responses</h1>
              <p className="text-gray-500 mt-1">
                {responses.length} response{responses.length !== 1 ? 's' : ''} for &ldquo;{form.name}&rdquo;
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/forms/${formId}/analytics`}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100"
              >
                View Analytics
              </Link>
              <button
                onClick={handleExportCSV}
                disabled={responses.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No responses yet</h3>
              <p className="text-sm text-gray-400">Share your form to start collecting responses</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      {form.fields.map((field) => (
                        <th
                          key={field.id}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responses.map((response, idx) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(response.submittedAt)}
                        </td>
                        {form.fields.map((field) => {
                          const val = response.data[field.id];
                          let display = '';
                          if (typeof val === 'boolean') display = val ? '✅ Yes' : '❌ No';
                          else display = String(val ?? '-');

                          return (
                            <td key={field.id} className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                              {display}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

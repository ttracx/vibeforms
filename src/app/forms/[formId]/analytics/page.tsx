'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Form, FormResponse } from '@/lib/types';
import Footer from '@/components/shared/Footer';

export default function AnalyticsPage() {
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

  const analytics = useMemo(() => {
    if (!form || responses.length === 0) return null;

    // Responses by day
    const dayMap: Record<string, number> = {};
    responses.forEach((r) => {
      const day = new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const responsesByDay = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // Field summaries
    const fieldSummaries = form.fields.map((field) => {
      const values = responses.map((r) => r.data[field.id]).filter((v) => v !== undefined && v !== '');

      if (field.type === 'select' || field.type === 'checkbox') {
        const counts: Record<string, number> = {};
        values.forEach((v) => {
          const key = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v);
          counts[key] = (counts[key] || 0) + 1;
        });
        return { field, counts, fillRate: Math.round((values.length / responses.length) * 100) };
      }

      if (field.type === 'number') {
        const nums = values.map(Number).filter((n) => !isNaN(n));
        const avg = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
        return { field, average: avg.toFixed(1), fillRate: Math.round((values.length / responses.length) * 100) };
      }

      return { field, fillRate: Math.round((values.length / responses.length) * 100) };
    });

    return { responsesByDay, fieldSummaries, totalResponses: responses.length };
  }, [form, responses]);

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
            <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <span>{form.name}</span>
            <span>/</span>
            <span className="text-gray-900">Analytics</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-500 mt-1">Insights for &ldquo;{form.name}&rdquo;</p>
            </div>
            <Link
              href={`/forms/${formId}/responses`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              View All Responses
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Total Responses</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{responses.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Total Fields</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{form.fields.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Status</div>
              <div className={`text-lg font-bold mt-1 ${form.published ? 'text-green-600' : 'text-yellow-600'}`}>
                {form.published ? '🟢 Published' : '🟡 Draft'}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Template</div>
              <div className="text-lg font-bold text-gray-900 mt-1 capitalize">{form.template}</div>
            </div>
          </div>

          {!analytics || responses.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No data yet</h3>
              <p className="text-sm text-gray-400">Analytics will appear once you receive responses</p>
            </div>
          ) : (
            <>
              {/* Response timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Timeline</h3>
                <div className="flex items-end gap-2 h-40">
                  {analytics.responsesByDay.map((day) => {
                    const maxCount = Math.max(...analytics.responsesByDay.map((d) => d.count));
                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500">{day.count}</span>
                        <div
                          className="w-full bg-indigo-500 rounded-t-md min-h-[4px] transition-all"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Field insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.fieldSummaries.map((summary) => (
                  <div key={summary.field.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{summary.field.label}</h4>
                      <span className="text-xs text-gray-500">{summary.fillRate}% fill rate</span>
                    </div>

                    {/* Fill rate bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${summary.fillRate}%` }}
                      />
                    </div>

                    {'counts' in summary && summary.counts && (
                      <div className="space-y-2">
                        {Object.entries(summary.counts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([value, count]) => (
                            <div key={value} className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700 truncate">{value}</span>
                                  <span className="text-gray-500 ml-2">{count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                  <div
                                    className="bg-purple-400 h-1.5 rounded-full"
                                    style={{ width: `${(count / responses.length) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {'average' in summary && (
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-indigo-600">{summary.average}</div>
                        <div className="text-sm text-gray-500">Average value</div>
                      </div>
                    )}

                    {!('counts' in summary) && !('average' in summary) && (
                      <div className="text-sm text-gray-400 text-center py-4">
                        Text field — {responses.length} responses collected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

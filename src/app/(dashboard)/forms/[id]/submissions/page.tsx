'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { FormField } from '@/types/form'

interface Submission {
  id: string
  data: Record<string, any>
  createdAt: string
}

export default function SubmissionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<{ name: string; fields: FormField[] } | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && formId) {
      fetchForm()
      fetchSubmissions(1)
    }
  }, [session, formId])

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}`)
      if (res.ok) {
        const data = await res.json()
        setForm({ name: data.name, fields: data.fields })
      }
    } catch (error) {
      console.error('Error fetching form:', error)
    }
  }

  const fetchSubmissions = async (page: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/forms/${formId}/submissions?page=${page}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selected.length} submission(s)?`)) return
    
    try {
      await fetch(`/api/forms/${formId}/submissions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionIds: selected }),
      })
      setSubmissions(submissions.filter((s) => !selected.includes(s.id)))
      setSelected([])
    } catch (error) {
      console.error('Error deleting submissions:', error)
    }
  }

  const exportCSV = () => {
    if (!form || submissions.length === 0) return

    const fieldLabels = form.fields.reduce((acc, f) => {
      acc[f.id] = f.label
      return acc
    }, {} as Record<string, string>)

    const headers = ['Submitted At', ...Object.values(fieldLabels)]
    const rows = submissions.map((s) => {
      const row = [new Date(s.createdAt).toLocaleString()]
      for (const field of form.fields) {
        const value = s.data[field.id]
        row.push(Array.isArray(value) ? value.join('; ') : String(value || ''))
      }
      return row
    })

    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.name}-submissions.csv`
    a.click()
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selected.length === submissions.length) {
      setSelected([])
    } else {
      setSelected(submissions.map((s) => s.id))
    }
  }

  if (status === 'loading' || (loading && !form)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const fieldLabels = form?.fields.reduce((acc, f) => {
    if (!['heading', 'paragraph'].includes(f.type)) {
      acc[f.id] = f.label
    }
    return acc
  }, {} as Record<string, string>) || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form?.name}</h1>
              <p className="text-gray-600">{pagination.total} submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <Button variant="destructive" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete ({selected.length})
              </Button>
            )}
            <Button variant="outline" onClick={exportCSV} disabled={submissions.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No submissions yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selected.length === submissions.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      {Object.values(fieldLabels).slice(0, 5).map((label, i) => (
                        <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(submission.id)}
                            onChange={() => toggleSelect(submission.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(submission.createdAt).toLocaleDateString()}
                          <br />
                          <span className="text-gray-500">{new Date(submission.createdAt).toLocaleTimeString()}</span>
                        </td>
                        {Object.keys(fieldLabels).slice(0, 5).map((fieldId, i) => (
                          <td key={i} className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                            {Array.isArray(submission.data[fieldId])
                              ? submission.data[fieldId].join(', ')
                              : submission.data[fieldId] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => fetchSubmissions(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => fetchSubmissions(pagination.page + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

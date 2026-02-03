'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, BarChart3, Settings, Trash2, ExternalLink, Copy, Loader2 } from 'lucide-react'

interface Form {
  id: string
  name: string
  description: string | null
  published: boolean
  shareId: string
  createdAt: string
  updatedAt: string
  _count: { submissions: number }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchForms()
    }
  }, [session])

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms')
      if (res.ok) {
        const data = await res.json()
        setForms(data)
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const createForm = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Form' }),
      })
      if (res.ok) {
        const form = await res.json()
        router.push(`/forms/${form.id}/edit`)
      }
    } catch (error) {
      console.error('Error creating form:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return
    
    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setForms(forms.filter((f) => f.id !== id))
      }
    } catch (error) {
      console.error('Error deleting form:', error)
    }
  }

  const copyShareLink = (shareId: string) => {
    const url = `${window.location.origin}/f/${shareId}`
    navigator.clipboard.writeText(url)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <p className="text-gray-600 mt-1">Create and manage your forms</p>
          </div>
          <Button onClick={createForm} disabled={creating}>
            {creating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            New Form
          </Button>
        </div>

        {forms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-4">Create your first form to get started</p>
              <Button onClick={createForm} disabled={creating}>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{form.name}</CardTitle>
                      <CardDescription className="truncate">
                        {form.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Badge variant={form.published ? 'success' : 'secondary'}>
                      {form.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {form._count.submissions} submissions
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/forms/${form.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/forms/${form.id}/submissions`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyShareLink(form.shareId)}
                      title="Copy share link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteForm(form.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

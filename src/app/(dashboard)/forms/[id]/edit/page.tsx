'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FormBuilder } from '@/components/form-builder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormSettings } from '@/types/form'
import { ArrowLeft, Save, Eye, ExternalLink, Loader2, Copy, Webhook, Plus, Trash2 } from 'lucide-react'

interface Webhook {
  id: string
  url: string
  secret: string
  active: boolean
  events: string[]
}

export default function FormEditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<{
    id: string
    name: string
    description: string
    fields: FormField[]
    settings: FormSettings
    published: boolean
    shareId: string
    webhooks: Webhook[]
  } | null>(null)

  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && formId) {
      fetchForm()
    }
  }, [session, formId])

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}`)
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching form:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveForm = useCallback(async (updates: Partial<typeof form>) => {
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const data = await res.json()
        setForm((prev) => prev ? { ...prev, ...data } : null)
      }
    } catch (error) {
      console.error('Error saving form:', error)
    } finally {
      setSaving(false)
    }
  }, [form, formId])

  const addWebhook = async () => {
    if (!webhookUrl) return
    try {
      const res = await fetch(`/api/forms/${formId}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl }),
      })
      if (res.ok) {
        const webhook = await res.json()
        setForm((prev) => prev ? { ...prev, webhooks: [...(prev.webhooks || []), webhook] } : null)
        setWebhookUrl('')
      }
    } catch (error) {
      console.error('Error adding webhook:', error)
    }
  }

  const deleteWebhook = async (webhookId: string) => {
    try {
      await fetch(`/api/forms/${formId}/webhooks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookId }),
      })
      setForm((prev) => prev ? { ...prev, webhooks: prev.webhooks?.filter((w) => w.id !== webhookId) || [] } : null)
    } catch (error) {
      console.error('Error deleting webhook:', error)
    }
  }

  const copyEmbedCode = () => {
    const code = `<iframe src="${window.location.origin}/embed/${form?.shareId}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(code)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => saveForm({ name: form.name })}
              className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 w-auto"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="published" className="text-sm">Published</Label>
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(checked) => {
                  setForm({ ...form, published: checked })
                  saveForm({ published: checked })
                }}
              />
            </div>
            <Link href={`/f/${form.shareId}`} target="_blank">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </Link>
            <Button onClick={() => saveForm({ fields: form.fields, settings: form.settings })} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              Save
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList>
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <FormBuilder
              initialFields={form.fields}
              onChange={(fields) => setForm({ ...form, fields })}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      onBlur={() => saveForm({ description: form.description })}
                      placeholder="Form description"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Submit Button Text</Label>
                    <Input
                      value={form.settings.submitButtonText || 'Submit'}
                      onChange={(e) => setForm({ ...form, settings: { ...form.settings, submitButtonText: e.target.value } })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Success Message</Label>
                    <Input
                      value={form.settings.successMessage || ''}
                      onChange={(e) => setForm({ ...form, settings: { ...form.settings, successMessage: e.target.value } })}
                      placeholder="Thank you for your submission!"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Redirect URL (optional)</Label>
                    <Input
                      value={form.settings.redirectUrl || ''}
                      onChange={(e) => setForm({ ...form, settings: { ...form.settings, redirectUrl: e.target.value } })}
                      placeholder="https://example.com/thank-you"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable email notifications</Label>
                    <Switch
                      checked={form.settings.emailNotifications?.enabled || false}
                      onCheckedChange={(checked) => setForm({
                        ...form,
                        settings: {
                          ...form.settings,
                          emailNotifications: {
                            ...form.settings.emailNotifications,
                            enabled: checked,
                            recipients: form.settings.emailNotifications?.recipients || [],
                          },
                        },
                      })}
                    />
                  </div>
                  {form.settings.emailNotifications?.enabled && (
                    <>
                      <div>
                        <Label>Recipients (comma separated)</Label>
                        <Input
                          value={form.settings.emailNotifications?.recipients?.join(', ') || ''}
                          onChange={(e) => setForm({
                            ...form,
                            settings: {
                              ...form.settings,
                              emailNotifications: {
                                ...form.settings.emailNotifications!,
                                recipients: e.target.value.split(',').map((r) => r.trim()).filter(Boolean),
                              },
                            },
                          })}
                          placeholder="email1@example.com, email2@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email Subject</Label>
                        <Input
                          value={form.settings.emailNotifications?.subject || ''}
                          onChange={(e) => setForm({
                            ...form,
                            settings: {
                              ...form.settings,
                              emailNotifications: {
                                ...form.settings.emailNotifications!,
                                subject: e.target.value,
                              },
                            },
                          })}
                          placeholder="New submission: {form name}"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-webhook-url.com/endpoint"
                    className="flex-1"
                  />
                  <Button onClick={addWebhook}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Webhook
                  </Button>
                </div>

                {form.webhooks?.length > 0 && (
                  <div className="space-y-2">
                    {form.webhooks.map((webhook) => (
                      <div key={webhook.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-mono text-sm">{webhook.url}</p>
                          <p className="text-xs text-gray-500 mt-1">Secret: {webhook.secret.substring(0, 20)}...</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteWebhook(webhook.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>Embed Your Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Share Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/f/${form.shareId}`}
                      readOnly
                    />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/f/${form.shareId}`)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Embed Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={`<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${form.shareId}" width="100%" height="600" frameborder="0"></iframe>`}
                      readOnly
                    />
                    <Button variant="outline" onClick={copyEmbedCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

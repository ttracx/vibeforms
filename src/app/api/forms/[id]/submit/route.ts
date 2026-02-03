import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FormSettings } from '@/types/form'

async function triggerWebhooks(formId: string, data: any) {
  const webhooks = await prisma.webhook.findMany({
    where: { formId, active: true, events: { has: 'submission.created' } },
  })

  for (const webhook of webhooks) {
    try {
      const payload = JSON.stringify({
        event: 'submission.created',
        formId,
        data,
        timestamp: new Date().toISOString(),
      })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (webhook.secret) {
        const crypto = require('crypto')
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(payload)
          .digest('hex')
        headers['X-Webhook-Signature'] = signature
      }

      await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: payload,
      })
    } catch (error) {
      console.error(`Webhook ${webhook.id} failed:`, error)
    }
  }
}

async function sendEmailNotification(form: any, data: any) {
  const settings = form.settings as FormSettings
  if (!settings.emailNotifications?.enabled || !settings.emailNotifications.recipients?.length) {
    return
  }

  // Build email content
  const fieldLabels = (form.fields as any[]).reduce((acc, field) => {
    acc[field.id] = field.label
    return acc
  }, {} as Record<string, string>)

  let emailBody = `New submission received for form: ${form.name}\n\n`
  for (const [key, value] of Object.entries(data)) {
    const label = fieldLabels[key] || key
    emailBody += `${label}: ${Array.isArray(value) ? value.join(', ') : value}\n`
  }

  // If Resend is configured, send email
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'VibeForms <noreply@vibeforms.app>',
        to: settings.emailNotifications.recipients,
        subject: settings.emailNotifications.subject || `New submission: ${form.name}`,
        text: emailBody,
      })
    } catch (error) {
      console.error('Email notification failed:', error)
    }
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()

    const form = await prisma.form.findUnique({ where: { id } })
    if (!form || !form.published) {
      return NextResponse.json({ error: 'Form not found or not published' }, { status: 404 })
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        formId: id,
        data,
      },
    })

    // Trigger webhooks (async, don't wait)
    triggerWebhooks(id, data).catch(console.error)

    // Send email notifications (async, don't wait)
    sendEmailNotification(form, data).catch(console.error)

    return NextResponse.json({ success: true, submissionId: submission.id })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}

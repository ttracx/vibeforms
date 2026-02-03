import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const form = await prisma.form.findUnique({ where: { id } })
    if (!form || form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const webhooks = await prisma.webhook.findMany({
      where: { formId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(webhooks)
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { url, events } = await req.json()

    const form = await prisma.form.findUnique({ where: { id } })
    if (!form || form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const webhook = await prisma.webhook.create({
      data: {
        formId: id,
        url,
        secret: crypto.randomBytes(32).toString('hex'),
        events: events || ['submission.created'],
      },
    })

    return NextResponse.json(webhook)
  } catch (error) {
    console.error('Error creating webhook:', error)
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { webhookId } = await req.json()

    const form = await prisma.form.findUnique({ where: { id } })
    if (!form || form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    await prisma.webhook.delete({
      where: { id: webhookId, formId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}

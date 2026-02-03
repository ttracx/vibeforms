import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { formId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.submission.count({ where: { formId: id } }),
    ])

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { submissionIds } = await req.json()

    const form = await prisma.form.findUnique({ where: { id } })
    if (!form || form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    await prisma.submission.deleteMany({
      where: {
        id: { in: submissionIds },
        formId: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting submissions:', error)
    return NextResponse.json({ error: 'Failed to delete submissions' }, { status: 500 })
  }
}

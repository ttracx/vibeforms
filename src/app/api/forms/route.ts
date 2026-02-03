import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { submissions: true } } },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await req.json()

    const form = await prisma.form.create({
      data: {
        name: name || 'Untitled Form',
        description,
        userId: session.user.id,
        fields: [],
        settings: {
          submitButtonText: 'Submit',
          successMessage: 'Thank you for your submission!',
        },
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
  }
}

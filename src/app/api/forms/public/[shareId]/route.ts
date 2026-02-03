import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  try {
    const { shareId } = await params
    
    const form = await prisma.form.findUnique({
      where: { shareId },
      select: {
        id: true,
        name: true,
        description: true,
        fields: true,
        settings: true,
        published: true,
      },
    })

    if (!form || !form.published) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching public form:', error)
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 })
  }
}

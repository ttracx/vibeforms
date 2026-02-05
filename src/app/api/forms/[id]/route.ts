import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const form = store.getForm(params.id);

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  return NextResponse.json(form);
}

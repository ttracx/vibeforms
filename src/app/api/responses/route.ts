import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/store';
import { FormResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');

  if (!formId) {
    return NextResponse.json({ error: 'formId is required' }, { status: 400 });
  }

  const responses = store.getFormResponses(formId);
  return NextResponse.json(responses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.formId) {
    return NextResponse.json({ error: 'formId is required' }, { status: 400 });
  }

  const form = store.getForm(body.formId);
  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  if (!form.published) {
    return NextResponse.json({ error: 'Form is not published' }, { status: 403 });
  }

  const response: FormResponse = {
    id: uuidv4(),
    formId: body.formId,
    data: body.data || {},
    submittedAt: new Date().toISOString(),
    metadata: {
      userAgent: request.headers.get('user-agent') || undefined,
    },
  };

  store.addResponse(response);
  return NextResponse.json(response, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/store';
import { Form, FormTemplate } from '@/lib/types';
import { getTemplateFields } from '@/lib/templates';
import { templateConfigs } from '@/lib/templates';

export async function GET() {
  const forms = store.getAllForms();
  const formsWithCounts = forms.map((form) => ({
    ...form,
    responseCount: store.getResponseCount(form.id),
  }));
  return NextResponse.json(formsWithCounts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const template = (body.template || 'blank') as FormTemplate;
  const config = templateConfigs[template];

  const form: Form = {
    id: uuidv4(),
    name: body.name || config.name,
    description: body.description || config.description,
    template,
    fields: body.fields || getTemplateFields(template),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
  };

  store.saveForm(form);
  return NextResponse.json(form, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const existing = store.getForm(body.id);

  if (!existing) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  const updated: Form = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  store.saveForm(updated);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Form ID required' }, { status: 400 });
  }

  store.deleteForm(id);
  return NextResponse.json({ success: true });
}

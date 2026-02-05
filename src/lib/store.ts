import { Form, FormResponse } from './types';

// In-memory store (server-side) - In production, use a database
// For this demo, we use a JSON file-based store

const globalStore = globalThis as unknown as {
  __vibeforms_forms?: Map<string, Form>;
  __vibeforms_responses?: Map<string, FormResponse[]>;
};

function getForms(): Map<string, Form> {
  if (!globalStore.__vibeforms_forms) {
    globalStore.__vibeforms_forms = new Map();
  }
  return globalStore.__vibeforms_forms;
}

function getResponses(): Map<string, FormResponse[]> {
  if (!globalStore.__vibeforms_responses) {
    globalStore.__vibeforms_responses = new Map();
  }
  return globalStore.__vibeforms_responses;
}

export const store = {
  // Forms
  getAllForms(): Form[] {
    return Array.from(getForms().values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getForm(id: string): Form | undefined {
    return getForms().get(id);
  },

  saveForm(form: Form): Form {
    getForms().set(form.id, form);
    return form;
  },

  deleteForm(id: string): boolean {
    getResponses().delete(id);
    return getForms().delete(id);
  },

  // Responses
  getFormResponses(formId: string): FormResponse[] {
    return getResponses().get(formId) || [];
  },

  addResponse(response: FormResponse): FormResponse {
    const responses = getResponses();
    const formResponses = responses.get(response.formId) || [];
    formResponses.push(response);
    responses.set(response.formId, formResponses);
    return response;
  },

  getResponseCount(formId: string): number {
    return (getResponses().get(formId) || []).length;
  },
};

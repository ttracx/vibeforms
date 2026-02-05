import { v4 as uuidv4 } from 'uuid';
import { FormField, FormTemplate } from './types';

export const templateConfigs: Record<FormTemplate, { name: string; description: string; fields: Omit<FormField, 'id'>[] }> = {
  blank: {
    name: 'Blank Form',
    description: 'Start from scratch',
    fields: [],
  },
  contact: {
    name: 'Contact Form',
    description: 'Collect contact information from visitors',
    fields: [
      { type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
      { type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
      { type: 'text', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: false },
      { type: 'text', label: 'Subject', placeholder: 'What is this about?', required: true },
      { type: 'textarea', label: 'Message', placeholder: 'Tell us more...', required: true },
    ],
  },
  survey: {
    name: 'Survey',
    description: 'Gather opinions and feedback with structured questions',
    fields: [
      { type: 'text', label: 'Your Name', placeholder: 'Optional', required: false },
      { type: 'select', label: 'How did you hear about us?', required: true, options: ['Social Media', 'Search Engine', 'Friend/Referral', 'Advertisement', 'Other'] },
      { type: 'select', label: 'Overall Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
      { type: 'select', label: 'How likely are you to recommend us?', required: true, options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'] },
      { type: 'textarea', label: 'Additional Comments', placeholder: 'Share your thoughts...', required: false },
    ],
  },
  feedback: {
    name: 'Feedback Form',
    description: 'Collect product or service feedback',
    fields: [
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: false },
      { type: 'select', label: 'Rating', required: true, options: ['⭐ 1 Star', '⭐⭐ 2 Stars', '⭐⭐⭐ 3 Stars', '⭐⭐⭐⭐ 4 Stars', '⭐⭐⭐⭐⭐ 5 Stars'] },
      { type: 'select', label: 'Category', required: true, options: ['Product Quality', 'Customer Service', 'Website Experience', 'Pricing', 'Other'] },
      { type: 'textarea', label: 'What did you like?', placeholder: 'Tell us what went well...', required: false },
      { type: 'textarea', label: 'What could be improved?', placeholder: 'Help us get better...', required: false },
      { type: 'checkbox', label: 'I would like a follow-up response', required: false },
    ],
  },
  registration: {
    name: 'Registration Form',
    description: 'Event or account registration',
    fields: [
      { type: 'text', label: 'First Name', placeholder: 'First name', required: true },
      { type: 'text', label: 'Last Name', placeholder: 'Last name', required: true },
      { type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
      { type: 'text', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: false },
      { type: 'text', label: 'Organization', placeholder: 'Company or organization', required: false },
      { type: 'select', label: 'Role', required: false, options: ['Student', 'Professional', 'Manager', 'Executive', 'Other'] },
      { type: 'date', label: 'Date of Birth', required: false },
      { type: 'checkbox', label: 'I agree to the terms and conditions', required: true },
    ],
  },
  order: {
    name: 'Order Form',
    description: 'Collect orders and purchase information',
    fields: [
      { type: 'text', label: 'Full Name', placeholder: 'Your full name', required: true },
      { type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
      { type: 'text', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: true },
      { type: 'select', label: 'Product', required: true, options: ['Basic Plan', 'Standard Plan', 'Premium Plan', 'Enterprise Plan'] },
      { type: 'number', label: 'Quantity', placeholder: '1', required: true },
      { type: 'text', label: 'Shipping Address', placeholder: '123 Main St, City, State, ZIP', required: true },
      { type: 'textarea', label: 'Special Instructions', placeholder: 'Any special requests?', required: false },
    ],
  },
};

export function getTemplateFields(template: FormTemplate): FormField[] {
  return templateConfigs[template].fields.map((field) => ({
    ...field,
    id: uuidv4(),
  }));
}

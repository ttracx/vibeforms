import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const PLANS = {
  pro: {
    name: 'VibeForms Pro',
    price: 1900, // $19.00 in cents
    features: [
      'Unlimited forms',
      'Unlimited submissions',
      'File uploads (up to 10MB)',
      'Conditional logic',
      'Email notifications',
      'Webhooks',
      'Embeddable widgets',
      'Priority support',
    ],
  },
}

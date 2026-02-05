'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';

const features = [
  {
    icon: '🎨',
    title: 'Visual Form Builder',
    description: 'Drag and drop fields to build beautiful forms in minutes. No coding required.',
  },
  {
    icon: '📋',
    title: 'Ready Templates',
    description: 'Start with pre-built templates for contacts, surveys, feedback, registration, and orders.',
  },
  {
    icon: '🔗',
    title: 'Instant Sharing',
    description: 'Share your forms with a unique URL. Embed anywhere or send directly to respondents.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Track responses in real-time with visual analytics and field-level insights.',
  },
  {
    icon: '📥',
    title: 'CSV Export',
    description: 'Export all your response data as CSV for further analysis in any spreadsheet tool.',
  },
  {
    icon: '🔒',
    title: 'Publish Control',
    description: 'Draft and publish forms on your schedule. Unpublish anytime to stop collecting responses.',
  },
];

const templates = [
  { name: 'Contact Form', icon: '📞', description: 'Collect visitor inquiries', color: 'from-blue-500 to-cyan-500' },
  { name: 'Survey', icon: '📊', description: 'Gather structured opinions', color: 'from-purple-500 to-pink-500' },
  { name: 'Feedback', icon: '💬', description: 'Product & service reviews', color: 'from-amber-500 to-orange-500' },
  { name: 'Registration', icon: '📝', description: 'Event & account signups', color: 'from-green-500 to-emerald-500' },
  { name: 'Order Form', icon: '🛒', description: 'Product purchase orders', color: 'from-red-500 to-rose-500' },
];

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Part of the VibeCaaS Suite
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Build forms that
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {' '}convert{' '}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Create beautiful, professional forms in minutes. Collect responses, analyze data, 
                and export insights — all from one powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2"
                >
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Start with a Template</h2>
              <p className="text-gray-500">Pre-built form templates for every use case</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {templates.map((t) => (
                <Link
                  key={t.name}
                  href="/builder"
                  className="group relative overflow-hidden rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
              <p className="text-gray-500">Powerful features to build, share, and analyze forms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your First Form?</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Get started for free. Upgrade to Pro for unlimited forms, advanced analytics, and priority support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-medium hover:bg-indigo-50 shadow-lg transition-all"
              >
                Start Building — It&apos;s Free
              </Link>
              <div className="text-indigo-200 text-sm">
                Pro plan: $19/month
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Settings, BarChart3, Mail, Webhook, Code } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VibeForms</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Build Beautiful Forms
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            In Minutes
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          The most intuitive drag-and-drop form builder. Create stunning forms with
          conditional logic, file uploads, and powerful integrations.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start Building Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              See Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Build Amazing Forms
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Settings className="h-6 w-6" />,
              title: 'Drag & Drop Builder',
              description: 'Intuitive visual builder with real-time preview. No coding required.',
            },
            {
              icon: <Zap className="h-6 w-6" />,
              title: 'Conditional Logic',
              description: 'Show or hide fields based on user responses for dynamic forms.',
            },
            {
              icon: <BarChart3 className="h-6 w-6" />,
              title: 'Submissions Dashboard',
              description: 'Track and manage all your form responses in one place.',
            },
            {
              icon: <Mail className="h-6 w-6" />,
              title: 'Email Notifications',
              description: 'Get instant email alerts when someone submits your form.',
            },
            {
              icon: <Webhook className="h-6 w-6" />,
              title: 'Webhooks',
              description: 'Connect to your favorite apps with powerful webhook integrations.',
            },
            {
              icon: <Code className="h-6 w-6" />,
              title: 'Embeddable Widgets',
              description: 'Embed forms anywhere with a simple code snippet.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 hover:border-violet-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
        <p className="text-gray-600 text-center mb-12">Start free, upgrade when you need more</p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="p-8 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-3 mb-8">
              {['3 forms', '100 submissions/month', 'Basic fields', 'Email notifications'].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">✓</div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="p-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm">Popular</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal opacity-80">/mo</span></p>
            <ul className="space-y-3 mb-8">
              {['Unlimited forms', 'Unlimited submissions', 'File uploads (10MB)', 'Conditional logic', 'Webhooks', 'Embed widgets', 'Priority support'].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button className="w-full bg-white text-violet-600 hover:bg-gray-100">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">VibeForms</span>
          </div>
          <p>&copy; {new Date().getFullYear()} VibeForms. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

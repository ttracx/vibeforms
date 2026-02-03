'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, Zap } from 'lucide-react'

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1Swbo6EHBwvjwYhUIQ6BYPAX' }),
      })
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManage = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const features = [
    'Unlimited forms',
    'Unlimited submissions',
    'File uploads (up to 10MB)',
    'Conditional logic',
    'Email notifications',
    'Webhooks integration',
    'Embeddable widgets',
    'Priority support',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
          <p className="text-gray-600">Manage your subscription</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For personal projects</CardDescription>
              <p className="text-3xl font-bold mt-4">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {['3 forms', '100 submissions/month', 'Basic fields', 'Email notifications'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-4 w-4 text-gray-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white relative">
            <div className="absolute top-4 right-4">
              <Badge className="bg-violet-600">Recommended</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-600" />
                Pro
              </CardTitle>
              <CardDescription>For teams and businesses</CardDescription>
              <p className="text-3xl font-bold mt-4">$19<span className="text-lg font-normal text-gray-500">/mo</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Check className="h-4 w-4 text-violet-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="link" onClick={handleManage} disabled={loading}>
            Manage existing subscription
          </Button>
        </div>
      </div>
    </div>
  )
}

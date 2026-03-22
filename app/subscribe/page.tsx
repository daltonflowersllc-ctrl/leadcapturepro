'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$199',
    period: 'per month',
    annual: '$1,990/year (save $398)',
    features: [
      'Missed Call Capture',
      'Auto-SMS to Callers',
      'Lead Dashboard',
      'SMS Notifications',
      '1 Phone Number',
      '7-Day Call Logs',
    ],
    cta: 'Start 7-Day Trial',
    style: 'border border-gray-200',
    btnStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$299',
    period: 'per month',
    annual: '$2,990/year (save $598)',
    popular: true,
    features: [
      'Everything in Basic',
      'Custom SMS Templates',
      'Lead Scoring',
      'Priority Support',
      'Team Access (2 users)',
      '3 Phone Numbers',
      '30-Day Call Logs',
    ],
    cta: 'Start 7-Day Trial',
    style: 'border-2 border-blue-500 scale-105',
    btnStyle: 'bg-blue-500 hover:bg-blue-400 text-white',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$499',
    period: 'per month',
    annual: '$4,990/year (save $998)',
    features: [
      'Everything in Pro',
      'Calendar Integration',
      'API Access',
      'Custom Branding',
      'Dedicated Account Manager',
      '5 Phone Numbers',
      'Unlimited Call History',
    ],
    cta: 'Start 7-Day Trial',
    style: 'border border-gray-200',
    btnStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
];

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const highlightPlan = searchParams.get('plan');

  useEffect(() => {
    // If user came from Stripe success, redirect to dashboard
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  const handleSelectPlan = async (tierId: string) => {
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/signup');
      return;
    }

    setLoading(tierId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: tierId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to start checkout. Please try again.');
        setLoading(null);
        return;
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        setError('No checkout URL returned. Please try again.');
        setLoading(null);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">LeadCapture Pro</Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
            Already have an account? Log in
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your 7-day free trial today. Credit card required — you won't be charged until day 8.
          </p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg p-8 relative ${plan.style} ${
                highlightPlan === plan.id ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-4xl font-bold mb-1">{plan.price}</p>
              <p className="text-gray-500 text-sm mb-1">{plan.period}</p>
              <p className="text-green-600 text-sm mb-6">{plan.annual}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading !== null}
                className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-60 ${plan.btnStyle}`}
              >
                {loading === plan.id ? 'Redirecting to checkout...' : plan.cta}
              </button>
              <p className="text-xs text-center text-gray-500 mt-3">💳 Credit card required</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          All plans include a 7-day trial. Your card will be charged on day 8. Cancel anytime before then.
        </p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SubscribeContent />
    </Suspense>
  );
}

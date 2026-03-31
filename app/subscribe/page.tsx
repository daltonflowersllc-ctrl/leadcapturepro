'use client';

import { useState } from 'react';
import Link from 'next/link';

async function handlePlanClick(planName: string, planHref: string) {
  const res = await fetch('/api/auth/me');
  if (res.ok) {
    // Logged in — go straight to Stripe checkout
    const checkoutRes = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planName.toLowerCase() }),
    });
    if (checkoutRes.ok) {
      const { url } = await checkoutRes.json();
      if (url) {
        window.location.href = url;
        return;
      }
    }
  }
  // Not logged in — go to signup
  window.location.href = planHref;
}

const plans = [
  {
    name: 'Starter',
    monthly: 149,
    annual: 1490,
    annualSavings: 298,
    color: 'from-slate-800 to-slate-900',
    border: 'border-slate-700',
    badge: null,
    features: [
      'Missed call detection',
      'Auto-SMS to caller',
      'Basic lead form',
      'Lead management dashboard',
      'One-tap call back',
      'SMS notifications to owner',
      '1 phone number',
      '100 SMS/month included',
    ],
    cta: 'Start 7-Day Trial',
    ctaStyle: 'bg-white text-slate-900 hover:bg-slate-100',
    href: '/signup?plan=starter',
  },
  {
    name: 'Pro',
    monthly: 249,
    annual: 2490,
    annualSavings: 498,
    color: 'from-blue-600 to-blue-800',
    border: 'border-blue-400',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Starter',
      'Smart lead form (service type, urgency, budget, photo)',
      'Zapier integration — 5,000+ apps',
      'Custom SMS templates',
      'Multi-step follow-up SMS',
      'Lead scoring (hot/warm/cold)',
      'Business hours settings',
      '3 phone numbers',
      '500 SMS/month',
      'Team access (2 users)',
    ],
    cta: 'Start 7-Day Trial',
    ctaStyle: 'bg-white text-blue-700 hover:bg-blue-50',
    href: '/signup?plan=pro',
  },
  {
    name: 'Elite',
    monthly: 399,
    annual: 3990,
    annualSavings: 798,
    color: 'from-violet-700 to-violet-900',
    border: 'border-violet-500',
    badge: 'COMING SOON',
    features: [
      'Everything in Pro',
      'AI voice agent',
      'Voicemail transcription',
      'Auto-schedule estimates',
      'Calendar integration',
      'Jobber & Housecall Pro integration',
      '5 phone numbers',
      'Unlimited SMS',
      'Dedicated account manager',
    ],
    cta: 'Join Waitlist',
    ctaStyle: 'bg-white text-violet-700 hover:bg-violet-50',
    href: '/signup?plan=elite',
  },
];

export default function SubscribePage() {
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen bg-slate-950 text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.25), transparent);
        }
      `}</style>

      {/* Nav */}
      <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">LeadCapture Pro</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 text-center hero-glow grid-bg">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-400 text-xl mb-10">
            Start your 7-day free trial today. No commitment until day 8.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? 'bg-blue-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle annual billing"
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  annual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-slate-500'}`}>
              Annual <span className="text-green-400 font-medium">Save 2 months</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-hover relative rounded-2xl p-8 bg-gradient-to-b ${plan.color} border ${
                  plan.border
                } ${plan.badge === 'MOST POPULAR' ? 'scale-105 shadow-2xl shadow-blue-500/20' : ''}`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                      plan.badge === 'MOST POPULAR'
                        ? 'bg-blue-400 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                <div className="flex items-end space-x-1 mb-1">
                  <span className="text-4xl font-bold text-white">
                    ${annual ? Math.round(plan.annual / 12) : plan.monthly}
                  </span>
                  <span className="text-slate-300 mb-1">/mo</span>
                </div>

                {annual ? (
                  <p className="text-green-400 text-sm mb-6">
                    ${plan.annual.toLocaleString()}/yr — save ${plan.annualSavings}
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm mb-6">
                    or ${plan.annual.toLocaleString()}/yr — save ${plan.annualSavings}
                  </p>
                )}

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2 text-sm text-slate-200">
                      <svg
                        className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={async () => {
                    setLoadingPlan(plan.name);
                    await handlePlanClick(plan.name, plan.href);
                    setLoadingPlan(null);
                  }}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 ${plan.ctaStyle}`}
                >
                  {loadingPlan === plan.name ? 'Loading...' : plan.cta}
                </button>

                <p className="text-xs text-center text-slate-400 mt-3">
                  {plan.badge === 'COMING SOON'
                    ? 'Launching soon — reserve your spot'
                    : '7-day trial • Credit card required'}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-12">
            All plans include a 7-day free trial. Your card will be charged on day 8. Cancel anytime
            before then.
          </p>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Why contractors trust us</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700 text-left">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="text-white font-semibold mb-2">Secure Checkout</h3>
              <p className="text-slate-400 text-sm">256-bit SSL encryption. Your data is always safe.</p>
            </div>
            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700 text-left">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-white font-semibold mb-2">5-Minute Setup</h3>
              <p className="text-slate-400 text-sm">We walk you through every step. No tech skills needed.</p>
            </div>
            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700 text-left">
              <div className="text-2xl mb-3">💬</div>
              <h3 className="text-white font-semibold mb-2">Real Support</h3>
              <p className="text-slate-400 text-sm">Live chat and email. We respond fast.</p>
            </div>
          </div>
          <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
  const [selectedTier, setSelectedTier] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const pricing = {
    basic: { monthly: 199, yearly: 1990 },
    pro: { monthly: 299, yearly: 2990 },
    elite: { monthly: 499, yearly: 4990 }
  };

  const features = {
    basic: [
      'Missed Call Capture',
      'Auto-SMS to Callers',
      'Lead Dashboard',
      'SMS Notifications',
      '1 Phone Number',
      'Email Support'
    ],
    pro: [
      'Everything in Basic',
      'Custom SMS Templates',
      'Lead Scoring',
      'Priority Support',
      '3 Phone Numbers',
      'Team Access (2 users)',
      'Analytics Dashboard'
    ],
    elite: [
      'Everything in Pro',
      'Calendar Integration',
      'AI Lead Scoring',
      'API Access',
      '5 Phone Numbers',
      'Team Access (5 users)',
      'Custom Branding',
      'Dedicated Account Manager'
    ]
  };

  const calculateYearlySavings = (tier: keyof typeof pricing) => {
    const monthlyTotal = pricing[tier].monthly * 12;
    const yearlyPrice = pricing[tier].yearly;
    const savings = monthlyTotal - yearlyPrice;
    return { monthlyTotal, yearlyPrice, savings };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            LeadCapture Pro
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Start Your 7-Day Trial
          </h1>
          <p className="text-xl text-gray-600">
            No risk. Your card won't be charged until day 8. Cancel anytime.
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🔒 Secure checkout
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              💳 Credit card required
            </span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition ${
                billingPeriod === 'monthly'
                  ? 'bg-secondary text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition relative ${
                billingPeriod === 'yearly'
                  ? 'bg-secondary text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly Billing
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
              selectedTier === 'basic' ? 'ring-4 ring-secondary' : ''
            }`}
            onClick={() => setSelectedTier('basic')}
          >
            <div className="px-6 py-8 bg-gray-50 border-b">
              <h3 className="text-2xl font-bold text-primary">Basic</h3>
              <div className="mt-4">
                {billingPeriod === 'yearly' ? (
                  <>
                    <span className="text-4xl font-bold">$1,990</span>
                    <span className="text-gray-600 ml-2">/year</span>
                    <p className="text-sm text-green-600 mt-1">
                      Save ${calculateYearlySavings('basic').savings}/year
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  7-Day Trial
                </span>
              </div>
              <ul className="space-y-3">
                {features.basic.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-8 hover:bg-opacity-90 transition">
                Start Basic Trial
              </button>
            </div>
          </div>

          {/* Pro Card - Most Popular */}
          <div 
            className={`bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transition transform hover:scale-105 ${
              selectedTier === 'pro' ? 'ring-4 ring-secondary' : ''
            }`}
            onClick={() => setSelectedTier('pro')}
          >
            <div className="px-6 py-8 bg-gradient-to-r from-secondary to-blue-700 text-white relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-2 text-sm font-bold rounded-bl-lg">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-4">
                {billingPeriod === 'yearly' ? (
                  <>
                    <span className="text-4xl font-bold">$2,990</span>
                    <span className="text-blue-200 ml-2">/year</span>
                    <p className="text-sm text-yellow-300 mt-1">
                      Save ${calculateYearlySavings('pro').savings}/year
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">$299</span>
                    <span className="text-blue-200 ml-2">/month</span>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  7-Day Trial
                </span>
              </div>
              <ul className="space-y-3">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-secondary text-white py-3 rounded-lg font-semibold mt-8 hover:bg-blue-600 transition">
                Start Pro Trial
              </button>
            </div>
          </div>

          {/* Elite Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
              selectedTier === 'elite' ? 'ring-4 ring-secondary' : ''
            }`}
            onClick={() => setSelectedTier('elite')}
          >
            <div className="px-6 py-8 bg-gray-900 text-white border-b">
              <h3 className="text-2xl font-bold">Elite</h3>
              <div className="mt-4">
                {billingPeriod === 'yearly' ? (
                  <>
                    <span className="text-4xl font-bold">$4,990</span>
                    <span className="text-gray-400 ml-2">/year</span>
                    <p className="text-sm text-green-400 mt-1">
                      Save ${calculateYearlySavings('elite').savings}/year
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">$499</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  7-Day Trial
                </span>
              </div>
              <ul className="space-y-3">
                {features.elite.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold mt-8 hover:bg-gray-800 transition">
                Start Elite Trial
              </button>
            </div>
          </div>
        </div>

        {/* Trial Terms */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">How Your 7-Day Trial Works</h3>
            <p className="text-gray-600 mb-4">
              We'll ask for your credit card to verify your identity. 
              <strong> You won't be charged until day 8.</strong> 
              Cancel anytime during your trial and you'll never be billed.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>🔒 256-bit SSL</span>
              <span>💳 Secure payments</span>
              <span>⏰ Cancel anytime</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            By starting your trial, you agree to our 
            <a href="#" className="text-secondary hover:underline"> Terms of Service</a> and 
            <a href="#" className="text-secondary hover:underline"> Privacy Policy</a>.
          </p>
        </div>

        {/* FAQ Preview */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">When will I be charged?</h4>
              <p className="text-gray-600 text-sm">Your card will be charged on day 8 of your trial. We'll send you a reminder email 2 days before.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Can I cancel during trial?</h4>
              <p className="text-gray-600 text-sm">Yes! Cancel anytime from your dashboard before day 8 and you'll never be charged.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">What if I need more than 7 days?</h4>
              <p className="text-gray-600 text-sm">Contact us! We're happy to extend your trial if you need more time to evaluate.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Can I switch plans later?</h4>
              <p className="text-gray-600 text-sm">Absolutely! You can upgrade or downgrade anytime. Changes are prorated.</p>
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-16 p-8 bg-green-50 rounded-2xl">
          <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you're not completely satisfied within the first 30 days of your paid subscription, 
            contact us for a full refund. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}

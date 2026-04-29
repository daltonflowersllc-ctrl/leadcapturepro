'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleUpgrade = async (tier: string) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert('Failed to upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LeadCapture Pro
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Upgrade Your Plan</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your business. Upgrade anytime and unlock powerful features.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Card */}
          <div className={`rounded-xl shadow-lg p-8 border-2 ${
            user?.tier === 'basic' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">$199</p>
            <p className="text-gray-600 mb-6">per month</p>
            {user?.tier === 'basic' && (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center mb-6 font-semibold">
                Current Plan
              </div>
            )}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Missed Call Notifications
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SMS to Customer & Company
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1 Phone Number
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Call Logs (7 days)
              </li>
            </ul>
            {user?.tier !== 'basic' && (
              <button
                onClick={() => handleUpgrade('basic')}
                disabled={loading}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Downgrade to Basic
              </button>
            )}
          </div>

          {/* Premium Card - Featured */}
          <div className="rounded-xl shadow-xl p-8 border-2 border-blue-600 bg-white transform scale-105 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">$349</p>
            <p className="text-gray-600 mb-6">per month</p>
            {user?.tier === 'premium' && (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center mb-6 font-semibold">
                Current Plan
              </div>
            )}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Basic
              </li>
              <li className="flex items-center text-sm font-semibold text-blue-600">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Lead Capture Form
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Lead Dashboard
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                3 Phone Numbers
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Call Logs (30 days)
              </li>
            </ul>
            {user?.tier !== 'premium' && (
              <button
                onClick={() => handleUpgrade('premium')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </button>
            )}
          </div>

          {/* Elite Card */}
          <div className={`rounded-xl shadow-lg p-8 border-2 ${
            user?.tier === 'elite' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Elite</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">$499</p>
            <p className="text-gray-600 mb-6">per month</p>
            {user?.tier === 'elite' && (
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-center mb-6 font-semibold">
                Current Plan
              </div>
            )}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Pro
              </li>
              <li className="flex items-center text-sm text-purple-600 font-semibold">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI Call Agent (Coming Soon)
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                5 Phone Numbers
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited Call History
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited Team Members
              </li>
            </ul>
            {user?.tier !== 'elite' && (
              <button
                onClick={() => handleUpgrade('elite')}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                Upgrade to Elite
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSaving, setWebhookSaving] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSaveWebhook = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setWebhookSaving(true);
    setWebhookMessage('');
    try {
      const res = await fetch('/api/settings/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ webhookUrl }),
      });
      if (res.ok) {
        setWebhookMessage('Webhook URL saved successfully.');
      } else {
        const data = await res.json();
        setWebhookMessage(data.error || 'Failed to save webhook URL.');
      }
    } catch {
      setWebhookMessage('Failed to save webhook URL.');
    } finally {
      setWebhookSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">LeadCapture Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={user?.businessName || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Subscription Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Plan</label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 capitalize">{user?.tier} Plan</span>
                {user?.tier !== 'elite' && (
                  <Link
                    href="/upgrade"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                user?.subscriptionStatus === 'trial' ? 'bg-blue-100 text-blue-800' :
                user?.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user?.subscriptionStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Phone Numbers</h3>
          <p className="text-gray-600 mb-4">
            {user?.tier === 'essential'
              ? 'Essential plan includes 1 phone number.'
              : user?.tier === 'premium'
              ? 'Premium plan includes 3 phone numbers.'
              : 'Elite plan includes 5 phone numbers.'}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add Phone Number
          </button>
        </div>

        {/* SMS Templates */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">SMS Templates</h3>
          <p className="text-gray-600 mb-4">
            {user?.tier === 'basic'
              ? 'Customize the SMS message sent to customers when they call.'
              : 'Customize SMS templates for different scenarios.'}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Manage Templates
          </button>
        </div>

        {/* Integrations (Pro and Elite only) */}
        {(user?.tier === 'premium' || user?.tier === 'elite') && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Integrations</h3>
            <p className="text-sm text-gray-500 mb-5">
              Connect LeadCapture Pro to your other tools via Zapier.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zapier Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Connect to Jobber, HubSpot, Google Sheets and 5,000+ apps
                </p>
              </div>
              {webhookMessage && (
                <p className={`text-sm ${webhookMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {webhookMessage}
                </p>
              )}
              <button
                onClick={handleSaveWebhook}
                disabled={webhookSaving}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {webhookSaving ? 'Saving…' : 'Save Webhook URL'}
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h3>
          <p className="text-red-800 mb-4">
            Canceling your subscription will stop all call capture and lead notifications.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

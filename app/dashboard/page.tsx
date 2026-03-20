'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  subscriptionStatus: string;
}

interface DashboardData {
  user: User;
  stats: {
    missedCalls: number;
    leadsCapture: number;
    responseRate: number;
    thisMonth: {
      calls: number;
      leads: number;
    };
  };
  recentCalls: any[];
  recentLeads: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <p className="text-sm text-gray-600">{user?.tier.toUpperCase()} Plan</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                Settings
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">
            {user?.tier === 'basic' 
              ? 'You\'re on the Basic plan. Get notified when customers call.'
              : 'You\'re on the Pro plan. Capture leads automatically with our lead form.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-gray-600 text-sm font-medium">This Month</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {dashboardData?.stats.thisMonth.calls || 0}
            </div>
            <div className="text-gray-600 text-sm mt-2">Missed Calls</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-gray-600 text-sm font-medium">This Month</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {dashboardData?.stats.thisMonth.leads || 0}
            </div>
            <div className="text-gray-600 text-sm mt-2">Leads Captured</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-gray-600 text-sm font-medium">Response Rate</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {dashboardData?.stats.responseRate || 0}%
            </div>
            <div className="text-gray-600 text-sm mt-2">Average</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-gray-600 text-sm font-medium">Subscription</div>
            <div className="text-lg font-bold text-orange-600 mt-2 capitalize">
              {user?.subscriptionStatus}
            </div>
            <div className="text-gray-600 text-sm mt-2">Status</div>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Calls</h3>
          {dashboardData?.recentCalls.length === 0 ? (
            <p className="text-gray-600">No calls yet. Your missed calls will appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-600 font-medium">From</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Time</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Duration</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentCalls.map((call) => (
                    <tr key={call.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{call.callerNumber}</td>
                      <td className="py-3 text-gray-600">{new Date(call.createdAt).toLocaleString()}</td>
                      <td className="py-3 text-gray-600">{call.duration}s</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          call.missedCall ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {call.missedCall ? 'Missed' : 'Answered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Leads (Pro only) */}
        {user?.tier === 'pro' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Leads</h3>
            {dashboardData?.recentLeads.length === 0 ? (
              <p className="text-gray-600">No leads captured yet. They'll appear here when customers fill out the form.</p>
            ) : (
              <div className="space-y-4">
                {dashboardData?.recentLeads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{lead.callerName}</h4>
                        <p className="text-sm text-gray-600">{lead.callerPhone}</p>
                        <p className="text-sm text-gray-600 mt-1">{lead.serviceNeeded}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

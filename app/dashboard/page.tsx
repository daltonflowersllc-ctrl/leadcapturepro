'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  subscriptionStatus: string;
}

interface Lead {
  id: string;
  callerName: string;
  callerPhone: string;
  callerEmail: string | null;
  serviceNeeded: string | null;
  urgency: string | null;
  status: string;
  notes: string | null;
  formData: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

function timeSince(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function urgencyBadge(urgency: string | null) {
  const u = (urgency || '').toLowerCase();
  if (u === 'emergency' || u === 'high') {
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wide">Emergency</span>;
  }
  if (u === 'urgent' || u === 'medium') {
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 uppercase tracking-wide">Urgent</span>;
  }
  if (u === 'flexible' || u === 'low') {
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide">Flexible</span>;
  }
  if (u === 'normal') {
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">Normal</span>;
  }
  return null;
}

const STATUS_BUTTONS = [
  { value: 'new', label: 'New', active: 'bg-blue-600 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'contacted', label: 'Contacted', active: 'bg-yellow-500 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'won', label: 'Won', active: 'bg-green-600 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'lost', label: 'Lost', active: 'bg-red-500 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
];

function LeadCard({
  lead,
  token,
  onStatusChange,
  onNotesChange,
}: {
  lead: Lead;
  token: string;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const serviceType = lead.serviceNeeded || lead.formData?.serviceType || null;
  const budget = lead.formData?.budget || null;
  const description = lead.formData?.description || lead.notes || null;

  const handleStatusClick = async (status: string) => {
    if (savingStatus || lead.status === status) return;
    setSavingStatus(true);
    try {
      await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      onStatusChange(lead.id, status);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/leads/${lead.id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notes }),
      });
      onNotesChange(lead.id, notes);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 text-base truncate">{lead.callerName}</h4>
          <a
            href={`tel:${lead.callerPhone}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {lead.callerPhone}
          </a>
          {lead.callerEmail && (
            <p className="text-gray-500 text-xs mt-0.5">{lead.callerEmail}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {urgencyBadge(lead.urgency)}
          <span className="text-xs text-gray-400">{timeSince(lead.createdAt)}</span>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-gray-600">
        {serviceType && (
          <span>
            <span className="font-medium text-gray-700">Service:</span> {serviceType}
          </span>
        )}
        {budget && (
          <span>
            <span className="font-medium text-gray-700">Budget:</span> {budget}
          </span>
        )}
      </div>

      {description && description !== notes && (
        <p className="text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg px-3 py-2 italic">
          &ldquo;{description}&rdquo;
        </p>
      )}

      {/* Status buttons */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {STATUS_BUTTONS.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleStatusClick(btn.value)}
            disabled={savingStatus}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              lead.status === btn.value ? btn.active : btn.inactive
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Notes input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSaveNotes}
          disabled={savingNotes}
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {savingNotes ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
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

    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/dashboard/leads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch leads');
        const data = await res.json();
        setLeads(data.leads || []);
      } catch {
        setError('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  const handleStatusChange = useCallback((id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const handleNotesChange = useCallback((id: string, notes: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  // Compute stats
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const leadsThisMonth = leads.filter((l) => new Date(l.createdAt) >= monthStart);
  const totalThisMonth = leadsThisMonth.length;
  const respondedThisMonth = leadsThisMonth.filter((l) => l.status !== 'new').length;
  const responseRate = totalThisMonth > 0 ? Math.round((respondedThisMonth / totalThisMonth) * 100) : 0;
  const leadsWon = leads.filter((l) => l.status === 'won' || l.status === 'converted').length;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

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
              <p className="text-sm text-gray-600">{user?.tier?.toUpperCase()} Plan</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 text-sm">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s your lead activity overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Leads This Month</p>
            <p className="text-4xl font-bold text-blue-600">{totalThisMonth}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Response Rate</p>
            <p className="text-4xl font-bold text-purple-600">{responseRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Leads Won</p>
            <p className="text-4xl font-bold text-green-600">{leadsWon}</p>
          </div>
        </div>

        {/* Leads */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            All Leads{leads.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({leads.length} total)</span>}
          </h3>

          {leads.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-lg mb-2">No leads yet</p>
              <p className="text-gray-400 text-sm">Leads will appear here as missed calls come in.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  token={token}
                  onStatusChange={handleStatusChange}
                  onNotesChange={handleNotesChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

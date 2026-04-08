'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  subscriptionStatus: string;
}

interface Usage {
  smsUsed: number;
  smsLimit: number;
  percentage: number;
  tier: string;
  subscriptionStatus: string;
}

function formatPhoneNumber(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  const local = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return e164;
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
  formData: Record<string, any> | null;
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

function aiScoreBadge(score: string | undefined, emoji: string | undefined, isStarter: boolean) {
  if (isStarter) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400 uppercase tracking-wide flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
        AI Score
      </span>
    );
  }
  if (!score || !emoji) return null;
  const colorMap: Record<string, string> = {
    hot: 'bg-red-100 text-red-700',
    warm: 'bg-yellow-100 text-yellow-700',
    cold: 'bg-blue-100 text-blue-700',
  };
  const cls = colorMap[score] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${cls}`}>
      {emoji} {score}
    </span>
  );
}

const STATUS_BUTTONS = [
  { value: 'new', label: 'New', active: 'bg-blue-600 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'contacted', label: 'Contacted', active: 'bg-yellow-500 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'won', label: 'Won', active: 'bg-green-600 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'lost', label: 'Lost', active: 'bg-red-500 text-white', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
];

function LeadCard({
  lead,
  onStatusChange,
  onNotesChange,
  isStarter,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  isStarter: boolean;
}) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [scripts, setScripts] = useState<string[] | null>(null);
  const [loadingScripts, setLoadingScripts] = useState(false);
  const [scriptsOpen, setScriptsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const serviceType = lead.serviceNeeded || lead.formData?.serviceType || null;
  const budget = lead.formData?.budget || null;
  const description = lead.formData?.description || lead.notes || null;
  const aiScore = lead.formData?.aiScore;
  const aiEmoji = lead.formData?.aiEmoji;
  const aiReason = lead.formData?.aiReason;
  const transcription = lead.formData?.transcription;

  const handleStatusClick = async (status: string) => {
    if (savingStatus || lead.status === status) return;
    setSavingStatus(true);
    try {
      await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      onNotesChange(lead.id, notes);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleGetScripts = async () => {
    if (isStarter) return;
    if (scripts) {
      setScriptsOpen((o) => !o);
      return;
    }
    setLoadingScripts(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/scripts`);
      if (!res.ok) throw new Error('Failed to fetch scripts');
      const data = await res.json();
      setScripts(data.scripts || []);
      setScriptsOpen(true);
    } catch {
      setScripts([]);
    } finally {
      setLoadingScripts(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
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
          {aiScoreBadge(aiScore, aiEmoji, isStarter)}
          <span className="text-xs text-gray-400">{timeSince(lead.createdAt)}</span>
        </div>
      </div>

      {isStarter ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-2 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
          <p className="text-[10px] text-gray-500 font-medium">Upgrade to Pro to unlock AI lead scoring</p>
        </div>
      ) : aiReason && (
        <p className="text-xs text-gray-500 mb-2 italic">AI: {aiReason}</p>
      )}

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

      {isStarter ? (
        <div className="mb-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between opacity-60">
          <p className="text-xs font-semibold text-gray-400">🎙 Voicemail Transcription</p>
          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
        </div>
      ) : transcription && (
        <div className="mb-3 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-purple-700 mb-0.5">🎙 Voicemail</p>
          <p className="text-xs text-purple-800">{transcription}</p>
        </div>
      )}

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

      <div className="flex gap-2 mb-3">
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

      <button
        onClick={handleGetScripts}
        disabled={loadingScripts || isStarter}
        className={`w-full text-xs px-3 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 ${
          isStarter 
            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
        }`}
      >
        {isStarter ? (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            Upgrade to Pro to unlock AI call scripts
          </>
        ) : loadingScripts ? (
          <>
            <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></span>
            Generating scripts…
          </>
        ) : scriptsOpen ? '▲ Hide Call Scripts' : '📞 Get Call Scripts'}
      </button>

      {scriptsOpen && scripts && scripts.length > 0 && (
        <div className="mt-3 space-y-2">
          {scripts.map((script, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Script {i + 1}</span>
                <button
                  onClick={() => handleCopy(script, i)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {copiedIndex === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{script}</p>
            </div>
          ))}
        </div>
      )}

      {scriptsOpen && scripts && scripts.length === 0 && (
        <p className="mt-2 text-xs text-gray-400 text-center">No scripts available.</p>
      )}
    </div>
  );
}

export default function DashboardClient({ user, assignedPhone }: { user: User; assignedPhone: string | null }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState('');
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError('Could not load leads. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/user/usage');
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchUsage();
  }, [fetchLeads, fetchUsage]);

  const handleStatusChange = (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not open billing portal. Please contact support.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const isStarter = user.tier === 'starter';
  const isPastDue = user.subscriptionStatus === 'past_due';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banners */}
      {isPastDue && (
        <div className="bg-red-600 text-white py-3 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚠️ Payment Failed — Your payment method failed. Please update your card to avoid losing access.</span>
          <button onClick={handleManageBilling} className="underline font-bold hover:text-red-100">Update Payment →</button>
        </div>
      )}
      
      {!isPastDue && isStarter && (
        <div className="bg-blue-600 text-white py-3 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>🤖 Unlock AI Features — Upgrade to Pro to get AI lead scoring, call scripts, and voicemail transcription.</span>
          <Link href="/subscribe" className="underline font-bold hover:text-blue-100">Upgrade to Pro →</Link>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">LeadCapture<span className="text-blue-600">Pro</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                {portalLoading ? 'Loading...' : 'Manage Billing'}
              </button>
              <Link href="/settings" className="text-gray-500 hover:text-gray-700 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}</h1>
            <p className="text-gray-500">You're on the <span className="font-semibold text-blue-600 uppercase">{user.tier}</span> plan</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full md:w-80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">SMS Usage</span>
              <span className="text-xs text-gray-500">{usage ? `${usage.smsUsed} of ${usage.smsLimit}` : '...'} SMS</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  (usage?.percentage ?? 0) > 80 ? 'bg-red-500' : (usage?.percentage ?? 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usage?.percentage ?? 0, 100)}%` }}
              ></div>
            </div>
            {usage && usage.percentage >= 80 && (
              <p className="text-[10px] text-red-600 font-bold animate-pulse">Running low on SMS — Upgrade to Pro for 500/month</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your LeadCapture Number</span>
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
              {assignedPhone ? (
                <span className="text-xl font-bold text-blue-700 tracking-tight">
                  {formatPhoneNumber(assignedPhone)}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-blue-500">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-500"></span>
                  <span className="text-sm font-medium">Assigning your number...</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No leads yet</h3>
            <p className="text-gray-500 mb-6">Once you forward your missed calls, leads will appear here in real-time.</p>
            <Link href="/setup" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              View Setup Guide
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
                onNotesChange={handleNotesChange}
                isStarter={isStarter}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

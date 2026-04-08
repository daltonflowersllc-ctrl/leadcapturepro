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
  const [copied, setCopied] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const handleCopyPhone = async () => {
    if (!assignedPhone) return;
    try {
      await navigator.clipboard.writeText(formatPhoneNumber(assignedPhone));
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowToast(false), 2500);
    } catch {
      // clipboard not available
    }
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

  const handleQuickContact = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' }),
      });
      handleStatusChange(id, 'contacted');
    } catch {
      // silent fail
    }
  };

  const handleCopySetup = async () => {
    const text = assignedPhone
      ? `Forward your missed calls to ${formatPhoneNumber(assignedPhone)} in your phone settings. All missed calls will be automatically captured as leads in your LeadCapture Pro dashboard.`
      : 'Assign a phone number in your dashboard first, then forward your missed calls to it in your phone settings.';
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const handleExportCsv = () => {
    const q = search.toLowerCase();
    const toExport = leads.filter(lead => {
      const matchesSearch = !q || lead.callerName.toLowerCase().includes(q) || lead.callerPhone.includes(q);
      const matchesFilter = !statusFilter || lead.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
    const headers = ['Name', 'Phone', 'Email', 'Service', 'Status', 'Date'];
    const rows = toExport.map(l => [
      l.callerName,
      l.callerPhone,
      l.callerEmail || '',
      l.serviceNeeded || '',
      l.status,
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isStarter = user.tier === 'starter';
  const isPastDue = user.subscriptionStatus === 'past_due';

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const leadsThisWeek = leads.filter(l => now - new Date(l.createdAt).getTime() < oneWeek);
  const totalLeads = leads.length;
  const callsThisWeek = leadsThisWeek.length;
  const smsSent = usage?.smsUsed || 0;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    const matchesSearch = !q || lead.callerName.toLowerCase().includes(q) || lead.callerPhone.includes(q);
    const matchesFilter = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  type ActivityItem = { icon: string; color: string; text: string; time: string };
  const recentActivity: ActivityItem[] = leads.slice(0, 5).map(lead => {
    if (lead.formData?.aiScore) {
      return { icon: '⭐', color: '#a78bfa', text: `New lead scored ${lead.formData.aiScore}/10`, time: timeSince(lead.createdAt) };
    }
    if (lead.status === 'contacted') {
      return { icon: '💬', color: '#4ade80', text: `SMS sent to ${lead.callerName}`, time: timeSince(lead.updatedAt) };
    }
    return { icon: '📞', color: '#60a5fa', text: `Missed call from ${formatPhoneNumber(lead.callerPhone)}`, time: timeSince(lead.createdAt) };
  });

  const userInitials = (user.name || user.email || '?')
    .split(' ')
    .map((n: string) => n[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const tierBadgeStyle =
    user.tier === 'elite'
      ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
      : user.tier === 'pro'
      ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }
      : { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
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

      <header style={{ background: '#0d1526', borderBottom: '1px solid rgba(37,99,235,0.3)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left: logo + plan badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 18, height: 18, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              LeadCapture<span style={{ color: '#3b82f6' }}>Pro</span>
            </span>
            <span style={{
              ...tierBadgeStyle,
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              display: 'inline-block',
            }}>
              {user.tier}
            </span>
          </div>

          {/* Right: billing, settings, avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="hidden sm:block"
              style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}
            >
              {portalLoading ? 'Loading…' : 'Billing'}
            </button>
            <Link href="/settings" style={{ color: '#64748b', display: 'flex', padding: 6, borderRadius: 8 }}>
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0, letterSpacing: '0.02em',
            }}>
              {userInitials}
            </div>
          </div>

        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.4s ease 0.05s both' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            You&apos;re on the <span style={{ fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>{user.tier}</span> plan
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Total Leads */}
          <div className="stat-card" style={{ animationDelay: '0.0s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>↑ {leadsThisWeek.length} this week</span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1, marginBottom: 6 }}>
              {loading ? '—' : totalLeads}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Total Leads</div>
          </div>

          {/* Card 2: Calls This Week */}
          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(234,88,12,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: '#f97316' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>↑ vs last week</span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1, marginBottom: 6 }}>
              {loading ? '—' : callsThisWeek}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Calls This Week</div>
          </div>

          {/* Card 3: SMS Sent */}
          <div className="stat-card" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                {usage ? `${usage.percentage}% of limit` : '...'}
              </span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1, marginBottom: 6 }}>
              {usage ? smsSent : '—'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>SMS Sent</div>
          </div>

          {/* Card 4: Conversion Rate */}
          <div className="stat-card" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: '#a78bfa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span style={{ color: conversionRate > 0 ? '#4ade80' : '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                {conversionRate > 0 ? `↑ ${wonLeads} won` : '—'}
              </span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1, marginBottom: 6 }}>
              {loading ? '—' : `${conversionRate}%`}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Conversion Rate</div>
          </div>
        </div>

        {/* Phone Number + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8" style={{ animation: 'fadeInUp 0.4s ease 0.2s both' }}>
          {/* Phone Number Card */}
          <div className="dark-card">
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Your LeadCapture Number
              </span>
            </div>
            {assignedPhone ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span className="pulse-dot"></span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                    {formatPhoneNumber(assignedPhone)}
                  </span>
                  <button
                    onClick={handleCopyPhone}
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}
                  >
                    {copied ? (
                      <>
                        <svg style={{ width: 14, height: 14, color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{ color: '#4ade80' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setSetupOpen(o => !o)}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>Setup Instructions</span>
                  <span style={{ display: 'inline-block', transform: setupOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
                </button>
                {setupOpen && (
                  <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    Forward missed calls to this number in your phone settings
                  </div>
                )}
              </>
            ) : (
              <div>
                <div style={{ height: 40, borderRadius: 10, marginBottom: 12 }} className="shimmer-loading"></div>
                <div style={{ height: 36, borderRadius: 10, width: '60%' }} className="shimmer-loading"></div>
              </div>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div className="dark-card">
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Recent Activity
              </span>
            </div>
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#475569', fontSize: '0.875rem' }}>
                Activity will appear here when calls come in
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentActivity.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                    <span style={{ flex: 1, color: '#cbd5e1', fontSize: '0.85rem' }}>{item.icon} {item.text}</span>
                    <span style={{ color: '#475569', fontSize: '0.75rem', flexShrink: 0 }}>{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
            <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {/* Lead Inbox CRM Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', animation: 'fadeInUp 0.4s ease 0.3s both' }}>
          {/* Table toolbar */}
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' as const }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Lead Inbox
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
              <div style={{ position: 'relative' as const }}>
                <svg style={{ position: 'absolute' as const, left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#475569', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search leads..."
                  style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: '0.82rem', outline: 'none', width: 180 }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,21,38,0.9)', color: '#94a3b8', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <button
                onClick={handleExportCsv}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(37,99,235,0.4)', background: 'rgba(37,99,235,0.1)', color: '#60a5fa', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ flex: 2, height: 14, borderRadius: 6 }} className="shimmer-loading"></div>
                  <div style={{ flex: 1, height: 14, borderRadius: 6 }} className="shimmer-loading"></div>
                  <div style={{ flex: 1, height: 22, width: 70, borderRadius: 99 }} className="shimmer-loading"></div>
                  <div style={{ flex: 1, height: 14, borderRadius: 6 }} className="shimmer-loading"></div>
                  <div style={{ flex: 1, height: 28, borderRadius: 8 }} className="shimmer-loading"></div>
                </div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center' as const, padding: '64px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
                {leads.length > 0 ? 'No matching leads' : 'No leads yet'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: 24 }}>
                {leads.length > 0 ? 'Try adjusting your search or filter.' : 'Missed calls will appear here automatically'}
              </p>
              {leads.length === 0 && (
                <Link href="/setup" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  View Setup Guide
                </Link>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Caller', 'Time', 'Status', 'AI Score', 'Actions'].map(col => (
                      <th key={col} style={{ padding: '11px 24px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', whiteSpace: 'nowrap' as const }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => {
                    const rawScore = lead.formData?.aiScore;
                    const scoreNum = (() => {
                      if (!rawScore) return null;
                      const n = Number(rawScore);
                      if (!isNaN(n)) return Math.min(10, Math.max(1, Math.round(n)));
                      if (rawScore === 'hot') return 9;
                      if (rawScore === 'warm') return 6;
                      if (rawScore === 'cold') return 3;
                      return null;
                    })();
                    const scoreColor = scoreNum !== null
                      ? (scoreNum >= 8 ? '#4ade80' : scoreNum >= 5 ? '#fbbf24' : '#f87171')
                      : '#475569';
                    const statusMap: Record<string, { bg: string; color: string; label: string }> = {
                      new:       { bg: 'rgba(37,99,235,0.2)',   color: '#60a5fa', label: 'NEW' },
                      contacted: { bg: 'rgba(245,158,11,0.2)',  color: '#fbbf24', label: 'CONTACTED' },
                      won:       { bg: 'rgba(22,163,74,0.2)',   color: '#4ade80', label: 'CONVERTED' },
                      lost:      { bg: 'rgba(239,68,68,0.2)',   color: '#f87171', label: 'MISSED' },
                    };
                    const sc = statusMap[lead.status] ?? statusMap.new;

                    return (
                      <tr
                        key={lead.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Caller */}
                        <td style={{ padding: '14px 24px' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem', marginBottom: 2 }}>{lead.callerName}</div>
                          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{lead.callerPhone}</div>
                        </td>
                        {/* Time */}
                        <td style={{ padding: '14px 24px', color: '#64748b', fontSize: '0.82rem', whiteSpace: 'nowrap' as const }}>
                          {timeSince(lead.createdAt)}
                        </td>
                        {/* Status */}
                        <td style={{ padding: '14px 24px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                            {sc.label}
                          </span>
                        </td>
                        {/* AI Score */}
                        <td style={{ padding: '14px 24px' }}>
                          {isStarter ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>
                              <svg style={{ width: 12, height: 12 }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                              PRO
                            </span>
                          ) : scoreNum !== null ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', minWidth: 48 }}>
                                <div style={{ height: '100%', width: `${scoreNum * 10}%`, background: scoreColor, borderRadius: 99 }}></div>
                              </div>
                              <span style={{ color: scoreColor, fontSize: '0.78rem', fontWeight: 700, minWidth: 16 }}>{scoreNum}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#475569', fontSize: '0.78rem' }}>—</span>
                          )}
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '14px 24px' }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                            <a
                              href={`tel:${lead.callerPhone}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.1)', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}
                            >
                              <svg style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call Back
                            </a>
                            {lead.status !== 'contacted' && lead.status !== 'won' && (
                              <button
                                onClick={() => handleQuickContact(lead.id)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                              >
                                <svg style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Mark Contacted
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade Banner — starter and pro only */}
        {user.tier !== 'elite' && (
          <div style={{ marginTop: 32, borderRadius: 16, background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0f172a 100%)', border: '1px solid rgba(37,99,235,0.3)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' as const, animation: 'fadeInUp 0.4s ease 0.38s both' }}>
            {/* Left: headline + locked features */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>🚀</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: 16, letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
                Unlock Your Full Growth Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginTop: 16 }}>
                {[
                  'AI Lead Scoring (score leads 1-10 automatically)',
                  'Voicemail Transcription (read missed voicemails)',
                  'Personalized AI SMS (custom responses per caller)',
                  'Zapier Integration (connect 5000+ apps)',
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.875rem' }}>
                    <span>🔒</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: CTA */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <Link
                href="/subscribe"
                style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(37,99,235,0.3)', transition: 'box-shadow 0.2s', whiteSpace: 'nowrap' as const }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(37,99,235,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.3)')}
              >
                Upgrade to Pro — $249/mo
              </Link>
              <span style={{ color: '#64748b', fontSize: '0.78rem' }}>7-day free trial included</span>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 32, marginBottom: 8, animation: 'fadeInUp 0.4s ease 0.44s both' }}>
          {/* Copy Setup Instructions */}
          <button
            onClick={handleCopySetup}
            style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', minHeight: 90 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>📋</span>
            <span style={{ color: copiedSetup ? '#4ade80' : '#94a3b8', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' as const, transition: 'color 0.2s' }}>
              {copiedSetup ? 'Copied!' : 'Copy Setup Instructions'}
            </span>
          </button>
          {/* Download Lead Report */}
          <button
            onClick={handleExportCsv}
            style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', minHeight: 90 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>📊</span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' as const }}>Download Lead Report</span>
          </button>
          {/* Configure SMS Template */}
          <a
            href="/settings"
            style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', minHeight: 90 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>⚙️</span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' as const }}>Configure SMS Template</span>
          </a>
          {/* Test Your Number */}
          {assignedPhone ? (
            <a
              href={`tel:${assignedPhone}`}
              style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', minHeight: 90 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>📞</span>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' as const }}>Test Your Number</span>
            </a>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', minHeight: 90, opacity: 0.4 }}>
              <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>📞</span>
              <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' as const }}>Test Your Number</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 16px', textAlign: 'center' as const }}>
        <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>
          LeadCapture Pro © 2026&nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/support" style={{ color: '#475569', textDecoration: 'none' }}>Support</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/docs" style={{ color: '#475569', textDecoration: 'none' }}>Docs</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/status" style={{ color: '#475569', textDecoration: 'none' }}>Status</a>
        </p>
      </footer>

      {/* Copy number toast — bottom-right */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          background: '#0d1526',
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: 12, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.3s ease both',
          color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500,
        }}>
          <svg style={{ width: 16, height: 16, color: '#4ade80', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Number copied to clipboard
        </div>
      )}
    </div>
  );
}

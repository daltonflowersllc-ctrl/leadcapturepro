'use client';

import { useEffect, useState, useCallback } from 'react';

type Lead = {
  id: string;
  caller_name: string;
  phone_number: string;
  created_at: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  ai_score: number | null;
  source: 'Missed Call' | 'Voicemail' | 'SMS Reply';
  notes: string | null;
};

const FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

const SORT_OPTIONS = ['Newest', 'Oldest', 'Highest Score'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const PAGE_SIZE = 10;

// Maps hot/warm/cold onto a 1–10 scale matching the green/yellow/red bands
function mapAiScore(aiScore: string | null | undefined): number | null {
  if (!aiScore) return null;
  const scores: Record<string, number> = { hot: 9, warm: 6, cold: 2 };
  return scores[aiScore.toLowerCase()] ?? null;
}

const STATUS_CONFIG: Record<
  Lead['status'],
  { bg: string; color: string; label: string; pulse: boolean }
> = {
  NEW:       { bg: 'rgba(37,99,235,0.15)',  color: '#60a5fa', label: 'New',       pulse: true  },
  CONTACTED: { bg: 'rgba(234,179,8,0.15)',  color: '#fbbf24', label: 'Contacted', pulse: false },
  QUALIFIED: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', label: 'Qualified', pulse: false },
  CONVERTED: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Converted', pulse: false },
  LOST:      { bg: 'rgba(100,116,139,0.2)', color: '#94a3b8', label: 'Lost',      pulse: false },
};

const SOURCE_CONFIG: Record<Lead['source'], { bg: string; color: string }> = {
  'Missed Call': { bg: 'rgba(37,99,235,0.12)',  color: '#60a5fa' },
  'Voicemail':   { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  'SMS Reply':   { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
};

function StatusBadge({ status }: { status: Lead['status'] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.LOST;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.pulse && (
        <span
          className="animate-pulse"
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: cfg.color,
            flexShrink: 0,
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

function AiScoreBar({ score, isStarter }: { score: number | null; isStarter: boolean }) {
  if (isStarter) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: 6,
          background: 'rgba(139,92,246,0.15)',
          color: '#a78bfa',
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        PRO 🔒
      </span>
    );
  }
  if (score === null) return <span style={{ color: '#475569', fontSize: 13 }}>—</span>;

  const pct = (score / 10) * 100;
  const fillColor = score >= 8 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444';
  const trackColor =
    score >= 8 ? 'rgba(34,197,94,0.15)' : score >= 5 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 90 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          background: trackColor,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 3,
            background: fillColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span style={{ color: fillColor, fontSize: 11, fontWeight: 700, minWidth: 14, textAlign: 'right' }}>
        {score}
      </span>
    </div>
  );
}

function SourcePill({ source }: { source: Lead['source'] }) {
  const { bg, color } = SOURCE_CONFIG[source] ?? { bg: 'rgba(255,255,255,0.08)', color: '#94a3b8' };
  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 20,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {source}
    </span>
  );
}

const TH_STYLE: React.CSSProperties = {
  padding: '12px 14px',
  textAlign: 'left',
  color: '#64748b',
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const ICON_BTN: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  borderRadius: 7,
  background: 'rgba(255,255,255,0.06)',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  transition: 'background 0.15s ease',
  textDecoration: 'none',
};

export default function LeadInbox({ isStarter }: { isStarter: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sort, setSort] = useState<SortOption>('Newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard/leads')
      .then((r) => r.json())
      .then((data) => {
        const rows: Lead[] = (data.leads ?? []).map((row: Record<string, any>) => ({
          id: row.id,
          caller_name: row.caller_name ?? 'Unknown',
          phone_number: row.caller_phone ?? '',
          created_at: row.created_at,
          status: ((row.status ?? 'new').toUpperCase()) as Lead['status'],
          ai_score: mapAiScore(row.form_data?.aiScore),
          source: (row.form_data?.source ?? 'Missed Call') as Lead['source'],
          notes: row.notes ?? null,
        }));
        setLeads(rows);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      l.caller_name.toLowerCase().includes(q) ||
      l.phone_number.includes(search);
    const matchesFilter =
      activeFilter === 'All' || l.status === activeFilter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Oldest')
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sort === 'Highest Score')
      return (b.ai_score ?? -1) - (a.ai_score ?? -1);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const sliceStart = (curPage - 1) * PAGE_SIZE;
  const paginated = sorted.slice(sliceStart, sliceStart + PAGE_SIZE);

  // Checkboxes
  const allOnPageSelected =
    paginated.length > 0 && paginated.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginated.forEach((l) => next.delete(l.id));
      } else {
        paginated.forEach((l) => next.add(l.id));
      }
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Bulk mark contacted
  const handleMarkAllContacted = async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/leads/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'contacted' }),
          })
        )
      );
      setLeads((prev) =>
        prev.map((l) => (selectedIds.has(l.id) ? { ...l, status: 'CONTACTED' as const } : l))
      );
      setSelectedIds(new Set());
      showToast(`${ids.length} lead${ids.length !== 1 ? 's' : ''} marked as contacted`);
    } catch {
      showToast('Failed to update leads', 'error');
    }
  };

  // Individual: mark contacted
  const handleMarkContacted = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' }),
      });
      if (!res.ok) throw new Error();
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: 'CONTACTED' as const } : l))
      );
      showToast('Marked as contacted');
    } catch {
      showToast('Failed to update lead', 'error');
    }
  };

  // Individual: delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      showToast('Lead deleted');
    } catch {
      showToast('Failed to delete lead', 'error');
    }
  };

  const handleExportCSV = () => {
    const header = 'Name,Phone,Date,Status,Score,Source';
    const rows = sorted.map((l) => {
      const date = new Date(l.created_at).toLocaleDateString();
      const score = l.ai_score !== null ? String(l.ai_score) : '';
      return `"${l.caller_name}","${l.phone_number}","${date}","${l.status}","${score}","${l.source}"`;
    });
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100%',
        background: '#0a0f1e',
        fontFamily: '"DM Sans", sans-serif',
        padding: '32px 24px',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes leadspin { to { transform: rotate(360deg); } }
        .inbox-row:hover td { background: rgba(255,255,255,0.04); }
        .inbox-row td { transition: background 0.12s ease; }
        .inbox-act:hover { background: rgba(255,255,255,0.12) !important; }
        .inbox-act-green:hover { background: rgba(34,197,94,0.2) !important; }
        .inbox-act-red:hover { background: rgba(239,68,68,0.2) !important; color: #f87171 !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            background:
              toast.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: toast.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toast.type === 'success' ? '✓ ' : '✗ '}
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ color: '#f8fafc', fontSize: 26, fontWeight: 700, margin: '0 0 24px' }}>
          Lead Inbox
        </h2>

        {/* Controls bar */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '8px 14px',
              color: '#f8fafc',
              fontSize: 14,
              outline: 'none',
              minWidth: 200,
            }}
          />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  background: activeFilter === f ? '#2563eb' : 'rgba(255,255,255,0.08)',
                  color: activeFilter === f ? '#fff' : '#94a3b8',
                  transition: 'background 0.15s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s} style={{ background: '#0d1526' }}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            disabled={sorted.length === 0}
            style={{
              marginLeft: 'auto',
              padding: '7px 16px',
              borderRadius: 8,
              border: '1px solid rgba(37,99,235,0.4)',
              cursor: sorted.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: 'rgba(37,99,235,0.15)',
              color: sorted.length === 0 ? '#475569' : '#60a5fa',
              opacity: sorted.length === 0 ? 0.5 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            Export CSV
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: '3px solid rgba(255,255,255,0.08)',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'leadspin 0.75s linear infinite',
              }}
            />
          </div>
        ) : sorted.length === 0 ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 16,
              padding: '60px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 40, margin: '0 0 14px' }}>📥</p>
            <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500, margin: 0 }}>
              {leads.length === 0
                ? "No leads yet — they'll appear here when customers call."
                : 'No leads match your current filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* Pagination + bulk action bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#64748b', fontSize: 13 }}>
                  {sliceStart + 1}–{Math.min(sliceStart + PAGE_SIZE, sorted.length)} of{' '}
                  {sorted.length} leads
                </span>
                {someSelected && (
                  <button
                    onClick={handleMarkAllContacted}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      background: 'rgba(234,179,8,0.15)',
                      color: '#fbbf24',
                    }}
                  >
                    ✓ Mark {selectedIds.size} Contacted
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={curPage === 1}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background:
                      curPage === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
                    color: curPage === 1 ? '#374151' : '#94a3b8',
                    cursor: curPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={curPage === totalPages}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background:
                      curPage === totalPages
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(255,255,255,0.1)',
                    color: curPage === totalPages ? '#374151' : '#94a3b8',
                    cursor: curPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Table */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {/* Select-all checkbox */}
                      <th style={{ width: 44, padding: '12px 8px 12px 16px' }}>
                        <input
                          type="checkbox"
                          checked={allOnPageSelected}
                          onChange={toggleSelectAll}
                          style={{ cursor: 'pointer', accentColor: '#2563eb', width: 15, height: 15 }}
                        />
                      </th>
                      {['Caller Name', 'Phone Number', 'Date / Time', 'Status', 'AI Score', 'Source', 'Actions'].map(
                        (h) => (
                          <th key={h} style={TH_STYLE}>
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((lead, idx) => (
                      <tr
                        key={lead.id}
                        className="inbox-row"
                        onClick={() => {
                          /* detail drawer — wired in next step */
                        }}
                        style={{
                          cursor: 'pointer',
                          borderBottom:
                            idx < paginated.length - 1
                              ? '1px solid rgba(255,255,255,0.05)'
                              : 'none',
                        }}
                      >
                        {/* Checkbox */}
                        <td
                          style={{ padding: '12px 8px 12px 16px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                            style={{ cursor: 'pointer', accentColor: '#2563eb', width: 15, height: 15 }}
                          />
                        </td>

                        {/* Caller Name */}
                        <td style={{ padding: '12px 14px', maxWidth: 180 }}>
                          <span
                            style={{
                              color: '#f1f5f9',
                              fontWeight: 600,
                              fontSize: 14,
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {lead.caller_name}
                          </span>
                        </td>

                        {/* Phone Number */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#60a5fa', fontWeight: 500 }}>
                            {lead.phone_number}
                          </span>
                        </td>

                        {/* Date / Time */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#94a3b8', display: 'block' }}>
                            {new Date(lead.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span style={{ color: '#475569', fontSize: 11 }}>
                            {new Date(lead.created_at).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Status */}
                        <td
                          style={{ padding: '12px 14px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatusBadge status={lead.status} />
                        </td>

                        {/* AI Score */}
                        <td
                          style={{ padding: '12px 14px', minWidth: 120 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AiScoreBar score={lead.ai_score} isStarter={isStarter} />
                        </td>

                        {/* Source */}
                        <td style={{ padding: '12px 14px' }}>
                          <SourcePill source={lead.source} />
                        </td>

                        {/* Actions */}
                        <td
                          style={{ padding: '12px 14px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {/* Call */}
                            <a
                              href={`tel:${lead.phone_number}`}
                              title="Call"
                              className="inbox-act"
                              style={ICON_BTN}
                            >
                              📞
                            </a>

                            {/* SMS */}
                            <a
                              href={`sms:${lead.phone_number}`}
                              title="Send SMS"
                              className="inbox-act"
                              style={ICON_BTN}
                            >
                              💬
                            </a>

                            {/* Mark Contacted */}
                            <button
                              title="Mark Contacted"
                              className="inbox-act-green"
                              onClick={() => handleMarkContacted(lead.id)}
                              disabled={lead.status === 'CONTACTED'}
                              style={{
                                ...ICON_BTN,
                                opacity: lead.status === 'CONTACTED' ? 0.35 : 1,
                                cursor:
                                  lead.status === 'CONTACTED' ? 'default' : 'pointer',
                                color: '#4ade80',
                              }}
                            >
                              ✓
                            </button>

                            {/* Delete */}
                            <button
                              title="Delete lead"
                              className="inbox-act-red"
                              onClick={() => handleDelete(lead.id)}
                              style={{
                                ...ICON_BTN,
                                cursor: 'pointer',
                                color: '#94a3b8',
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

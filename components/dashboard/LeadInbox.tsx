'use client';

import { useEffect, useState } from 'react';

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

function mapAiScore(aiScore: string | null | undefined): number | null {
  if (!aiScore) return null;
  const scores: Record<string, number> = { hot: 3, warm: 2, cold: 1 };
  return scores[aiScore.toLowerCase()] ?? null;
}

function statusStyle(status: string): { background: string; color: string } {
  const map: Record<string, [string, string]> = {
    NEW: ['rgba(37,99,235,0.15)', '#60a5fa'],
    CONTACTED: ['rgba(234,179,8,0.15)', '#fbbf24'],
    QUALIFIED: ['rgba(16,185,129,0.15)', '#34d399'],
    CONVERTED: ['rgba(139,92,246,0.15)', '#a78bfa'],
    LOST: ['rgba(239,68,68,0.15)', '#f87171'],
  };
  const [background, color] = map[status] ?? ['rgba(255,255,255,0.08)', '#94a3b8'];
  return { background, color };
}

export default function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sort, setSort] = useState<SortOption>('Newest');
  const [page, setPage] = useState(1);

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
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2
          style={{
            color: '#f8fafc',
            fontSize: 26,
            fontWeight: 700,
            margin: '0 0 24px',
          }}
        >
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
          {/* Search */}
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

          {/* Filter buttons */}
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

          {/* Sort */}
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

          {/* Export CSV */}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 80,
            }}
          >
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
            <style>{`@keyframes leadspin { to { transform: rotate(360deg); } }`}</style>
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
            {/* Pagination bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span style={{ color: '#64748b', fontSize: 13 }}>
                {sliceStart + 1}–{Math.min(sliceStart + PAGE_SIZE, sorted.length)} of {sorted.length} leads
              </span>
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

            {/* Lead rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {paginated.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 16,
                    padding: '14px 20px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                    <p
                      style={{
                        color: '#f8fafc',
                        fontWeight: 600,
                        fontSize: 14,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {lead.caller_name}
                    </p>
                    <p style={{ color: '#60a5fa', fontSize: 13, margin: '2px 0 0' }}>
                      {lead.phone_number}
                    </p>
                  </div>

                  <span style={{ color: '#64748b', fontSize: 13, flexShrink: 0 }}>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>

                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                      ...statusStyle(lead.status),
                    }}
                  >
                    {lead.status}
                  </span>

                  <span style={{ color: '#64748b', fontSize: 12, flexShrink: 0 }}>
                    {lead.source}
                  </span>

                  {lead.ai_score !== null && (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                        ...(lead.ai_score === 3
                          ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
                          : lead.ai_score === 2
                          ? { background: 'rgba(234,179,8,0.15)', color: '#fbbf24' }
                          : { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }),
                      }}
                    >
                      {lead.ai_score === 3 ? 'Hot' : lead.ai_score === 2 ? 'Warm' : 'Cold'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

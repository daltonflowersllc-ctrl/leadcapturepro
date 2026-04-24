'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UsageData {
  sms: { used: number; limit: number; percentage: number };
  leads: { thisMonth: number };
  calls: { thisMonth: number };
  tier: string;
  subscriptionStatus: string;
}

function MeterBar({ percentage, color }: { percentage: number; color: string }) {
  const capped = Math.min(percentage, 100);
  return (
    <div style={{ background: '#334155', borderRadius: 4, height: 8, overflow: 'hidden' }}>
      <div
        style={{
          background: color,
          height: 8,
          borderRadius: 4,
          width: `${capped}%`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
}

function barColor(pct: number): string {
  if (pct >= 100) return '#ef4444';
  if (pct >= 80) return '#f59e0b';
  return '#22c55e';
}

export default function UsageMeter() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/usage/current')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '20px 24px',
          minWidth: 280,
        }}
      >
        <div style={{ color: '#64748b', fontSize: 13 }}>Loading usage…</div>
      </div>
    );
  }

  if (!data) return null;

  const { sms, leads, calls, tier } = data;
  const smsPct = sms.percentage;
  const isStarter = tier === 'starter';
  const isPro = tier === 'pro';
  const isElite = tier === 'elite';
  const isOverLimit = smsPct >= 100;
  const isNearLimit = smsPct >= 80 && smsPct < 100;

  const nextTierLabel = isStarter ? 'Pro' : isPro ? 'Elite' : null;
  const nextTierCapacity = isStarter
    ? '500 SMS/mo (5× more)'
    : isPro
    ? 'Unlimited SMS'
    : null;

  return (
    <div
      style={{
        background: '#1e293b',
        border: `1px solid ${isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#334155'}`,
        borderRadius: 12,
        padding: '20px 24px',
        minWidth: 280,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>Monthly Usage</span>
        <span
          style={{
            background: isElite ? '#7c3aed22' : isStarter ? '#33415522' : '#1d4ed822',
            color: isElite ? '#a78bfa' : isStarter ? '#94a3b8' : '#60a5fa',
            border: `1px solid ${isElite ? '#7c3aed44' : isStarter ? '#475569' : '#1d4ed844'}`,
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          {tier}
        </span>
      </div>

      {/* SMS meter */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>SMS Messages</span>
          <span style={{ color: barColor(smsPct), fontSize: 13, fontWeight: 700 }}>
            {sms.used} / {isElite ? '∞' : sms.limit}
          </span>
        </div>
        <MeterBar percentage={smsPct} color={barColor(smsPct)} />
        {isOverLimit && (
          <p style={{ color: '#fca5a5', fontSize: 12, margin: '6px 0 0', fontWeight: 600 }}>
            ⚠️ Over limit — new missed calls won't get SMS follow-ups
          </p>
        )}
        {isNearLimit && (
          <p style={{ color: '#fcd34d', fontSize: 12, margin: '6px 0 0', fontWeight: 600 }}>
            Running low — {sms.limit - sms.used} SMS remaining this month
          </p>
        )}
      </div>

      {/* Leads & Calls stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div
          style={{
            background: '#0f172a',
            borderRadius: 8,
            padding: '10px 14px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
            {leads.thisMonth}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 3, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Leads This Month
          </div>
        </div>
        <div
          style={{
            background: '#0f172a',
            borderRadius: 8,
            padding: '10px 14px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
            {calls.thisMonth}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 3, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Calls This Month
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {nextTierLabel && nextTierCapacity && (isOverLimit || isNearLimit || isStarter) && (
        <div
          style={{
            background: '#1e2d40',
            border: '1px solid #2563eb',
            borderRadius: 8,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 600 }}>
              Upgrade to {nextTierLabel}
            </div>
            <div style={{ color: '#60a5fa', fontSize: 11, marginTop: 2 }}>
              {nextTierCapacity}
            </div>
          </div>
          <Link
            href="/subscribe"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap' as const,
              flexShrink: 0,
            }}
          >
            Upgrade →
          </Link>
        </div>
      )}
    </div>
  );
}

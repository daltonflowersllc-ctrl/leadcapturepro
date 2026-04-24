export { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leadcapturepro.app';

// ─── Usage Alert Templates ────────────────────────────────────────────────────

export function usage80Email({
  ownerName,
  businessName,
  used,
  limit,
  tier,
}: {
  ownerName: string;
  businessName: string;
  used: number;
  limit: number;
  tier: string;
}): string {
  const remaining = limit - used;
  const nextTier = tier === 'starter' ? 'Pro' : tier === 'pro' ? 'Elite' : null;
  const upgradeLink = `${APP_URL}/subscribe`;
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #f59e0b; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">📊</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">You're at 80% of your SMS limit</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, ${businessName} is running low on SMS messages this month.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: #94a3b8; font-size: 14px;">SMS Used</span>
          <span style="color: #f59e0b; font-weight: 700;">${used} / ${limit}</span>
        </div>
        <div style="background: #334155; border-radius: 4px; height: 8px; overflow: hidden;">
          <div style="background: #f59e0b; height: 8px; border-radius: 4px; width: 80%;"></div>
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 10px 0 0;">You have <strong style="color: #e2e8f0;">${remaining} SMS remaining</strong> for the rest of the month.</p>
      </div>

      ${nextTier ? `
      <div style="background: #1e2d40; border: 1px solid #2563eb; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 16px;">Don't run out — upgrade to ${nextTier}</h2>
        <p style="color: #94a3b8; margin: 0 0 16px; font-size: 14px;">
          ${tier === 'starter' ? 'Pro gives you 500 SMS/month — 5× more than Starter.' : 'Elite gives you unlimited SMS — never hit a limit again.'}
        </p>
        <a href="${upgradeLink}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Upgrade to ${nextTier} →</a>
      </div>
      ` : ''}

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function usage100Email({
  ownerName,
  businessName,
  used,
  limit,
  tier,
}: {
  ownerName: string;
  businessName: string;
  used: number;
  limit: number;
  tier: string;
}): string {
  const nextTier = tier === 'starter' ? 'Pro' : tier === 'pro' ? 'Elite' : null;
  const upgradeLink = `${APP_URL}/subscribe`;
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #ef4444; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">⚠️</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">You've hit your SMS limit</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, ${businessName} has used all ${limit} SMS messages for this month.</p>
      </div>

      <div style="background: #2d1515; border: 1px solid #ef4444; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: #94a3b8; font-size: 14px;">SMS Used</span>
          <span style="color: #ef4444; font-weight: 700;">${used} / ${limit}</span>
        </div>
        <div style="background: #334155; border-radius: 4px; height: 8px; overflow: hidden;">
          <div style="background: #ef4444; height: 8px; border-radius: 4px; width: 100%;"></div>
        </div>
        <p style="color: #fca5a5; font-size: 13px; margin: 10px 0 0; font-weight: 600;">⚠️ New missed calls will NOT receive SMS follow-ups until your limit resets or you upgrade.</p>
      </div>

      ${nextTier ? `
      <div style="background: #1e2d40; border: 1px solid #2563eb; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 16px;">Upgrade now to keep capturing leads</h2>
        <p style="color: #94a3b8; margin: 0 0 16px; font-size: 14px;">
          ${tier === 'starter' ? 'Pro gives you 500 SMS/month — 5× more than Starter. Never miss another lead.' : 'Elite gives you unlimited SMS — capture every missed call, every time.'}
        </p>
        <a href="${upgradeLink}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Upgrade to ${nextTier} →</a>
      </div>
      ` : ''}

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function usage200Email({
  ownerName,
  businessName,
  used,
  limit,
  tier,
}: {
  ownerName: string;
  businessName: string;
  used: number;
  limit: number;
  tier: string;
}): string {
  const overage = used - limit;
  const nextTier = tier === 'starter' ? 'Pro' : tier === 'pro' ? 'Elite' : null;
  const upgradeLink = `${APP_URL}/subscribe`;
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #dc2626; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">🚨</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Critical: SMS limit exceeded by 200%</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, ${businessName} has exceeded its SMS limit by <strong style="color: #ef4444;">${overage} messages</strong>.</p>
      </div>

      <div style="background: #2d1515; border: 1px solid #dc2626; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: #94a3b8; font-size: 14px;">SMS Used</span>
          <span style="color: #dc2626; font-weight: 700;">${used} / ${limit} (${Math.round((used / limit) * 100)}%)</span>
        </div>
        <div style="background: #334155; border-radius: 4px; height: 8px; overflow: hidden;">
          <div style="background: #dc2626; height: 8px; border-radius: 4px; width: 100%;"></div>
        </div>
        <p style="color: #fca5a5; font-size: 13px; margin: 10px 0 0; font-weight: 600;">🚨 Your account may be subject to overage fees or service interruption. Action required.</p>
      </div>

      ${nextTier ? `
      <div style="background: #1e2d40; border: 1px solid #2563eb; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 16px;">Upgrade immediately to restore service</h2>
        <p style="color: #94a3b8; margin: 0 0 16px; font-size: 14px;">
          ${tier === 'starter' ? 'Switch to Pro for 500 SMS/month — you\'ll have 5× more capacity and won\'t hit this limit.' : 'Switch to Elite for unlimited SMS — no caps, no overages, ever.'}
        </p>
        <a href="${upgradeLink}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700;">Upgrade Now — Fix This →</a>
      </div>
      ` : ''}

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

// ─── Weekly Report Template ───────────────────────────────────────────────────

export function weeklyReportEmail({
  ownerName,
  businessName,
  weekStart,
  weekEnd,
  totalLeads,
  newLeads,
  contactedLeads,
  wonLeads,
  lostLeads,
  hotLeads,
  warmLeads,
  coldLeads,
}: {
  ownerName: string;
  businessName: string;
  weekStart: string;
  weekEnd: string;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  wonLeads: number;
  lostLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
}): string {
  const winRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #3b82f6; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">📈</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Your Weekly Lead Report</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, here's how ${businessName} performed this week.</p>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">${weekStart} — ${weekEnd}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #3b82f6;">${totalLeads}</div>
          <div style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Total Leads</div>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #22c55e;">${wonLeads}</div>
          <div style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Won</div>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #a855f7;">${winRate}%</div>
          <div style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Win Rate</div>
        </div>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 16px;">Lead Status Breakdown</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">New</td>
            <td style="color: #3b82f6; font-weight: 600; text-align: right;">${newLeads}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">Contacted</td>
            <td style="color: #f59e0b; font-weight: 600; text-align: right;">${contactedLeads}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">Won</td>
            <td style="color: #22c55e; font-weight: 600; text-align: right;">${wonLeads}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">Lost</td>
            <td style="color: #ef4444; font-weight: 600; text-align: right;">${lostLeads}</td>
          </tr>
        </table>
      </div>

      ${(hotLeads > 0 || warmLeads > 0 || coldLeads > 0) ? `
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 16px;">AI Lead Quality</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">🔥 Hot</td>
            <td style="color: #ef4444; font-weight: 600; text-align: right;">${hotLeads}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">☀️ Warm</td>
            <td style="color: #f59e0b; font-weight: 600; text-align: right;">${warmLeads}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0; font-size: 14px;">❄️ Cold</td>
            <td style="color: #3b82f6; font-weight: 600; text-align: right;">${coldLeads}</td>
          </tr>
        </table>
      </div>
      ` : ''}

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Dashboard →</a>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

// ─── Payment & Account Templates ─────────────────────────────────────────────

export function paymentFailedEmail({ ownerName }: { ownerName: string }): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #ef4444; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">⚠️</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Payment Failed</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, your recent payment didn't go through.</p>
      </div>

      <div style="background: #2d1515; border: 1px solid #ef4444; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #fca5a5; margin: 0; font-weight: 600;">Your payment method failed. You have 7 days to update your card before your account is suspended and lead capture stops.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 16px;">What to do now</h2>
        <ol style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>Click the button below to open the billing portal</li>
          <li>Update your payment method</li>
          <li>Your subscription will automatically resume</li>
        </ol>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #ef4444; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">Update Payment Method →</a>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function reactivationEmail({
  ownerName,
  businessName,
}: {
  ownerName: string;
  businessName: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #6366f1; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">💡</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Reactivate Your Account</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, ${businessName}'s lead capture is currently paused.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 12px; font-size: 16px;">What you're missing</h2>
        <ul style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>Automatic SMS follow-ups for missed calls</li>
          <li>AI-powered lead scoring and call scripts</li>
          <li>Real-time lead notifications via SMS + email</li>
          <li>Your full lead history is still saved and waiting</li>
        </ul>
      </div>

      <div style="background: #1e2d40; border: 1px solid #2563eb; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #94a3b8; margin: 0 0 16px;">Reactivate in seconds — pick a plan and you're back capturing leads immediately.</p>
        <a href="${APP_URL}/subscribe" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">Reactivate LeadCapture Pro →</a>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px;">
        <p>Questions? Contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function trialEndingEmail({
  ownerName,
  businessName,
  daysLeft,
  planName,
  price,
}: {
  ownerName: string;
  businessName: string;
  daysLeft: number;
  planName: string;
  price: number;
}): string {
  const planLabel = planName.charAt(0).toUpperCase() + planName.slice(1);
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #f59e0b; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">⏰</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, your ${businessName} trial is almost up.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 12px; font-size: 18px;">What happens next</h2>
        <p style="color: #94a3b8; margin: 0 0 8px;">Your <strong style="color: #e2e8f0;">${planLabel}</strong> plan will automatically continue at <strong style="color: #e2e8f0;">$${price}/month</strong> on day 8 using the card you provided during signup.</p>
        <p style="color: #94a3b8; margin: 0;">You can cancel anytime from your dashboard — no questions asked.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 12px; font-size: 18px;">Don't lose your leads</h2>
        <p style="color: #94a3b8; margin: 0 0 16px;">Every missed call you capture during the trial is already in your dashboard. Keep capturing after the trial to stay on top of your pipeline.</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View My Dashboard →</a>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Reply to this email or contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function welcomeEmail({
  ownerName,
  businessName,
  twilioNumber,
  planName,
  trialEnd,
}: {
  ownerName: string;
  businessName: string;
  twilioNumber: string;
  planName: string;
  trialEnd?: string | null;
}): string {
  const trialEndDate = trialEnd
    ? new Date(trialEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #3b82f6; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">📞</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Welcome to LeadCapture Pro!</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${ownerName}, ${businessName} is now live on LeadCapture Pro.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 18px;">Your LeadCapture Number</h2>
        <div style="font-size: 28px; font-weight: bold; color: #3b82f6; letter-spacing: 2px;">${twilioNumber}</div>
        <p style="color: #64748b; font-size: 14px; margin: 8px 0 0;">Forward your missed calls to this number to start capturing leads.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 18px;">Quick Setup (5 minutes)</h2>
        <ol style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>Go to your phone carrier settings</li>
          <li>Set up <strong style="color: #e2e8f0;">conditional call forwarding</strong> (when unanswered)</li>
          <li>Forward to: <strong style="color: #3b82f6;">${twilioNumber}</strong></li>
          <li>Test by missing a call — you should get a lead notification!</li>
        </ol>
        <a href="${APP_URL}/setup" style="display: inline-block; margin-top: 16px; background: #3b82f6; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Setup Guide →</a>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 18px;">Your Plan</h2>
        <p style="color: #94a3b8; margin: 0; text-transform: capitalize;"><strong style="color: #e2e8f0;">${planName}</strong> — you're all set and capturing leads.</p>
        ${trialEndDate ? `<p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">Free trial ends <strong style="color: #94a3b8;">${trialEndDate}</strong>. Your card will be charged automatically on day 8.</p>` : ''}
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Reply to this email or contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;
}

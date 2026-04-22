export { sendEmail } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://leadcapturepro.app';

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

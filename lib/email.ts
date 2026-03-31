const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM = 'LeadCapture Pro <support@leadcapturepro.app>';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping email');
    return;
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Resend API error:', response.status, text);
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  businessName: string,
  plan: string,
  twilioNumber: string
): Promise<void> {
  const subject = 'Welcome to LeadCapture Pro — Your Setup Instructions';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #3b82f6; width: 48px; height: 48px; border-radius: 10px; line-height: 48px; font-size: 24px;">📞</div>
        <h1 style="color: #ffffff; margin: 16px 0 4px;">Welcome to LeadCapture Pro!</h1>
        <p style="color: #94a3b8; margin: 0;">Hi ${name}, your 7-day free trial has started.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 18px;">Your LeadCapture Number</h2>
        <div style="font-size: 28px; font-weight: bold; color: #3b82f6; letter-spacing: 2px;">${twilioNumber || 'Being assigned — check your dashboard'}</div>
        <p style="color: #64748b; font-size: 14px; margin: 8px 0 0;">Forward your missed calls to this number to start capturing leads.</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 18px;">Quick Setup (5 minutes)</h2>
        <ol style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>Go to your phone carrier settings</li>
          <li>Set up <strong style="color: #e2e8f0;">conditional call forwarding</strong> (when unanswered)</li>
          <li>Forward to: <strong style="color: #3b82f6;">${twilioNumber || 'your LeadCapture number'}</strong></li>
          <li>Test by missing a call — you should get a lead notification!</li>
        </ol>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leadcapturepro.app'}/setup" style="display: inline-block; margin-top: 16px; background: #3b82f6; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Setup Guide →</a>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0 0 8px; font-size: 18px;">Your Plan</h2>
        <p style="color: #94a3b8; margin: 0; text-transform: capitalize;"><strong style="color: #e2e8f0;">${plan}</strong> — 7-day free trial. Your card will be charged on day 8 unless you cancel.</p>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>Questions? Reply to this email or contact <a href="mailto:support@leadcapturepro.app" style="color: #3b82f6;">support@leadcapturepro.app</a></p>
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, html);
}

export async function sendNewLeadEmail(
  to: string,
  businessName: string,
  leadData: {
    callerName: string;
    callerPhone: string;
    serviceNeeded?: string | null;
    urgency?: string | null;
    notes?: string | null;
    aiScore?: string;
    leadId: string;
  }
): Promise<void> {
  const subject = `🔔 New Lead: ${leadData.callerName} — ${leadData.serviceNeeded || 'Service Request'}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://leadcapturepro.app';
  const urgencyColor = leadData.urgency === 'high' ? '#ef4444' : leadData.urgency === 'medium' ? '#f59e0b' : '#22c55e';
  const scoreEmoji = leadData.aiScore === 'hot' ? '🔥' : leadData.aiScore === 'warm' ? '☀️' : '❄️';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #ffffff; margin: 0 0 8px;">${scoreEmoji} New Lead for ${businessName}</h1>
        <p style="color: #94a3b8; margin: 0;">Someone needs your services — call them back now!</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Name</td><td style="color: #ffffff; font-weight: 600;">${leadData.callerName}</td></tr>
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Phone</td><td style="color: #3b82f6; font-weight: 600;">${leadData.callerPhone}</td></tr>
          ${leadData.serviceNeeded ? `<tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Service</td><td style="color: #e2e8f0;">${leadData.serviceNeeded}</td></tr>` : ''}
          ${leadData.urgency ? `<tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Urgency</td><td style="color: ${urgencyColor}; font-weight: 600; text-transform: capitalize;">${leadData.urgency}</td></tr>` : ''}
          ${leadData.notes ? `<tr><td style="color: #64748b; padding: 6px 0; font-size: 14px; vertical-align: top;">Notes</td><td style="color: #94a3b8;">${leadData.notes}</td></tr>` : ''}
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${appUrl}/dashboard" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">View Lead in Dashboard →</a>
      </div>

      <div style="text-align: center; color: #475569; font-size: 13px; margin-top: 32px;">
        <p>© 2025 LeadCapture Pro. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, html);
}

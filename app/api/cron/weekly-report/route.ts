export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';
import { weeklyReportEmail } from '@/lib/emails/templates';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekStartIso = weekStart.toISOString();
  const weekEndIso = weekEnd.toISOString();

  const weekStartLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const weekEndLabel = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('id, email, name, business_name, tier, subscription_status')
    .in('subscription_status', ['trial', 'active']);

  if (usersError || !users || users.length === 0) {
    return NextResponse.json({ processed: 0, reportsSent: 0 });
  }

  let reportsSent = 0;

  for (const user of users) {
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('id, status, form_data')
      .eq('user_id', user.id)
      .gte('created_at', weekStartIso)
      .lte('created_at', weekEndIso);

    if (!leads || leads.length === 0) continue;

    let newLeads = 0;
    let contactedLeads = 0;
    let wonLeads = 0;
    let lostLeads = 0;
    let hotLeads = 0;
    let warmLeads = 0;
    let coldLeads = 0;

    for (const lead of leads) {
      const status = lead.status || 'new';
      if (status === 'new') newLeads++;
      else if (status === 'contacted') contactedLeads++;
      else if (status === 'won' || status === 'converted') wonLeads++;
      else if (status === 'lost') lostLeads++;

      const aiScore = (lead.form_data as Record<string, string> | null)?.aiScore;
      if (aiScore === 'hot') hotLeads++;
      else if (aiScore === 'warm') warmLeads++;
      else if (aiScore === 'cold') coldLeads++;
    }

    const ownerName = user.name || 'there';
    const businessName = user.business_name || user.name || 'your business';

    await sendEmail(
      user.email,
      `📈 Your Weekly Lead Report — ${weekStartLabel}`,
      weeklyReportEmail({
        ownerName,
        businessName,
        weekStart: weekStartLabel,
        weekEnd: weekEndLabel,
        totalLeads: leads.length,
        newLeads,
        contactedLeads,
        wonLeads,
        lostLeads,
        hotLeads,
        warmLeads,
        coldLeads,
      }),
    );

    reportsSent++;
  }

  return NextResponse.json({ processed: users.length, reportsSent });
}

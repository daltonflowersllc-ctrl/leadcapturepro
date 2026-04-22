import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import DashboardClient from './DashboardClient';

export const runtime = 'nodejs';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('id, email, name, tier, subscription_status')
    .eq('id', payload.userId)
    .limit(1)
    .single();

  if (!userRow) {
    redirect('/login');
  }

  if (userRow.subscription_status === 'pending') {
    redirect('/signup?step=payment');
  }

  if (userRow.subscription_status === 'canceled') {
    redirect('/reactivate');
  }

  const user = {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    tier: userRow.tier,
    subscriptionStatus: userRow.subscription_status,
  };

  const { data: phoneRows } = await supabaseAdmin
    .from('phone_numbers')
    .select('twilio_phone_number')
    .eq('user_id', payload.userId)
    .limit(1);

  const assignedPhone = phoneRows?.[0]?.twilio_phone_number ?? null;

  return <DashboardClient user={user} assignedPhone={assignedPhone} />;
}

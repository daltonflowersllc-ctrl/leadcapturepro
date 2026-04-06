import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, phoneNumbers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
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

  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      tier: users.tier,
      subscriptionStatus: users.subscriptionStatus,
    })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  const user = result[0];
  if (!user) {
    redirect('/login');
  }

  const phoneResult = await db
    .select({ twilioPhoneNumber: phoneNumbers.twilioPhoneNumber })
    .from(phoneNumbers)
    .where(eq(phoneNumbers.userId, payload.userId))
    .limit(1);

  const assignedPhone = phoneResult[0]?.twilioPhoneNumber ?? null;

  return <DashboardClient user={user} assignedPhone={assignedPhone} />;
}

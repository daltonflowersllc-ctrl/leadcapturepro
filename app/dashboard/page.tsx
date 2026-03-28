import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import DashboardClient from './DashboardClient';

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

  const db = getDb();
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

  return <DashboardClient user={user} />;
}

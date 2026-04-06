import { db } from './db';
import { users } from './db/schema';
import { eq, sql } from 'drizzle-orm';

export const TIER_LIMITS = {
  starter: { smsPerMonth: 100, phoneNumbers: 1, teamMembers: 1, aiFeatures: false, zapier: false },
  pro: { smsPerMonth: 500, phoneNumbers: 3, teamMembers: 2, aiFeatures: true, zapier: true },
  elite: { smsPerMonth: 99999, phoneNumbers: 5, teamMembers: 99, aiFeatures: true, zapier: true },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export async function checkSmsLimit(userId: string, tier: Tier) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  let smsUsed = user.smsUsedThisMonth || 0;
  const now = new Date();
  const resetDate = user.smsResetDate ? new Date(user.smsResetDate) : null;

  // Check if smsResetDate is in a past month
  if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
    smsUsed = 0;
    await db
      .update(users)
      .set({ 
        smsUsedThisMonth: 0, 
        smsResetDate: now,
        updatedAt: now
      })
      .where(eq(users.id, userId));
  }

  const limit = TIER_LIMITS[tier]?.smsPerMonth || TIER_LIMITS.starter.smsPerMonth;
  const percentage = (smsUsed / limit) * 100;

  return {
    allowed: smsUsed < limit,
    used: smsUsed,
    limit,
    percentage,
  };
}

export async function incrementSmsCount(userId: string) {
  await db
    .update(users)
    .set({ 
      smsUsedThisMonth: sql`${users.smsUsedThisMonth} + 1`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

export function checkAiAccess(tier: Tier) {
  return TIER_LIMITS[tier]?.aiFeatures || false;
}

export function checkZapierAccess(tier: Tier) {
  return TIER_LIMITS[tier]?.zapier || false;
}

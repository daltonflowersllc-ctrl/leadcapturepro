import { supabaseAdmin } from './supabase-admin';

export const TIER_LIMITS = {
  essential: { smsPerMonth: 100, phoneNumbers: 1, teamMembers: 1, aiFeatures: false, zapier: false },
  premium: { smsPerMonth: 500, phoneNumbers: 3, teamMembers: 2, aiFeatures: true, zapier: true },
  elite: { smsPerMonth: 99999, phoneNumbers: 5, teamMembers: 99, aiFeatures: true, zapier: true },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export async function checkSmsLimit(userId: string, tier: Tier) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('sms_used_this_month, sms_reset_date')
    .eq('id', userId)
    .limit(1)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  let smsUsed = user.sms_used_this_month || 0;
  const now = new Date();
  const resetDate = user.sms_reset_date ? new Date(user.sms_reset_date) : null;

  // Check if smsResetDate is in a past month
  if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
    smsUsed = 0;
    await supabaseAdmin
      .from('users')
      .update({ sms_used_this_month: 0, sms_reset_date: now.toISOString(), updated_at: now.toISOString() })
      .eq('id', userId);
  }

  const limit = TIER_LIMITS[tier]?.smsPerMonth || TIER_LIMITS.essential.smsPerMonth;
  const percentage = (smsUsed / limit) * 100;

  return {
    allowed: smsUsed < limit,
    used: smsUsed,
    limit,
    percentage,
  };
}

export async function incrementSmsCount(userId: string) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('sms_used_this_month')
    .eq('id', userId)
    .single();

  await supabaseAdmin
    .from('users')
    .update({
      sms_used_this_month: (user?.sms_used_this_month || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export function checkAiAccess(tier: Tier) {
  return TIER_LIMITS[tier]?.aiFeatures || false;
}

export function checkZapierAccess(tier: Tier) {
  return TIER_LIMITS[tier]?.zapier || false;
}

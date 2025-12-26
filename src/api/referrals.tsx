import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';

export async function createUser(email: string, referredBy?: string) {
  const referralCode = nanoid(8);

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        email,
        referral_code: referralCode,
        referred_by: referredBy || null,
        points: 0,
        referral_count: 0,
        created_at: new Date(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  const userId = data.id;

  if (referredBy) {
    await supabase.rpc('increment_profile_referrals', { ref_code: referredBy, increment: 1 });

    await supabase.rpc('increment_user_points', { uid: referredBy, amount: 25 });
  }

  await supabase
    .from('user_points')
    .upsert({ user_id: userId, points: 0 });

  return data;
}


/**
 * Fetch a user's referral stats and referral link
 */
export async function getReferralStats(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('referral_count, points, referral_code')
    .eq('id', userId)
    .maybeSingle(); // <-- changed

  if (error) throw error;

  if (!data) {
    // No row found, return defaults
    return {
      referrals: 0,
      pointsEarned: 0,
      referralLink: '',
    };
  }

  return {
    referrals: data.referral_count,
    pointsEarned: data.points,
    referralLink: `${window.location.origin}/signup?ref=${data.referral_code}`,
  };
}

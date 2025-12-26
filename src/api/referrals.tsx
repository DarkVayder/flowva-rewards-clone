import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';

export async function createUser(email: string, referredBy?: string) {
  const referralCode = nanoid(8);

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email,
      referral_code: referralCode,
      referred_by: referredBy || null,
      referral_count: 0,
      points: 0,
    })
    .select()
    .single();

  if (error) throw error;

  if (referredBy) {
    await supabase.rpc('increment_profile_referrals', {
      ref_code: referredBy,
    });

    await supabase.rpc('reward_referrer', {
      ref_code: referredBy,
      amount: 25,
    });
  }

  await supabase
    .from('user_points')
    .upsert({ user_id: data.id, points: 0 });

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
    .maybeSingle();

  if (error) throw error;

  if (!data) {
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

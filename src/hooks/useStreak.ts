import { supabase } from '../lib/supabase';

export async function claimDaily(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch streak:', error);
    return false;
  }

  if (!data) {
    const { error: insertError } = await supabase.from('streaks').insert({
      user_id: userId,
      last_claim: today,
      streak_count: 1,
    });

    if (insertError) {
      console.error('Failed to insert streak:', insertError);
      return false;
    }

    await supabase.rpc('increment_user_points', { uid: userId, amount: 5 });

    return true;
  }

  if (data.last_claim === today) return false;

  const { error: updateError } = await supabase
    .from('streaks')
    .update({
      last_claim: today,
      streak_count: data.streak_count + 1,
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Failed to update streak:', updateError);
    return false;
  }

  await supabase.rpc('increment_user_points', { uid: userId, amount: 5 });

  return true;
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePoints(userId: string | null) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!userId) return;

    supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => setPoints(data?.points ?? 0));
  }, [userId]);

  const addPoints = async (amount: number) => {
    if (!userId) return;

    const { data } = await supabase
      .from('profiles')
      .update({ points: points + amount })
      .eq('id', userId)
      .select()
      .single();

    setPoints(data.points);
  };

  return { points, addPoints };
}

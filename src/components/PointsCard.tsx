import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function PointsCard() {
  const { user } = useAuth();
  const userId: string | null = user?.id ?? null;
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchPoints = async () => {
      try {
        let { data, error } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const { error: insertError, data: insertData } = await supabase
            .from('user_points')
            .insert({ user_id: userId, points: 0 })
            .select()
            .maybeSingle();

          if (insertError) throw insertError;

          data = insertData;
        }

        setPoints(data?.points ?? 0);
      } catch (err) {
        console.error('Failed to fetch points:', err);
        setPoints(0);
      }
    };

    fetchPoints();

    const interval = setInterval(fetchPoints, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  if (!userId) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">
        Log in to see your points.
      </div>
    );
  }

  const progress = Math.min((points / 5000) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-600">🏅</span>
        <h3 className="font-semibold">Points Balance</h3>
      </div>

      <h1 className="text-4xl font-bold text-purple-600 mb-2">{points}</h1>

      <div className="text-sm text-gray-500 mb-2">Progress to $5 Gift Card</div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {points}/5000 points
      </p>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { FaRegStar } from 'react-icons/fa6';

const GOAL_POINTS = 5000;

export default function PointsCard() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pulseOnce, setPulseOnce] = useState(false);
  const [rotateStarOnce, setRotateStarOnce] = useState(false);

  const prevPoints = useRef(0);

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
          const { data: inserted } = await supabase
            .from('user_points')
            .insert({ user_id: userId, points: 0 })
            .select()
            .maybeSingle();

          data = inserted;
        }

        prevPoints.current = points;
        setPoints(data?.points ?? 0);
      } catch (err) {
        console.error('Failed to fetch points:', err);
        setPoints(0);
      } finally {
        setLoading(false);
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

  const progress = Math.min((points / GOAL_POINTS) * 100, 100);

  const triggerInteraction = () => {
    setPulseOnce(true);
    setRotateStarOnce(true);

    setTimeout(() => {
      setPulseOnce(false);
      setRotateStarOnce(false);
    }, 700);
  };

  return (
    <div
      onMouseEnter={triggerInteraction}
      onTouchStart={triggerInteraction}
      className="
        relative bg-white rounded-2xl p-6
        shadow-sm transition-all duration-300
        hover:shadow-xl hover:ring-2 hover:ring-purple-700
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          🏅 <h3 className="font-semibold">Your Points</h3>
        </div>

        {progress >= 100 && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Reward unlocked 🎉
          </span>
        )}
      </div>

      {/* POINTS + STAR */}
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-end gap-2">
          <h1
            className={`
              text-4xl font-bold text-purple-600 transition
              ${pulseOnce ? 'animate-pulse' : ''}
            `}
          >
            {loading ? '—' : points.toLocaleString()}
          </h1>
          <span className="text-sm text-gray-500 mb-1">pts</span>
        </div>

        <FaRegStar
          className={`
            text-yellow-500 text-3xl
            transition-transform origin-center
            ${rotateStarOnce ? 'animate-[spin_0.6s_linear_1]' : ''}
          `}
        />
      </div>

      {/* GOAL */}
      <p className="text-sm text-gray-500 mb-3">
        Progress toward <span className="font-medium">$5 Gift Card</span>
      </p>

      {/* PROGRESS BAR */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute top-0 left-[50%] h-full w-[2px] bg-white/60" />
      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{points.toLocaleString()} pts</span>
        <span>{GOAL_POINTS.toLocaleString()} pts</span>
      </div>

      {/* GLOW */}
      {pulseOnce && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/40 animate-ping pointer-events-none" />
      )}
    </div>
  );
}
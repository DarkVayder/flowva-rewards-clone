import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TiTick } from 'react-icons/ti';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  pointsPerDay?: number;
};

export default function StreakCard({ pointsPerDay = 5 }: Props) {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [streakedDays, setStreakedDays] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const todayIndex = new Date().getDay();

  // Helper to cal streaked weekdays
  const getStreakedWeekdays = (last: Date, count: number) => {
    const days: number[] = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(last);
      d.setDate(d.getDate() - i);
      days.push(d.getDay());
    }
    return Array.from(new Set(days));
  };

  useEffect(() => {
    if (!userId) return;

    const fetchStreak = async () => {
      try {
        const { data, error } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setStreak(data.streak_count || 0);

          const last = data.last_claim ? new Date(data.last_claim) : null;
          setLastClaim(last);

          if (last && data.streak_count) {
            setStreakedDays(getStreakedWeekdays(last, data.streak_count));

            const todayUTC = new Date().toISOString().split('T')[0];
            if (data.last_claim === todayUTC) {
              setClaimed(true);
            }
          }
        }
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to fetch streak.');
      }
    };

    fetchStreak();
  }, [userId]);

  const handleClaim = async () => {
    if (!userId || claimed) return;

    setLoading(true);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    try {
      let newStreak = 1;
      if (lastClaim && lastClaim.toDateString() === yesterday.toDateString()) {
        newStreak = streak + 1;
      }

      await supabase.from('streaks').upsert(
        {
          user_id: userId,
          streak_count: newStreak,
          last_claim: today.toISOString().split('T')[0],
        },
        { onConflict: 'user_id' }
      );

      const { data: pointsData } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .maybeSingle();

      await supabase.from('user_points').upsert(
        {
          user_id: userId,
          points: (pointsData?.points || 0) + pointsPerDay,
        },
        { onConflict: 'user_id' }
      );

      setStreak(newStreak);
      setLastClaim(today);
      setStreakedDays(getStreakedWeekdays(today, newStreak));
      setClaimed(true);

      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);

      toast.success(`🔥 ${newStreak}-day streak! +${pointsPerDay} points`);
    } catch (err) {
      toast.error('Failed to claim points.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">
        Log in to start your daily streak.
      </div>
    );
  }

  return (
    <>
      {/* CARD */}
      <div
        className="
          bg-white rounded-2xl p-6 relative
          shadow-sm transition-all duration-300
          hover:shadow-xl hover:ring-2 hover:ring-purple-700
        "
      >
        <div className="flex items-center gap-2 mb-3">
          📅 <h3 className="font-semibold">Daily Streak</h3>
          {streak >= 3 && (
            <span className="ml-1 animate-pulse text-xl">🔥</span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          {streak} day{streak !== 1 ? 's' : ''}
          {streak >= 3 && (
            <span className="animate-bounce">🔥</span>
          )}
        </h1>

        {/* WEEKDAYS */}
        <div className="flex gap-2 mb-4 justify-center">
          {weekdays.map((d, i) => {
            const isToday = i === todayIndex;
            const isStreaked = streakedDays.includes(i);

            return (
              <div key={i} className="relative group">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all duration-200
                    cursor-pointer
                    ${
                      isToday
                        ? 'bg-purple-600 text-white scale-110'
                        : isStreaked
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }
                    hover:scale-110
                  `}
                >
                  {d}
                </div>

                {/* TOOLTIP */}
                <div
                  className="
                    absolute -top-8 left-1/2 -translate-x-1/2
                    bg-black text-white text-xs px-2 py-1 rounded
                    opacity-0 group-hover:opacity-100 transition
                    pointer-events-none whitespace-nowrap
                  "
                >
                  {isToday
                    ? 'Today'
                    : isStreaked
                    ? 'Streaked'
                    : 'Not streaked'}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Check in daily to earn +{pointsPerDay} points
        </p>

        <button
          onClick={handleClaim}
          disabled={claimed || loading}
          className={`
            w-full py-3 rounded-full font-semibold transition
            ${claimed
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.97] cursor-pointer'}
          `}
        >
          {loading
            ? 'Claiming...'
            : claimed
            ? 'Claimed Today'
            : '⚡ Claim Today’s Points'}
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lg animate-fade-in">
            <TiTick className="text-green-500 w-16 h-16" />
            <h2 className="text-2xl font-bold">Streak Updated!</h2>
            <p className="text-gray-600 text-center">
              Keep the fire burning 🔥
            </p>
          </div>
        </div>
      )}
    </>
  );
}

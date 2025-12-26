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
  const [showModal, setShowModal] = useState(false); // new

  const todayIndex = new Date().getDay();

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

          if (last) {
            const lastUTC = new Date(last.toISOString().split('T')[0]);
            const todayUTC = new Date(new Date().toISOString().split('T')[0]);
            if (lastUTC.getTime() === todayUTC.getTime()) {
              setClaimed(true);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching streak:', err.message || err);
        toast.error('Failed to fetch daily streak.');
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

      const { error: streakError } = await supabase
        .from('streaks')
        .upsert(
          {
            user_id: userId,
            streak_count: newStreak,
            last_claim: today.toISOString().split('T')[0],
          },
          { onConflict: 'user_id' }
        );

      if (streakError) throw streakError;

      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .maybeSingle();

      if (pointsError) throw pointsError;

      const currentPoints = pointsData?.points || 0;

      const { error: upsertError } = await supabase
        .from('user_points')
        .upsert(
          { user_id: userId, points: currentPoints + pointsPerDay },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      setStreak(newStreak);
      setLastClaim(today);
      setClaimed(true);

      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500); 

      toast.success(
        `Claimed ${pointsPerDay} points! Current streak: ${newStreak} day${
          newStreak > 1 ? 's' : ''
        }.`
      );
    } catch (err: any) {
      console.error('Error claiming daily points:', err.message || err);
      toast.error('Error claiming daily points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">
        Log in to start your daily streak and earn points.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm relative">
        <div className="flex items-center gap-2 mb-4">
          📅 <h3 className="font-semibold">Daily Streak</h3>
        </div>

        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          {streak} day{streak !== 1 ? 's' : ''}
        </h1>

        <div className="flex gap-2 mb-4 justify-center">
          {weekdays.map((d, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i === todayIndex ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4 cursor-pointer">
          Check in daily to earn +{pointsPerDay} points
        </p>

        <button
          onClick={handleClaim}
          disabled={claimed || loading}
          className={`w-full py-3 rounded-full font-semibold cursor-pointer ${
            claimed ? 'bg-gray-200 text-gray-500' : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {loading ? 'Claiming...' : claimed ? 'Claimed Today' : `⚡ Claim Today’s Points`}
        </button>
      </div>

      {/* Blurry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lg animate-fade-in">
            <TiTick className="text-green-500 w-16 h-16" />
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Congratulations!
            </h2>
            <p className="text-gray-600 text-center">
              You have successfully claimed today’s points.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

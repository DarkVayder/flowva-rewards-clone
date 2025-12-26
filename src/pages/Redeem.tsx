import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import ReedemCard, { type Reedem } from '../components/ReedemCard';
import { Gift, CreditCard, BookOpen, Package } from 'lucide-react';
import type React from 'react';

const FILTERS = ['all', 'unlocked', 'locked', 'coming_soon'] as const;

const FILTER_LABELS: Record<
  typeof FILTERS[number],
  { label: string; icon: React.ReactNode }
> = {
  all: { label: 'All Rewards', icon: <Gift className="inline w-4 h-4 mr-1" /> },
  unlocked: { label: 'Unlocked', icon: <CreditCard className="inline w-4 h-4 mr-1" /> },
  locked: { label: 'Locked', icon: <BookOpen className="inline w-4 h-4 mr-1" /> },
  coming_soon: { label: 'Coming Soon', icon: <Package className="inline w-4 h-4 mr-1" /> },
};

export default function ReedemPage() {
  const { user } = useAuth();
  const [reedems, setReedems] = useState<Reedem[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>('all');
  const [loading, setLoading] = useState(true);
  const [page, _setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single();
        if (pointsError) console.error('Error fetching points:', pointsError);
        else setUserPoints(pointsData?.points ?? 0);

        const { data: reedemData, error: reedemError } = await supabase
          .from('rewards')
          .select('*')
          .range((page - 1) * pageSize, page * pageSize - 1);
        if (reedemError) console.error('Error fetching reedems:', reedemError);
        else setReedems(reedemData ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, page]);

  const handleRedeem = async (reedem: Reedem) => {
    if (!user) return;
    if ((userPoints ?? 0) < (reedem.points ?? 0)) {
      alert('Not enough points!');
      return;
    }

    const { error } = await supabase.rpc('redeem_reward', {
      p_user_id: user.id,
      p_reward_id: reedem.id,
    });

    if (error) alert('Error redeeming reward: ' + error.message);
    else {
      alert(`Successfully redeemed ${reedem.title}!`);
      setUserPoints(prev => prev - (reedem.points ?? 0));
      setReedems(prev =>
        prev.map(r => (r.id === reedem.id ? { ...r, status: 'unlocked' } : r))
      );
      await supabase.from('reward_redemptions').insert({ user_id: user.id, reward_id: reedem.id });
    }
  };

  const filteredReedems = reedems.filter(r => (activeFilter === 'all' ? true : r.status === activeFilter));

  const counts = {
    all: reedems.length,
    unlocked: reedems.filter(r => r.status === 'unlocked').length,
    locked: reedems.filter(r => r.status === 'locked').length,
    coming_soon: reedems.filter(r => r.status === 'coming_soon').length,
  };

  if (!user || loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Redeem Rewards"
        subtitle="Use your points to unlock rewards and perks!"
        userPoints={userPoints}
        activeTab="redeem"
      />

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap gap-2 md:gap-4 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex items-center ${
              activeFilter === f
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {FILTER_LABELS[f].icon}
            {FILTER_LABELS[f].label}
            <span className="ml-2 text-xs sm:text-sm bg-gray-200 px-2 py-0.5 rounded-full">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse h-64" />
            ))
          : filteredReedems.length === 0
          ? <div className="text-center py-12 text-gray-500 col-span-full">No rewards found in this category</div>
          : filteredReedems.map(reedem => (
              <ReedemCard key={reedem.id} reedem={reedem} userPoints={userPoints} onRedeem={handleRedeem} />
            ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { getReferralStats } from '../api/referrals';
import { useAuth } from '../hooks/useAuth';
import { GoPeople } from 'react-icons/go';
import { toast } from 'react-toastify';

export default function ReferralStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    referrals: 0,
    pointsEarned: 0,
    referralLink: '',
  });

  useEffect(() => {
    if (!user) return;

    getReferralStats(user.id)
      .then(setStats)
      .catch(() => toast.error('Failed to load referral stats'));
  }, [user]);

  const handleCopy = async () => {
    if (!stats.referralLink) return;
    await navigator.clipboard.writeText(stats.referralLink);
    toast.success('Referral link copied 🚀');
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
        <GoPeople className="w-8 h-8 text-purple-700" />
        <p className="font-medium">
          Invite friends and earn <b>25 points</b> per signup
        </p>
      </div>

      <div className="flex justify-around text-center">
        <div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.referrals}
          </p>
          <p className="text-sm text-gray-500">Referrals</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.pointsEarned}
          </p>
          <p className="text-sm text-gray-500">Points Earned</p>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-100 p-3 rounded-lg">
        <input
          value={stats.referralLink || 'Generating referral link…'}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          Copy
        </button>
      </div>
    </section>
  );
}

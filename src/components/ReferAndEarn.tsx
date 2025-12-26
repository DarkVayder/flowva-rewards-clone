import { useState, useEffect } from 'react';
import { getReferralStats } from '../api/referrals';
import { useAuth } from '../hooks/useAuth';
import { GoPeople } from "react-icons/go";

function ReferralStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    referrals: 0,
    pointsEarned: 0,
    referralLink: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const data = await getReferralStats(user.id);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch referral stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  const handleCopy = () => {
    if (!stats.referralLink) return;
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Message */}
      <div className="flex items-center gap-2 bg-purple-50  px-4 py-2 rounded-lg text-sm font-medium">
        <GoPeople className="w-8 h-8 text-purple-700" />
        <span>
          <p className='text-semibold text-xl'>Share Your Link:</p> Invite friends and earn 
          <b> 25 points</b> when they join!
        </span>
      </div>  
      {/* Stats */}
      <div className="flex justify-center text-center space-x-85">
        <div>
          <p className="text-2xl font-bold text-purple-600">{stats.referrals}</p>
          <p className="text-gray-500 text-sm">Referrals</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-purple-600">{stats.pointsEarned}</p>
          <p className="text-gray-500 text-sm">Points Earned</p>
        </div>
      </div>

      {/* Referral link copy */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <input
          type="text"
          value={stats.referralLink}
          readOnly
          className="flex-1 bg-gray-100 text-sm text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="ml-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// Wrapper
export default function ReferAndEarn() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      <ReferralStats />
    </section>
  );
}

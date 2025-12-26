import { useState } from 'react';
import { Gift, CreditCard, BookOpen, Package, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

export type Reedem = {
  id: number;
  title?: string;
  description?: string;
  points?: number;
  status: 'locked' | 'unlocked' | 'coming_soon';
  icon?: string;
};

interface ReedemCardProps {
  reedem: Reedem;
  userPoints: number;
  onRedeem: (r: Reedem) => Promise<void>;
}

export default function ReedemCard({
  reedem,
  userPoints,
}: ReedemCardProps) {
  const [isRedeeming] = useState(false);

  // 🔒 FORCE-LOCK everything
  const isLocked = true;

  const notifyLocked = () => {
    toast.info('This reward is locked. Keep earning points to unlock 💪', {
      position: 'top-center',
      autoClose: 2500,
    });
  };

  const notifyComingSoon = () => {
    toast.warning('This reward is coming soon 👀', {
      position: 'top-center',
      autoClose: 2500,
    });
  };

  const handleClick = () => {
    if (reedem.status === 'coming_soon') {
      notifyComingSoon();
      return;
    }
    notifyLocked();
  };

  const getIcon = () => {
    const size = 36;
    switch (reedem.icon) {
      case 'transfer':
        return <CreditCard size={size} className="text-green-600" />;
      case 'gift':
        return <Gift size={size} className="text-purple-600" />;
      case 'course':
        return <BookOpen size={size} className="text-blue-600" />;
      default:
        return <Package size={size} className="text-gray-500" />;
    }
  };

  const getBadge = () => {
    switch (reedem.status) {
      case 'coming_soon':
        return 'bg-yellow-100 text-yellow-700';
      case 'locked':
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        relative bg-white rounded-2xl border border-gray-200
        p-6 flex flex-col overflow-hidden
        shadow-sm hover:shadow-lg transition
        cursor-not-allowed select-none
      "
    >
      {/* Status Badge */}
      <span
        className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${getBadge()}`}
      >
        {reedem.status === 'coming_soon' ? 'Coming Soon' : 'Locked'}
      </span>

      {/* Icon */}
      <div className="mx-auto mb-4 p-4 rounded-full bg-gray-50">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 line-clamp-2">
        {reedem.title ?? 'Untitled reward'}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
        {reedem.description ?? 'No description available.'}
      </p>

      {/* Points */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-yellow-400">⭐</span>
        <span className="font-semibold text-purple-600">
          {(reedem.points ?? 0).toLocaleString()} pts
        </span>
      </div>

      {/* Locked Button */}
      <button
        disabled
        className="
          w-full py-3 rounded-xl text-sm font-semibold
          bg-gray-200 text-gray-500
          flex items-center justify-center gap-2
          cursor-not-allowed
        "
      >
        <Lock size={16} />
        {reedem.status === 'coming_soon' ? 'Coming Soon' : 'Locked'}
      </button>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl pointer-events-none" />
    </div>
  );
}

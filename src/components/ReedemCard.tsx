import { useState } from 'react';
import { Gift, CreditCard, BookOpen, Package } from 'lucide-react';

export type Reedem = {
  id: number;
  title?: string;
  description?: string;
  points?: number;
  status: 'locked' | 'unlocked' | 'coming_soon';
  icon?: string;
  type?: string;
};

interface ReedemCardProps {
  reedem: Reedem;
  userPoints: number;
  onRedeem: (r: Reedem) => Promise<void>;
}

export default function ReedemCard({ reedem, userPoints, onRedeem }: ReedemCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const canRedeem =
    (userPoints ?? 0) >= (reedem.points ?? 0) && reedem.status !== 'coming_soon';

  const getIcon = () => {
    const size = 8;
    switch (reedem.icon) {
      case 'transfer':
        return <CreditCard className={`w-${size} h-${size} text-green-600`} />;
      case 'gift':
        return <Gift className={`w-${size} h-${size} text-purple-600`} />;
      case 'course':
        return <BookOpen className={`w-${size} h-${size} text-blue-600`} />;
      default:
        return <Package className={`w-${size} h-${size} text-gray-600`} />;
    }
  };

  const getTypeColor = () => {
    switch (reedem.icon) {
      case 'transfer':
        return 'bg-green-50';
      case 'gift':
        return 'bg-purple-50';
      case 'course':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleRedeem = async () => {
    if (!canRedeem) return;
    setIsRedeeming(true);
    await onRedeem(reedem);
    setIsRedeeming(false);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer overflow-hidden">

      {/* Status stripe */}
      <div
        className={`absolute top-0 left-0 h-1 w-full ${
          reedem.status === 'unlocked'
            ? 'bg-green-500'
            : reedem.status === 'locked'
            ? 'bg-gray-400'
            : 'bg-yellow-400'
        }`}
      />

      {/* Icon */}
      <div className={`flex justify-center mb-4 p-4 rounded-full ${getTypeColor()}`}>
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 line-clamp-2">
        {reedem.title ?? 'Untitled'}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-4 flex-grow line-clamp-3">
        {reedem.description ?? 'No description available.'}
      </p>

      {/* Points */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-yellow-400 text-lg">⭐</span>
        <span className="text-purple-600 font-semibold text-sm">
          {(reedem.points ?? 0).toLocaleString()} pts
        </span>
      </div>

      {/* Redeem button */}
      <button
        onClick={handleRedeem}
        disabled={!canRedeem || isRedeeming}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          reedem.status === 'coming_soon'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : canRedeem
            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-pink-500 hover:to-purple-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isRedeeming
          ? 'Redeeming...'
          : reedem.status === 'coming_soon'
          ? 'Coming Soon'
          : canRedeem
          ? 'Redeem Now'
          : 'Locked'}
      </button>

      {/* Locked overlay */}
      {!canRedeem && reedem.status === 'locked' && (
        <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center text-gray-500 font-semibold text-lg rounded-2xl">
          Locked
        </div>
      )}
    </div>
  );
}

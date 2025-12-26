import { Link } from 'react-router-dom';
import { DollarSign, Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  userPoints?: number;
  activeTab: 'earn' | 'redeem';
};

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

export default function PageHeader({
  title,
  subtitle,
  userPoints,
  activeTab,
}: PageHeaderProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [fullName, setFullName] = useState('there');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name =
        data.user?.user_metadata?.full_name ||
        data.user?.email?.split('@')[0];
      if (name) setFullName(name);
    });
  }, []);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: 'Daily Streak Reminder',
        message: `Don't lose your streak! You're at 1 day(s)! Claim today to keep it going! 🔥
Stay consistent for the next 30 days and you could stand a chance to win 5,000 Flowva Points 🎉`,
        time: '3d ago',
        unread: true,
      },
      {
        id: 2,
        title: `Welcome, ${fullName}!`,
        message: `We're thrilled to have you on board! 🚀

Explore powerful tools, build your personal stack, and start unlocking rewards through daily streaks, referrals, and more.

Your journey to smarter productivity starts here.`,
        time: '4d ago',
        unread: true,
      },
    ]);
  }, [fullName]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (open || selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open, selected]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteAll = () => {
    setNotifications([]);
    toast.info('All notifications deleted');
    setOpen(false);
  };

  const openNotification = (n: Notification) => {
    setNotifications(prev =>
      prev.map(item =>
        item.id === n.id ? { ...item, unread: false } : item
      )
    );
    setSelected(n);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 md:py-6 relative">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}

            {userPoints !== undefined && (
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">
                  {userPoints.toLocaleString()} points available
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(v => !v)}
            className="relative p-2.5 rounded-full hover:bg-gray-300 transition text-gray-600 hover:text-purple-700 cursor-pointer"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8 mt-6">
          <Link to="/rewards">
            <button
              className={`pb-4 font-medium cursor-pointer ${
                activeTab === 'earn'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Earn Points
            </button>
          </Link>

          <Link to="/redeem">
            <button
              className={`pb-4 font-medium cursor-pointer ${
                activeTab === 'redeem'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Redeem Rewards
            </button>
          </Link>
        </div>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200
              w-[calc(100%-2rem)] sm:w-[380px] md:w-[420px]
              top-16 sm:top-20
              left-1/2 -translate-x-1/2
              md:left-auto md:right-8 md:translate-x-0
              animate-in fade-in slide-in-from-top-3
            "
          >
            <div className="px-5 py-4 flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-500">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex gap-4 text-xs">
                <button
                  onClick={markAllRead}
                  className="text-white/90 hover:text-white hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
                <button
                  onClick={deleteAll}
                  className="text-red-200 hover:text-red-100 hover:underline cursor-pointer"
                >
                  Delete all
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`px-5 py-4 cursor-pointer transition hover:bg-gray-50 ${
                      n.unread ? 'bg-purple-50/40' : ''
                    }`}
                  >
                    <p className="font-medium text-gray-900">{n.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 relative shadow-xl animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
              >
                <X />
              </button>

              <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
              <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
                {selected.message}
              </p>
              <p className="text-xs text-gray-400 mt-6">{selected.time}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
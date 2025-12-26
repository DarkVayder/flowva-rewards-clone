import { useEffect, useState } from 'react';
import Logo from '../assets/logo.png';

export default function Loader() {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + Math.random() * 15));
    }, 200);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
        <div className="relative w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-float hover:scale-105 transition-transform">
          <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>
      </div>

      {/* Loading text */}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-shimmer bg-[length:200%_100%]">
        Loading{dots}
      </h2>

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin-slow" />
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out animate-shimmer"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-gray-500 text-sm animate-pulse">Please Wait a Moment...</p>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
        .animate-spin-slow { animation: spin-slow 1.5s linear infinite; }
      `}</style>
    </div>
  );
}

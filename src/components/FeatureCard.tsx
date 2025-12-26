import React, { useState } from 'react';
import { CiGift } from 'react-icons/ci';
import { FiCalendar } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

type FeaturedCardProps = {
  title: string;
  subtitle?: string;
  signupLink?: string;
  pointsToClaim?: number;
  userId?: string;
};

export default function FeaturedCard({
  title,
  subtitle = `Automate and optimize your schedule with Reclaim.ai.
Sign up for free and earn Flowva Points instantly.`,
  signupLink = 'https://go.reclaim.ai/ur9i6g5eznps',
  pointsToClaim = 25,
  userId,
}: FeaturedCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !file || !userId) {
      setError('Email and screenshot are required.');
      return;
    }

    try {
      setLoading(true);

      const ext = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from('reclaim-screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error } = await supabase.from('reward_claims').insert({
        user_id: userId,
        email,
        screenshot_path: data.path,
        points: pointsToClaim,
        reward_title: title,
      });

      if (error) throw error;

      setIsOpen(false);
      setEmail('');
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="group relative rounded-3xl bg-gradient-to-br from-purple-600/90 to-blue-500/90 p-6 shadow-lg transition hover:shadow-2xl hover:-translate-y-1">
        <span className="inline-block text-xs bg-white/20 px-3 py-1 rounded-full mb-3">
          Featured
        </span>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>

        <div className="bg-white/95 rounded-2xl p-4 flex gap-4">
          <FiCalendar className="w-10 h-10 text-purple-600 flex-shrink-0" />
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {subtitle}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={signupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex-1 rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white text-center transition hover:bg-white hover:text-purple-700"
          >
            Sign up free
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer flex-1 rounded-full px-5 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <CiGift className="w-5 h-5" />
            Claim {pointsToClaim} pts
          </button>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-[scaleIn_0.2s_ease-out]"
          >
            <h3 className="text-xl font-bold mb-1">
              Claim {pointsToClaim} Points
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sign up, then upload a screenshot showing your email.
            </p>

            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Email used on Reclaim"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <label className="cursor-pointer block border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                {file ? (
                  <span className="text-sm text-gray-700 truncate block">
                    {file.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">
                    Click to upload screenshot
                  </span>
                )}
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-xl border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className={`cursor-pointer px-5 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 transition ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {loading ? 'Submitting…' : 'Submit claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
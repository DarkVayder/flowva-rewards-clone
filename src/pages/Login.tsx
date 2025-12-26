import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const referredBy = params.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const referralCode = crypto.randomUUID().slice(0, 8);

          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            points: 0,
            referral_code: referralCode,
            referred_by: referredBy || null,
            created_at: new Date(),
          });

          if (profileError) throw profileError;

          await supabase.from('streaks').insert({
            user_id: data.user.id,
            streak_count: 0,
          });

          if (referredBy) {
            await supabase.rpc('increment_profile_stats', {
              ref_code: referredBy,
              point_inc: 100, 
            });
          }

          await supabase.auth.signInWithPassword({ email, password });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      navigate('/rewards');
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/rewards${referredBy ? `?ref=${referredBy}` : ''}`,
      },
    });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email to reset password.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) setError(error.message);
    else alert('Password reset email sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9013fe] to-[#6D28D9] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white px-8 py-12 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            {isSignup ? 'Create an account' : 'Log in to Flowva'}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {isSignup
              ? 'Sign up to manage your tools and rewards'
              : 'Welcome back — Login to receive personalized recommendations'}
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        {!isSignup && (
          <div className="flex justify-end mb-8">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-purple-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-purple-600 text-white font-semibold text-base hover:bg-purple-700 transition disabled:opacity-60 cursor-pointer"
        >
          {loading
            ? 'Please wait...'
            : isSignup
            ? 'Create account'
            : 'Sign in'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs tracking-wider text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Auth */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 font-medium transition cursor-pointer"
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* Toggle */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-purple-600 hover:underline cursor-pointer"
          >
            {isSignup
              ? 'Already have an account? Sign in'
              : "Don’t have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
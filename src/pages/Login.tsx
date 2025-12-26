import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const referredBy = params.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (!data.user) throw new Error('Signup failed');

        const referralCode = crypto.randomUUID().slice(0, 8);

        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          points: 0,
          referral_code: referralCode,
          referred_by: referredBy || null,
          referral_count: 0,
          created_at: new Date(),
        });

        if (profileError) throw profileError;

        await supabase.from('streaks').insert({
          user_id: data.user.id,
          streak_count: 0,
        });

        if (referredBy) {
          await supabase.rpc('increment_profile_referrals', {
            ref_code: referredBy,
            increment: 1,
          });

          await supabase.rpc('increment_user_points', {
            uid: referredBy,
            amount: 25,
          });
        }

        await supabase.auth.signInWithPassword({ email, password });
        toast.success('Account created successfully 🎉');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        toast.success('Welcome back 👋');
      }

      navigate('/rewards');
    } catch (err: any) {
      toast.error(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback${
          referredBy ? `?ref=${referredBy}` : ''
          }`,
        },
      });
    };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning('Enter your email to reset password');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) toast.error(error.message);
    else toast.success('Password reset email sent 📧');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9013fe] to-[#6D28D9] px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white px-8 py-12 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-purple-700 mb-2">
              {isSignup ? 'Create an account' : 'Log in to Flowva'}
            </h1>
            <p className="text-sm text-gray-500">
              {isSignup
                ? 'Sign up to manage your tools and rewards'
                : 'Welcome back — Log In to receive personalized recommendations'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder='user@email.com'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='*******'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl pr-12 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
          </button>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full border bg-white hover:bg-gray-200 cursor-pointer"
          >
            <FaGoogle />
            Continue with Google
          </button>

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
    </>
  );
}
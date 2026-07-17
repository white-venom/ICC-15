'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      // Login
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      // Register
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, referralCode }),
        });

        if (res.ok) {
          // Auto login after register
          await signIn('credentials', { email, password, redirect: false });
          router.push('/');
          router.refresh();
        } else {
          const msg = await res.text();
          setError(msg || 'Registration failed.');
          setLoading(false);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-ivory pt-32 pb-16 px-6 md:px-16 flex flex-col justify-center items-center font-sans">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={12} /> Return Home
        </button>

        <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl uppercase tracking-wider text-white">
              {isLogin ? 'Member Login' : 'Create Account'}
            </h1>
            <p className="text-xs text-ivory/40 uppercase tracking-widest mt-2">
              {isLogin ? 'Welcome back to the club.' : 'Join the exclusive atelier.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/25 rounded-xl text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-ivory/40">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-ivory/40">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-ivory/40">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none transition-colors"
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-ivory/40">Referral Code (Optional)</label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ICC-XXXXX"
                  className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory placeholder-ivory/20 focus:outline-none transition-colors uppercase"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gold text-[#050505] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[10px] uppercase tracking-widest text-ivory/60 hover:text-gold transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already a member? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

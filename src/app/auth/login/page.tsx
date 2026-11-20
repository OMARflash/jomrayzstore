'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-neutral-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="font-stencil text-3xl text-white inline-block">
            JOMRAYZ
          </Link>
          <h1 className="text-lg font-bold text-neutral-200">Customer Account Login</h1>
          <p className="text-xs text-neutral-400">
            Sign in to access your orders, saved addresses, and drop wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. youssef@example.com"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? <span>Signing In...</span> : <span>SIGN IN</span>}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-[11px] text-neutral-400 space-y-1">
          <p className="font-bold text-neutral-300">Demo Customer Credentials:</p>
          <p>Email: <code className="text-white">customer@jomrayz.com</code></p>
          <p>Password: <code className="text-white">customer123</code></p>
        </div>

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
          <span>Don't have an account yet? </span>
          <Link href="/auth/register" className="text-white font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

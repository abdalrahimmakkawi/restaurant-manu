import React, { useState, useEffect } from 'react';
import {
  signUp, signIn, signOut, getCurrentUser, onAuthStateChange,
} from '../lib/supabase';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';

export function Login() {
  const [mode, setMode]         = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');

  const clear = () => { setError(''); setSuccess(''); };

  // Monitor authentication state
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (user) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.reload(); // Reload to trigger App.tsx auth state update
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        setSuccess('Account created! Please check your email to confirm.');
      } else {
        await signIn(email, password);
        setSuccess('Login successful! Redirecting...');
      }
    } catch (err: any) {
      setError(err.message?.replace('AuthApiError: ', '') || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/30 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Nusantara</h1>
          <p className="text-muted-foreground mt-1 text-sm">Dish Information Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-border p-8">
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); clear(); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text" placeholder="Full name" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email" placeholder="Email address" value={email} required
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password" placeholder="Password" value={password} required
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <p className="text-green-600 text-xs">{success}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Shenyang Aerospace University · Java Programming Project
        </p>
      </motion.div>
    </div>
  );
}

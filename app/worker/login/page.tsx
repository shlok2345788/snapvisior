'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WorkerLogin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/worker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/worker/dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff9f2] p-6 text-[#2a1d12] lg:p-12">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,178,113,0.34),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(0,166,166,0.2),transparent_38%),radial-gradient(circle_at_40%_90%,rgba(144,101,70,0.12),transparent_35%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2a1d12] text-[#fff9f2]">
              <Camera className="h-5 w-5" />
            </span>
            <span className="text-2xl font-black tracking-tight">SNAPVISOR TEAM</span>
          </Link>
          <h1 className="max-w-lg text-4xl font-black leading-tight md:text-5xl">
            Worker access for instant event delivery.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-[#5f4a39]">
            Log in to create events, upload photos, and manage live galleries during shoots.
          </p>
          <div className="rounded-2xl border border-[#efd8bf] bg-white/70 p-5 text-sm text-[#6a5543]">
            Tip: keep this page open on mobile + desktop for faster event ops.
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-[#efdbc8] bg-white/85 p-8 shadow-[0_24px_60px_rgba(139,91,57,0.16)] md:p-10"
        >
          <form onSubmit={handleLogin} className="space-y-6">
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4d31]">Worker Login</p>
              <div>
                <label className="mb-2 block pl-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f7157]">Team Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b08f74] transition-colors group-focus-within:text-[#ff6a3d]" />
                  <input
                    required
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-2xl border border-[#ebd4ba] bg-[#fff9f2] py-4 pl-12 pr-5 text-[#2a1d12] shadow-inner transition-all focus:border-[#ff6a3d] focus:outline-none"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block pl-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f7157]">Security Token</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b08f74] transition-colors group-focus-within:text-[#ff6a3d]" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-2xl border border-[#ebd4ba] bg-[#fff9f2] py-4 pl-12 pr-5 text-[#2a1d12] shadow-inner transition-all focus:border-[#ff6a3d] focus:outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {error && <p className="pl-2 text-xs font-bold text-[#c3482b]">{error}</p>}

              <button
                disabled={loading}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f1b16] py-5 font-bold text-[#fff9f2] transition-all hover:bg-[#ff6a3d] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Enter Workspace <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#90735b]">
              Secure Platform Access • Snapvisor Systems
            </p>
          </form>
        </motion.section>
      </div>
    </main>
  );
}

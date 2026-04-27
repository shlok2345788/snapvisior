'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', otp: '' });
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#131317] flex items-center justify-center p-6 lg:p-12 selection:bg-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-6 h-6 text-white" />
             </div>
             <span className="text-3xl font-inter font-bold text-white tracking-tighter">Snapvior</span>
          </Link>
          <h1 className="text-2xl font-inter font-bold text-white">Admin Control</h1>
          <p className="text-foreground/40 text-sm font-manrope">Enter your credentials to receive an OTP</p>
        </div>

        <div className="glass rounded-[2rem] border-white/10 p-8 shadow-2xl relative overflow-hidden">
           <AnimatePresence mode="wait">
             {step === 1 ? (
               <motion.form 
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onSubmit={handleSendOTP}
                className="space-y-6"
               >
                 <div>
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Username</label>
                   <div className="relative">
                      <input 
                        required
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-manrope focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="shlok"
                      />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Admin Email</label>
                   <div className="relative">
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-manrope focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="snapvior23@gmail.com"
                      />
                   </div>
                 </div>

                 {error && <p className="text-red-400 text-xs font-bold pl-2">{error}</p>}

                 <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full gradient-primary py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98]"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                     <>Send OTP <ArrowRight className="w-4 h-4" /></>
                   )}
                 </button>
               </motion.form>
             ) : (
                <motion.form 
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleVerify}
                  className="space-y-6"
                >
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-4 mb-8">
                     <Mail className="w-5 h-5 text-primary" />
                     <p className="text-sm text-primary font-manrope">OTP sent to {formData.email}</p>
                  </div>

                  <div>
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Authentication Code</label>
                   <input 
                      required
                      type="text" 
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="000000"
                    />
                 </div>

                 {error && <p className="text-red-400 text-xs font-bold pl-2">{error}</p>}

                 <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-[0.98]"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Verify & Login <ShieldCheck className="w-5 h-5" /></>
                    )}
                 </button>

                 <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-foreground/40 text-xs font-bold hover:text-white transition-colors"
                 >
                   Back to credentials
                 </button>
                </motion.form>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}

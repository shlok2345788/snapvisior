'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Trash2, Edit2, 
  LogOut, ShieldAlert, Sparkles, Plus,
  Search, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';

export default function AdminDashboard() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorker, setNewWorker] = useState({ username: '', password: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Real API Fetch
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await apiFetch('/api/admin/workers');
        if (res.ok) {
          const data = await res.json();
          setWorkers(data);
        }
      } catch (err) {
        console.error('Failed to fetch workers');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await apiFetch('/api/admin/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorker),
      });
      
      const data = await res.json();
      if (res.ok) {
        setWorkers([...workers, data]);
        setNewWorker({ username: '', password: '' });
        setIsAdding(false);
      } else {
        alert(data.message || 'Error creating worker');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white selection:bg-primary/20">
      {/* Sidebar / Top Nav */}
      <nav className="border-b border-white/5 bg-surface-container-low/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-xl font-bold font-inter">Admin <span className="text-primary italic">Console</span></h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-foreground/40 hover:text-white transition-colors text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats / Actions Left Column */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] border-white/5 p-8">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-lg font-bold">Quick Actions</h2>
                 <ShieldAlert className="w-5 h-5 text-secondary" />
               </div>
               <button 
                onClick={() => setIsAdding(true)}
                className="w-full gradient-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
               >
                 <UserPlus className="w-5 h-5" /> Add New Worker
               </button>
            </div>

            <div className="glass rounded-[2rem] border-white/5 p-8 bg-gradient-to-br from-primary/5 to-transparent">
               <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Team Size</p>
               <h3 className="text-5xl font-inter font-bold">{workers.length}</h3>
               <p className="text-foreground/40 text-sm mt-4 font-manrope">Active photographers managing event galleries.</p>
            </div>
          </div>

          {/* Main List Center/Right Column */}
          <div className="lg:col-span-2">
            <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                     <Users className="w-6 h-6 text-primary" /> 
                     Worker Directory
                  </h2>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                     <input 
                      type="text" 
                      placeholder="Search users..."
                      className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                     />
                  </div>
               </div>

               <div className="p-4">
                  {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                       <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                       <p className="text-foreground/40 font-manrope">Retrieving team data...</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-white/40 text-xs font-bold uppercase tracking-widest">
                          <th className="px-6 py-4">Username</th>
                          <th className="px-6 py-4">Joined</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {workers.map((worker) => (
                           <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={worker.id} 
                            className="hover:bg-white/[0.02] transition-colors group"
                           >
                             <td className="px-6 py-6 font-bold">{worker.username}</td>
                             <td className="px-6 py-6 text-foreground/40 font-manrope text-sm">{worker.createdAt}</td>
                             <td className="px-6 py-6 text-right">
                               <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button title="Edit worker" aria-label="Edit worker" className="p-2 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-white transition-colors">
                                     <Edit2 className="w-4 h-4" />
                                  </button>
                                   <button title="Delete worker" aria-label="Delete worker" className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/40 hover:text-red-400 transition-colors">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                             </td>
                           </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Worker Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md glass border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative"
           >
              <h2 className="text-2xl font-bold mb-2">Create Worker</h2>
              <p className="text-foreground/40 text-sm mb-8">Grant system access to a team member.</p>
              
              <form onSubmit={handleCreateWorker} className="space-y-6">
                 <div>
                    <label htmlFor="new-worker-username" className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Username</label>
                    <input 
                      id="new-worker-username"
                      required
                      type="text" 
                      placeholder="Enter worker username"
                      value={newWorker.username}
                      onChange={(e) => setNewWorker({ ...newWorker, username: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-manrope focus:outline-none focus:border-primary/50"
                    />
                 </div>
                 <div>
                    <label htmlFor="new-worker-password" className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 mb-2 block">Password</label>
                    <input 
                      id="new-worker-password"
                      required
                      type="password" 
                      placeholder="Enter secure password"
                      value={newWorker.password}
                      onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-manrope focus:outline-none focus:border-primary/50"
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 gradient-primary py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all"
                    >
                      Initialize
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}

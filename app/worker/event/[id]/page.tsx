'use client';

import React, { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, ArrowLeft, Camera, Image as ImageIcon,
  ExternalLink, Grid3X3, Download, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Media {
  id: string;
  url: string;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  code: string;
  media: Media[];
}

export default function EventManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/worker/event/${id}/details`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }
    } catch {
      console.error('Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm('Remove this photo permanently?')) return;
    
    setDeletingId(mediaId);
    try {
      const res = await fetch(`/api/worker/media/${mediaId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvent(prev => prev ? {
          ...prev,
          media: prev.media.filter(m => m.id !== mediaId)
        } : null);
      }
    } catch {
      alert('Failed to delete media');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#efcfb2] border-t-[#ff6a3d]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff9f2] p-6 text-[#2a1d12]">
        <h2 className="mb-4 text-2xl font-black italic">Event Not Found</h2>
        <Link href="/worker/dashboard" className="flex items-center gap-2 text-[#ff6a3d] hover:text-[#de5428]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f2] text-[#2a1d12]">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-[#efd8bf] bg-[#fff9f2]/95 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href="/worker/dashboard" className="rounded-xl border border-[#e8d3b8] bg-white p-2 text-[#8f7157] transition-all hover:bg-[#fff1e2] hover:text-[#2a1d12]" aria-label="Back to dashboard">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="h-6 w-[1px] bg-[#e0c8ae]" />
             <div>
                <h1 className="text-lg font-black tracking-tight">{event.name}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6a3d]">Management Portal</p>
             </div>
          </div>
          <button 
             onClick={() => window.open(`/gallery/${event.code}`, '_blank')}
             className="flex items-center gap-2 rounded-xl bg-[#1f1b16] px-6 py-2.5 text-sm font-bold text-[#fff9f2] transition-all hover:bg-[#ff6a3d]"
          >
             <ExternalLink className="w-4 h-4" /> Live Gallery
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h2 className="mb-2 text-4xl font-black tracking-tight">Gallery Assets</h2>
              <p className="text-sm text-[#6e5744]">Manage and curate individual captures for this event.</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#efd8bf] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#8f7157]">
                 {event.media.length} Total Captures
              </div>
              <button 
                onClick={fetchEvent}
                className="rounded-2xl border border-[#efd8bf] bg-white/80 p-3 text-[#8f7157] transition-all hover:bg-[#fff1e2]" aria-label="Refresh gallery"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
           </div>
        </div>

        {event.media.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-[#e7c9ac] bg-white/75 py-40 text-center">
             <Grid3X3 className="mx-auto mb-6 h-12 w-12 text-[#a77b5c]" />
             <h3 className="text-xl font-black text-[#725a47]">No media found</h3>
             <p className="mt-2 text-sm text-[#8f7157]">Upload photos from the dashboard to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             <AnimatePresence>
                {event.media.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="group relative aspect-square overflow-hidden rounded-[2rem] border border-[#edd4bb] bg-white/85 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                     <img 
                       src={item.url} 
                       alt="Event Capture" 
                       className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     
                     <div className="absolute inset-0 flex items-center justify-center gap-3 bg-[#2a1d12]/60 opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                        <button 
                          onClick={() => window.open(item.url, '_blank')}
                          aria-label="Download photo"
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                        >
                           <Download className="h-5 w-5" />
                        </button>
                        <button 
                           disabled={deletingId === item.id}
                           onClick={() => handleDeleteMedia(item.id)}
                           aria-label="Delete photo"
                           className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/20 text-red-500 backdrop-blur-md transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
                        >
                           {deletingId === item.id ? (
                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                           ) : (
                             <Trash2 className="h-5 w-5" />
                           )}
                        </button>
                     </div>

                     <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-white/20 px-4 py-2 backdrop-blur-md opacity-0 transition-all group-hover:opacity-100">
                        <p className="truncate text-[8px] font-bold uppercase tracking-widest text-white/70">
                          Captured {new Date(item.createdAt).toLocaleTimeString()}
                        </p>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

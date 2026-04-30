'use client';

import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Image as ImageIcon, QrCode, Copy, 
  LogOut, Check, Upload, 
  Clock, Trash2, Camera
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

interface WorkerEvent {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  mediaCount: number;
}

export default function WorkerDashboard() {
  const [events, setEvents] = useState<WorkerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [eventName, setEventName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await apiFetch('/api/worker/event');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      try {
        setModelsLoading(true);
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        if (!cancelled) {
          setModelsLoaded(true);
        }
      } catch (error) {
        console.error('Face model load failed:', error);
      } finally {
        if (!cancelled) {
          setModelsLoading(false);
        }
      }
    }

    loadModels();

    return () => {
      cancelled = true;
    };
  }, []);

  const [uploadingEventId, setUploadingEventId] = useState<string | null>(null);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const res = await apiFetch('/api/worker/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setEvents([data, ...events]);
        setEventName('');
        setIsCreating(false);
      } else {
        alert(data.message || 'Failed to create event');
      }
    } catch {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  async function extractDescriptorsFromFile(file: File) {
    const imageUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error(`Failed to load image ${file.name}`));
      });

      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const descriptors = detections.map((d) => Array.from(d.descriptor));
      if (descriptors.length === 0) {
        throw new Error(`No face detected in ${file.name}`);
      }

      return descriptors;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
    if (!e.target.files?.length) return;

    if (!modelsLoaded) {
      alert(modelsLoading ? 'Loading face recognition models. Please try again in a moment.' : 'Face recognition models are not ready yet. Check that /public/models exists.');
      return;
    }
    
    setUploadingEventId(eventId);
    const formData = new FormData();
    formData.append('eventId', eventId);

    const files = Array.from(e.target.files);
    const descriptorItems: Array<{ fileName: string; descriptors: number[][] }> = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const descriptors = await extractDescriptorsFromFile(file);
        descriptorItems.push({ fileName: file.name, descriptors });
        formData.append('files', file);
      }

      formData.append('descriptors', JSON.stringify(descriptorItems));
    } catch (error: any) {
      alert(error?.message || 'Unable to detect a face in one of the images.');
      setUploadingEventId(null);
      return;
    }

    try {
      const res = await apiFetch('/api/worker/upload', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        // Update the event media count visually
        setEvents(prevEvents => prevEvents.map(ev => 
          ev.id === eventId ? { ...ev, mediaCount: ev.mediaCount + result.uploaded } : ev
        ));
        alert('Upload successful!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Upload failed.');
      }
    } catch {
      alert('Network error during upload');
    } finally {
      setUploadingEventId(null);
    }
  };

  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event and all its media? This action cannot be undone.')) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      const res = await apiFetch(`/api/worker/event/${eventId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setEvents(events.filter(ev => ev.id !== eventId));
      } else {
        alert('Failed to delete event.');
      }
    } catch {
      alert('Network error during deletion');
    } finally {
      setDeletingEventId(null);
    }
  };

    if (loading) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#efcfb2] border-t-[#ff6a3d]" />
      </div>
     );
    }

  return (
     <div className="min-h-screen bg-[#fff9f2] text-[#2a1d12] selection:bg-[#ffd7bf]">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 border-b border-[#efd8bf] bg-[#fff9f2]/95 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
           <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a1d12] text-[#fff9f2]">
            <Camera className="h-5 w-5" />
           </span>
           <div className="h-6 w-[1px] bg-[#e0c8ae]" />
           <div>
            <h1 className="text-lg font-black tracking-tight">Worker Dashboard</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6a3d]">Event Hub</p>
           </div>
          </div>
          <div className="flex items-center gap-6">
           <button
                onClick={() => setIsCreating(true)}
             className="flex items-center gap-2 rounded-xl bg-[#1f1b16] px-5 py-2.5 text-sm font-bold text-[#fff9f2] transition-all hover:bg-[#ff6a3d]"
             >
                <Plus className="w-4 h-4" /> New Event
             </button>
           <button
             aria-label="Exit worker dashboard"
             title="Exit worker dashboard"
             className="text-[#9b7b61] transition-colors hover:text-[#2a1d12]"
             onClick={() => window.location.href = '/'}
           >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-8 grid gap-4 md:grid-cols-3">
         <article className="rounded-2xl border border-[#efd8bf] bg-white/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#966242]">Active Events</p>
          <p className="mt-2 text-3xl font-black">{events.length}</p>
         </article>
         <article className="rounded-2xl border border-[#efd8bf] bg-white/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#966242]">Total Media</p>
          <p className="mt-2 text-3xl font-black">{events.reduce((sum, event) => sum + (event.mediaCount || 0), 0)}</p>
         </article>
         <article className="rounded-2xl border border-[#efd8bf] bg-white/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#966242]">Live Workflow</p>
          <p className="mt-2 text-sm font-semibold text-[#5f4a39]">Create, upload, and share in seconds.</p>
         </article>
        </section>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#e7c9ac] bg-white/75 py-28 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#efd8bf] bg-[#fff3e4]">
              <ImageIcon className="h-10 w-10 text-[#a77b5c]" />
              </div>
            <h2 className="mb-2 text-2xl font-black">No Events Yet</h2>
            <p className="max-w-sm text-[#725a47]">Create your first event project to start uploading and sharing instant galleries.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={event.id}
                className="group relative overflow-hidden rounded-[2rem] border border-[#edd4bb] bg-white/85 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(125,88,62,0.15)]"
                 >
                    {uploadingEventId === event.id && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-[#2a1d12]/80 backdrop-blur-sm">
                   <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#ffd2b3] border-t-transparent" />
                   <span className="text-sm font-bold text-white">Uploading Assets...</span>
                       </div>
                    )}
                    <div className="p-8">
                       <div className="flex items-center justify-between mb-6">
                    <div className="rounded-full border border-[#ffcfb0] bg-[#fff2e2] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9b6240]">
                             {event.mediaCount || 0} Media
                          </div>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={deletingEventId === event.id}
                     className={`transition-colors ${deletingEventId === event.id ? 'text-[#ff6a3d] animate-pulse' : 'text-[#b08f74] hover:text-[#c3482b]'}`}
                          >
                             {deletingEventId === event.id ? (
                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff6a3d] border-t-transparent" />
                             ) : (
                               <Trash2 className="w-4 h-4" />
                             )}
                          </button>
                       </div>
                       
                  <h3 className="mb-2 text-2xl font-black">{event.name}</h3>
                  <div className="mb-8 flex items-center gap-2 text-xs text-[#7d6350]">
                          <Clock className="w-3 h-3" /> Created {new Date(event.createdAt).toLocaleDateString()}
                       </div>

                  <div className="mb-8 rounded-2xl border border-[#ecd5bc] bg-[#fff6eb] p-6">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9e7c63]">Event Access Code</p>
                          <div className="flex items-center justify-between">
                      <span className="text-3xl font-black tracking-[0.38em] text-[#2a1d12]">{event.code}</span>
                             <button 
                                onClick={() => handleCopy(event.code)}
                        className="rounded-xl border border-[#e4ccb3] bg-white p-3 text-[#8f7157] transition-all hover:bg-[#fff1e2] hover:text-[#2a1d12]"
                             >
                        {copied === event.code ? <Check className="h-5 w-5 text-[#0f8c70]" /> : <Copy className="h-5 w-5" />}
                             </button>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e7c9ab] bg-[#fff8ef] py-4 text-xs font-bold text-[#5d4634] transition-all hover:bg-[#ffefe0]">
                             <input 
                               type="file" 
                               multiple 
                               accept="image/*" 
                               className="hidden" 
                               onChange={(e) => handleFileChange(e, event.id)}
                             />
                             <Upload className="w-4 h-4" /> Upload
                          </label>
                          <button 
                             onClick={() => {
                                const url = `${window.location.origin}/gallery/${event.code}`;
                                handleCopy(url);
                                alert('Gallery URL copied to clipboard!');
                             }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#e7c9ab] bg-[#fff8ef] py-4 text-xs font-bold text-[#5d4634] transition-all hover:bg-[#ffefe0]"
                          >
                             <QrCode className="w-4 h-4" /> Share
                          </button>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => window.location.href = `/worker/event/${event.id}`}
                 className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-[#ecd3b8] bg-[#fff4e8] py-4 text-[10px] font-bold uppercase tracking-widest text-[#7f6551] opacity-0 transition-all group-hover:opacity-100 hover:text-[#2a1d12]"
                    >
                        Manage Photos & Gallery
                    </button>
                 </motion.div>
              ))}
           </div>
        )}
      </main>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a1d12]/60 p-6 backdrop-blur-2xl">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-md rounded-[2rem] border border-[#ecd3b8] bg-white p-10 shadow-2xl"
             >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0df]">
                   <Plus className="h-7 w-7 text-[#ff6a3d]" />
                </div>
                <h2 className="mb-2 text-3xl font-black">New Event</h2>
                <p className="mb-10 text-sm text-[#6e5744]">Initialize a new event workspace for your photoshoot.</p>
                
                <form onSubmit={handleCreateEvent} className="space-y-8">
                   <div>
                      <label className="mb-2 block pl-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f7157]">Event Name</label>
                      <input 
                        required
                        autoFocus
                        type="text" 
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full rounded-2xl border border-[#e9d0b4] bg-[#fff9f2] px-6 py-5 text-lg text-[#2a1d12] transition-all placeholder:text-[#b4967e] focus:border-[#ff6a3d] focus:outline-none"
                        placeholder="e.g. Amit's Birthday"
                      />
                   </div>
                   <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="flex-1 rounded-2xl border border-[#e8cdb0] py-5 font-bold text-[#6f5744] transition-all hover:bg-[#fff1e2]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 rounded-2xl bg-[#1f1b16] py-5 font-bold text-[#fff9f2] transition-all hover:bg-[#ff6a3d] active:scale-95"
                      >
                        {uploading ? 'Creating...' : 'Create'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Sparkles, Download, User, X, Loader2, Search, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api-client';

interface Media {
  id: string;
  url: string;
}

interface MatchedMediaItem {
  id: string;
  url: string;
  confidence: number;
}

interface GalleryClientProps {
  eventCode: string;
  initialMedia: Media[];
}

export default function GalleryClient({ eventCode, initialMedia }: GalleryClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [matchedMedia, setMatchedMedia] = useState<MatchedMediaItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setSearchError(null);

    try {
      // Load face-api models with detailed logging
      try {
        console.debug('[models] Loading ssdMobilenetv1...');
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        console.debug('[models] ✓ ssdMobilenetv1 loaded');
        
        console.debug('[models] Loading faceLandmark68Net...');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        console.debug('[models] ✓ faceLandmark68Net loaded');

        console.debug('[models] Loading faceRecognitionNet...');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.debug('[models] ✓ faceRecognitionNet loaded');
        
        console.debug('[models] ✓ All models loaded successfully');
      } catch (err) {
        console.error('[models] Failed to load models', err);
        throw err;
      }

      const img = await faceapi.bufferToImage(file);
      const single = await faceapi
        .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!single || !single.descriptor) {
        setSearchError('Unable to extract face descriptor.');
        setLoading(false);
        return;
      }

      const descriptorArr = Array.from(single.descriptor as Float32Array);

      const res = await apiFetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventCode, descriptor: descriptorArr }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.message || 'Unable to search photos right now.');
        return;
      }

      const matches: MatchedMediaItem[] = Array.isArray(data.matches) ? data.matches : [];
      setMatchedMedia(matches);
      setHasSearched(true);
      setShowModal(false);

      setTimeout(() => {
        document.getElementById('matched-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Search error:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error);
      setSearchError(`Error while processing selfie: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="rounded-[2rem] border border-[#e7cdb0] bg-white/80 p-6 shadow-[0_16px_40px_rgba(97,65,37,0.08)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#fff3e6] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#a05e3b]">
              <Sparkles className="h-3.5 w-3.5" /> Coming Soon
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-[#2a1c12] md:text-3xl">Find My Photos is coming soon</h3>
            
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="group relative overflow-hidden rounded-full bg-[#d8c2aa] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#6b5544]"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                <Camera className="h-4 w-4" /> Find My Photos
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-[2rem] border border-[#f3d8bb] bg-[#fff8ef] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowModal(false)}
                aria-label="Close selfie upload modal"
                title="Close"
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6e6d4] transition-colors hover:bg-[#edd1b5]"
              >
                <X className="h-5 w-5 text-[#5f4a39]" />
              </button>

              <div className="text-center mb-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ffe9d5]">
                   <User className="h-10 w-10 text-[#ff6a3d]" />
                </div>
                <h2 className="mb-2 text-3xl font-black text-[#2a1c12]">Upload a Selfie</h2>
                <p className="text-[#6f5948]">Our AI will find all photos where you appear.</p>
              </div>

              <div className="space-y-4">
                {searchError && (
                  <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 mb-4">
                    {searchError}
                  </div>
                )}
                <label className="block">
                  <div className="relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleSelfieUpload}
                      className="hidden" 
                      disabled={loading}
                    />
                    <div className="rounded-3xl border-2 border-dashed border-[#e2c5a8] bg-white p-12 text-center transition-colors group-hover:border-[#ff6a3d]">
                      {loading ? (
                        <div className="flex flex-col items-center gap-4">
                           <Loader2 className="h-10 w-10 animate-spin text-[#ff6a3d]" />
                           <span className="font-semibold text-[#8d5838]">Analyzing face match...</span>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4e7] transition-transform group-hover:scale-110">
                             <Camera className="h-8 w-8 text-[#ff6a3d]" />
                          </div>
                          <span className="text-lg font-semibold text-[#2f2116]">Click to upload or take photo</span>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasSearched && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="matched-results" 
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe7d0]">
                  <CheckCircle2 className="h-6 w-6 text-[#ff6a3d]" />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-[#2a1c12]">Your Photos</h2>
                  <p className="text-[#685443]">We found {matchedMedia.length} matches in this collection.</p>
               </div>
               <button 
                 onClick={() => { setHasSearched(false); setMatchedMedia([]); }}
                 className="ml-auto text-sm font-semibold text-[#7f6652] transition hover:text-[#ff6a3d]"
               >
                 Clear Search
               </button>
            </div>

            {matchedMedia.length === 0 ? (
              <div className="rounded-[2rem] border border-[#ebcdb0] bg-white/80 py-16 text-center">
                 <p className="text-lg font-semibold text-[#6e5846]">No matches found. Try another selfie.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                 {matchedMedia.map((item, i) => (
                   <div key={`matched-${item.id || i}`} className="relative group break-inside-avoid overflow-hidden rounded-3xl border border-[#e9ceb4] bg-white shadow-[0_10px_30px_rgba(90,60,30,0.1)]">
                      <img 
                        src={item.url} 
                        alt="Matched Content" 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="rounded-full bg-[#ffefe0] px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-[#8e462f]">Perfect Match</div>
                               <span className="text-white/40 text-xs font-medium">{Math.round(item.confidence * 100)}% Match</span>
                            </div>
                             <button aria-label="Download matched photo" title="Download" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white text-white hover:text-black transition-all">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
              </div>
            )}
            
              <div className="border-t border-[#e9ceb4] pt-10">
                <h3 className="mb-8 text-center text-sm font-black uppercase tracking-[0.2em] text-[#8f6f57]">Remaining Event Collection</h3>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {initialMedia.map((item, i) => (
            <div key={`gallery-${item.id || i}`} className="relative group break-inside-avoid overflow-hidden rounded-3xl border border-[#e9ceb4] bg-white shadow-[0_10px_30px_rgba(90,60,30,0.1)]">
              <img 
                src={item.url} 
                alt="Gallery Content" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60 tracking-widest uppercase">HD Capture</span>
                      <button aria-label="Download gallery photo" title="Download" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white text-white hover:text-black transition-all">
                       <Download className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}

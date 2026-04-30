'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, ArrowRight, Keyboard, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

interface AccessEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessEventModal = ({ isOpen, onClose }: AccessEventModalProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  const QrScanner = dynamic(() => import('./QrScanner'), { ssr: false });

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    // In a real app, we might check if event exists first, 
    // but the gallery page will handle the "not found" state.
    router.push(`/gallery/${code}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2a1d12]/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-[#edd4bb] bg-[#fff9f2] shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-6 top-6 rounded-full p-2 text-[#8f7157] transition-colors hover:bg-[#fff1e2] hover:text-[#2a1d12]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-10 pt-12">
              <h2 className="mb-2 text-center text-3xl font-black text-[#2a1d12]">
                Access Your Event
              </h2>
              <p className="mb-8 text-center text-[#8f7157]">
                Enter your details to view the private gallery
              </p>

              <div className="space-y-6">
                {/* QR Section */}
                <div onClick={() => setShowScanner(true)} className="group cursor-pointer rounded-3xl border border-[#e7d4ba] bg-[#fff1e2] p-6 transition-all hover:border-[#ff6a3d] hover:bg-[#ffe8d6]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff6a3d]/10 transition-colors group-hover:bg-[#ff6a3d]/20">
                      <QrCode className="h-6 w-6 text-[#ff6a3d]" />
                    </div>
                    <div>
                      <p className="font-black text-[#2a1d12]">Scan QR Code</p>
                      <p className="text-xs text-[#8f7157]">Point your camera at the invite</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-[#c9a97f] transition-colors group-hover:text-[#ff6a3d]" />
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#e7d4ba]"></div>
                  <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-widest text-[#a77b5c]">
                    OR
                  </span>
                  <div className="flex-grow border-t border-[#e7d4ba]"></div>
                </div>

                {/* Event Code Section */}
                <form onSubmit={handleAccess} className="space-y-4">
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                         <Keyboard className="h-5 w-5 text-[#c9a97f]" />
                      </div>
                      <input 
                        type="text" 
                        maxLength={4}
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.replace(/\D/g, ''));
                            setError('');
                        }}
                        placeholder="Enter 4-Digit Code"
                        className="w-full rounded-2xl border border-[#e7d4ba] bg-white/50 py-5 pl-12 pr-4 text-center text-xl font-black tracking-[0.5em] text-[#2a1d12] placeholder:text-[#c9a97f] focus:border-[#ff6a3d] focus:outline-none transition-all"
                      />
                   </div>

                   {error && <p className="text-center text-xs font-bold text-red-500">{error}</p>}

                   <button 
                    disabled={loading}
                    type="submit"
                    className="flex w-full items-center justify-center rounded-2xl bg-[#1f1b16] py-5 text-lg font-black text-[#fff9f2] transition-all hover:bg-[#ff6a3d] active:scale-[0.98] disabled:opacity-50"
                   >
                     {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'View Gallery'}
                   </button>
                </form>
              </div>

              <p className="mt-8 text-center text-xs text-[#a77b5c]">
                Problems accessing? <button className="text-[#ff6a3d] hover:underline">Contact Support</button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
      {showScanner && <QrScanner onClose={() => setShowScanner(false)} />}
    </AnimatePresence>
  );
};

export default AccessEventModal;

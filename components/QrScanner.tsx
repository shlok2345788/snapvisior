"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface QrScannerProps {
  onClose: () => void;
}

export default function QrScanner({ onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API not supported in this browser.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!mounted) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.error("QrScanner getUserMedia error:", err);
        setError(err?.message || "Unable to access camera. Check permissions.");
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white">
        <button
          onClick={onClose}
          aria-label="Close scanner"
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-gray-700"
        >
          <X />
        </button>

        <div className="flex h-[70vh] items-center justify-center bg-black">
          {error ? (
            <div className="p-6 text-center text-white">
              <p className="mb-4 font-bold">{error}</p>
              <p className="text-sm">Please allow camera access or try a different browser.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
            />
          )}
        </div>
      </div>
    </div>
  );
}

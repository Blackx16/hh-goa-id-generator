"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export function WebcamModal({ isOpen, onClose, onCapture }: WebcamModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      return;
    }

    async function startCamera() {
      try {
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch {
        setError("Unable to access camera. Please check permissions or upload a file.");
      }
    }

    startCamera();
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = () => {
    if (!videoRef.current) return;
    soundFx.playShutter();
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      onCapture(canvas.toDataURL("image/jpeg", 0.95));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hhgoa-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-hhgoa-cream p-0 overflow-hidden"
        style={{ boxShadow: "8px 10px 0 rgba(0,0,0,0.3)", borderRadius: 0 }}
      >
        {/* Header bar — green */}
        <div className="bg-hhgoa-green px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-hhgoa-yellow" />
            <span className="font-body text-xs font-bold tracking-widest text-hhgoa-white uppercase">
              LIVE HACKER CAM · SNAPSHOT
            </span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="text-hhgoa-white/60 hover:text-hhgoa-yellow transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video */}
        <div
          className="relative aspect-video bg-hhgoa-black overflow-hidden flex items-center justify-center"
        >
          {error ? (
            <p className="p-4 text-center font-body text-xs text-hhgoa-pink font-bold uppercase">
              {error}
            </p>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Corner guides — yellow */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-hhgoa-yellow" />
                <div className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-hhgoa-yellow" />
                <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-hhgoa-yellow" />
                <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-hhgoa-yellow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-hhgoa-yellow/50" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 flex items-center gap-3 bg-hhgoa-cream border-t border-hhgoa-black/10">
          <button
            type="button"
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-2 font-body text-xs font-bold uppercase text-hhgoa-black/50 hover:text-hhgoa-black border border-hhgoa-black/20 transition-colors"
            style={{ borderRadius: 0 }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleCapture}
            disabled={!!error}
            className="btn-primary flex-1 justify-center disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
            CAPTURE PHOTO
          </button>
        </div>
      </div>
    </div>
  );
}

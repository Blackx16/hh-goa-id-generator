"use client";

import React, { useRef, useState } from "react";
import { ImageTransform } from "@/types/generator";
import { SAMPLE_AVATARS } from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { processImageFile } from "@/lib/heic-converter";
import { WebcamModal } from "./WebcamModal";
import {
  UploadCloud, Camera, RotateCw, Maximize2, ZoomIn, ZoomOut, Move, Trash2,
} from "lucide-react";

interface ImageUploaderProps {
  imageSrc: string | null;
  onImageChange: (src: string | null) => void;
  transform: ImageTransform;
  onTransformChange: (transform: ImageTransform) => void;
}

export function ImageUploader({
  imageSrc,
  onImageChange,
  transform,
  onTransformChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      soundFx.playShutter();
      const dataUrl = await processImageFile(file);
      onImageChange(dataUrl);
      onTransformChange({ zoom: 1, panX: 0, panY: 0, rotate: 0 });
    } catch (err) {
      console.error("Failed to process image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleRotate = () => {
    soundFx.playClick();
    onTransformChange({ ...transform, rotate: (transform.rotate + 90) % 360 });
  };

  const handleReset = () => {
    soundFx.playClick();
    onTransformChange({ zoom: 1, panX: 0, panY: 0, rotate: 0 });
  };

  return (
    <div className="hhgoa-card p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-hhgoa-black/10 pb-3">
        <div className="flex items-center gap-2 font-heading font-bold text-hhgoa-black text-sm uppercase tracking-wide">
          <UploadCloud className="h-4 w-4 text-hhgoa-green shrink-0" />
          PHOTO UPLOAD
        </div>
        {imageSrc && (
          <button
            type="button"
            onClick={() => { soundFx.playClick(); onImageChange(null); }}
            className="flex items-center gap-1 font-body text-[11px] font-bold uppercase text-hhgoa-pink hover:opacity-75 transition-opacity"
          >
            <Trash2 className="h-3 w-3" />
            CLEAR
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      {/* Drop zone / Controls */}
      {!imageSrc ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => { soundFx.playClick(); fileInputRef.current?.click(); }}
          className={`cursor-pointer border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-hhgoa-green bg-hhgoa-green/10 scale-[0.99]"
              : "border-hhgoa-black/25 hover:border-hhgoa-green bg-hhgoa-cream/50"
          }`}
          style={{ borderRadius: 0 }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="h-6 w-6 border-2 border-hhgoa-green border-t-transparent rounded-full animate-spin"
              />
              <span className="font-body text-xs font-bold text-hhgoa-green uppercase tracking-wider">
                PROCESSING IMAGE...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-12 w-12 flex items-center justify-center bg-hhgoa-green text-hhgoa-white"
                style={{ borderRadius: 0 }}
              >
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="font-body text-sm font-bold text-hhgoa-black uppercase">
                  <span className="text-hhgoa-green">CLICK TO UPLOAD</span>
                  {" "}or drag &amp; drop
                </p>
                <p className="font-body text-[11px] text-hhgoa-black/45 mt-1">
                  JPG, PNG, WebP, or iPhone HEIC supported
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Controls */
        <div className="space-y-3 p-3 bg-hhgoa-green/8 border border-hhgoa-black/10">
          {/* Zoom */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-body text-[11px] font-bold text-hhgoa-black/60 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ZoomIn className="h-3 w-3 text-hhgoa-green" />
                ZOOM LEVEL
              </span>
              <span className="text-hhgoa-green">{transform.zoom.toFixed(2)}×</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTransformChange({ ...transform, zoom: Math.max(0.5, transform.zoom - 0.1) })}
                className="p-1 bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/60 hover:text-hhgoa-green transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <input
                type="range" min="0.5" max="3" step="0.05"
                value={transform.zoom}
                onChange={(e) => onTransformChange({ ...transform, zoom: parseFloat(e.target.value) })}
                className="flex-1 h-1.5 bg-hhgoa-black/15 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => onTransformChange({ ...transform, zoom: Math.min(3, transform.zoom + 0.1) })}
                className="p-1 bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/60 hover:text-hhgoa-green transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick transform buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "ROTATE 90°", icon: <RotateCw className="h-3.5 w-3.5" />, action: handleRotate },
              { label: "AUTO-FIT",  icon: <Maximize2 className="h-3.5 w-3.5" />, action: handleReset },
              { label: "REPLACE",   icon: <UploadCloud className="h-3.5 w-3.5" />, action: () => { soundFx.playClick(); fileInputRef.current?.click(); } },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                className="py-1.5 px-2 font-body text-[11px] font-bold uppercase tracking-wider bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/60 hover:text-hhgoa-green hover:border-hhgoa-green flex items-center justify-center gap-1.5 transition-all"
                style={{ borderRadius: 0 }}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-body text-[10px] text-hhgoa-black/45 uppercase tracking-wider">
            <Move className="h-3 w-3 text-hhgoa-green shrink-0" />
            Click &amp; drag on the preview to pan your photo
          </div>
        </div>
      )}

      {/* Webcam + Sample Avatars */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="section-label text-hhgoa-green text-[10px]">QUICK INPUT OR DEMO</span>
          <button
            type="button"
            onClick={() => { soundFx.playClick(); setIsWebcamOpen(true); }}
            className="flex items-center gap-1 font-body text-[11px] font-bold uppercase text-hhgoa-pink hover:opacity-75 transition-opacity"
          >
            <Camera className="h-3 w-3" />
            USE WEBCAM
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_AVATARS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { soundFx.playShutter(); onImageChange(sample.url); onTransformChange({ zoom: 1, panX: 0, panY: 0, rotate: 0 }); }}
              className="group relative aspect-square overflow-hidden border-2 border-transparent hover:border-hhgoa-yellow transition-all"
              style={{ borderRadius: 0, boxShadow: "3px 4px 0 rgba(0,0,0,0.15)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.url}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-1">
                <span className="font-body text-[9px] font-bold text-white truncate w-full uppercase">
                  {sample.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={(dataUrl) => {
          onImageChange(dataUrl);
          onTransformChange({ zoom: 1, panX: 0, panY: 0, rotate: 0 });
        }}
      />
    </div>
  );
}

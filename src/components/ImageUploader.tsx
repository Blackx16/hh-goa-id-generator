"use client";

import React, { useRef, useState, useEffect } from "react";
import { ImageTransform, GeneratorMode } from "@/types/generator";
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
  mode?: GeneratorMode;
}

export function ImageUploader({
  imageSrc,
  onImageChange,
  transform,
  onTransformChange,
  mode,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number, h: number } | null>(null);

  useEffect(() => {
    if (!imageSrc) {
      setDimensions(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => setDimensions({ w: img.width, h: img.height });
    img.src = imageSrc;
  }, [imageSrc]);

  const isPortrait = dimensions ? dimensions.h > dimensions.w : false;

  useEffect(() => {
    if (!dragStart) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const dx = (clientX - dragStart.x) / transform.zoom;
      const dy = (clientY - dragStart.y) / transform.zoom;

      onTransformChange({
        ...transform,
        panX: transform.panX + dx,
        panY: transform.panY + dy,
      });

      setDragStart({ x: clientX, y: clientY });
    };

    const handleMouseUp = () => setDragStart(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragStart, transform, onTransformChange]);

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
    <div className="hhgoa-card p-5 space-y-4 bg-upload-card">

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
          className={`cursor-pointer border-2 border-dashed p-8 text-center transition-all ${isDragging
              ? "border-hhgoa-green bg-hhgoa-green/10 scale-[0.99]"
              : "border-hhgoa-black/25 hover:border-hhgoa-green bg-[var(--upload-card-bg)]"
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
        <div className="flex flex-col sm:flex-row gap-4 p-3 bg-[var(--upload-card-bg)] border border-hhgoa-black/10 items-center sm:items-start">

          {/* Hide preview circle if in PFP mode (to avoid double preview) */}
          {mode !== "pfp" && (
            <div className="relative flex items-center justify-center shrink-0" style={{ width: "220px", height: "220px" }}>

              {/* Profile Picture Container SVG (Background) */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/profile_picture_container.svg`}
                alt="Profile Container Decoration"
                className="absolute"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Draggable Preview Circle */}
              <div
                className="relative shrink-0 flex flex-col items-center justify-center bg-black cursor-move"
                style={{
                  width: "150px",
                  height: "150px",
                  touchAction: "none",
                  borderRadius: "100%",
                  overflow: "hidden",
                  zIndex: 1,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDragStart({ x: e.clientX, y: e.clientY });
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                }}
              >
                {/* The SQUARE inside the circle */}
                <div
                  style={{
                    width: "145px",
                    height: "145px",
                    border: "4px solid #FFFFFF",
                    overflow: "hidden",
                    position: "relative",
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="absolute pointer-events-none select-none max-w-none"
                    draggable={false}
                    style={{
                      width: isPortrait ? "100%" : "auto",
                      height: isPortrait ? "auto" : "100%",
                      objectFit: "cover",
                      transform: `translate(${transform.panX}px, ${transform.panY}px) scale(${transform.zoom}) rotate(${transform.rotate}deg)`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 flex-1 w-full">
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
                { label: "AUTO-FIT", icon: <Maximize2 className="h-3.5 w-3.5" />, action: handleReset },
                { label: "REPLACE", icon: <UploadCloud className="h-3.5 w-3.5" />, action: () => { soundFx.playClick(); fileInputRef.current?.click(); } },
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
              Click &amp; drag on the preview circle to pan your photo
            </div>
          </div>
        </div>
      )}

      {/* Webcam */}
      <div className="pt-2 border-t border-hhgoa-black/10">
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setIsWebcamOpen(true); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-body text-xs font-bold uppercase text-hhgoa-pink hover:bg-hhgoa-pink/10 transition-colors border border-hhgoa-pink/30"
          style={{ borderRadius: 0 }}
        >
          <Camera className="h-4 w-4" />
          USE WEBCAM TO TAKE PHOTO
        </button>
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

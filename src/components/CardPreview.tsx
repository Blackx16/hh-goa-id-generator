"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageTransform, UserData } from "@/types/generator";
import { THEMES, HH_GOA_CONFIG } from "@/lib/constants";
import { renderGraphicToCanvas } from "@/lib/canvas-renderer";
import { soundFx } from "@/lib/sound-effects";
import confetti from "canvas-confetti";
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Move,
  Maximize,
} from "lucide-react";

interface CardPreviewProps {
  userData: UserData;
  imageSrc: string | null;
  transform: ImageTransform;
  onTransformChange: (t: ImageTransform) => void;
}

export function CardPreview({
  userData,
  imageSrc,
  transform,
  onTransformChange,
}: CardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Drag Panning State on Canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const theme = THEMES[userData.theme] || THEMES.cyan;

  // Load Image Object
  useEffect(() => {
    if (!imageSrc) {
      setImageElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => setImageElement(img);
    img.onerror = () => {
      console.warn("Could not load image element");
      setImageElement(null);
    };
  }, [imageSrc]);

  // Live Canvas Render
  useEffect(() => {
    if (!canvasRef.current) return;
    renderGraphicToCanvas(canvasRef.current, {
      userData,
      imageElement,
      transform,
      scale: 1, // standard preview scale
    });
  }, [userData, imageElement, transform]);

  // 3D Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setIsDragging(false);
  };

  // Direct Canvas Drag to Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageElement) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: transform.panX,
      panY: transform.panY,
    };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageElement) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    onTransformChange({
      ...transform,
      panX: dragStartRef.current.panX + dx,
      panY: dragStartRef.current.panY + dy,
    });
  };

  // Touch Support for Mobile Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageElement || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      panX: transform.panX,
      panY: transform.panY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageElement || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    onTransformChange({
      ...transform,
      panX: dragStartRef.current.panX + dx,
      panY: dragStartRef.current.panY + dy,
    });
  };

  // Mouse Wheel Zoom on Canvas
  const handleWheel = (e: React.WheelEvent) => {
    if (!imageElement) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newZoom = Math.min(3, Math.max(0.5, transform.zoom + delta));
    onTransformChange({
      ...transform,
      zoom: newZoom,
    });
  };

  // 1-Click High-Res PNG Download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      soundFx.playShutter();

      // Create offscreen canvas rendered at 2x high resolution
      const exportCanvas = document.createElement("canvas");
      await renderGraphicToCanvas(exportCanvas, {
        userData,
        imageElement,
        transform,
        scale: 2, // crisp export
      });

      const cleanName = (userData.name.trim() || "Hacker").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `HHGoa2026_${userData.mode === "pfp" ? "PFP" : "Badge"}_${cleanName}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: [theme.primary, "#ffffff", "#38bdf8", "#ffaa00"],
      });

      soundFx.playSuccess();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      soundFx.playClick();
      const exportCanvas = document.createElement("canvas");
      await renderGraphicToCanvas(exportCanvas, {
        userData,
        imageElement,
        transform,
        scale: 2,
      });

      exportCanvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      });
    } catch (err) {
      console.warn("Clipboard copy failed, downloading instead:", err);
      handleDownload();
    }
  };

  // 1-Click Share to X (Twitter Intent)
  const handleShareToX = () => {
    soundFx.playClick();

    const name = userData.name.trim() || "Anonymous Hacker";
    const role = userData.role;
    const builderClass = userData.builderClass || "Ship or Die Specialist";
    const team = userData.isTeam && userData.teamName.trim() ? `Team: ${userData.teamName.trim()}` : "Solo Hacker";

    const tweetText = `Locked in for Hacker House Goa 2026! 🌊🌴\n\n👤 ${name}\n🚀 ${builderClass} | ${role}\n⚡ ${team}\n\nGenerated my official badge with #FrameInGoa 👇\n`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent("https://hhgoa.com/")}&hashtags=${encodeURIComponent(
      "FrameInGoa,HackerHouseGoa,HHGoa2026"
    )}`;

    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className="flex flex-col items-center space-y-5">
      {/* 3D Interactive Tilt Card Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative holo-card-container cursor-grab active:cursor-grabbing select-none"
        style={{
          perspective: 1200,
        }}
      >
        <div
          className="relative holo-card-inner rounded-3xl overflow-hidden shadow-2xl transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
              isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
            }`,
          }}
        >
          {/* Main Canvas Display */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleCanvasMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            className={`w-full max-w-[380px] sm:max-w-[420px] h-auto block rounded-2xl border ${
              userData.theme === "amber"
                ? "border-amber-500/60 shadow-[0_0_30px_rgba(255,170,0,0.3)]"
                : userData.theme === "green"
                ? "border-emerald-500/60 shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                : userData.theme === "purple"
                ? "border-purple-500/60 shadow-[0_0_30px_rgba(217,70,239,0.3)]"
                : "border-cyan-500/60 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            }`}
          />

          {/* Holographic Glare Overlay */}
          <div
            className="holo-glare"
            style={
              {
                "--mouse-x": `${glarePos.x}%`,
                "--mouse-y": `${glarePos.y}%`,
                "--glare-opacity": isHovered ? 0.8 : 0,
              } as React.CSSProperties
            }
          />
        </div>

        {/* Floating Pan Indicator */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-950/90 border border-zinc-700/80 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
          <Move className="h-3 w-3 text-cyan-400" />
          <span>DRAG CANVAS TO PAN · SCROLL TO ZOOM</span>
        </div>
      </div>

      {/* Primary Export & Share Action Buttons */}
      <div className="w-full max-w-md space-y-3 pt-2">
        {/* Main 1-Click Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500 text-black font-mono font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {downloading ? (
            <>
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>EXPORTING HIGH-RES PNG...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>DOWNLOAD HIGH-RES GRAPHIC (PNG)</span>
            </>
          )}
        </button>

        {/* Share to X & Copy Image Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleShareToX}
            className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group"
          >
            <Share2 className="h-4 w-4 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
            <span>SHARE TO X (#FrameInGoa)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-400 hover:bg-cyan-950/20 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>COPY IMAGE</span>
              </>
            )}
          </button>
        </div>

        {/* Requirements Banner Reminder */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 text-center space-y-1">
          <p className="text-zinc-300">
            ⚠ <span className="text-amber-400 font-bold">Important:</span> Include{" "}
            <span className="text-cyan-400 font-semibold">#FrameInGoa</span> when posting on X for official shortlisting validation!
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { HH_GOA_CONFIG } from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { ExternalLink } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-hhgoa-green/95 backdrop-blur-sm border-b border-hhgoa-yellow/20"
          : "bg-transparent"
      }`}
    >
      {/* Top Ticker Bar (Commented out per user request) */}
      {/* 
      <div className="bg-black/30 border-b border-hhgoa-yellow/15 overflow-hidden">
        <div className="marquee-track py-1.5 text-[11px] font-body font-semibold text-hhgoa-yellow tracking-widest uppercase select-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 shrink-0">
              ✦ HACKER HOUSE GOA 2026 &nbsp;·&nbsp; OCT 28–31 &nbsp;·&nbsp; GOA, INDIA &nbsp;·&nbsp; #FrameInGoa &nbsp;·&nbsp; LESS NOISE. MORE SIGNAL
            </span>
          ))}
        </div>
      </div>
      */}

      {/* Main Nav Bar */}
      <div className="max-w-[1060px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center text-hhgoa-yellow hover:text-hhgoa-yellow/80 transition-colors"
            title="Back to Landing"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M19 12H5M12 19l-7-7 7-7"/>
             </svg>
          </button>
          
          <a
            href={HH_GOA_CONFIG.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
          >
            <div className="font-heading font-black text-hhgoa-white text-lg leading-none uppercase tracking-wide hidden sm:block pt-1">
              247PM STUDIO
            </div>
          </a>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-3">
          <a
            href={HH_GOA_CONFIG.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs font-semibold text-hhgoa-white/80 hover:text-hhgoa-white uppercase tracking-wider transition-colors"
          >
            <span className="live-dot" />
            hhgoa.com
          </a>

          <a
            href={HH_GOA_CONFIG.devfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="btn-primary relative overflow-hidden flex flex-col items-center justify-center text-xs"
            style={{ padding: "12px 24px" }}
          >
            {/* Top Border Decoration */}
            <img 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/border-decorations-1.svg`} 
              alt="" 
              className="absolute top-0 left-0 w-full"
              style={{ height: "4px", objectFit: "cover", opacity: 0.8 }}
              draggable={false}
            />
            
            <div className="flex items-center gap-1.5 z-10 relative">
              APPLY
              <ExternalLink className="h-3 w-3" />
            </div>

            {/* Bottom Border Decoration */}
            <img 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/border-decorations-1.svg`} 
              alt="" 
              className="absolute bottom-0 left-0 w-full"
              style={{ height: "4px", objectFit: "cover", transform: "scaleY(-1)", opacity: 0.8 }} 
              draggable={false}
            />
          </a>
        </div>
      </div>
    </header>
  );
}

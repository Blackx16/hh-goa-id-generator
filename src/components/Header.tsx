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

        {/* Brand — left */}
        <a
          href={HH_GOA_CONFIG.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
        >
          {/* Hacker House Logo */}
          <div className="h-10 flex items-center justify-center rounded-full overflow-hidden border border-hhgoa-yellow/20 bg-hhgoa-black p-1">
            <img 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/hacker-house.png`} 
              alt="Hacker House" 
              className="h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-heading font-black text-hhgoa-white text-lg leading-none uppercase tracking-wide">
              HACKER HOUSE
            </div>
            <div className="section-label mt-0.5 text-hhgoa-yellow/80" style={{ fontSize: "10px" }}>
              GOA 2026 · FRAME GENERATOR
            </div>
          </div>
        </a>

        {/* Right nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="hidden sm:inline-flex btn-pill text-[10px] px-3 py-1.5"
          >
            BACK TO LANDING
          </button>

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
            className="btn-primary text-xs"
          >
            APPLY
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

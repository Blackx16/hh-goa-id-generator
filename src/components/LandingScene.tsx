"use client";

import React, { useEffect, useState, useCallback } from "react";
import { HH_GOA_CONFIG } from "@/lib/constants";
import { ExternalLink } from "lucide-react";

const SESSION_KEY = "hh_goa_landing_seen";

/* ═════════════════════════════════════════
   Inline SVG sub-components for the scene
═════════════════════════════════════════ */

function SunSvg() {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun rays */}
      {[...Array(9)].map((_, i) => {
        const angle = (Math.PI / 8) * (i - 4);
        const x1 = 80 + Math.sin(angle) * 55;
        const y1 = 90 - Math.cos(angle) * 55;
        const x2 = 80 + Math.sin(angle) * 75;
        const y2 = 90 - Math.cos(angle) * 75;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#FEE101" strokeWidth="2" strokeLinecap="round"
          />
        );
      })}
      {/* Sun body (half circle) */}
      <path d="M 30 90 A 50 50 0 0 1 130 90" fill="#FEE101" />
      {/* Sun reflection shimmer */}
      <rect x="70" y="85" width="20" height="3" rx="1.5" fill="#FEE101" opacity="0.7" />
      <rect x="60" y="82" width="10" height="2" rx="1" fill="#FEE101" opacity="0.4" />
      <rect x="90" y="82" width="12" height="2" rx="1" fill="#FEE101" opacity="0.4" />
    </svg>
  );
}

function WavesSvg() {
  return (
    <svg style={{ width: "var(--landing-wave-width, 100%)", overflow: "visible" }} height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wave layer 1 — darker green */}
      <path
        className="landing-wave landing-wave-1"
        d="M-2880,60 C-2760,30 -2640,90 -2520,60 C-2400,30 -2280,90 -2160,60 C-2040,30 -1920,90 -1800,60 C-1680,30 -1560,90 -1440,60 C-1320,30 -1200,90 -1080,60 C-960,30 -840,90 -720,60 C-600,30 -480,90 -360,60 C-240,30 -120,90 0,60 C120,30 240,90 360,60 C480,30 600,90 720,60 C840,30 960,90 1080,60 C1200,30 1320,90 1440,60 C1560,30 1680,90 1800,60 C1920,30 2040,90 2160,60 C2280,30 2400,90 2520,60 C2640,30 2760,90 2880,60 C3000,30 3120,90 3240,60 C3360,30 3480,90 3600,60 C3720,30 3840,90 3960,60 C4080,30 4200,90 4320,60 C4440,30 4560,90 4680,60 C4800,30 4920,90 5040,60 C5160,30 5280,90 5400,60 C5520,30 5640,90 5760,60 C5880,30 6000,90 6120,60 C6240,30 6360,90 6480,60 C6600,30 6720,90 6840,60 C6960,30 7080,90 7200,60 C7320,30 7440,90 7560,60 C7680,30 7800,90 7920,60 C8040,30 8160,90 8280,60 C8400,30 8520,90 8640,60 C8760,30 8880,90 9000,60 C9120,30 9240,90 9360,60 C9480,30 9600,90 9720,60 C9840,30 9960,90 10080,60 C10200,30 10320,90 10440,60 C10560,30 10680,90 10800,60 C10920,30 11040,90 11160,60 C11280,30 11400,90 11520,60 C11640,30 11760,90 11880,60 C12000,30 12120,90 12240,60 C12360,30 12480,90 12600,60 C12720,30 12840,90 12960,60 C13080,30 13200,90 13320,60 C13440,30 13560,90 13680,60 C13800,30 13920,90 14040,60 C14160,30 14280,90 14400,60 L14400,120 L-2880,120 Z"
        fill="rgba(8, 80, 42, 0.7)"
      />
      {/* Wave layer 2 — lighter with white */}
      <path
        className="landing-wave landing-wave-2"
        d="M-2880,75 C-2760,50 -2640,100 -2520,75 C-2400,50 -2280,100 -2160,75 C-2040,50 -1920,100 -1800,75 C-1680,50 -1560,100 -1440,75 C-1320,50 -1200,100 -1080,75 C-960,50 -840,100 -720,75 C-600,50 -480,100 -360,75 C-240,50 -120,100 0,75 C120,50 240,100 360,75 C480,50 600,100 720,75 C840,50 960,100 1080,75 C1200,50 1320,100 1440,75 C1560,50 1680,100 1800,75 C1920,50 2040,100 2160,75 C2280,50 2400,100 2520,75 C2640,50 2760,100 2880,75 C3000,50 3120,100 3240,75 C3360,50 3480,100 3600,75 C3720,50 3840,100 3960,75 C4080,50 4200,100 4320,75 C4440,50 4560,100 4680,75 C4800,50 4920,100 5040,75 C5160,50 5280,100 5400,75 C5520,50 5640,100 5760,75 C5880,50 6000,100 6120,75 C6240,50 6360,100 6480,75 C6600,50 6720,100 6840,75 C6960,50 7080,100 7200,75 C7320,50 7440,100 7560,75 C7680,50 7800,100 7920,75 C8040,50 8160,100 8280,75 C8400,50 8520,100 8640,75 C8760,50 8880,100 9000,75 C9120,50 9240,100 9360,75 C9480,50 9600,100 9720,75 C9840,50 9960,100 10080,75 C10200,50 10320,100 10440,75 C10560,50 10680,100 10800,75 C10920,50 11040,100 11160,75 C11280,50 11400,100 11520,75 C11640,50 11760,100 11880,75 C12000,50 12120,100 12240,75 C12360,50 12480,100 12600,75 C12720,50 12840,100 12960,75 C13080,50 13200,100 13320,75 C13440,50 13560,100 13680,75 C13800,50 13920,100 14040,75 C14160,50 14280,100 14400,75 L14400,120 L-2880,120 Z"
        fill="url(#glisten-gradient)"
      />
      <defs>
        <linearGradient id="glisten-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="25%" stopColor="#FEE101" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="75%" stopColor="#FEE101" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Wave crests — white squiggles */}
      <path
        d="M200,65 Q220,55 240,65 Q260,75 280,65"
        fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"
      />
      <path
        d="M600,58 Q620,48 640,58 Q660,68 680,58"
        fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"
      />
      <path
        d="M1000,62 Q1020,52 1040,62 Q1060,72 1080,62"
        fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"
      />
    </svg>
  );
}

function BoatSvg() {
  return (
    <svg viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hull */}
      <path d="M4 20 L8 26 L28 26 L32 20 Z" fill="white" stroke="white" strokeWidth="1" />
      {/* Mast */}
      <line x1="18" y1="4" x2="18" y2="20" stroke="white" strokeWidth="1.5" />
      {/* Sail */}
      <path d="M18 4 L18 18 L8 18 Z" fill="#0b6839" stroke="white" strokeWidth="0.5" />
      <path d="M19 6 L19 18 L26 18 Z" fill="#0b6839" stroke="white" strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}

function BirdsSvg({ count = 3 }: { count?: number }) {
  const birds = [];
  for (let i = 0; i < count; i++) {
    const x = 8 + i * 18;
    const y = 6 + (i % 2) * 8;
    birds.push(
      <path
        key={i}
        d={`M${x},${y} Q${x + 4},${y - 4} ${x + 8},${y} M${x + 8},${y} Q${x + 12},${y - 4} ${x + 16},${y}`}
        fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"
      />
    );
  }
  return (
    <svg width={count * 18 + 16} height={30} viewBox={`0 0 ${count * 18 + 16} 30`} xmlns="http://www.w3.org/2000/svg">
      {birds}
    </svg>
  );
}

/* ═════════════════════════════════════════
   Main LandingScene Component
═════════════════════════════════════════ */

interface LandingSceneProps {
  onEnter: () => void;
}

export function LandingScene({ onEnter }: LandingSceneProps) {
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Kick off the animation sequence
  useEffect(() => {
    // Brief loading state, then start animations
    const loadTimer = setTimeout(() => {
      setLoading(false);
      setAnimating(true);
    }, 300);

    return () => clearTimeout(loadTimer);
  }, []);

  const handleEnter = useCallback(() => {
    if (exiting) return;
    setExiting(true);

    // Mark as seen in this session
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {}

    // Wait for the exit animation to finish, then call onEnter
    setTimeout(() => {
      onEnter();
    }, 750);
  }, [exiting, onEnter]);

  // Build class helper
  const cls = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

  return (
    <div className={cls("landing-overlay", exiting && "exiting")}>
      {/* Loading spinner */}
      <div className={cls("landing-loader", !loading && "hidden")}>
        <div className="landing-spinner" />
      </div>

      {/* Scene */}
      <div className="landing-scene">
        {/* ── Birds ── */}
        <div className={cls(
          "landing-birds landing-birds-1",
          animating && !exiting && "floating",
          animating && exiting && "animate",
          exiting && "landing-exit-fade exiting"
        )}>
          <BirdsSvg count={3} />
        </div>
        <div className={cls(
          "landing-birds landing-birds-2",
          animating && !exiting && "floating",
          exiting && "landing-exit-fade exiting"
        )}>
          <BirdsSvg count={2} />
        </div>

        {/* ── Sun ── */}
        <div className={cls(
          "landing-sun",
          animating && "animate",
          exiting && "landing-exit-fade exiting"
        )}>
          <SunSvg />
        </div>

        {/* ── Center content (logos + buttons) ── */}
        <div className={cls("landing-logo-container landing-exit-up", exiting && "exiting")}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/hacker-house.png`}
            alt="Hacker House"
            className={cls(
              "landing-hh-logo",
              animating && "animate"
            )}
            draggable={false}
          />
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/goa-hindi.svg`}
            alt="गोवा Goa"
            className={cls(
              "landing-goa-logo",
              animating && !exiting && "oscillating",
              animating && exiting && "animate"
            )}
            draggable={false}
          />
        </div>

        {/* Event info pills */}
        <div className={cls(
          "landing-info landing-exit-up",
          animating && "animate",
          exiting && "exiting"
        )}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {["OCT 28–31, 2026", "GOA, INDIA", "247 BUILDERS"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "4px 12px",
                  fontFamily: "'Victor Mono', monospace",
                  fontWeight: 700,
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#000",
                  backgroundColor: "#fee101",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={cls(
          "landing-buttons landing-exit-up",
          animating && "animate",
          exiting && "exiting"
        )}>
          <button
            className="btn-primary"
            onClick={handleEnter}
            style={{ fontSize: "14px", padding: "12px 28px" }}
          >
            BUILD YOUR ID →
          </button>
          <a
            href={HH_GOA_CONFIG.devfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
            style={{ fontSize: "12px", padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            APPLY
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* ── Trees ── */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/trees_left.svg?v=2`}
          alt=""
          className={cls(
            "landing-trees-left",
            animating && !exiting && "swaying",
            animating && exiting && "animate",
            exiting && "landing-exit-fade exiting"
          )}
          draggable={false}
          style={{ objectFit: "contain", objectPosition: "bottom left" }}
        />
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/trees_right.svg?v=2`}
          alt=""
          className={cls(
            "landing-trees-right",
            animating && !exiting && "swaying",
            animating && exiting && "animate",
            exiting && "landing-exit-fade exiting"
          )}
          draggable={false}
          style={{ objectFit: "contain", objectPosition: "bottom right" }}
        />

        {/* ── Sea & Waves ── */}
        <div className={cls(
          "landing-sea",
          animating && "animate",
          exiting && "landing-exit-fade exiting"
        )}>
          <WavesSvg />
        </div>

        {/* ── Boat ── */}
        <div className={cls(
          "landing-boat",
          animating && !exiting && "bobbing",
          animating && exiting && "animate",
          exiting && "landing-exit-fade exiting"
        )}>
          <BoatSvg />
        </div>
      </div>
    </div>
  );
}

/**
 * Check if the landing animation has already been seen in this session.
 */
export function hasSeenLanding(): boolean {
  return false;
}

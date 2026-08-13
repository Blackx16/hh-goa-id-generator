"use client";

import React from "react";
import { GeneratorMode, PfpStyle } from "@/types/generator";
import { soundFx } from "@/lib/sound-effects";
import { BadgeCheck, UserCircle } from "lucide-react";

interface ModeSelectorProps {
  mode: GeneratorMode;
  onModeChange: (mode: GeneratorMode) => void;
  pfpStyle: PfpStyle;
  onPfpStyleChange: (style: PfpStyle) => void;
}

export function ModeSelector({
  mode,
  onModeChange,
  pfpStyle,
  onPfpStyleChange,
}: ModeSelectorProps) {
  const handleMode = (newMode: GeneratorMode) => {
    soundFx.playModeSwitch();
    onModeChange(newMode);
  };



  const handlePfpStyle = (newStyle: PfpStyle) => {
    soundFx.playClick();
    onPfpStyleChange(newStyle);
  };

  return (
    <div className="space-y-4">

      {/* Section header */}
      <div className="section-label text-hhgoa-green">FORMAT & THEME</div>

      {/* Format Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1" style={{
        background: "#0b6839",
        borderRadius: 0,
      }}>
        {[
          { id: "pfp"   as GeneratorMode, label: "FORMAT A: PFP FRAME",  Icon: UserCircle },
          { id: "badge" as GeneratorMode, label: "FORMAT B: BUILDER ID", Icon: BadgeCheck },
        ].map(({ id, label, Icon }) => {
          const isActive = mode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleMode(id)}
              className={`relative overflow-hidden flex flex-col items-center justify-center py-3 px-3 font-body text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-hhgoa-yellow text-hhgoa-black"
                  : "text-hhgoa-white/70 hover:text-hhgoa-white bg-transparent"
              }`}
              style={{ borderRadius: 0 }}
            >
              {isActive && (
                <img 
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/border-decorations-1.svg`} 
                  alt="" 
                  className="absolute top-0 left-0 w-full"
                  style={{ height: "4px", objectFit: "cover", opacity: 0.8 }}
                  draggable={false}
                />
              )}
              
              <div className="flex items-center gap-2 z-10 relative">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{id === "badge" ? "BADGE" : "PFP"}</span>
              </div>

              {isActive && (
                <img 
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landing/border-decorations-1.svg`} 
                  alt="" 
                  className="absolute bottom-0 left-0 w-full"
                  style={{ height: "4px", objectFit: "cover", transform: "scaleY(-1)", opacity: 0.8 }} 
                  draggable={false}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* PFP Style (badge mode only) */}
      {mode === "pfp" && (
        <div className="hhgoa-card p-4 space-y-3" style={{ animation: "fadeIn 0.25s ease" }}>
          <div className="section-label text-hhgoa-green">PFP OVERLAY FRAME STYLE</div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "cyber-ring",        label: "Cyber Ring" },
              { id: "hexagon-shield",    label: "Hexagon" },
              { id: "terminal-minimal",  label: "Terminal" },
              { id: "holographic-wave",  label: "Holo Wave" },
            ].map((st) => {
              const isSelected = pfpStyle === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handlePfpStyle(st.id as PfpStyle)}
                  className={`py-2 px-2 font-body text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? "bg-hhgoa-green text-hhgoa-white"
                      : "bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/60 hover:text-hhgoa-black"
                  }`}
                  style={{
                    borderRadius: 0,
                    boxShadow: isSelected ? "3px 4px 0 rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

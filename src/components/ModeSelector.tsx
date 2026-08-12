"use client";

import React from "react";
import { GeneratorMode, PfpStyle, ThemeColor } from "@/types/generator";
import { THEMES } from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { BadgeCheck, UserCircle } from "lucide-react";

interface ModeSelectorProps {
  mode: GeneratorMode;
  onModeChange: (mode: GeneratorMode) => void;
  theme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  pfpStyle: PfpStyle;
  onPfpStyleChange: (style: PfpStyle) => void;
}

export function ModeSelector({
  mode,
  onModeChange,
  theme,
  onThemeChange,
  pfpStyle,
  onPfpStyleChange,
}: ModeSelectorProps) {
  const handleMode = (newMode: GeneratorMode) => {
    soundFx.playModeSwitch();
    onModeChange(newMode);
  };

  const handleTheme = (newTheme: ThemeColor) => {
    soundFx.playClick();
    onThemeChange(newTheme);
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
          { id: "badge" as GeneratorMode, label: "FORMAT B: BUILDER ID", Icon: BadgeCheck },
          { id: "pfp"   as GeneratorMode, label: "FORMAT A: PFP FRAME",  Icon: UserCircle },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleMode(id)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 font-body text-xs font-bold uppercase tracking-wider transition-all ${
              mode === id
                ? "bg-hhgoa-yellow text-hhgoa-black"
                : "text-hhgoa-white/70 hover:text-hhgoa-white bg-transparent"
            }`}
            style={{ borderRadius: 0 }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{id === "badge" ? "BADGE" : "PFP"}</span>
          </button>
        ))}
      </div>

      {/* Theme Color Selector */}
      <div className="hhgoa-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="section-label text-hhgoa-green">VISUAL THEME</span>
          <span className="font-body text-xs font-bold text-hhgoa-black/60 uppercase">
            {THEMES[theme].name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(THEMES) as ThemeColor[]).map((thmKey) => {
            const thm = THEMES[thmKey];
            const isSelected = theme === thmKey;
            return (
              <button
                key={thmKey}
                type="button"
                onClick={() => handleTheme(thmKey)}
                className={`py-2 px-2.5 text-left flex items-center gap-2 transition-all font-body text-xs font-semibold ${
                  isSelected
                    ? "bg-hhgoa-green text-hhgoa-white"
                    : "bg-hhgoa-cream text-hhgoa-black/60 hover:text-hhgoa-black border border-hhgoa-black/10"
                }`}
                style={{
                  borderRadius: 0,
                  boxShadow: isSelected ? "3px 4px 0 rgba(0,0,0,0.2)" : "none",
                }}
              >
                <span
                  className="h-3 w-3 shrink-0"
                  style={{ backgroundColor: thm.primary, borderRadius: 0 }}
                />
                <span className="truncate uppercase tracking-wider text-[10px]">
                  {thm.name}
                </span>
              </button>
            );
          })}
        </div>
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

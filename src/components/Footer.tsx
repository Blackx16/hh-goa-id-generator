"use client";

import React from "react";
import { HH_GOA_CONFIG } from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { ExternalLink } from "lucide-react";

const XMARK = "× × × × × × × × × × × × × × × × × × × × × × × × × × × × × ×";

export function Footer() {
  return (
    <footer className="mt-16 bg-hhgoa-green">

      {/* × Divider */}
      <div className="hhgoa-divider py-2 border-t border-hhgoa-yellow/20">
        {XMARK}
      </div>



      {/* Main footer content */}
      <div className="max-w-[1060px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="md:col-span-1 space-y-3">
          <div className="font-heading font-black text-hhgoa-white text-2xl uppercase">
            HACKER<br />HOUSE GOA
          </div>
          <p className="font-body text-xs text-hhgoa-white/70 leading-relaxed max-w-xs">
            4 days. one rhythm. everything intentional.<br />
            Less Noise. More Signal.
          </p>
          <div className="section-label text-hhgoa-yellow">#FrameInGoa</div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="section-label text-hhgoa-white/80">Navigation</h4>
          <ul className="space-y-2 font-body text-xs">
            {[
              { label: "Official Website", href: HH_GOA_CONFIG.officialUrl },
              { label: "Apply on Devfolio", href: HH_GOA_CONFIG.devfolioUrl },
              { label: "W Celeb Radar", href: HH_GOA_CONFIG.radarUrl },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="flex items-center gap-1.5 text-hhgoa-white/60 hover:text-hhgoa-yellow transition-colors"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Organized by */}
        <div className="space-y-3">
          <h4 className="section-label text-hhgoa-white/80">Organized by</h4>
          <div className="font-heading font-black text-hhgoa-yellow text-lg">
            2:47 PM STUDIO
          </div>
          <div className="space-y-1.5 font-body text-xs">
            <a
              href="https://x.com/247pmstudio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="block text-hhgoa-white/60 hover:text-hhgoa-yellow transition-colors"
            >
              X: @247pmstudio
            </a>
            <a
              href="https://t.me/twofourtysevenpm"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="block text-hhgoa-white/60 hover:text-hhgoa-yellow transition-colors"
            >
              Telegram: @twofourtysevenpm
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hhgoa-yellow/15 py-4 px-6">
        <div className="max-w-[1060px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-body text-[11px] text-hhgoa-white/40">
          <span>© 2026 Hacker House Goa. All rights reserved.</span>
          <span>Built for #FrameInGoa · {HH_GOA_CONFIG.motto}</span>
        </div>
      </div>
    </footer>
  );
}

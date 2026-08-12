"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeSelector } from "@/components/ModeSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { FormControls } from "@/components/FormControls";
import { CardPreview } from "@/components/CardPreview";
import { GeneratorMode, ImageTransform, PfpStyle, ThemeColor, UserData } from "@/types/generator";
import {
  generateHackerId,
  getRandomBuilderClass,
  ROLE_PRESETS,
  SAMPLE_AVATARS,
} from "@/lib/constants";
import { CheckCircle2, ShieldCheck, Flame } from "lucide-react";

const STORAGE_KEY = "hh_goa_user_data_v1";
const XMARK = "× × × × × × × × × × × × × × × × × × × × × × × × × × × × × × × × × × × ×";

const DEFAULT_USER_DATA: UserData = {
  name: "Alex Vance",
  isTeam: false,
  teamName: "ByteBrigade",
  role: ROLE_PRESETS[0],
  stack: ["Next.js", "Rust", "Solidity", "TailwindCSS"],
  builderClass: getRandomBuilderClass(),
  hackerId: generateHackerId(),
  qrValue: "https://hhgoa.com/",
  theme: "cyan",
  mode: "badge",
  pfpStyle: "cyber-ring",
};

const DEFAULT_TRANSFORM: ImageTransform = {
  zoom: 1,
  panX: 0,
  panY: 0,
  rotate: 0,
};

export default function Home() {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [imageSrc, setImageSrc] = useState<string | null>(SAMPLE_AVATARS[0].url);
  const [transform, setTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.warn("Could not read local storage:", err);
    }
    setIsLoaded(true);
  }, []);

  const handleUserDataChange = (updated: Partial<UserData>) => {
    setUserData((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn("Could not write to local storage:", err);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-hhgoa-green flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── HERO SECTION ── */}
        <section className="bg-hhgoa-green pt-12 pb-10 px-6">
          <div className="max-w-[1060px] mx-auto text-center space-y-4">

            {/* Overline label */}
            <div className="inline-flex items-center gap-2">
              <span className="btn-pill">TASK #1 · SHORTLISTING</span>
              <span className="btn-pill" style={{ backgroundColor: "#fee101", color: "#000" }}>
                #FrameInGoa
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-heading font-black text-hhgoa-white uppercase leading-none tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 7vw, 4.5rem)" }}>
              FRAME &amp;{" "}
              <span style={{ color: "#fee101" }}>BADGE</span>
              <br />
              GENERATOR
            </h1>

            {/* Sub-tagline */}
            <p className="font-body text-sm text-hhgoa-white/70 leading-relaxed max-w-xl mx-auto">
              Craft your custom builder ID badge or X avatar frame for Hacker House Goa 2026.
              Instant image pan/zoom, dynamic builder classes, 1-click share to X.
            </p>

            {/* Event details pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {["OCT 28–31, 2026", "GOA, INDIA", "247 BUILDERS"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 font-body font-bold text-[11px] uppercase tracking-widest text-hhgoa-black bg-hhgoa-yellow"
                  style={{ borderRadius: 0 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* × Divider */}
        <div className="hhgoa-divider py-2 bg-hhgoa-green">{XMARK}</div>

        {/* ── MAIN WORKSPACE (Cream section) ── */}
        <section className="bg-hhgoa-cream py-10 px-6">
          <div className="max-w-[1060px] mx-auto">

            {/* Section label */}
            <div className="mb-6">
              <div className="section-label text-hhgoa-green">PINNED UP · BUILD YOUR BADGE</div>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left: Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <ModeSelector
                  mode={userData.mode}
                  onModeChange={(mode: GeneratorMode) => handleUserDataChange({ mode })}
                  theme={userData.theme}
                  onThemeChange={(theme: ThemeColor) => handleUserDataChange({ theme })}
                  pfpStyle={userData.pfpStyle}
                  onPfpStyleChange={(pfpStyle: PfpStyle) => handleUserDataChange({ pfpStyle })}
                />
                <ImageUploader
                  imageSrc={imageSrc}
                  onImageChange={setImageSrc}
                  transform={transform}
                  onTransformChange={setTransform}
                />
                <FormControls
                  userData={userData}
                  onChange={handleUserDataChange}
                />
              </div>

              {/* Right: Card Preview (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <CardPreview
                  userData={userData}
                  imageSrc={imageSrc}
                  transform={transform}
                  onTransformChange={setTransform}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── GUIDELINES SECTION (Green) ── */}
        <section className="bg-hhgoa-green py-12 px-6">
          <div className="max-w-[1060px] mx-auto">

            {/* Section header */}
            <div className="text-center mb-8 space-y-2">
              <div className="section-label text-hhgoa-yellow">THE ROADMAP</div>
              <h2 className="font-heading font-black text-hhgoa-white uppercase text-3xl sm:text-4xl">
                SUBMISSION CHECKLIST
              </h2>
              <p className="font-body text-sm text-hhgoa-white/60 max-w-md mx-auto">
                Ensure your entry meets all official Hacker House Goa 2026 criteria
              </p>
            </div>

            {/* 3 Guide Cards — cream bg, hard shadow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#ff0080" }} />,
                  num: "01",
                  title: "#FrameInGoa HASHTAG",
                  body: (
                    <>
                      Your submission must include an X post containing{" "}
                      <span className="font-bold" style={{ color: "#ff0080" }}>#FrameInGoa</span> to
                      be validly indexed on the W Celeb Radar.
                    </>
                  ),
                },
                {
                  icon: <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: "#0b6839" }} />,
                  num: "02",
                  title: "ZERO LOGIN GATES",
                  body: "Everything runs client-side with near-instant rendering. No account or signup wall required to generate or download.",
                },
                {
                  icon: <Flame className="h-5 w-5 shrink-0" style={{ color: "#fee101" }} />,
                  num: "03",
                  title: "CRISP HIGH-RES EXPORT",
                  body: "High-DPI canvas engine renders clean 2×/3× PNG images with sub-pixel alignment and sharp typography for social media.",
                },
              ].map((card) => (
                <div key={card.num} className="hhgoa-card p-5 space-y-3">
                  {/* Pin */}
                  <div className="flex items-start gap-3">
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-heading font-black text-xs text-hhgoa-black"
                      style={{ backgroundColor: "#fee101" }}
                    >
                      {card.num}
                    </div>
                    {card.icon}
                    <h3 className="font-heading font-bold text-hhgoa-black text-sm uppercase leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  <p className="font-body text-xs text-hhgoa-black/70 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* × Divider */}
        <div className="hhgoa-divider py-2 bg-hhgoa-green">{XMARK}</div>

        {/* ── MISSION CTA ── */}
        <section className="bg-hhgoa-green py-14 px-6 text-center">
          <div className="max-w-[1060px] mx-auto space-y-4">
            <p className="section-label text-hhgoa-yellow">LESS NOISE. MORE SIGNAL.</p>
            <h2
              className="font-heading font-black text-hhgoa-white uppercase leading-none"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
            >
              4 DAYS. ONE RHYTHM.<br />
              <span style={{ color: "#fee101" }}>EVERYTHING INTENTIONAL.</span>
            </h2>
            <div className="pt-4">
              <a
                href="https://devfolio.co/discover"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm px-8 py-3"
              >
                GO TO DEVFOLIO →
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

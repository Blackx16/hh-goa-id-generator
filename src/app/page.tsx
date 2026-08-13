"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeSelector } from "@/components/ModeSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { FormControls } from "@/components/FormControls";
import { CardPreview } from "@/components/CardPreview";
import { LandingScene } from "@/components/LandingScene";
import { GeneratorMode, ImageTransform, PfpStyle, ThemeColor, UserData } from "@/types/generator";
import {
  ROLE_PRESETS,
  SAMPLE_AVATARS,
  getRandomBuilderClass,
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
  builderClass: "Fullstack Alchemist",
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [transform, setTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUserData((prev) => ({ ...prev, ...JSON.parse(savedUser) }));
      } else {
        // Randomize only on client to avoid hydration mismatch
        setUserData((prev) => ({
          ...prev,
          builderClass: getRandomBuilderClass(),
        }));
      }
      
      const savedImage = localStorage.getItem(`${STORAGE_KEY}_image`);
      if (savedImage) {
        setImageSrc(savedImage);
      }
      
      const savedTransform = localStorage.getItem(`${STORAGE_KEY}_transform`);
      if (savedTransform) {
        setTransform(JSON.parse(savedTransform));
      }
    } catch (err) {
      console.warn("Could not read local storage:", err);
    }
    setIsLoaded(true);
  }, []);

  const handleUserDataChange = (updated: Partial<UserData>) => {
    setUserData((prev) => {
      const next = { ...prev, ...updated };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (err) {}
      return next;
    });
  };

  const handleImageChange = (src: string | null) => {
    setImageSrc(src);
    try { 
      if (src) localStorage.setItem(`${STORAGE_KEY}_image`, src);
      else localStorage.removeItem(`${STORAGE_KEY}_image`);
    } catch (err) { console.warn(err) }
  };

  const handleTransformChange = (newTransform: ImageTransform) => {
    setTransform(newTransform);
    try { localStorage.setItem(`${STORAGE_KEY}_transform`, JSON.stringify(newTransform)); } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-hhgoa-green flex flex-col relative">
      {/* ── Landing Page Scene ── */}
      <LandingScene />
      
      <div id="main-content">
        <Header />

      <main className="flex-1">

        {/* ── HERO SECTION ── */}
        <section className="bg-hhgoa-green pt-12 pb-10 px-6">
          <div className="max-w-[1060px] mx-auto text-center space-y-4">

            {/* Main headline */}
            <h1 className="font-heading font-black text-hhgoa-white uppercase leading-none tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 7vw, 4.5rem)" }}>
              FRAME &amp;{" "}
              <span style={{ color: "#fee101" }}>BADGE</span>
              <br />
              GENERATOR
            </h1>
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
                  pfpStyle={userData.pfpStyle}
                  onPfpStyleChange={(pfpStyle: PfpStyle) => handleUserDataChange({ pfpStyle })}
                />
                <ImageUploader
                  imageSrc={imageSrc}
                  onImageChange={handleImageChange}
                  transform={transform}
                  onTransformChange={handleTransformChange}
                />
                <FormControls
                  userData={userData}
                  onChange={handleUserDataChange}
                />
              </div>

              {/* Right: Card Preview (5 cols) */}
              <div className="lg:col-span-5">
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

      </main>

      <Footer />
      </div>
    </div>
  );
}

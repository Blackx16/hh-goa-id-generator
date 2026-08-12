# Hacker House Goa 2026 — Frame & Builder ID Generator
# Project Decisions & Specification Record

**Document Version:** 1.0.0  
**Date:** August 11, 2026  
**Target Event:** Hacker House Goa 2026 (`28 – 31 OCT 2026 · GOA, INDIA`)  
**Mandatory Hashtag:** `#FrameInGoa`  
**Official Links:** [hhgoa.com](https://hhgoa.com/) | [Devfolio Application](https://hacker-house-goa-2026.devfolio.co/)

---

## 1. Project Overview & Objective
A high-performance, client-side web application where hackers can upload a photo and instantly generate branded **HH Goa 2026** graphics ready to download and share on X (Twitter). The application supports both **Format A (PFP Frame/Overlay)** and **Format B (Builder ID Card)** with real-time interactive canvas manipulation, session memory, cyber-hacker aesthetic, and 1-click export/sharing.

---

## 2. Core Decisions Matrix

### 2.1 Supported Formats
- **Format A: PFP Frame / Overlay (1:1 Aspect Ratio)**
  - Circular and square framing designed for X profile pictures.
  - HH Goa 2026 neon branding, glowing corner notches, event dates (`28-31 OCT 2026 · GOA`), and dynamic hacker badges.
  - 4 overlay styles: *Cyber Ring, Hexagon Shield, Terminal Minimal, Holographic Wave*.
- **Format B: Builder ID Card (3:4 Badge Aspect Ratio)**
  - Vertical event lanyard / badge pass layout.
  - Personalized fields: Name, Team/Solo tag (+ Team Name), Track/Role, Tech Stack, Randomized "Builder Class", Unique Hacker ID, and scannable QR Code.

### 2.2 Tech Stack & Libraries
- **Framework:** Next.js (React 18/19, App Router) + TypeScript
- **Styling:** Tailwind CSS + Custom Cyber Design System (deep obsidian `#08090c`, neon cyan `#00f0ff`, amber `#ffaa00`, phosphor green `#00ff66`, purple holographic shimmer)
- **Icons:** `lucide-react`
- **Canvas Engine:** Native HTML5 Canvas 2D with Offscreen high-DPI (3x) rendering for crisp, pixel-perfect exports
- **Image Processing:** Native `FileReader` + `heic2any` for full iPhone HEIC format support
- **Audio SFX:** Web Audio API Synthesizer (zero external audio file dependencies; ultra-responsive retro-cyber clicks and camera shutter sound with mute toggle)
- **State & Persistence:** React State + `localStorage` synchronization (auto-saves form fields so users never lose their data on refresh)

### 2.3 Visual Design & Aesthetics
- **Aesthetic Direction:** Dark Cyber-Hacker / Brutalist Terminal matching `hhgoa.com` (Less Noise. More Signal).
- **Visual Elements:**
  - Technical grid backgrounds, dot matrix, corner brackets `[+]`, crosshair marks, subtle scanlines.
  - Glowing borders and interactive 3D card tilt with holographic foil glare on cursor hover.
  - Smooth cyber landing animations, telemetry ticker, and glitch accents.
- **Selectable Theme Colorways:**
  1. 🩵 **Cyber Cyan** (Default): Neon Cyan `#00f0ff` & Electric Blue on Obsidian.
  2. 🧡 **Sunset Amber**: Goa Sunset Amber `#ffaa00` & Deep Sunset Purple.
  3. 💚 **Terminal Green**: Phosphor Green `#00ff66` & Stealth Slate.
  4. 💜 **Holographic VIP**: Iridescent Purple/Magenta `#d946ef` & Glitch Shimmer.

### 2.4 Image Manipulation & Input UX
- **Input Channels:** Drag & Drop, File Picker (JPG, PNG, WebP, HEIC), Webcam selfie capture, and 1-Click Demo Avatars for instant testing.
- **Interactive Manipulation:**
  - Direct canvas dragging to pan (reposition photo inside frame).
  - Smooth zoom slider + trackpad/mouse wheel zoom.
  - 90° rotation button.
  - "Auto-Fit / Center" reset button.
  - Automatic aspect ratio handling for portrait, landscape, and off-center photos with zero required pre-cropping.

### 2.5 Builder ID Fields & Generation Rules
- **Name:** User's name or hacker handle.
- **Participation Mode:** Toggle between `Solo Hacker` and `Team`.
- **Team Name:** Input field active when `Team` mode is selected, displayed prominently on the badge.
- **Role / Track:** Selectable presets (*Fullstack Builder, AI/ML Specialist, Systems / Rust, Smart Contracts, UI/UX Architect, Security Researcher, Founder / Product*) + custom typing.
- **Tech Stack:** Skill tags / badges (e.g., `Next.js`, `Rust`, `Solidity`, `PyTorch`, `TypeScript`).
- **Builder Class Generator:** Randomized elite/humorous builder classes (e.g., *Caffeine-Powered 10x Architect, Zero-Knowledge Necromancer, Ship or Die Specialist, Bytecode Whisperer, Chaos Monkey Wrangler*) with a `🎲 Reroll` button and manual edit support.
- **Hacker ID:** Auto-generated unique badge string (e.g. `HHG-2026-9A4F`).
- **QR Code:** Scannable code pointing directly to `https://hhgoa.com/`.

### 2.6 Export & Share to X Workflow
- **1-Click High-Res Download:** Renders at 3x DPI (e.g. 1800×2400 for Card, 1500×1500 for PFP) as clean PNG with descriptive filename (`HHGoa2026_[Name].png`).
- **1-Click Share to X:** Opens Twitter / X Intent URL (`https://twitter.com/intent/tweet?text=...&hashtags=FrameInGoa`) with pre-filled punchy copy containing user's name, role, builder class, team name, website link, and mandatory `#FrameInGoa` hashtag.

### 2.7 Navigation & External Links
- Direct header and footer links to `https://hhgoa.com/`, Devfolio application page, and 2:47 pm Studio socials.

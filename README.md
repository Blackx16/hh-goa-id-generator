# 🌴 Hacker House Goa 2026 — Frame & Builder ID Generator

> **Official Submission for Hacker House Goa 2026 Shortlisting Task #1**  
> **Live Web App:** [https://blackx16.github.io/hh-goa-id-generator/](https://blackx16.github.io/hh-goa-id-generator/)  
> **Mandatory Hashtag:** `#FrameInGoa`  
> **Event:** `OCT 28–31, 2026 · GOA, INDIA` | **Official Site:** [hhgoa.com](https://hhgoa.com/) | **Devfolio:** [Application Portal](https://hacker-house-goa-2026.devfolio.co/)

---

## ⚡ Overview

The **HH Goa 2026 Frame & Builder ID Generator** is a zero-login, high-performance, client-side web application designed to generate branded **Hacker House Goa 2026** graphics in seconds. Hackers can create both **X (Twitter) Profile Picture Frames** and **Custom Builder ID Badges**, complete with interactive photo positioning, randomized builder titles, high-DPI export, and 1-click sharing to X with `#FrameInGoa`.

Everything runs 100% in the browser with sub-second rendering, offline capability, and zero signup friction.

---

## 🚀 Key Features

### 🎴 Dual Generation Modes (Format A & B)
- **Format A: PFP Frame / Overlay (1:1 Aspect Ratio)**
  - Circular & square framing tailored for X (Twitter) profile pictures.
  - Neon event branding, coordinate stamps (`15.2993° N, 74.1240° E`), and dynamic corner badges.
- **Format B: Builder ID Card (3:4 Aspect Ratio)**
  - Vertical event lanyard badge layout.
  - Interactive fields: Name, Solo/Team toggle, Team Name, Role/Track, Tech Stack chips, Unique Hacker ID (`HHG-2026-XXXX`), scannable QR code to `hhgoa.com`, and a randomized **"Builder Class"** generator.

### 🖼️ Real-Time Image Studio
- **Multi-Source Uploads**: Drag & Drop, Native File Picker, **Webcam selfie capture**, and 1-Click Demo Avatars for instant testing.
- **Universal Format Support**: JPG, PNG, WebP, SVG, and iPhone **HEIC / HEIF** format (auto-converted via `heic2any`).
- **Interactive Canvas Manipulation**:
  - Direct canvas dragging to pan photo.
  - Smooth zoom slider + mouse wheel / trackpad pinch zoom.
  - 90° rotation button & 1-click "Center / Reset" button.
  - Automatic aspect ratio handling for portrait, landscape, and off-center photos.

### 🎨 HH Goa Native Design System
- **Event Colors**: Uses the official 5-color palette (HH Goa Green `#0b6839`, Yellow `#fee101`, Pink `#ff0080`, Cream `#fffbe8`, Black `#000000`).
- **Typography**: Authentic `Imbue` (serif) and `Victor Mono` typefaces matching the event site.
- **Visuals**: Animated landing scene with SVGs, hard offset shadows, and brutalist card aesthetics instead of legacy cyberpunk styling.

### 💾 Local Persistence & Audio FX
- **Session Memory**: Auto-saves form fields to `localStorage` so user entries persist across page reloads.
- **Synthesizer SFX**: Procedural Web Audio API sound effects (shutter sound, retro clicks) with an instant mute toggle.
- **Confetti Celebration**: Fires particle effects upon badge export.

### 📤 High-DPI Export & 1-Click Share
- **Crisp 3× Output**: Renders at up to 1800×2400 resolution via an offscreen 2D canvas engine for ultra-sharp typography and social media clarity.
- **1-Click Share to X**: Opens Twitter/X with pre-populated punchy copy, builder metadata, and the required `#FrameInGoa` hashtag.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Static HTML Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Image & Canvas Processing**: HTML5 Canvas 2D API, [`heic2any`](https://www.npmjs.com/package/heic2any), [`qrcode`](https://www.npmjs.com/package/qrcode)
- **Visual & Audio FX**: [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti), Web Audio API
- **Deployment & Hosting**: [GitHub Pages](https://pages.github.com/) via automated [GitHub Actions](https://github.com/features/actions)

---

## 📋 Task Requirements Compliance

| Requirement | Status | Implementation Detail |
| :--- | :---: | :--- |
| **Format A (PFP Frame)** | ✅ | 1:1 circular/square frame overlay with 4 styles |
| **Format B (Builder ID)** | ✅ | 3:4 lanyard badge with customizable tech stack, roles & classes |
| **Fast / Instant Generation** | ✅ | Pure client-side HTML5 canvas rendering in < 50ms |
| **Real Photo Handling** | ✅ | Pan, zoom, rotate, auto-fit, and HEIC iPhone image support |
| **Downloadable Output** | ✅ | High-resolution 3× PNG download with custom filename |
| **Working Share to X Flow** | ✅ | Pre-filled tweet with `#FrameInGoa`, builder class & event URL |
| **Zero Login Wall** | ✅ | No signups, accounts, or auth gates required |
| **Mobile Friendly** | ✅ | Fully responsive UI with touch gestures and sticky live preview |

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Blackx16/hh-goa-id-generator.git
cd hh-goa-id-generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build static export
```bash
npm run build
```
The static HTML export will be generated in the `out/` directory.

---

## 🌐 Deployment (GitHub Pages)

This project is deployed to GitHub Pages automatically on every push to `main` via the GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To configure GitHub Pages manually:
1. Go to **Settings > Pages** in your GitHub repository.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main` or manually trigger the workflow from the **Actions** tab.

---

## 📄 License

Built with ❤️ for **Hacker House Goa 2026** by [Chandraveer S Solanki (@Blackx16)](https://github.com/Blackx16).

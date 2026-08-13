import { ThemeColor, ThemeConfig } from "@/types/generator";

export const HH_GOA_CONFIG = {
  eventName: "HACKER HOUSE GOA 2026",
  shortName: "HH GOA 2026",
  dates: "28 – 31 OCT 2026",
  location: "GOA, INDIA",
  studio: "2:47 pm Studio",
  hashtag: "#FrameInGoa",
  officialUrl: "https://hhgoa.com/",
  devfolioUrl: "https://hacker-house-goa-2026.devfolio.co/",
  radarUrl: "https://hhgoa.com/radar",
  coords: "15.2993° N, 74.1240° E",
  motto: "Less Noise. More Signal.",
};

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  cyan: {
    id: "cyan",
    name: "Cyber Cyan",
    primary: "#00f0ff",
    primaryGlow: "rgba(0, 240, 255, 0.5)",
    secondary: "#3b82f6",
    accent: "#38bdf8",
    bgGradient: "from-cyan-950/40 via-slate-900/60 to-black",
    borderClass: "border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]",
    textClass: "text-cyan-400",
    badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
  },
  amber: {
    id: "amber",
    name: "Sunset Amber",
    primary: "#ffaa00",
    primaryGlow: "rgba(255, 170, 0, 0.5)",
    secondary: "#f97316",
    accent: "#fbbf24",
    bgGradient: "from-amber-950/40 via-stone-900/60 to-black",
    borderClass: "border-amber-500/50 shadow-[0_0_20px_rgba(255,170,0,0.25)]",
    textClass: "text-amber-400",
    badgeBg: "bg-amber-950/80 text-amber-300 border-amber-500/40",
  },
  green: {
    id: "green",
    name: "Terminal Green",
    primary: "#00ff66",
    primaryGlow: "rgba(0, 255, 102, 0.5)",
    secondary: "#10b981",
    accent: "#4ade80",
    bgGradient: "from-emerald-950/40 via-zinc-900/60 to-black",
    borderClass: "border-emerald-500/50 shadow-[0_0_20px_rgba(0,255,102,0.25)]",
    textClass: "text-emerald-400",
    badgeBg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
  },
  purple: {
    id: "purple",
    name: "Holographic VIP",
    primary: "#d946ef",
    primaryGlow: "rgba(217, 70, 239, 0.5)",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    bgGradient: "from-purple-950/40 via-slate-900/60 to-black",
    borderClass: "border-purple-500/50 shadow-[0_0_20px_rgba(217,70,239,0.25)]",
    textClass: "text-purple-400",
    badgeBg: "bg-purple-950/80 text-purple-300 border-purple-500/40",
  },
};

export const ROLE_PRESETS = [
  "Fullstack Architect",
  "AI / Agent Engineer",
  "Smart Contract Hacker",
  "Systems / Rust Specialist",
  "Zero-Knowledge Researcher",
  "Frontend / UI Engineer",
  "DevOps / Infrastructure",
  "Product Founder",
  "Design Technologist",
  "Kernel Cowboy",
];

export const STACK_SUGGESTIONS = [
  "Next.js",
  "React",
  "TypeScript",
  "Rust",
  "Solidity",
  "Python",
  "PyTorch",
  "Go",
  "Node.js",
  "TailwindCSS",
  "PostgreSQL",
  "Docker",
  "Web3.js",
  "EVM",
  "Bun",
  "GraphQL",
];

export const BUILDER_CLASSES = [
  "10x Architect",
  "Necromancer",
  "Whisperer",
  "Specialist",
  "Kernel Cowboy & Pointer Juggler",
  "Terminal Hermit & Git Wizard",
  "Fullstack Alchemist",
  "Sub-Millisecond Optimizer",
  "Gas-Fee Exorcist",
  "Professional Smoker",
  "Electricity bill Increaser",
  "Clanker Enthusiast.",
  "Computer Person",
  "Guy.",
  "Back-end specialist 😏",
];

export const SAMPLE_AVATARS = [
  {
    name: "Cyber Hacker",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Terminal Dev",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Web3 Builder",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "AI Researcher",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
  },
];



export function getRandomBuilderClass(): string {
  return BUILDER_CLASSES[Math.floor(Math.random() * BUILDER_CLASSES.length)];
}

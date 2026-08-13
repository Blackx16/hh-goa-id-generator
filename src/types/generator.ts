export type GeneratorMode = "badge" | "pfp";

export type ThemeColor = "cyan" | "amber" | "green" | "purple";

export type PfpStyle = "cyber-ring" | "hexagon-shield" | "terminal-minimal" | "holographic-wave";

export interface ImageTransform {
  zoom: number; // 0.5 to 3
  panX: number; // in px
  panY: number; // in px
  rotate: number; // 0, 90, 180, 270
}

export interface UserData {
  name: string;
  isTeam: boolean;
  teamName: string;
  role: string;
  stack: string[];
  builderClass: string;
  qrValue: string;
  theme: ThemeColor;
  mode: GeneratorMode;
  pfpStyle: PfpStyle;
}

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  primary: string;
  primaryGlow: string;
  secondary: string;
  accent: string;
  bgGradient: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
}

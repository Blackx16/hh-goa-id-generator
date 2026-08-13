"use client";

import { ImageTransform, ThemeConfig, UserData } from "@/types/generator";
import { THEMES } from "./constants";
import QRCode from "qrcode";

interface RenderOptions {
  userData: UserData;
  imageElement: HTMLImageElement | null;
  transform: ImageTransform;
  scale?: number; // default 1 for preview, 2 or 3 for high-res export
}

/**
 * Draws rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws cyber corner brackets [+]
 */
function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  size: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "square";

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + size);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - size);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + size, y + h);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - size);
  ctx.stroke();
}

/**
 * Draws fine cyber grid
 */
function drawCyberGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gridSize: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.15;

  for (let x = 0; x <= w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y <= h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws faux barcode
 */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3];
  let curX = x;
  const totalWeight = barPattern.reduce((a, b) => a + b, 0);
  const unit = w / totalWeight;

  for (let i = 0; i < barPattern.length; i++) {
    const barWidth = barPattern[i] * unit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, barWidth, h);
    }
    curX += barWidth;
  }
  ctx.restore();
}

/**
 * Renders user photo onto target viewport with pan, zoom, and rotate
 */
function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetX: number,
  targetY: number,
  targetW: number,
  targetH: number,
  transform: ImageTransform
) {
  ctx.save();
  // Clip to target area
  ctx.beginPath();
  ctx.rect(targetX, targetY, targetW, targetH);
  ctx.clip();

  // Dark background behind photo
  ctx.fillStyle = "#050608";
  ctx.fillRect(targetX, targetY, targetW, targetH);

  const centerX = targetX + targetW / 2 + transform.panX;
  const centerY = targetY + targetH / 2 + transform.panY;

  ctx.translate(centerX, centerY);
  ctx.rotate((transform.rotate * Math.PI) / 180);
  ctx.scale(transform.zoom, transform.zoom);

  // Cover calculation
  const imgAspect = img.width / img.height;
  const targetAspect = targetW / targetH;
  let renderW: number;
  let renderH: number;

  if (imgAspect > targetAspect) {
    renderH = targetH;
    renderW = targetH * imgAspect;
  } else {
    renderW = targetW;
    renderH = targetW / imgAspect;
  }

  ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
  ctx.restore();
}

/**
 * Main Render Dispatcher
 */
export async function renderGraphicToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { userData, imageElement, transform, scale = 1 } = options;
  const theme = THEMES[userData.theme] || THEMES.cyan;

  if (userData.mode === "pfp") {
    await renderPfpFrame(canvas, userData, imageElement, transform, theme, scale);
  } else {
    await renderBuilderBadge(canvas, userData, imageElement, transform, theme, scale);
  }
}

/**
 * FORMAT A: PFP Frame / Overlay (1:1)
 */
async function renderPfpFrame(
  canvas: HTMLCanvasElement,
  userData: UserData,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  theme: ThemeConfig,
  scale: number
) {
  const baseSize = 800;
  const size = baseSize * scale;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Base background
  ctx.fillStyle = "#08090c";
  ctx.fillRect(0, 0, size, size);

  // Cyber Grid
  drawCyberGrid(ctx, size, size, 40 * scale, theme.primary);

  const padding = 60 * scale;
  const photoSize = size - padding * 2;
  const photoX = padding;
  const photoY = padding;
  const radius = photoSize / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // 1. Draw User Photo (Circular or Rounded)
  ctx.save();
  if (userData.pfpStyle === "hexagon-shield") {
    // Hexagonal Clip
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const hx = centerX + radius * 0.95 * Math.cos(angle);
      const hy = centerY + radius * 0.95 * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.clip();
  } else {
    // Circle Clip
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.92, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  if (img) {
    drawUserPhoto(ctx, img, photoX, photoY, photoSize, photoSize, {
      ...transform,
      panX: transform.panX * scale,
      panY: transform.panY * scale,
    });
  } else {
    // Placeholder avatar background
    ctx.fillStyle = "#12151e";
    ctx.fillRect(photoX, photoY, photoSize, photoSize);

    ctx.fillStyle = theme.primary;
    ctx.font = `bold ${32 * scale}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("[ NO PHOTO UPLOADED ]", centerX, centerY);
  }
  ctx.restore();

  // 2. Draw Frame Overlay based on pfpStyle
  ctx.save();

  // Glow filter
  ctx.shadowColor = theme.primaryGlow;
  ctx.shadowBlur = 18 * scale;

  // Outer circular neon ring
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.92, 0, Math.PI * 2);
  ctx.stroke();

  // Secondary dashed ring
  ctx.strokeStyle = theme.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.97, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Corner Brackets
  drawCornerBrackets(ctx, 24 * scale, 24 * scale, size - 48 * scale, size - 48 * scale, 30 * scale, theme.primary);

  // Top Header Banner
  ctx.shadowBlur = 10 * scale;
  ctx.fillStyle = "#0c0e15";
  roundRect(ctx, centerX - 180 * scale, 24 * scale, 360 * scale, 36 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.fillStyle = theme.primary;
  ctx.font = `bold ${14 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⚡ HH GOA 2026 · HACKER PASS", centerX, 42 * scale);

  // Bottom Badge Pill
  ctx.fillStyle = "#0c0e15";
  roundRect(ctx, centerX - 190 * scale, size - 60 * scale, 380 * scale, 40 * scale, 8 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${15 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("#FrameInGoa · 28-31 OCT", centerX, size - 40 * scale);

  // Coordinates and Telemetry
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#8a94a6";
  ctx.font = `${11 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.fillText("LOC: 15.2993° N, 74.1240° E", 30 * scale, size - 26 * scale);

  ctx.textAlign = "right";

  // Side tick marks
  const tickAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  tickAngles.forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    const innerR = radius * 0.98;
    const outerR = radius * 1.03;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX + innerR * Math.cos(rad), centerY + innerR * Math.sin(rad));
    ctx.lineTo(centerX + outerR * Math.cos(rad), centerY + outerR * Math.sin(rad));
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * FORMAT B: Builder ID Card (3:4 Badge, 900x1260 base)
 */
async function renderBuilderBadge(
  canvas: HTMLCanvasElement,
  userData: UserData,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  theme: ThemeConfig,
  scale: number
) {
  const baseW = 900;
  const baseH = 1260;
  const w = baseW * scale;
  const h = baseH * scale;

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Card Outer Shadow / Margin
  const margin = 28 * scale;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const cardX = margin;
  const cardY = margin;
  const cardRadius = 24 * scale;

  // Background Gradient
  ctx.save();
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#0e1017");
  bgGrad.addColorStop(0.5, "#08090c");
  bgGrad.addColorStop(1, "#040507");

  ctx.fillStyle = bgGrad;
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  // Glowing Outer Border
  ctx.shadowColor = theme.primaryGlow;
  ctx.shadowBlur = 24 * scale;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Clip all interior drawing to card shape
  ctx.save();
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.clip();

  // Cyber Grid pattern in background
  drawCyberGrid(ctx, w, h, 45 * scale, theme.primary);

  // Top Lanyard Slot
  ctx.save();
  const slotW = 120 * scale;
  const slotH = 16 * scale;
  const slotX = w / 2 - slotW / 2;
  const slotY = cardY + 16 * scale;
  ctx.fillStyle = "#040507";
  roundRect(ctx, slotX, slotY, slotW, slotH, 8 * scale);
  ctx.fill();
  ctx.strokeStyle = "#252b3d";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Header Section
  ctx.save();
  const headerY = cardY + 54 * scale;

  // Event Name
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${28 * scale}px 'Syne', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("HACKER HOUSE GOA", cardX + 36 * scale, headerY + 20 * scale);

  // Edition Badge
  ctx.fillStyle = theme.primary;
  ctx.font = `bold ${18 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("2026", cardX + 36 * scale + ctx.measureText("HACKER HOUSE GOA ").width + 12 * scale, headerY + 20 * scale);

  // Subtitle / Dates
  ctx.fillStyle = "#8a94a6";
  ctx.font = `bold ${13 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("28 – 31 OCT 2026 · GOA, INDIA", cardX + 36 * scale, headerY + 44 * scale);

  // 2:47 pm Studio Pill
  ctx.fillStyle = "#121520";
  const studioW = 150 * scale;
  const studioX = cardX + cardW - 36 * scale - studioW;
  roundRect(ctx, studioX, headerY, studioW, 36 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = "#2b3247";
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.fillStyle = "#00f0ff";
  ctx.font = `bold ${12 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "center";
  ctx.fillText("2:47 pm Studio", studioX + studioW / 2, headerY + 23 * scale);
  ctx.restore();

  // Header Divider Line
  ctx.strokeStyle = "#1f2438";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX + 36 * scale, headerY + 60 * scale);
  ctx.lineTo(cardX + cardW - 36 * scale, headerY + 60 * scale);
  ctx.stroke();

  // User Avatar Frame Area
  const avatarW = cardW - 72 * scale;
  const avatarH = 430 * scale;
  const avatarX = cardX + 36 * scale;
  const avatarY = headerY + 76 * scale;
  const avatarRadius = 14 * scale;

  ctx.save();
  roundRect(ctx, avatarX, avatarY, avatarW, avatarH, avatarRadius);
  ctx.clip();

  if (img) {
    drawUserPhoto(ctx, img, avatarX, avatarY, avatarW, avatarH, {
      ...transform,
      panX: transform.panX * scale,
      panY: transform.panY * scale,
    });
  } else {
    ctx.fillStyle = "#121520";
    ctx.fillRect(avatarX, avatarY, avatarW, avatarH);

    ctx.fillStyle = theme.primary;
    ctx.font = `bold ${24 * scale}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("[ UPLOAD PHOTO ]", avatarX + avatarW / 2, avatarY + avatarH / 2);
  }
  ctx.restore();

  // Avatar Border & Corner Accents
  ctx.save();
  roundRect(ctx, avatarX, avatarY, avatarW, avatarH, avatarRadius);
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = theme.primaryGlow;
  ctx.shadowBlur = 10 * scale;
  ctx.stroke();

  // Live status badge overlay on top-right of avatar
  const badgeW = 140 * scale;
  const badgeH = 28 * scale;
  const badgeX = avatarX + avatarW - badgeW - 12 * scale;
  const badgeY = avatarY + 12 * scale;

  ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // Green pulsating dot
  ctx.fillStyle = "#00ff66";
  ctx.beginPath();
  ctx.arc(badgeX + 16 * scale, badgeY + badgeH / 2, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${10 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("ACTIVE BUILDER", badgeX + 28 * scale, badgeY + badgeH / 2);

  // Corner brackets inside avatar
  drawCornerBrackets(ctx, avatarX + 8 * scale, avatarY + 8 * scale, avatarW - 16 * scale, avatarH - 16 * scale, 20 * scale, theme.primary);
  ctx.restore();

  // Hacker Details Section
  let curY = avatarY + avatarH + 34 * scale;

  // 1. Name & Team/Solo Badge
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${36 * scale}px 'Syne', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameText = (userData.name.trim() || "ANONYMOUS HACKER").toUpperCase();
  ctx.fillText(nameText, cardX + 36 * scale, curY);

  // Mode badge (Team vs Solo)
  const isTeam = userData.isTeam && userData.teamName.trim().length > 0;
  const modeText = isTeam
    ? `⚡ SQUAD // ${userData.teamName.trim().toUpperCase()}`
    : "👤 SOLO HACKER";

  ctx.font = `bold ${12 * scale}px 'JetBrains Mono', monospace`;
  const modeMeasure = ctx.measureText(modeText).width;
  const modePillW = modeMeasure + 24 * scale;
  const modePillH = 26 * scale;
  const modePillX = cardX + cardW - 36 * scale - modePillW;
  const modePillY = curY - 24 * scale;

  ctx.fillStyle = isTeam ? "rgba(255, 170, 0, 0.15)" : "rgba(0, 240, 255, 0.12)";
  roundRect(ctx, modePillX, modePillY, modePillW, modePillH, 6 * scale);
  ctx.fill();

  ctx.strokeStyle = isTeam ? "#ffaa00" : theme.primary;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.fillStyle = isTeam ? "#ffaa00" : theme.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(modeText, modePillX + modePillW / 2, modePillY + modePillH / 2);
  ctx.restore();

  curY += 28 * scale;

  // 2. Role / Track
  ctx.save();
  ctx.fillStyle = theme.primary;
  ctx.font = `bold ${16 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.fillText(`ROLE: ${userData.role.toUpperCase()}`, cardX + 36 * scale, curY);
  ctx.restore();

  curY += 18 * scale;

  // 3. Builder Class / Specialty Box
  ctx.save();
  const classBoxH = 50 * scale;
  const classBoxW = cardW - 72 * scale;
  const classBoxX = cardX + 36 * scale;
  const classBoxY = curY;

  // Cyber Glass Box
  ctx.fillStyle = "rgba(18, 22, 32, 0.85)";
  roundRect(ctx, classBoxX, classBoxY, classBoxW, classBoxH, 8 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Class Label
  ctx.fillStyle = "#8a94a6";
  ctx.font = `bold ${10 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("BUILDER CLASS //", classBoxX + 16 * scale, classBoxY + 8 * scale);

  // Class Value
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${15 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText(userData.builderClass || "Ship or Die Specialist", classBoxX + 16 * scale, classBoxY + 24 * scale);
  ctx.restore();

  curY += classBoxH + 20 * scale;

  // 4. Tech Stack Tags
  ctx.save();
  ctx.fillStyle = "#8a94a6";
  ctx.font = `bold ${11 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.fillText("ARSENAL & STACK:", cardX + 36 * scale, curY);

  let stackX = cardX + 36 * scale;
  const stackY = curY + 8 * scale;
  const stackItems = userData.stack.length > 0 ? userData.stack.slice(0, 5) : ["Next.js", "Rust", "Solidity"];

  stackItems.forEach((tech) => {
    ctx.font = `bold ${11 * scale}px 'JetBrains Mono', monospace`;
    const tagWidth = ctx.measureText(tech).width + 20 * scale;
    const tagHeight = 24 * scale;

    ctx.fillStyle = "#141824";
    roundRect(ctx, stackX, stackY, tagWidth, tagHeight, 5 * scale);
    ctx.fill();

    ctx.strokeStyle = "#2d354d";
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = theme.primary;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tech, stackX + tagWidth / 2, stackY + tagHeight / 2);

    stackX += tagWidth + 8 * scale;
  });
  ctx.restore();

  // Bottom Telemetry, Barcode & QR Code Section
  const bottomY = cardY + cardH - 150 * scale;

  // Divider
  ctx.strokeStyle = "#1f2438";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX + 36 * scale, bottomY);
  ctx.lineTo(cardX + cardW - 36 * scale, bottomY);
  ctx.stroke();

  // Scannable QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(userData.qrValue || "https://hhgoa.com/", {
      margin: 1,
      width: 100 * scale,
      color: {
        dark: "#00f0ff",
        light: "#00000000",
      },
    });

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise((res) => {
      qrImg.onload = res;
      qrImg.onerror = res;
    });

    const qrSize = 105 * scale;
    const qrX = cardX + 36 * scale;
    const qrY = bottomY + 18 * scale;

    // Dark backing
    ctx.fillStyle = "#0c0e15";
    roundRect(ctx, qrX, qrY, qrSize, qrSize, 6 * scale);
    ctx.fill();
    ctx.strokeStyle = "#252b3d";
    ctx.stroke();

    ctx.drawImage(qrImg, qrX + 4 * scale, qrY + 4 * scale, qrSize - 8 * scale, qrSize - 8 * scale);
  } catch (err) {
    console.warn("QR code generation failed:", err);
  }

  // Hacker ID and Barcode to the right of QR Code
  ctx.save();
  const infoX = cardX + 160 * scale;
  const infoY = bottomY + 28 * scale;

  // Removed Hacker ID, now drawing barcode directly.

  // Barcode
  drawBarcode(ctx, infoX, infoY + 12 * scale, 340 * scale, 30 * scale, theme.primary);

  // Telemetry metadata
  ctx.fillStyle = "#8a94a6";
  ctx.font = `${10 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("LOC: 15.2993° N, 74.1240° E // RADAR VERIFIED", infoX, infoY + 58 * scale);
  ctx.fillText("OFFICIAL PASS // " + userData.mode.toUpperCase(), infoX, infoY + 72 * scale);

  // Hashtag & Motto on bottom right
  ctx.textAlign = "right";
  ctx.fillStyle = theme.primary;
  ctx.font = `bold ${14 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("#FrameInGoa", cardX + cardW - 36 * scale, bottomY + 54 * scale);

  ctx.fillStyle = "#8a94a6";
  ctx.font = `italic ${10 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText("Less Noise. More Signal.", cardX + cardW - 36 * scale, bottomY + 74 * scale);
  ctx.restore();

  ctx.restore(); // end clip
}

"use client";

import React, { useRef, useState, useEffect } from "react";
import { ImageTransform, UserData } from "@/types/generator";
import { THEMES } from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import confetti from "canvas-confetti";
import { toPng, toBlob } from "html-to-image";
import {
  Download,
  Share2,
  Copy,
  Check,
  User,
} from "lucide-react";

interface CardPreviewProps {
  userData: UserData;
  imageSrc: string | null;
  transform: ImageTransform;
  onTransformChange: (t: ImageTransform) => void;
}

export function CardPreview({
  userData,
  imageSrc,
  transform,
  onTransformChange,
}: CardPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState<{w: number, h: number} | null>(null);

  useEffect(() => {
    if (!imageSrc) {
      setDimensions(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => setDimensions({ w: img.width, h: img.height });
    img.src = imageSrc;
  }, [imageSrc]);

  const isPortrait = dimensions ? dimensions.h > dimensions.w : false;

  const theme = THEMES[userData.theme] || THEMES.cyan;

  // 3D Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // 1-Click High-Res PNG Download
  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      setDownloading(true);
      soundFx.playShutter();

      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution
        quality: 1.0,
      });

      const cleanName = (userData.name.trim() || "Hacker").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `HHGoa2026_${userData.mode === "pfp" ? "PFP" : "Badge"}_${cleanName}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: [theme.primary, "#ffffff", "#38bdf8", "#ffaa00"],
      });

      soundFx.playSuccess();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!captureRef.current) return;
    try {
      soundFx.playClick();

      const blob = await toBlob(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      if (blob && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn("Clipboard copy failed, downloading instead:", err);
      handleDownload();
    }
  };

  // 1-Click Share to X (Twitter Intent)
  const handleShareToX = () => {
    soundFx.playClick();

    const name = userData.name.trim() || "Anonymous Hacker";
    const role = userData.role || "Builder";
    const builderClass = userData.builderClass || "Ship or Die Specialist";
    const team = userData.isTeam && userData.teamName.trim() ? `Team: ${userData.teamName.trim()}` : "Solo Hacker";

    const tweetText = `Locked in for Hacker House Goa 2026! 🌊🌴\n\n👤 ${name}\n🚀 ${builderClass} | ${role}\n⚡ ${team}\n\nGenerated my official badge with #FrameInGoa 👇\n`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent("https://hhgoa.com/")}&hashtags=${encodeURIComponent(
      "FrameInGoa,HackerHouseGoa,HHGoa2026"
    )}`;

    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  const name = userData.name.trim() || "Anonymous Hacker";

  // Split name for two-line display
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const restOfName = nameParts.slice(1).join(" ");
  // Programmatic font size reduction using a non-linear (exponential decay) formula
  const BASE_FONT_SIZE = 40; // Normal Font Size (Tweak this!)
  const SHRINK_THRESHOLD = 12; // Start shrinking if a word is longer than 12 letters

  const calculateFontSize = (text: string) => {
    if (!text) return { fontSize: `${BASE_FONT_SIZE}px`, lineHeight: `${BASE_FONT_SIZE * 0.9}px` };
    const len = text.length;
    let size = BASE_FONT_SIZE;
    if (len > SHRINK_THRESHOLD) {
      const excess = len - SHRINK_THRESHOLD;
      // Non-linear exponential decay: shrinks by 8% for every extra letter
      // This means it shrinks faster and faster the longer the name gets!
      size = Math.max(14, BASE_FONT_SIZE * Math.pow(0.92, excess));
    }
    return {
      fontSize: `${size}px`,
      lineHeight: `${size * 1.05}px`, // Increased line-height so descenders (g, y, j) don't get clipped
    };
  };

  // Calculate size independently so a long second line doesn't shrink a short first line
  const firstNameStyle = calculateFontSize(firstName);
  const restOfNameStyle = calculateFontSize(restOfName);

  const role = userData.role || "Builder";
  const builderClass = userData.builderClass || "Ship or Die Specialist";

  const teamLabel = (userData.isTeam && userData.teamName.trim()) ? "TEAM" : "STATUS";
  const teamValue = (userData.isTeam && userData.teamName.trim()) ? userData.teamName.trim() : "SOLO";

  // TWEAK THIS: Team text font sizing
  const BASE_TEAM_FONT = 16; // Normal size for Team name
  const TEAM_SHRINK_THRESHOLD = 8; // Starts shrinking after 8 characters

  let teamFontSize = BASE_TEAM_FONT;
  if (teamValue.length > TEAM_SHRINK_THRESHOLD) {
    const excess = teamValue.length - TEAM_SHRINK_THRESHOLD;
    // Shrinks by 5% per extra character
    teamFontSize = Math.max(9, BASE_TEAM_FONT * Math.pow(0.95, excess));
  }

  // TWEAK THIS: Builder Title font sizing
  const BASE_BUILDER_FONT = 20; // Increased from 16 to make it slightly bigger!
  const BUILDER_SHRINK_THRESHOLD = 12; // Starts shrinking after 12 characters

  let builderFontSize = BASE_BUILDER_FONT;
  const builderClassStr = builderClass || "";
  if (builderClassStr.length > BUILDER_SHRINK_THRESHOLD) {
    const excess = builderClassStr.length - BUILDER_SHRINK_THRESHOLD;
    // Shrinks by 2% per extra character (Less powerful scaling factor than the others)
    builderFontSize = Math.max(10, BASE_BUILDER_FONT * Math.pow(0.98, excess));
  }
  if (userData.mode === "pfp") {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 w-full">
        {/* Invisible high-res capture node for PFP export */}
        <div 
          ref={captureRef}
          className="absolute -z-50 opacity-0 pointer-events-none"
          style={{ width: "1000px", height: "1000px", borderRadius: "100%", overflow: "hidden", background: "transparent" }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              style={{
                width: isPortrait ? "100%" : "auto",
                height: isPortrait ? "auto" : "100%",
                objectFit: "cover",
                transform: `translate(${transform.panX * (1000/145)}px, ${transform.panY * (1000/145)}px) scale(${transform.zoom}) rotate(${transform.rotate}deg)`,
                transformOrigin: "center center",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#111" }} />
          )}
        </div>
        
        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || !imageSrc}
            className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <span className="animate-pulse">GENERATING PFP...</span>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>DOWNLOAD HIGH-RES PFP</span>
              </>
            )}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleShareToX}
              className="py-3 px-4 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] font-bold text-xs flex items-center justify-center gap-2 transition-all group"
            >
              <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>SHARE TO X</span>
            </button>
            <button
              type="button"
              onClick={handleCopyImage}
              className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group"
            >
              {copied ? (
                <span className="text-emerald-400">COPIED!</span>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-5">
      {/* 3D Interactive Tilt Card Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative holo-card-container select-none w-full max-w-[380px] sm:max-w-[420px]"
        style={{
          perspective: 1200,
          aspectRatio: "420 / 630"
        }}
      >
        <div
          className="relative holo-card-inner rounded-3xl overflow-hidden shadow-2xl transition-transform duration-100 ease-out w-full h-full"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
              isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
              }`,
          }}
        >
          {/* Card Capture Area - Export happens on this node */}
          <div
            ref={captureRef}
            className="relative bg-black w-full h-full overflow-hidden flex items-center justify-center rounded-2xl border border-white/10"
          >
            {/* Base SVG Background */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/card.svg`}
              alt="ID Card Background"
              className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
            />

            {/* Avatar / Profile Image Block */}
            <div
              className="absolute z-10"
              style={{
                // TWEAK THIS: Position of the Avatar Image Block on the card
                top: "19.5%",
                left: "50%",
                transform: "translateX(-50%)", // Centers it horizontally
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* The Actual Avatar Image */}
              <div
                style={{
                  width: "145px",
                  height: "145px",
                  borderRadius: "100%",
                  overflow: "hidden", 
                  position: "relative",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Uploaded Avatar"
                    style={{
                      width: isPortrait ? "100%" : "auto",
                      height: isPortrait ? "auto" : "100%",
                      objectFit: "cover", // Ensures the image fills the square
                        // Applies the pan/zoom/rotate from the form controls
                        transform: `translate(${transform.panX}px, ${transform.panY}px) scale(${transform.zoom}) rotate(${transform.rotate}deg)`,
                        transformOrigin: "center center",
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#111]">
                    <User className="w-16 h-16 text-white/20" strokeWidth={1.5} />
                  </div>
                )}
              </div>

            {/* Dynamic Text Overlays using CSS Absolute Positioning */}

            {/* Name and Builder Title Container (Figma spec + modifications) */}
            <div
              className="absolute z-10"
              style={{
                top: "48%",
                left: "3%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                width: "auto", // Automatically expands horizontally up to max-width
                maxWidth: "350px", // Threshold so it never expands off the 420px wide card
                height: "auto",
                gap: "6px", // Increased gap between name and role block
                transform: "rotate(-1deg)",
              }}
            >
              {/* Heading 1 (Name) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "0px",
                  width: "100%", // Take up available space horizontally
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 900,
                    letterSpacing: "-1.9px",
                    color: "#000000",
                    flex: "none",
                    order: 0,
                    flexGrow: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    paddingRight: "8px", // Added padding so italic/slanted font doesn't clip
                    paddingBottom: "8px", // Added so bottom letters like 'G' and 'y' don't clip
                    paddingTop: "4px", // Added just to be safe for tall ascenders
                  }}
                >
                  <div style={{ fontSize: firstNameStyle.fontSize, lineHeight: firstNameStyle.lineHeight }}>{firstName}</div>
                  {restOfName && <div style={{ fontSize: restOfNameStyle.fontSize, lineHeight: restOfNameStyle.lineHeight }}>{restOfName}</div>}
                </div>
              </div>

              {/* (Role / Stack Box) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  // TWEAK THIS: Padding inside the yellow box (Top/Bottom, Left/Right). Increasing this makes the box thicker.
                  padding: "4px 14px",

                  // TWEAK THIS: This is the MAXIMUM size the box can stretch to before the text gets cut off with "..."
                  maxWidth: "320px",
                  width: "fit-content", // This tells the yellow box to automatically grow and shrink to hug the text exactly
                  height: "auto",

                  // TWEAK THIS: Background color
                  background: "#FFF200",

                  // TWEAK THIS: The drop shadow! (Currently black #000000, but you can change it to Pink #FF00A0 or anything else)
                  boxShadow: "-5px 4px 0px #000000",

                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 700,

                    // TWEAK THIS: The size of the text inside the yellow box! (I increased it from 13px to 16px)
                    fontSize: "16px",
                    lineHeight: "1.2",
                    letterSpacing: "1.3px",
                    textTransform: "uppercase",

                    // TWEAK THIS: The color of the text (Currently Pink #FF00A0)
                    color: "#FF00A0",

                    flex: "none",
                    order: 0,
                    flexGrow: 0,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%", // Ensures it respects the parent's max-width constraint
                  }}
                >
                  {role}
                </div>
              </div>
            </div>

            {/* Builder Title Block (Figma spec + modifications) */}
            <div
              className="absolute z-10"
              style={{
                // TWEAK THIS: How far down from the top of the card (vertical distance)
                top: "77.5%",
                // TWEAK THIS: How far from the left edge of the card
                left: "27%",

                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Aligns the text to the left inside the box

                // TWEAK THIS: Padding (thickness) of the black box
                padding: "8px 20px", // Slightly bigger padding

                background: "#000000",
                borderRadius: "3.5px",
                transform: "rotate(-2deg)",

                // Automatically expands horizontally from the center
                width: "fit-content",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    // Uses the new dynamic (less powerful) scaling factor from the top
                    fontSize: `${builderFontSize}px`,
                    lineHeight: "1.25",
                    letterSpacing: "1.3px",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}
                >
                  {builderClass}
                </div>
              </div>
            </div>

            {/* Team / Status Block (Figma spec + modifications) */}
            <div
              className="absolute z-10"
              style={{
                // TWEAK THIS: Position of the Team box. Placed on the right side.
                top: "54%",
                right: "3%",

                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "5.25px 10.5px",

                background: "#000000",
                border: "2.133px solid #000000",
                // TWEAK THIS: Pink Drop shadow for the team box
                boxShadow: "3px 3px 0px #FF00A0",
                transform: "rotate(2deg)",

                // Allow the box to grow horizontally but limit it
                maxWidth: "160px",
                width: "fit-content",
              }}
            >
              {/* Label (TEAM or STATUS) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    // TWEAK THIS: The size of the "TEAM" or "STATUS" label
                    fontSize: "9px",
                    lineHeight: "13px",
                    textAlign: "center",
                    letterSpacing: "0.9px",
                    textTransform: "uppercase",
                    color: "#99A1AF",
                  }}
                >
                  {teamLabel}
                </div>
              </div>

              {/* Value (Team Name or SOLO) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1.75px 0px 0px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    // This uses the dynamic font size calculation from the top!
                    fontSize: `${teamFontSize}px`,
                    lineHeight: "1",
                    textAlign: "center",
                    color: "#FFF200",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {teamValue}
                </div>
              </div>
            </div>

          </div>

          {/* Holographic Glare Overlay */}
          <div
            className="holo-glare absolute inset-0 z-20 pointer-events-none"
            style={
              {
                "--mouse-x": `${glarePos.x}%`,
                "--mouse-y": `${glarePos.y}%`,
                "--glare-opacity": isHovered ? 0.8 : 0,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* Primary Export & Share Action Buttons */}
      <div className="w-full max-w-md space-y-3 pt-2">
        {/* Main 1-Click Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500 text-black font-mono font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {downloading ? (
            <>
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>EXPORTING HIGH-RES PNG...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>DOWNLOAD HIGH-RES GRAPHIC (PNG)</span>
            </>
          )}
        </button>

        {/* Share to X & Copy Image Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleShareToX}
            className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group"
          >
            <Share2 className="h-4 w-4 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
            <span>SHARE TO X (#FrameInGoa)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-400 hover:bg-cyan-950/20 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all group"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>COPY IMAGE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

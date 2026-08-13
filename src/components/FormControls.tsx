"use client";

import React, { useState } from "react";
import { UserData } from "@/types/generator";
import {
  ROLE_PRESETS,
  getRandomBuilderClass,
} from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { User, Users, Dices, Briefcase, Fingerprint } from "lucide-react";

interface FormControlsProps {
  userData: UserData;
  onChange: (updated: Partial<UserData>) => void;
}

const Label = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <label className="flex items-center gap-1.5 section-label text-hhgoa-green text-[10px]">
    {icon}
    {children}
  </label>
);

export function FormControls({ userData, onChange }: FormControlsProps) {

  const handleRerollClass = () => {
    soundFx.playReroll();
    onChange({ builderClass: getRandomBuilderClass() });
  };

  return (
    <div className="hhgoa-card p-5 space-y-5">

      {/* Card header */}
      <div className="flex items-center justify-between border-b border-hhgoa-black/10 pb-3">
        <div className="flex items-center gap-2 font-heading font-bold text-hhgoa-black text-sm uppercase tracking-wide">
          <Fingerprint className="h-4 w-4 text-hhgoa-green shrink-0" />
          HACKER CREDENTIALS
        </div>
        <span className="flex items-center gap-1 section-label text-[9px] text-hhgoa-green">
          <span className="live-dot" style={{ backgroundColor: "#0b6839" }} />
          AUTO-SAVED
        </span>
      </div>

      {/* Builder Name */}
      <div className="space-y-1.5">
        <Label icon={<User className="h-3 w-3 text-hhgoa-green" />}>
          BUILDER NAME / HANDLE
        </Label>
        <input
          type="text"
          value={userData.name}
          maxLength={30} // Constraint for max characters (you can tweak this!)
          placeholder="e.g. Satoshi Nakamoto"
          onChange={(e) => {
            const val = e.target.value;
            // Constraint for max words (prevents typing a 4th word)
            if (val.split(" ").length > 3) return;
            onChange({ name: val });
          }}
          className="hhgoa-input text-hhgoa-black bg-hhgoa-cream border-hhgoa-green/30 placeholder:text-hhgoa-black/30 focus:border-hhgoa-green"
          style={{ color: "#000", backgroundColor: "var(--hhgoa-cream)" }}
        />
      </div>

      {/* Solo vs Team */}
      <div className="space-y-2">
        <Label icon={<Users className="h-3 w-3 text-hhgoa-green" />}>
          PARTICIPATION FORMAT
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "SOLO HACKER", icon: <User className="h-3.5 w-3.5" />, isTeam: false },
            { label: "TEAM SQUAD",  icon: <Users className="h-3.5 w-3.5" />, isTeam: true  },
          ].map(({ label, icon, isTeam }) => (
            <button
              key={label}
              type="button"
              onClick={() => { soundFx.playClick(); onChange({ isTeam }); }}
              className={`py-2 px-3 font-body text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                userData.isTeam === isTeam
                  ? "bg-hhgoa-green text-hhgoa-white"
                  : "bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/50 hover:text-hhgoa-black"
              }`}
              style={{
                borderRadius: 0,
                boxShadow: userData.isTeam === isTeam ? "3px 4px 0 rgba(0,0,0,0.2)" : "none",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {userData.isTeam && (
          <input
            type="text"
            value={userData.teamName}
            maxLength={20}
            placeholder="Enter Team Name (e.g. ByteBrigade)"
            onChange={(e) => onChange({ teamName: e.target.value })}
            className="hhgoa-input text-xs bg-hhgoa-cream"
            style={{
              color: "#000",
              backgroundColor: "var(--hhgoa-cream)",
              borderColor: "#ff0080",
            }}
          />
        )}
      </div>

      {/* Role / Track */}
      <div className="space-y-1.5">
        <Label icon={<Briefcase className="h-3 w-3 text-hhgoa-green" />}>
          ROLE OR TRACK
        </Label>
        <input
          type="text"
          value={userData.role}
          maxLength={24}
          placeholder="e.g. Backend Specialist"
          onChange={(e) => onChange({ role: e.target.value })}
          className="hhgoa-input text-hhgoa-black bg-hhgoa-cream border-hhgoa-green/30 placeholder:text-hhgoa-black/30 focus:border-hhgoa-green"
          style={{ color: "#000", backgroundColor: "var(--hhgoa-cream)" }}
        />
      </div>

      {/* Builder Class */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label icon={<Dices className="h-3 w-3 text-hhgoa-pink" />}>
            BUILDER CLASS
          </Label>
          <button
            type="button"
            onClick={handleRerollClass}
            className="btn-pill text-[10px] px-2.5 py-1"
            style={{ fontSize: "10px" }}
          >
            🎲 REROLL
          </button>
        </div>
        <input
          type="text"
          value={userData.builderClass}
          maxLength={36} // TWEAK THIS: Set your own maximum character limit for Builder Title here
          placeholder="e.g. Zero-Knowledge Necromancer"
          onChange={(e) => onChange({ builderClass: e.target.value })}
          className="hhgoa-input text-xs bg-hhgoa-cream"
          style={{
            color: "#000",
            backgroundColor: "var(--hhgoa-cream)",
            borderColor: "rgba(255,0,128,0.4)",
          }}
        />
      </div>




    </div>
  );
}

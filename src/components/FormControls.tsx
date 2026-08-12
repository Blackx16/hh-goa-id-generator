"use client";

import React, { useState } from "react";
import { UserData } from "@/types/generator";
import {
  ROLE_PRESETS,
  STACK_SUGGESTIONS,
  getRandomBuilderClass,
  generateHackerId,
} from "@/lib/constants";
import { soundFx } from "@/lib/sound-effects";
import { User, Users, Dices, Briefcase, Layers, Fingerprint, QrCode, Plus, X } from "lucide-react";

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
  const [customSkill, setCustomSkill] = useState("");

  const handleRerollClass = () => {
    soundFx.playReroll();
    onChange({ builderClass: getRandomBuilderClass() });
  };

  const handleRegenId = () => {
    soundFx.playClick();
    onChange({ hackerId: generateHackerId() });
  };

  const toggleStackItem = (skill: string) => {
    soundFx.playClick();
    if (userData.stack.includes(skill)) {
      onChange({ stack: userData.stack.filter((s) => s !== skill) });
    } else if (userData.stack.length < 6) {
      onChange({ stack: [...userData.stack, skill] });
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const t = customSkill.trim();
    if (t && !userData.stack.includes(t) && userData.stack.length < 6) {
      soundFx.playClick();
      onChange({ stack: [...userData.stack, t] });
      setCustomSkill("");
    }
  };

  const removeStackItem = (skill: string) => {
    soundFx.playClick();
    onChange({ stack: userData.stack.filter((s) => s !== skill) });
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
          maxLength={26}
          placeholder="e.g. Satoshi Nakamoto"
          onChange={(e) => onChange({ name: e.target.value })}
          className="hhgoa-input text-hhgoa-black bg-hhgoa-cream border-hhgoa-green/30 placeholder:text-hhgoa-black/30 focus:border-hhgoa-green"
          style={{ color: "#000", backgroundColor: "rgba(11,104,57,0.06)" }}
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
            maxLength={24}
            placeholder="Enter Team Name (e.g. ByteBrigade)"
            onChange={(e) => onChange({ teamName: e.target.value })}
            className="hhgoa-input text-xs"
            style={{
              color: "#000",
              backgroundColor: "rgba(11,104,57,0.06)",
              borderColor: "#ff0080",
            }}
          />
        )}
      </div>

      {/* Role / Track */}
      <div className="space-y-1.5">
        <Label icon={<Briefcase className="h-3 w-3 text-hhgoa-green" />}>
          PRIMARY ROLE / TRACK
        </Label>
        <select
          value={userData.role}
          onChange={(e) => { soundFx.playClick(); onChange({ role: e.target.value }); }}
          className="w-full px-3 py-2.5 font-body text-xs bg-hhgoa-cream border-0 outline-none cursor-pointer text-hhgoa-black font-semibold uppercase tracking-wider"
          style={{
            borderRadius: 0,
            border: "1.5px solid rgba(11,104,57,0.3)",
            boxShadow: "3px 4px 0 rgba(0,0,0,0.12)",
          }}
        >
          {ROLE_PRESETS.map((r) => (
            <option key={r} value={r} className="bg-white">{r}</option>
          ))}
        </select>
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
          maxLength={36}
          placeholder="e.g. Zero-Knowledge Necromancer"
          onChange={(e) => onChange({ builderClass: e.target.value })}
          className="hhgoa-input text-xs"
          style={{
            color: "#000",
            backgroundColor: "rgba(255,0,128,0.05)",
            borderColor: "rgba(255,0,128,0.4)",
          }}
        />
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label icon={<Layers className="h-3 w-3 text-hhgoa-green" />}>
            STACK ARSENAL (MAX 5)
          </Label>
          <span className="font-body text-[10px] text-hhgoa-black/50 font-bold">
            {userData.stack.length}/5
          </span>
        </div>

        {/* Selected chips */}
        {userData.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 bg-hhgoa-green/5 border border-hhgoa-green/15">
            {userData.stack.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2.5 py-1 font-body text-[11px] font-bold bg-hhgoa-green text-hhgoa-white"
                style={{ borderRadius: 0 }}
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeStackItem(item)}
                  className="hover:text-hhgoa-yellow transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-1.5">
          {STACK_SUGGESTIONS.map((skill) => {
            const isSelected = userData.stack.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleStackItem(skill)}
                className={`px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-hhgoa-green text-hhgoa-white"
                    : "bg-hhgoa-cream border border-hhgoa-black/15 text-hhgoa-black/50 hover:text-hhgoa-black"
                }`}
                style={{
                  borderRadius: 0,
                  boxShadow: isSelected ? "2px 3px 0 rgba(0,0,0,0.2)" : "none",
                }}
              >
                {skill}
              </button>
            );
          })}
        </div>

        {/* Custom skill */}
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            maxLength={18}
            placeholder="Add custom skill..."
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1 px-3 py-1.5 font-body text-xs bg-hhgoa-cream text-hhgoa-black placeholder:text-hhgoa-black/30 outline-none border border-hhgoa-black/15 focus:border-hhgoa-green"
            style={{ borderRadius: 0 }}
          />
          <button
            type="submit"
            disabled={!customSkill.trim() || userData.stack.length >= 5}
            className="px-3 py-1.5 font-body text-xs font-bold uppercase bg-hhgoa-green text-hhgoa-white disabled:opacity-40 flex items-center gap-1 transition-opacity"
            style={{ borderRadius: 0 }}
          >
            <Plus className="h-3 w-3" />
            ADD
          </button>
        </form>
      </div>

      {/* Hacker ID + QR */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-hhgoa-black/10">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label icon={<Fingerprint className="h-3 w-3 text-hhgoa-green" />}>
              HACKER ID
            </Label>
            <button
              type="button"
              onClick={handleRegenId}
              className="font-body text-[10px] font-bold uppercase text-hhgoa-pink hover:opacity-75 transition-opacity"
            >
              REGEN
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={userData.hackerId}
            className="w-full px-2.5 py-1.5 font-body text-xs bg-hhgoa-green/8 text-hhgoa-black/70 border border-hhgoa-black/15 outline-none"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div className="space-y-1">
          <Label icon={<QrCode className="h-3 w-3 text-hhgoa-green" />}>
            QR LINK
          </Label>
          <input
            type="text"
            value={userData.qrValue}
            placeholder="https://hhgoa.com/"
            onChange={(e) => onChange({ qrValue: e.target.value })}
            className="w-full px-2.5 py-1.5 font-body text-xs bg-hhgoa-cream text-hhgoa-black/70 border border-hhgoa-black/15 outline-none focus:border-hhgoa-green"
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>
    </div>
  );
}

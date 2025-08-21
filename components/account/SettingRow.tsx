"use client";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

export function SettingRow({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="w-full block rounded-xl bg-[#3B3835] text-left text-white font-semibold
                 px-5 py-5 md:px-6 md:py-6
                 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]
                 hover:bg-[#2b2927] active:translate-y-[0.5px]
                 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{label}</span>
        <ChevronRight className="h-5 w-5 text-white/80" />
      </div>
    </Link>
  );
}

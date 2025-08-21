"use client";
import React from "react";
import { SettingRow } from "@/components/account/SettingRow";

type Row = { label: string; href: string };

const rows: Row[] = [
  { label: "Company Information", href: "/account/company" },
  { label: "Security & Preferences", href: "/account/security" },
  { label: "Notification", href: "/account/notifications" },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="space-y-4">
          {rows.map((r) => (
            <SettingRow key={r.href} label={r.label} href={r.href} />
          ))}
        </div>
      </div>
    </div>
  );
}

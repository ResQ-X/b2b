"use client";
import axiosInstance from "@/lib/axios";
import React, { Suspense, useEffect, useState } from "react";
import { SettingRow } from "@/components/account/SettingRow";

// Force dynamic rendering
export const dynamic = "force-dynamic";

type Row = { label: string; href: string };

function AccountContent() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/fleets/profile");
        setRole(res.data?.data?.role || null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const rows: Row[] = [
    { label: "Company Information", href: "/account/company" },
    { label: "Security & Preferences", href: "/account/security" },
    { label: "Notification", href: "/account/notifications" },
    ...(role === "SUPER" ? [{ label: "Teams", href: "/account/teams" }] : []),
    // ✅ Show Requests if role is SUPER or SUB
    ...(role === "SUPER" || role === "SUB"
      ? [{ label: "Requests", href: "/account/requests" }]
      : []),

    { label: "Logs", href: "/account/logs" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div>
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

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

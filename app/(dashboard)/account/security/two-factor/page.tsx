"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TwoFAPage() {
  return (
    <div className="min-h-screen text-[#FFFFFF]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header (arrow col + title col) */}
        <div className="grid grid-cols-[32px_1fr] items-center gap-2">
          <Link
            href="/account/security"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-lg font-semibold">Two-Factor Authentication</h1>

          {/* Divider aligned with title only */}
          <div className="col-start-2 mt-3 h-[2px] w-full bg-[#777777]" />
        </div>

        {/* Body aligned under title (skip arrow column with a spacer) */}
        <div className="mt-6 grid grid-cols-[32px_1fr] gap-y-6">
          <div /> {/* spacer for arrow column */}
          {/* Put your 2FA content here; sample placeholder block */}
          <div className="rounded-xl bg-[#3B3835] px-5 py-6 md:px-6">
            <p className="text-sm text-white/80">
              Set up Two-Factor Authentication to add an extra layer of security
              to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

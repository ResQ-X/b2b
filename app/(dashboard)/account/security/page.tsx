"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  const router = useRouter();
  const lastChangedText = "Last changed 30 days ago";

  const handleChangePassword = () => {
    router.push("/account/security/change-password");
    console.log("Change password clicked");
  };

  return (
    <div className="min-h-screen text-[#FFFFFF]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header with aligned divider */}
        <div className="grid grid-cols-[32px_1fr] items-center gap-2">
          <Link
            href="/account"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-lg font-semibold">
            Login &amp; Security Settings
          </h1>

          {/* Divider aligned with title (col 2) */}
          <div className="col-start-2 mt-3 h-[2px] w-full bg-[#777777]" />
        </div>

        {/* Body aligned under title (skip col 1 with spacer) */}
        <div className="mt-7 grid grid-cols-[32px_1fr] gap-y-6">
          <div /> {/* spacer */}
          {/* Password Row */}
          <div className="rounded-xl bg-[#3B3835] px-5 py-4 md:px-6 md:py-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="text-lg font-semibold">Password</div>
                <div className="mt-1 text-sm font-medium">
                  {lastChangedText}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleChangePassword}
                className="w-[142px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all duration-200"
              >
                Change Password
              </Button>
            </div>
          </div>
          {/* Example for 2FA row if you bring it back later */}
          {/* <div>
            <Link
              href="/account/security/two-factor"
              className="block rounded-xl bg-[#3B3835] px-5 py-4 md:px-6 md:py-6 hover:bg-[#2b2927] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Two-Factor Authentication
                </span>
                <ChevronRight className="h-5 w-5 text-white/80" />
              </div>
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

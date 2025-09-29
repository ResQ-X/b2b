"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountService } from "@/services/account.service";

export default function SecurityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastChangedText = "Last changed 30 days ago";

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Initializing password change...");

      // Call the init endpoint to send OTP to user's email
      const response = await AccountService.initializeChangePassword();

      console.log("OTP sent successfully:", response);

      // Navigate to change password page after successful OTP send
      router.push("/account/security/change-password");
    } catch (err) {
      console.error("Error initializing password change:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Error message */}
        {error && (
          <div className="mt-4 grid grid-cols-[32px_1fr] gap-2">
            <div /> {/* spacer */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

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
                variant="orange"
                onClick={handleChangePassword}
                disabled={loading}
                className="w-auto h-[48px] lg:h-[52px]"
              >
                {loading ? "Sending OTP..." : "Change Password"}
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

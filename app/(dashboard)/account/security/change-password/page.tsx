"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { AccountService } from "@/services/account.service";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password visibility states
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPw || !newPw || !confirmPw || !token) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await AccountService.changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
        token: token,
      });

      if (response.success) {
        // Success - redirect back to security page
        router.push("/account/security");
      } else {
        setErrorMsg(
          response.message || "Failed to update password. Try again."
        );
      }
    } catch (err: any) {
      console.error("Error changing password:", err);
      setErrorMsg(
        err?.response?.data?.message || "Failed to update password. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#FFFFFF]">
      <div className="w-full lg:w-3/5 px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header (arrow + title) with divider aligned to title */}
        <div className="grid grid-cols-[32px_1fr] items-center gap-2">
          <Link
            href="/account/security"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-lg font-semibold">Change Password</h1>

          {/* Divider starts under title (col 2), not under the arrow */}
          <div className="col-start-2 mt-3 h-[2px] w-full bg-[#777777]" />
        </div>

        {/* Info message about OTP */}
        <div className="mt-6 grid grid-cols-[32px_1fr] gap-2">
          <div /> {/* spacer */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-blue-400 text-sm">
            An OTP has been sent to your email. Please enter it below along with
            your password details.
          </div>
        </div>

        {/* Form aligned under title (skip col 1 with an empty spacer) */}
        <form
          onSubmit={onSubmit}
          className="mt-6 grid grid-cols-[32px_1fr] gap-y-6"
        >
          <div />

          <div className="space-y-6">
            <CustomInput
              label="OTP Code"
              id="otp-token"
              name="token"
              type="text"
              placeholder="Enter the 6-digit code from your email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

            <div className="relative">
              <CustomInput
                label="Current Password"
                id="current-password"
                name="currentPassword"
                type={showCurrentPw ? "text" : "password"}
                placeholder="Enter your current password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((prev) => !prev)}
                className="absolute right-4 top-[70%] -translate-y-1/2 text-white focus:outline-none"
                tabIndex={-1}
                aria-label={showCurrentPw ? "Hide password" : "Show password"}
              >
                {showCurrentPw ? (
                  <EyeOff className="text-white" />
                ) : (
                  <Eye className="text-white" />
                )}
              </button>
            </div>

            <div className="relative">
              <CustomInput
                label="New Password"
                id="new-password"
                name="newPassword"
                type={showNewPw ? "text" : "password"}
                placeholder="Enter new password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPw((prev) => !prev)}
                className="absolute right-4 top-[70%] -translate-y-1/2 text-white focus:outline-none"
                tabIndex={-1}
                aria-label={showNewPw ? "Hide password" : "Show password"}
              >
                {showNewPw ? (
                  <EyeOff className="text-white" />
                ) : (
                  <Eye className="text-white" />
                )}
              </button>
            </div>

            <div className="relative">
              <CustomInput
                label="Confirm New Password"
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPw ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((prev) => !prev)}
                className="absolute right-4 top-[70%] -translate-y-1/2 text-white focus:outline-none"
                tabIndex={-1}
                aria-label={showConfirmPw ? "Hide password" : "Show password"}
              >
                {showConfirmPw ? (
                  <EyeOff className="text-white" />
                ) : (
                  <Eye className="text-white" />
                )}
              </button>
            </div>

            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

            {/* Actions */}
            <div className="mt-2 flex flex-wrap gap-4">
              <Button
                type="submit"
                variant="orange"
                className="w-[215px] h-[48px] lg:h-[52px]"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>

              <Button
                type="button"
                variant="grey"
                className="w-[215px] h-[48px] lg:h-[52px]"
                onClick={() => router.push("/account/security")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

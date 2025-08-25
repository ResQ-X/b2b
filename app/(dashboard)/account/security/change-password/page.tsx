"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/Button";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPw || !newPw || !confirmPw) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: call your API
      // await axiosInstance.post("/account/security/change-password", { currentPw, newPw });
      router.push("/account/security");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to update password. Try again."
      );
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

        {/* Form aligned under title (skip col 1 with an empty spacer) */}
        <form
          onSubmit={onSubmit}
          className="mt-8 grid grid-cols-[32px_1fr] gap-y-6"
        >
          <div />

          <div className="space-y-6">
            <CustomInput
              label="Current Password"
              id="current-password"
              name="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              autoComplete="current-password"
              required
            />

            <CustomInput
              label="New Password"
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              required
            />

            <CustomInput
              label="Confirm New Password"
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              autoComplete="new-password"
              required
            />

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

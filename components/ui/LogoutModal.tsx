"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[380px] rounded-2xl bg-[#2A2929] p-6 text-center text-white shadow-lg">
        <h2 className="text-lg font-semibold">Log Out?</h2>
        <p className="mt-3 text-sm text-white/80">
          Are you sure you want to log out? You’ll need to log in again to
          access your account.
        </p>

        <div className="mt-6 flex justify-between gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-1/2 rounded-lg bg-[#4A4A4A] text-white hover:bg-[#5a5a5a]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="w-1/2 rounded-lg bg-orange text-white hover:bg-orange/90"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

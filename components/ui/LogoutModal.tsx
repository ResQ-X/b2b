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
      <div className="w-[547px] rounded-2xl bg-[#3B3835] p-6 text-center text-[#fff] shadow-lg">
        <h2 className="text-2xl font-semibold">Log Out?</h2>
        <p className="my-9 text-lg font-medium">
          Are you sure you want to log out? You’ll need to log in again to
          access your account.
        </p>

        <div className="my-8 flex justify-between gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-[224px] h-[52px] rounded-lg bg-[#4A4A4A] text-white hover:bg-[#5a5a5a]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-[224px] h-[52px] rounded-lg bg-orange text-white hover:bg-orange/90"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

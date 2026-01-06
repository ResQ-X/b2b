"use client";
import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

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

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="w-11/12 lg:w-[547px] rounded-2xl bg-[#3B3835] p-6 text-center text-[#fff] shadow-lg">
        <h2 className="text-2xl font-semibold">Log Out?</h2>
        <p className="my-9 text-lg font-medium">
          Are you sure you want to log out? You&#39;ll need to log in again to
          access your account.
        </p>

        <div className="my-8 flex flex-col lg:flex-row justify-between gap-4">
          <Button
            variant="grey"
            onClick={onClose}
            className="w-full lg:w-[224px] h-[48px] lg:h-[52px]"
          >
            Cancel
          </Button>
          <Button
            variant="orange"
            onClick={onConfirm}
            className="w-full lg:w-[224px] h-[48px] lg:h-[52px]"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}

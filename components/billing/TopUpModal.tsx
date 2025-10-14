"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { cn } from "@/lib/utils";

type TopUpModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  amount: string;
  onAmountChange: (v: string) => void;
  isProcessing?: boolean;
  onSubmit: () => void;
  quickAmounts?: number[];
  minAmount?: number;
};

const DEFAULT_QUICK = [50000, 100000, 200000, 400000, 500000];

function toDigits(v: string) {
  const d = v.replace(/[^\d]/g, "");
  return d.replace(/^0+(?=\d)/, "");
}
function formatNaira(numStr: string) {
  if (!numStr) return "₦ 0.0";
  const n = Number(numStr);
  if (Number.isNaN(n)) return "₦ 0.0";
  return "₦ " + n.toLocaleString("en-NG");
}

export default function TopUpModal({
  open,
  onOpenChange,
  amount,
  onAmountChange,
  isProcessing,
  onSubmit,
  quickAmounts = DEFAULT_QUICK,
  minAmount = 1,
}: TopUpModalProps) {
  const disabled = isProcessing || !amount || Number(amount) < minAmount;

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[560px] w-[92%] p-0 overflow-hidden",
          "bg-[#1F1F1F] border border-[#2B2B2B] rounded-2xl shadow-2xl"
        )}
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-white text-2xl font-semibold">
              Top Up Wallet
            </DialogTitle>
            <DialogDescription className="text-[#B5B5B5]">
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>

          {/* Amount */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#E7E7E7] mb-2">
              Enter Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF]">
                ₦
              </span>

              {/* keep type=text so we can format freely; we store digits only */}
              <CustomInput
                id="topup-amount"
                name="topup-amount"
                type="text"
                autoFocus
                placeholder="0.0"
                value={amount ? Number(amount).toLocaleString("en-NG") : ""}
                onChange={(e) => onAmountChange(toDigits(e.target.value))}
                onKeyDown={handleEnter}
                className="pl-8"
              />

              {amount && (
                <button
                  type="button"
                  aria-label="Clear amount"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white"
                  onClick={() => onAmountChange("")}
                  disabled={isProcessing}
                >
                  ×
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-[#9A9A9A]">{formatNaira(amount)}</p>
          </div>

          {/* Quick Select */}
          <div className="mt-8">
            <p className="text-[#E7E7E7] font-medium">Quick Select</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickAmounts.map((v) => {
                const active = Number(amount) === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onAmountChange(String(v))}
                    disabled={isProcessing}
                    className={cn(
                      "h-12 rounded-xl border text-left px-4",
                      "bg-[#262626] border-[#3A3A3A] text-[#EAEAEA] hover:bg-[#2E2E2E] transition-colors",
                      active && "ring-2 ring-[#FF8A00]/60 bg-[#2E2B29]"
                    )}
                  >
                    ₦{v.toLocaleString("en-NG")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="button"
              variant="orange"
              className="flex-1 h-12"
              onClick={onSubmit}
              disabled={disabled}
            >
              {isProcessing ? "Processing…" : "Top Up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

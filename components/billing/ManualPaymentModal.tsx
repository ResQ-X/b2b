"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ManualPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setShowPaymentDetails: (show: boolean) => void;
  showPaymentDetails: boolean;
}

const BANK_DETAILS = {
  name: "ResQ-X Technologies Ltd",
  number: "0123456789",
  bank: "First Bank of Nigeria",
};

export default function ManualPaymentModal({
  open,
  onOpenChange,
  setShowPaymentDetails,
}: ManualPaymentModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleProceed = () => {
    // Close this modal
    onOpenChange(false);

    // Open payment details modal
    setTimeout(() => {
      setShowPaymentDetails(true);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 lg:max-w-[640px] rounded-[28px] border border-white/10 bg-[#1F1E1C] text-white p-7 md:p-9 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[28px] font-semibold">
            Add Money Manually
          </DialogTitle>
          <p className="text-sm text-white/70">
            Transfer funds directly to our bank account
          </p>
          <h3 className="text-[#FF8500] text-lg font-semibold mt-3">
            Bank Details
          </h3>
        </DialogHeader>

        {/* Bank Details */}
        <div className="space-y-4 mb-6">
          {[
            { label: "Account Name", value: BANK_DETAILS.name, key: "name" },
            {
              label: "Account Number",
              value: BANK_DETAILS.number,
              key: "number",
            },
            { label: "Bank Name", value: BANK_DETAILS.bank, key: "bank" },
          ].map(({ label, value, key }) => (
            <div key={key}>
              <p className="text-sm text-white/60 mb-1">{label}</p>
              <div className="flex items-center justify-between bg-[#2D2A27] border border-white/10 rounded-2xl px-4 py-4">
                <span className="text-sm md:text-base">{value}</span>
                <button
                  onClick={() => handleCopy(value, key)}
                  className="flex items-center gap-1 text-[#FF8500] text-sm font-medium hover:opacity-80"
                >
                  {copiedField === key ? (
                    <>
                      <Check size={16} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-8">
          <Button
            onClick={handleProceed}
            className="w-full h-[58px] bg-[#FF8500] hover:bg-[#E67600] text-white font-semibold rounded-2xl transition-colors"
          >
            I&#39;ve Sent The Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

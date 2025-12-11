import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";

type ReclaimFundsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, note: string, password: string) => Promise<void>;
  userName: string;
  subAccountId: string;
};

export default function ReclaimFundsModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: //   subAccountId,
ReclaimFundsModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setIsLoading(true);
      await onConfirm(amountNum, note.trim(), password);
      // Reset form on success
      setAmount("");
      setNote("");
      setPassword("");
      onClose();
    } catch (err: any) {
      // Error is handled in parent, but we keep the modal open
      console.error("Reclaim failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setNote("");
      setPassword("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#2D2A27] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Reclaim Funds
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Reclaim funds from {userName}&#39;s wallet. Enter the amount and
            your password to confirm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white/90">
              Amount (₦)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                ₦
              </span>
              <CustomInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8 bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-white/90">
              Note (Optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for reclaiming funds..."
              className="bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">
              Your Password
            </Label>
            <CustomInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
              disabled={isLoading}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              //   variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Processing..." : "Reclaim Funds"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface DisburseMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: DisburseData) => Promise<void> | void;
  availableBalance?: number | null;
}

interface DisburseData {
  subAccountId: string;
  amount: number;
  note?: string;
  password: string;
}

type SubAdmin = {
  id: string;
  name: string | null;
  email: string;
  role: string; // "SUB"
};

export default function DisburseMoneyModal({
  open,
  onOpenChange,
  onSubmit,
  availableBalance,
}: DisburseMoneyModalProps) {
  const [subAccountId, setSubAccountId] = useState("");
  // amountNumber is what you POST; amountText is what the user sees (formatted)
  const [amountNumber, setAmountNumber] = useState<number>(5500);
  const [amountText, setAmountText] = useState<string>("5,500");
  const [note, setNote] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [subs, setSubs] = useState<SubAdmin[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  // -------- helpers: format as you type (₦, commas, keep decimals) --------
  const formatWithGrouping = (intPart: string) => {
    // remove leading zeros (keep single zero)
    const normalized = intPart.replace(/^0+(?=\d)/, "");
    return normalized
      ? Number(normalized).toLocaleString("en-NG", {
          maximumFractionDigits: 0,
        })
      : "0";
  };

  const onAmountChange = (raw: string) => {
    // keep only digits and at most one dot
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const intPart = parts[0] ?? "";
    let fracPart = parts[1] ?? "";

    // cap to 2 decimals
    if (fracPart.length > 2) fracPart = fracPart.slice(0, 2);

    // build formatted string while preserving decimals if present
    const formattedInt = intPart ? formatWithGrouping(intPart) : "0";
    const nextText =
      parts.length > 1 ? `${formattedInt}.${fracPart}` : formattedInt;

    setAmountText(nextText);

    // parse to number for validation/posting
    const num = parseFloat(intPart + (fracPart ? `.${fracPart}` : ""));
    setAmountNumber(Number.isFinite(num) ? num : 0);
  };

  // also format on blur to normalize (e.g., "100." -> "100")
  const onAmountBlur = () => {
    const num = Number.isFinite(amountNumber) ? amountNumber : 0;
    const normalized = num.toLocaleString("en-NG", {
      minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    });
    setAmountText(normalized);
  };

  useEffect(() => {
    if (!open) return;

    const fetchSubs = async () => {
      setSubsLoading(true);
      try {
        const res = await axiosInstance.get<SubAdmin[]>("/super/team");
        const onlySubs = (res.data || []).filter((u) => u.role === "SUB");
        setSubs(onlySubs);
        if (onlySubs.length === 0) {
          toast.info("No Sub-Admins found yet. Invite one to disburse funds.");
        }
      } catch (err: any) {
        console.error("Failed to fetch sub-admins:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load sub-admins.";
        toast.error(msg);
      } finally {
        setSubsLoading(false);
      }
    };

    fetchSubs();
  }, [open]);

  const formattedBalance =
    typeof availableBalance === "number"
      ? `₦${availableBalance.toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "₦0.00";

  // enable when: recipient picked, amount > 0, <= balance (if provided), password present
  const canSubmit =
    !!subAccountId &&
    amountNumber > 0 &&
    (typeof availableBalance === "number"
      ? amountNumber <= availableBalance
      : true) &&
    password.trim().length > 0;

  const handleSubmit = async () => {
    if (!subAccountId) return toast.error("Please select a recipient.");
    if (!(amountNumber > 0)) return toast.error("Please enter a valid amount.");
    if (
      typeof availableBalance === "number" &&
      amountNumber > (availableBalance ?? 0)
    )
      return toast.error("Amount exceeds available balance.");
    if (!password.trim()) return toast.error("Please enter your password.");

    const payload: DisburseData = {
      subAccountId,
      amount: amountNumber,
      note: note?.trim() || undefined,
      password,
    };

    setProcessing(true);
    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // Example fallback:
        // await axiosInstance.post("/super/disburse", payload);
      }

      // reset
      setSubAccountId("");
      setAmountNumber(0);
      setAmountText("0");
      setNote("");
      setPassword("");
      onOpenChange(false);
    } catch (error) {
      console.error("Disburse error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 lg:max-w-[640px] rounded-[28px] border border-white/10 bg-[#1F1E1C] text-white p-7 md:p-9 max-h-[90vh] overflow-y-auto overscroll-contain">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            Disburse Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Recipient */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Select Recipient
            </label>
            <div className="relative">
              <select
                value={subAccountId}
                onChange={(e) => setSubAccountId(e.target.value)}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10"
                disabled={subsLoading}
              >
                <option value="">
                  {subsLoading ? "Loading Sub-Admins..." : "Select Sub-Admin"}
                </option>
                {subs.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name?.trim() ? `${u.name} (${u.email})` : u.email}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Enter Amount (formatted as you type) */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Enter Amount
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amountText}
                onChange={(e) => onAmountChange(e.target.value)}
                onBlur={onAmountBlur}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text");
                  onAmountChange(text);
                }}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 pr-28"
                placeholder="5,500"
                aria-label="Amount"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 select-none">
                ₦
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-white/60">Available Balance</p>
              <div className="text-[#FF8500] font-medium text-xs">
                {formattedBalance}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional note/reference"
              rows={3}
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 border border-white/10"
            />
          </div>

          {/* Password with visibility toggle */}
          <div className="relative">
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your login password"
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 border border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-[70%] -translate-y-1/2 text-white/80"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <DialogFooter className="mt-6 flex w-full gap-4">
          <Button
            onClick={handleSubmit}
            variant="orange"
            disabled={processing || !canSubmit}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
          >
            {processing ? "Processing..." : "Disburse Money"}
          </Button>

          <Button
            type="button"
            variant="black"
            onClick={() => onOpenChange(false)}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

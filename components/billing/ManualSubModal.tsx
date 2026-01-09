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
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount?: string;
  availableBalance?: number | null;
}

interface RequestData {
  amount: number;
  type: "SUBSCRIPTION";
  receipt_url: string;
  note?: string;
  sub_months?: number;
  sub_category?: "UNLIMITED_CALLOUT" | "CAPPED_CALLOUT";
}

export default function PaymentDetailsModal({
  open,
  onOpenChange,
}: PaymentDetailsModalProps) {
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [subMonths, setSubMonths] = useState("1");
  const [subCategory, setSubCategory] = useState<
    "UNLIMITED_CALLOUT" | "CAPPED_CALLOUT"
  >("UNLIMITED_CALLOUT");
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PNG, JPG or JPEG file");
        return;
      }

      if (file.size <= 5 * 1024 * 1024) {
        setReceipt(file);
      } else {
        toast.error("File size must be less than 5MB");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PNG, JPG or JPEG file");
        return;
      }

      if (file.size <= 5 * 1024 * 1024) {
        setReceipt(file);
      } else {
        toast.error("File size must be less than 5MB");
      }
    }
  };

  const uploadReceipt = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("type", "FLEET_RECEIPT");

    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Response is an array of URLs directly
    if (response.data && Array.isArray(response.data) && response.data[0]) {
      return response.data[0];
    }
    throw new Error("Failed to upload receipt");
  };

  const handleSubmit = async () => {
    if (!receipt) {
      toast.error("Please upload a receipt");
      return;
    }

    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setProcessing(true);
    setUploading(true);

    try {
      // Upload receipt first
      toast.info("Uploading receipt...");
      const receiptUrl = await uploadReceipt(receipt);
      setUploading(false);

      // Prepare request data
      const requestData: RequestData = {
        amount: numericAmount,
        type: "SUBSCRIPTION",
        receipt_url: receiptUrl,
        note: note || undefined,
        sub_months: parseInt(subMonths),
        sub_category: subCategory,
      };

      // Submit manual fund request
      toast.info("Submitting payment details...");
      const response = await axiosInstance.post(
        "/fleet-wallet/manuel-fund-request",
        requestData
      );

      if (response.data?.status === "OK" || response.data?.success) {
        toast.success(
          response.data?.message || "Payment details submitted successfully!"
        );

        // Reset form
        setAmount("");
        setNote("");
        setReceipt(null);
        setSubMonths("1");
        setSubCategory("UNLIMITED_CALLOUT");

        onOpenChange(false);
      } else {
        toast.error(
          response.data?.message || "Failed to submit payment details"
        );
      }
    } catch (error: any) {
      console.error("Payment submission error:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to submit payment details. Please try again.";
      toast.error(errMsg);
    } finally {
      setProcessing(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-11/12
          lg:max-w-[640px]
          rounded-[28px]
          border border-white/10
          bg-[#1F1E1C]
          text-white
          p-7 md:p-9
          max-h-[90vh]
          overflow-y-auto
          overscroll-contain
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            Payment Details
          </DialogTitle>
          <DialogTitle className="text-[14px] leading-8 font-medium text-white/70">
            Please provide the payment information below
          </DialogTitle>
          <DialogTitle className="text-[#FF8500] text-[18px] leading-8 font-semibold mt-3">
            Payment Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10"
                placeholder="₦4,500.00"
              />
            </div>
          </div>

          {/* Upload Receipt */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Upload receipt
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative border-2 border-dashed border-[#0EA5E9] rounded-2xl bg-[#2D2A27] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#3D3A37] transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="bg-[#3D3A37] p-4 rounded-lg mb-4">
                <Upload className="w-6 h-6 text-[#FF8500]" />
              </div>
              <p className="text-white text-sm mb-1">
                {receipt ? receipt.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-white/60 text-xs">
                PNG, JPG or JPEG (max. 5MB)
              </p>
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
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 min-h-[100px] resize-none"
              placeholder="Add additional Information"
            />
          </div>

          {/* Sub Months */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Sub Month
            </label>
            <div className="relative">
              <select
                value={subMonths}
                onChange={(e) => setSubMonths(e.target.value)}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Sub Category */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Sub Category
            </label>
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) =>
                  setSubCategory(
                    e.target.value as "UNLIMITED_CALLOUT" | "CAPPED_CALLOUT"
                  )
                }
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 appearance-none cursor-pointer"
              >
                <option value="UNLIMITED_CALLOUT">Unlimited Callout</option>
                <option value="CAPPED_CALLOUT">Capped Callout</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex w-full">
          <Button
            onClick={handleSubmit}
            disabled={processing || !receipt}
            className="flex-1 w-full h-[58px] lg:h-[60px] bg-[#FF8500] hover:bg-[#E67600] text-white font-semibold rounded-2xl disabled:opacity-50 transition-colors"
          >
            {uploading
              ? "Uploading..."
              : processing
              ? "Submitting..."
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

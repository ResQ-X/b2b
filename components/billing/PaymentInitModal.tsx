import React, { useState } from "react";
import axiosInstance from "@/lib/axios";

export function PaymentInitModal({
  isOpen,
  onClose,
  estimateData,
}: {
  isOpen: boolean;
  onClose: () => void;
  estimateData: any;
}) {
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total based on billing cycle
  const calculateTotal = () => {
    const monthlyTotal = estimateData.total_amount;
    if (billingCycle === "ANNUAL") {
      return monthlyTotal * 12;
    }
    return monthlyTotal;
  };

  const getCategoryLabel = (category: string) => {
    return category === "UNLIMITED_CALLOUT"
      ? "Unlimited Callout"
      : "Capped Callout (8x/month)";
  };

  const handleInitPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/fleet-subscription/assign/init",
        {
          asset_count: estimateData.asset_count,
          billing_cycle: billingCycle,
          category: estimateData.category,
          starts_at: new Date().toISOString(),
        }
      );

      if (response.data.success) {
        setPaymentData(response.data.data);
        setShowPaystackModal(true);
      } else {
        throw new Error(
          response.data.message || "Failed to initialize payment"
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = async () => {
    setShowPaystackModal(false);

    // Call verify endpoint
    try {
      const response = await axiosInstance.post(
        "/fleet-subscription/assign/verify",
        {
          plan_id: paymentData.plan_code,
          payment_ref: paymentData.reference,
          start_date: new Date().toISOString(),
          billing_cycle: billingCycle,
        }
      );

      if (response.data.success) {
        // Close all modals and refresh
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to verify payment. Please contact support."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-[#3B3835] rounded-2xl max-w-md w-full p-6 border border-[#777777]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Initialize Subscription
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Estimate Summary */}
          <div className="mb-6 p-4 bg-[#2C2926] border border-[#777777] rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#CCC8C4] text-sm">Assets:</span>
              <span className="text-white font-semibold">
                {estimateData.asset_count}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#CCC8C4] text-sm">Category:</span>
              <span className="text-white font-semibold">
                {getCategoryLabel(estimateData.category)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#CCC8C4] text-sm">Per Asset:</span>
              <span className="text-white font-semibold">
                {formatCurrency(estimateData.per_asset)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#CCC8C4] text-sm">Billing Cycle:</span>
              <span className="text-white font-semibold">
                {billingCycle === "MONTHLY" ? "Monthly" : "Annual"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-[#777777]">
              <span className="text-white font-semibold">Total Amount:</span>
              <span className="text-[#FF9933] font-bold text-xl">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>

          {/* Billing Cycle Selection */}
          <div className="mb-6">
            <label className="block text-[#CCC8C4] text-sm font-medium mb-3">
              Select Billing Cycle
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  billingCycle === "MONTHLY"
                    ? "bg-[#FF9933] text-white"
                    : "bg-[#2C2926] text-[#CCC8C4] border border-[#777777] hover:border-[#FF9933]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("ANNUAL")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  billingCycle === "ANNUAL"
                    ? "bg-[#FF9933] text-white"
                    : "bg-[#2C2926] text-[#CCC8C4] border border-[#777777] hover:border-[#FF9933]"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#2C2926] border border-[#777777] text-white font-semibold py-3 px-6 rounded-lg hover:border-[#FF9933] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInitPayment}
              disabled={loading}
              className="flex-1 bg-[#FF9933] hover:bg-[#FF8C1A] disabled:bg-[#775533] disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Paystack Modal */}
      {showPaystackModal && paymentData && (
        <PaystackModal
          authorizationUrl={paymentData.authorization_url}
          onClose={handlePaystackClose}
        />
      )}
    </>
  );
}

function PaystackModal({
  authorizationUrl,
  onClose,
}: {
  authorizationUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Payment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Iframe */}
        <iframe
          src={authorizationUrl}
          className="flex-1 w-full"
          title="Paystack Payment"
        />
      </div>
    </div>
  );
}

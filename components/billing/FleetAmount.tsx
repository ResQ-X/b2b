import React, { useState } from "react";
import axiosInstance from "@/lib/axios";
import { PaymentInitModal } from "./PaymentInitModal";

function FleetAmount() {
  const [assetCount, setAssetCount] = useState("");
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleProceed = async () => {
    if (!assetCount || assetCount <= 0) {
      setError("Please enter a valid number of assets");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/fleet-subscription/assign/estimate",
        {
          asset_count: parseInt(assetCount),
          billing_cycle: "MONTHLY",
        }
      );

      if (response.data.success) {
        setPricing(response.data.data);
        setShowPaymentModal(true);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch pricing estimate"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4 rounded-2xl bg-[#3B3835] text-[#FFFFFF] p-5 md:p-6 border border-[#777777]">
        <p className="pb-3 text-[#FFFFFF] text-2xl font-semibold">
          Subscription
        </p>
        <p className="mb-6 text-sm font-medium text-[#CCC8C4]">
          Add the number of assets to get your subscription pricing
        </p>

        <div className="mb-6">
          <p className="pb-3 text-sm font-medium text-[#CCC8C4]">
            How many assets would you like to add?
          </p>
          <input
            type="number"
            min="1"
            value={assetCount}
            onChange={(e) => setAssetCount(e.target.value)}
            placeholder="Enter no of assets"
            className="w-full bg-[#2C2926] border border-[#777777] rounded-lg px-4 py-3 text-[#FFFFFF] placeholder-[#777777] focus:outline-none focus:border-[#FF9933]"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleProceed}
          disabled={loading}
          className="w-full bg-[#FF9933] hover:bg-[#FF8C1A] disabled:bg-[#775533] disabled:cursor-not-allowed text-[#FFFFFF] font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? "Loading..." : "Proceed"}
        </button>
      </div>

      {/* Payment Modal */}
      {pricing && (
        <PaymentInitModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          estimateData={pricing}
        />
      )}
    </>
  );
}

export default FleetAmount;

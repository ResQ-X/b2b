"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import CardImage from "@/public/resq-x-card.svg";
import { Button } from "../ui/button";

export function WalletHeaderCard() {
  type WalletBalance = { balance: number };
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUpInitiate = async () => {
    try {
      setIsProcessing(true);

      const response = await axiosInstance.post(
        "/fleet-wallet/top-up-initiate",
        {
          amount: parseFloat(topUpAmount),
        }
      );

      const { authorization_url, reference } = response.data.data;

      // Store reference to verify later
      sessionStorage.setItem("paystack_reference", reference);

      // Open Paystack in a popup window
      const popup = window.open(
        authorization_url,
        "PaystackPayment",
        "width=600,height=700,left=200,top=100"
      );

      // Check if popup was blocked
      if (!popup) {
        toast.error("Please allow popups for this site to complete payment");
        setIsProcessing(false);
        return;
      }

      // Close the top-up modal
      setTopUpOpen(false);
      setTopUpAmount("");
      setIsProcessing(false);

      // Monitor popup window
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // When popup closes, verify payment
          verifyPayment(reference);
        }
      }, 500);
    } catch (error) {
      console.error("Failed to initiate top-up:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    try {
      toast.info("Verifying payment...");

      const response = await axiosInstance.post(
        "/fleet-wallet/verify-payment",
        {
          ref,
          action: "TOP_UP",
        }
      );

      if (response.data.status === "OK") {
        toast.success(response.data.message);

        // Refresh wallet balance
        const balanceResponse = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(balanceResponse?.data?.data);

        // Remove stored reference
        sessionStorage.removeItem("paystack_reference");
      } else {
        toast.error("Payment verification failed.");
        sessionStorage.removeItem("paystack_reference");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
      sessionStorage.removeItem("paystack_reference");
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);
  return (
    <div className="relative w-full h-auto rounded-[28px] overflow-hidden p-6 md:p-7 lg:p-8 flex justify-between items-center bg-gradient-to-r from-[#9A6200] to-[#3B3835] text-white border border-[#A33F00]">
      <div className="relative z-10 min-w-0 text-[#FFFFFF]">
        <p className="text-sm font-medium">Total Balance</p>
        {/* <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight mt-3 mb-7">
          ₦64,500.00
        </h2> */}
        <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight mt-3 mb-7">
          {loading
            ? "......."
            : `₦${(walletBalance?.balance ?? 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </h2>

        <Button
          variant="orange"
          className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
          onClick={() => setTopUpOpen(true)}
        >
          Top Up Wallet
        </Button>
      </div>

      <div className="hidden absolute inset-0 lg:flex justify-end items-end">
        <Image
          src={CardImage}
          alt="ResQ-X Card"
          className="w-auto h-full object-contain"
          priority
        />
      </div>
      {topUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Top Up Wallet
            </h2>
            <p className="text-gray-600 mb-4">
              Enter the amount you want to add to your wallet
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="1"
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                onClick={() => {
                  setTopUpOpen(false);
                  setTopUpAmount("");
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleTopUpInitiate}
                disabled={
                  !topUpAmount || parseFloat(topUpAmount) <= 0 || isProcessing
                }
              >
                {isProcessing ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

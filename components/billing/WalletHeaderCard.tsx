"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import CardImage from "@/public/resq-x-card.svg";
import TopUpModal from "@/components/billing/TopUpModal";
import { Button } from "../ui/button";
import DisburseMoneyModal from "@/components/billing/DisburseMoneyModal";
import RequestMoneyModal from "@/components/billing/RequestMoneyModal";

export function WalletHeaderCard({ role }: { role?: string }) {
  type WalletBalance = { balance: number; overdraftBalance: number };

  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [showDisburse, setShowDisburse] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const availableBalance = walletBalance?.balance ?? 0.0;
  const overdraftBalance = walletBalance?.overdraftBalance ?? 0.0;

  const handleDisburseSubmit = async (data: any) => {
    console.log("Disburse data:", data);
    try {
      // Start request
      toast.info("Submitting disbursement...");
      const response = await axiosInstance.post("/super/wallet/disburse", data);

      if (response.data?.status === "OK" || response.data?.success) {
        toast.success(
          response.data?.message || "Funds disbursed successfully!"
        );
        setShowDisburse(false);
      } else {
        toast.error(response.data?.message || "Failed to disburse funds.");
      }
    } catch (error: any) {
      console.error("Disburse failed:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to disburse funds. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleRequestSubmit = async (data: any) => {
    console.log("Request data:", data);

    try {
      // Start request
      toast.info("Submitting fund request...");
      const response = await axiosInstance.post("/sub/fund-requests", data);

      if (response.data?.status === "OK" || response.data?.success) {
        toast.success(
          response.data?.message || "Fund request submitted successfully!"
        );
        setShowRequest(false); // close modal
      } else {
        toast.error(response.data?.message || "Failed to submit fund request.");
      }
    } catch (error: any) {
      console.error("Fund request failed:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to submit fund request. Please try again.";
      toast.error(errMsg);
    }
  };

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

      sessionStorage.setItem("paystack_reference", reference);

      const popup = window.open(
        authorization_url,
        "PaystackPayment",
        "width=600,height=700,left=200,top=100"
      );

      if (!popup) {
        toast.error("Please allow popups for this site to complete payment");
        setIsProcessing(false);
        return;
      }

      setTopUpOpen(false);
      setTopUpAmount("");
      setIsProcessing(false);

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
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
        setLoading(true);
        const balanceResponse = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(balanceResponse?.data?.data);
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      sessionStorage.removeItem("paystack_reference");
      setLoading(false);
    }
  };

  // Fetch balance on mount
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
        toast.error("Failed to load wallet balance.");
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
        <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight mt-3 mb-7">
          {loading
            ? "......."
            : `₦${availableBalance.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
        </h2>

        {role === "SUPER" || role === "USER" && (
          <p className="text-[#FF8500] mb-2">
            {loading
              ? "......."
              : `₦ - ${overdraftBalance.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
          </p>
        )}


        <div className="flex gap-4">
          {role !== "SUB" && (
            <Button
              variant="orange"
              className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
              onClick={() => setTopUpOpen(true)}
            >
              Top Up Wallet
            </Button>
          )}

          {role === "SUPER" && (
            <Button
              variant="light"
              className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
              onClick={() => setShowDisburse(true)}
            >
              Disburse Money
            </Button>
          )}

          {role === "SUB" && (
            <Button
              variant="light"
              className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
              onClick={() => setShowRequest(true)}
            >
              Request Money
            </Button>
          )}
        </div>
      </div>

      <div className="hidden absolute inset-10 lg:flex justify-end items-end">
        <Image
          src={CardImage}
          alt="ResQ-X Card"
          className="w-auto h-full object-contain"
          priority
        />
      </div>

      {/* Top-up modal */}
      <TopUpModal
        open={topUpOpen}
        onOpenChange={(v) => {
          setTopUpOpen(v);
          if (!v) setTopUpAmount("");
        }}
        amount={topUpAmount}
        onAmountChange={setTopUpAmount}
        isProcessing={isProcessing}
        onSubmit={handleTopUpInitiate}
      />

      {/* Pass a NUMBER down to the modals */}
      <DisburseMoneyModal
        open={showDisburse}
        availableBalance={availableBalance}
        onOpenChange={setShowDisburse}
        onSubmit={handleDisburseSubmit}
      />

      <RequestMoneyModal
        open={showRequest}
        availableBalance={availableBalance}
        onOpenChange={setShowRequest}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}

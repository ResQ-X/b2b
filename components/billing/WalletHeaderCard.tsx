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
import ManualPaymentModal from "@/components/billing/ManualPaymentModal";
import PaymentDetailsModal from "@/components/billing/PaymentDetailsModal";
import { formatCurrency } from "@/lib/utils";

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

  const [showManualPayment, setShowManualPayment] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

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
          callback_url: `${window.location.origin}/payment/payment_callback`,
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

      // Poll the popup to check for closure or URL change
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          verifyPayment(reference);
          return;
        }

        try {
          // Wrap in try-catch to handle cross-origin restrictions
          const currentUrl = popup.location.href;
          if (
            currentUrl.includes("payment/payment_callback") ||
            currentUrl.includes(window.location.host)
          ) {
            // URL changed to our domain - successful redirection
            clearInterval(checkPopup);
            popup.close();
            verifyPayment(reference);
          }
        } catch (e) {
          // Ignore cross-origin errors while user is on Paystack domain
        }
      }, 1000);

      // Listen for postMessage from backend success page
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === "PAYMENT_SUCCESS") {
          // Verify reference matches if needed, or just proceed
          if (event.data?.reference === reference) {
            clearInterval(checkPopup);
            popup.close(); // Ensure popup is closed
            verifyPayment(reference);
            window.removeEventListener("message", messageHandler);
          }
        }
      };

      window.addEventListener("message", messageHandler);
    } catch (error) {
      console.error("Failed to initiate top-up:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    try {
      toast.info("Refreshing wallet balance...");

      // Refresh wallet balance
      setLoading(true);
      const balanceResponse = await axiosInstance.get(
        "/fleet-wallet/get-wallet-balance"
      );
      setWalletBalance(balanceResponse?.data?.data);

      setTopUpOpen(false);
      setTopUpAmount("");
      setIsProcessing(false);
      toast.success("Wallet balance updated");
    } catch (error) {
      console.error("Balance refresh failed:", error);
      toast.error("Failed to refresh balance. Please reload the page.");
      setIsProcessing(false);
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

        <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight mt-3 mb-5">
          {loading
            ? "......."
            : formatCurrency(availableBalance.toLocaleString())}
        </h2>

        {role === "USER" && (
          <p className="text-[#FF613E] font-medium text-lg mb-2">
            <span className="text-[#E2E2E2] text-[16px]">Overdraft: </span>
            {loading
              ? "......."
              : formatCurrency(overdraftBalance.toLocaleString())}
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

          <Button
            variant="grey"
            className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
            onClick={() => setShowManualPayment(true)}
          >
            Top Up Manually
          </Button>
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

      <ManualPaymentModal
        open={showManualPayment}
        onOpenChange={setShowManualPayment}
        setShowPaymentDetails={setShowPaymentDetails}
        showPaymentDetails={showPaymentDetails}
      />

      <PaymentDetailsModal
        open={showPaymentDetails}
        onOpenChange={setShowPaymentDetails}
      />
    </div>
  );
}

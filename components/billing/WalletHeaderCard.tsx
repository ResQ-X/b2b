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


export function WalletHeaderCard() {
  type WalletBalance = { balance: number };
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [showDisburse, setShowDisburse] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const handleDisburseSubmit = (data: any) => {
    console.log('Disburse data:', data);
    // Add your API call here
  };

  const handleRequestSubmit = (data: any) => {
    console.log('Request data:', data);
    // Add your API call here
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
        <div className="flex gap-4">
          <Button
            variant="orange"
            className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
            onClick={() => setTopUpOpen(true)}
          >
            Top Up Wallet
          </Button>

          {/**<Button
            variant="light"
            className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
            onClick={() => setShowDisburse(true)}
          >
            Disburse Money
          </Button>   **/     } 

          <Button
            variant="light"
            className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
            onClick={() => setShowRequest(true)}
          >
            Request Money
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
        onOpenChange={setShowDisburse}
        onSubmit={(data) => console.log('Disburse:', data)}
      />

      <RequestMoneyModal
        open={showRequest}
        onOpenChange={setShowRequest}
        onSubmit={(data) => console.log('Request:', data)}
      />
    </div>
  );
}

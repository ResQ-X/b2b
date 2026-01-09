"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { WalletHeaderCard } from "@/components/billing/WalletHeaderCard";
import { Tabs } from "@/components/billing/Tabs";
import { BillingTable } from "@/components/billing/BillingTable";
import { OverDraftTable } from "@/components/billing/OverDraftTable";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import FleetAmount from "@/components/billing/FleetAmount";
import NeedOverdraft from "@/components/billing/NeedOverdraft";

export const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

type UserProfile = {
  id: string;
  name: string;
  company_name: string;
  email: string;
  company_email: string;
  phone: string;
  company_phone: string;
  role?: string;
};

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<"subscription" | "billing" | "Overdraft">(
    "billing"
  );
  const [showPicker, setShowPicker] = useState(false);
  const [showOverdraftModal, setShowOverdraftModal] = useState(true);

  const handleConfirmOverdraft = () => {
    setShowOverdraftModal(false);
    setShowPicker(true);
    // showRightPane(true)
  };

  console.log("loading", loading);

  const showRightPane = tab === "subscription" && showPicker;
  const isUser = userProfile?.role === "USER";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/fleets/profile");
        const profile = response.data.data;
        setUserProfile(profile);

        // Set default tab based on role
        if (profile?.role === "USER") {
          setTab("subscription");
        } else {
          setTab("billing");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col gap-4">
      {/* WalletHeader stays fixed width */}
      <div className="w-full lg:w-3/5">
        <WalletHeaderCard role={userProfile?.role} />
      </div>

      {/* Tabs for all roles */}
      <div className="w-full">
        <Tabs value={tab} onChange={setTab} role={userProfile?.role} />
      </div>

      {/* Subscription tab content - USER only */}
      {isUser && tab === "subscription" && (
        <div
          className={
            showRightPane
              ? "w-full flex flex-col lg:flex-row justify-between gap-6"
              : "w-full lg:w-3/5"
          }
        >
          <div className={showRightPane ? "w-full lg:w-1/2" : "w-full"}>
            <CurrentPlanCard onUpgrade={() => setShowPicker(true)} />
            {showRightPane && <FleetAmount />}
          </div>
        </div>
      )}

      {/* Billing tab content - all roles */}
      {tab === "billing" && (
        <div className="w-full">
          <BillingTable />
        </div>
      )}

      {/* Overdraft tab content */}
      {tab === "Overdraft" && (
        <div className="w-full">
          <OverDraftTable />
        </div>
      )}

      {userProfile?.role === "USER" && (
        <NeedOverdraft
          isOpen={showOverdraftModal}
          onClose={() => setShowOverdraftModal(false)}
          onConfirm={handleConfirmOverdraft}
        />
      )}
    </div>
  );
}

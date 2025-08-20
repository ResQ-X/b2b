"use client";
import React, { useState } from "react";
import { WalletHeaderCard } from "@/components/billing/WalletHeaderCard";
import { Tabs } from "@/components/billing/Tabs";
import { FeaturePanel } from "@/components/billing/FeaturePanel";
import { BillingTable } from "@/components/billing/BillingTable";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { PlanPicker } from "@/components/billing/PlanPicker";

export const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export default function BillingPage() {
  const [tab, setTab] = useState<"subscription" | "billing">("subscription");
  const [showPicker, setShowPicker] = useState(false);

  const showRightPane = tab === "subscription" && showPicker;

  return (
    <div className="w-full h-auto flex flex-col gap-4">
      {/* WalletHeader stays fixed width (do not change) */}
      <div className="w-3/5">
        <WalletHeaderCard />
      </div>

      {/* Tabs: match original behavior */}
      <div className={tab === "subscription" ? "w-3/5" : "w-full"}>
        <Tabs value={tab} onChange={setTab} />
      </div>

      {tab === "subscription" ? (
        <div
          className={
            showRightPane ? "w-full flex justify-between gap-6" : "w-3/5"
          }
        >
          {/* Left column */}
          <div className={showRightPane ? "w-3/5" : "w-full"}>
            <CurrentPlanCard onUpgrade={() => setShowPicker(true)} />
            <FeaturePanel />
          </div>

          {/* Right column (shows at the right, not below) */}
          {showRightPane && (
            <div className="w-[35%] bg-[#3B3835] rounded-2xl h-[810px] shrink-0 mt-[-21rem]">
              <PlanPicker
                current="basic"
                onClose={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <BillingTable />
        </div>
      )}
    </div>
  );
}

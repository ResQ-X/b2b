"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "../ui/button";

/* ————— Types (MATCH BACKEND EXACTLY) ————— */
type PlanType = "REFUEL" | "FLEET" | "RESCUE";
type BillingCycle = "MONTHLY" | "ANNUAL";

interface MeSubscription {
  id: string;
  business_id: string;
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  category: string;
  plan_id: string;
  asset_count: number;
  price_total: string;
  starts_at: string;
  expires_at: string;
  remaining_uses: number | null;
  last_reset_at: string | null;
  created_at: string;
  updated_at: string;
  paystack_plan_code: string | null;
  paystack_subscription_code: string | null;
  paystack_email_token: string | null;
  isActive: boolean;
}

interface MeResponse {
  success: boolean;
  data: MeSubscription | null;
}

/* ————— Helpers ————— */
function naira(n?: string | number | null): string {
  if (!n) return "₦0";
  const num = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(num) ? `₦${num.toLocaleString()}` : "₦0";
}

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function badgeColor(planType: PlanType): string {
  switch (planType) {
    case "RESCUE":
      return "text-[#9BFF95]";
    case "REFUEL":
      return "text-[#FFD88A]";
    case "FLEET":
      return "text-[#8AD3FF]";
    default:
      return "text-white";
  }
}

/* ————— Type Guard (KEY FIX) ————— */
function isActiveSubscription(
  sub: MeSubscription | null
): sub is MeSubscription {
  if (!sub) return false;

  if (typeof sub.isActive === "boolean") {
    return sub.isActive;
  }

  return new Date(sub.expires_at).getTime() > Date.now();
}

/* ————— Component ————— */
export function CurrentPlanCard({ onUpgrade }: { onUpgrade: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<MeSubscription | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get<MeResponse>(
          "/fleet-subscription/me"
        );

        if (!alive) return;
        setSubscription(res.data.data);
      } catch (e: any) {
        if (!alive) return;
        setError(
          e?.response?.data?.message ?? e?.message ?? "Failed to load plan"
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ————— Loading ————— */
  if (loading) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] p-6 text-white border border-white/10 animate-pulse">
        <div className="h-4 w-40 bg-white/20 rounded mb-3" />
        <div className="h-7 w-56 bg-white/20 rounded mb-3" />
        <div className="h-4 w-28 bg-white/20 rounded" />
      </div>
    );
  }

  /* ————— Error ————— */
  if (error) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] p-6 text-white border border-white/10 flex justify-between">
        <div>
          <div className="text-sm text-[#FF9B9B]">Error</div>
          <div className="mt-2">{error}</div>
        </div>
        <Button variant="orange" onClick={onUpgrade}>
          Browse Plans
        </Button>
      </div>
    );
  }

  /* ————— No active subscription ————— */
  if (!isActiveSubscription(subscription)) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] p-6 text-white border border-white/10">
        <div className="text-sm text-[#FFD88A]">No Active Subscription</div>
        <div className="my-3 text-2xl font-semibold">
          Choose a plan to get started
        </div>
        <div className="text-sm text-[#E2E2E2] mb-6">
          You can upgrade anytime.
        </div>
        <Button variant="orange" onClick={onUpgrade}>
          Browse Plans
        </Button>
      </div>
    );
  }

  /* ————— Active subscription (TS knows it's NOT null here) ————— */
  return (
    <div className="mt-6 rounded-2xl bg-[#3B3835] p-6 text-white border border-white/10">
      <div className="flex justify-between gap-6">
        <div>
          <div
            className={`text-sm font-medium ${badgeColor(
              subscription.plan_type
            )}`}
          >
            Active Subscription • {subscription.plan_type} •{" "}
            {subscription.billing_cycle}
          </div>

          <div className="my-3 text-2xl font-semibold">
            {subscription.plan_type} Plan
          </div>

          <div className="text-sm text-[#E2E2E2] mb-2">
            Assets:{" "}
            <span className="text-white">{subscription.asset_count}</span>
          </div>

          {typeof subscription.remaining_uses === "number" && (
            <div className="text-sm text-[#E2E2E2] mb-4">
              Remaining Uses:{" "}
              <span className="text-white">{subscription.remaining_uses}</span>
            </div>
          )}

          <Button variant="orange" onClick={onUpgrade}>
            Upgrade Plan
          </Button>
        </div>

        <div className="text-right">
          <div className="text-sm">Price</div>
          <div className="my-3 text-2xl font-semibold">
            {naira(subscription.price_total)}
          </div>
          <div className="text-sm text-[#E2E2E2]">
            Renews {formatDate(subscription.expires_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

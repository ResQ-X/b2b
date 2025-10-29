"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "../ui/button";

// --- Types matching your API ---
type PlanType = "REFUEL" | "FLEET" | "RESCUE";
type BillingCycle = "MONTHLY" | "ANNUAL";

interface MeSubscription {
  id: string;
  business_id: string;
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  plan_id: string;
  asset_count: number;
  price_total: string | null; // total in kobo? or naira string—server returns "225000"
  starts_at: string; // ISO
  expires_at: string; // ISO
  remaining_uses: number | null;
  last_reset_at: string | null; // ISO
  created_at: string;
  updated_at: string;
  paystack_plan_code: string | null;
  paystack_subscription_code: string | null;
  paystack_email_token: string | null;
}

interface MePlan {
  id: string;
  name: string;
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  min_assets: number | null;
  max_assets: number | null;
  price_per_asset: string | null;
  uses_per_month: number | null;
  base_fee_per_asset: string | null;
  services: Array<{ name: string; uses_per_month: number }> | null;
  created_at: string;
  updated_at: string;
  paystack_plan_code: string | null;
}

interface MeResponse {
  success: boolean;
  data: {
    subscription: MeSubscription | null;
    plan: MePlan | null;
  };
}

// --- helpers ---
function naira(n: string | number | null | undefined): string {
  if (n === null || n === undefined) return "₦0";
  const asNum = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(asNum)) return "₦0";
  return `₦${asNum.toLocaleString()}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
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

export function CurrentPlanCard({ onUpgrade }: { onUpgrade: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse["data"] | null>(null);

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
        setMe(res.data.data);
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

  // Render states
  if (loading) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] text-white p-5 md:p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 bg-white/20 rounded" />
          <div className="h-7 w-56 bg-white/20 rounded" />
          <div className="h-4 w-28 bg-white/20 rounded" />
          <div className="h-10 w-36 bg-white/20 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] text-white p-5 md:p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#FF9B9B]">Error</div>
            <div className="my-2 text-base">{error}</div>
          </div>
          <Button
            onClick={onUpgrade}
            variant="orange"
            className="lg-full lg:w-[142px] h-[48px] lg:h-[52px]"
          >
            Browse Plans
          </Button>
        </div>
      </div>
    );
  }

  const subscription = me?.subscription ?? null;
  const plan = me?.plan ?? null;

  // No active subscription
  if (!subscription || !plan) {
    return (
      <div className="mt-6 rounded-2xl bg-[#3B3835] text-white p-5 md:p-6 border border-white/10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-medium text-[#FFD88A]">
              No Active Subscription
            </div>
            <div className="my-[15px] text-2xl font-semibold">
              Choose a plan to get started
            </div>
            <div className="text-[#E2E2E2] text-sm font-medium mb-6">
              You can upgrade anytime.
            </div>
            <Button
              onClick={onUpgrade}
              variant="orange"
              className="lg-full lg:w-[142px] h-[48px] lg:h-[52px]"
            >
              Browse Plans
            </Button>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Price</div>
            <div className="text-2xl font-semibold my-[15px]">—</div>
            <div className="text-[#E2E2E2] text-sm font-medium">—</div>
          </div>
        </div>
      </div>
    );
  }

  // Active subscription
  const planBadge = `${plan.plan_type} • ${subscription.billing_cycle}`;
  const renewalDate = formatDate(subscription.expires_at);

  // Prefer total price if provided; otherwise compute from price_per_asset * asset_count
  let totalPrice = subscription.price_total
    ? naira(subscription.price_total)
    : naira(
        (plan.price_per_asset ? Number(plan.price_per_asset) : 0) *
          (subscription.asset_count ?? 1)
      );

  return (
    <div className="mt-6 rounded-2xl bg-[#3B3835] text-[#FFFFFF] p-5 md:p-6 border border-white/10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className={`text-sm font-medium ${badgeColor(plan.plan_type)}`}>
            Active Subscription • {planBadge}
          </div>

          <div className="my-[15px] text-2xl font-semibold">{plan.name}</div>

          <div className="text-[#E2E2E2] text-sm font-medium mb-1">
            Assets:{" "}
            <span className="text-white">{subscription.asset_count ?? 0}</span>
          </div>

          {typeof subscription.remaining_uses === "number" && (
            <div className="text-[#E2E2E2] text-sm font-medium mb-6">
              Remaining Uses:{" "}
              <span className="text-white">{subscription.remaining_uses}</span>
            </div>
          )}

          <div className="text-[#E2E2E2] text-sm font-medium mb-6">
            Renewal Date
          </div>

          <Button
            onClick={onUpgrade}
            variant="orange"
            className="lg-full lg:w-[142px] h-[48px] lg:h-[52px]"
          >
            Upgrade Plan
          </Button>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">Price</div>
          <div className="text-2xl font-semibold my-[15px]">{totalPrice}</div>
          <div className="text-[#E2E2E2] text-sm font-medium">
            {renewalDate}
          </div>
        </div>
      </div>
    </div>
  );
}

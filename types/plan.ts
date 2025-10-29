export type Billing = "monthly" | "annually";
export type CategoryKey = "rescue" | "refuel" | "fleet";

// Backend API response types

export interface CardSpec {
  title: string;
  price: string;
  cadence: "/mon" | "/mo" | "/yr" | "/year";
  bullets: string[];
  cta?: string;
}

export type PlanType = "REFUEL" | "FLEET" | "RESCUE";
export type BillingCycle = "MONTHLY" | "ANNUAL";

export interface BackendPlan {
  id: string;
  name: string;
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  min_assets: number;
  max_assets: number;
  price_per_asset: string | null;
  uses_per_month: number | null;
  base_fee_per_asset: string | null;
  services: Array<{ name: string; uses_per_month: number }> | null;
  created_at: string;
  updated_at: string;
  paystack_plan_code: string;
}

export interface BackendPlansResponse {
  REFUEL: { MONTHLY: BackendPlan[]; ANNUAL: BackendPlan[] };
  FLEET: { MONTHLY: BackendPlan[]; ANNUAL: BackendPlan[] };
  RESCUE: { MONTHLY: BackendPlan[]; ANNUAL: BackendPlan[] };
}

// Helper to get plans by billing and category
export function getPlans(
  data: BackendPlansResponse,
  billing: Billing,
  category: CategoryKey
): BackendPlan[] {
  const billingCycle = billing === "monthly" ? "MONTHLY" : "ANNUAL";
  const planType = category.toUpperCase() as keyof BackendPlansResponse;

  return data[planType][billingCycle] || [];
}

export const categoryToPlanType: Record<CategoryKey, PlanType> = {
  refuel: "REFUEL",
  fleet: "FLEET",
  rescue: "RESCUE",
};
export const billingToCycle: Record<Billing, BillingCycle> = {
  monthly: "MONTHLY",
  annually: "ANNUAL",
};

export function naira(n: string | null): string | null {
  if (!n) return null;
  const num = Number(n);
  if (Number.isNaN(num)) return null;
  return `₦${num.toLocaleString()}`;
}

export function prettyServiceName(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toCardSpec(plan: BackendPlan, billing: Billing): CardSpec {
  const price =
    naira(plan.price_per_asset) ??
    naira(plan.base_fee_per_asset) ??
    "Talk to Sales";
  const cadence: CardSpec["cadence"] = billing === "monthly" ? "/mon" : "/yr";

  const bullets: string[] = [];
  if (plan.min_assets && plan.max_assets)
    bullets.push(`${plan.min_assets}–${plan.max_assets} assets`);
  if (plan.uses_per_month) bullets.push(`${plan.uses_per_month} uses / month`);
  if (plan.services?.length) {
    for (const s of plan.services) {
      const label = prettyServiceName(s.name);
      bullets.push(
        s.uses_per_month ? `${label} • ${s.uses_per_month}/mo` : label
      );
    }
  }

  return {
    title: plan.name,
    price,
    cadence,
    bullets,
    cta: price === "Talk to Sales" ? "Talk to Sales" : "Choose plan",
  };
}

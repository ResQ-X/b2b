import axiosInstance from "@/lib/axios";

export type PlanType = "REFUEL" | "FLEET" | "RESCUE";
export type BillingCycle = "MONTHLY" | "ANNUAL";

export interface MeResponse {
  success: boolean;
  data: {
    subscription: {
      id: string;
      plan_type: PlanType;
      billing_cycle: BillingCycle;
      plan_id: string;
      asset_count: number;
      price_total: string | null;
      starts_at: string;
      expires_at: string;
      remaining_uses: number | null;
      // ...other fields
    } | null;
    plan: {
      id: string;
      name: string;
      plan_type: PlanType;
      billing_cycle: BillingCycle;
      price_per_asset: string | null;
      // ...other fields
    } | null;
  };
}

export const PlanService = {
  async getMySubscription(): Promise<MeResponse["data"] | null> {
    const res = await axiosInstance.get<MeResponse>("/fleet-subscription/me");
    return res.data?.data ?? null;
  },
};

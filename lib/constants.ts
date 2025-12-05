export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "PieChart",
  },
  {
    title: "Fuel Delivery",
    href: "/fuel-delivery",
    icon: "Fuel",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: "Bolt",
  },
  {
    title: "Emergency Service",
    href: "/emergency",
    icon: "AlertTriangle",
  },
  {
    title: "Fleet Management",
    href: "/fleet",
    icon: "CarFront",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "ChartNoAxesColumnIncreasing",
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: "Calendar",
  },
  {
    title: "Billing",
    href: "/billing",
    icon: "CreditCard",
  },
  {
    title: "Account",
    href: "/account",
    icon: "User",
  },
] as const;

// export type Billing = "monthly" | "annually";

// export type CategoryKey = "rescue" | "refuel" | "fleet";

// export interface CardSpec {
//   title: string;
//   price: string;
//   cadence: "/mon" | "/mo" | "/yr" | "/year";
//   bullets: string[];
//   cta?: string;
// }

// export const PLANS: Record<Billing, Record<CategoryKey, CardSpec[]>> = {
//   monthly: {
//     rescue: [
//       {
//         title: "Essential",
//         price: "₦7,500",
//         cadence: "/mon",
//         bullets: [
//           "4 call out per annum",
//           "5km Tow free per trip",
//           "Priority line",
//           "Roadside Assistance",
//         ],
//       },
//       {
//         title: "Plus",
//         price: "₦14,500",
//         cadence: "/mon",
//         bullets: [
//           "6 call out per annum",
//           "15km Tow free per trip",
//           "One free overnight refuel per month",
//           "Priority Lines",
//           "Free annual Healthcheck",
//           "Roadside Assistance",
//         ],
//       },
//       {
//         title: "Elite",
//         price: "₦24,500",
//         cadence: "/mon",
//         bullets: [
//           "12 call out per annum",
//           "30km Tow free per trip",
//           "2 free overnight refuel per month",
//           "Free Annual Healthcheck",
//           "Priority line",
//           "Roadside Assistance",
//         ],
//       },
//     ],
//     refuel: [
//       {
//         title: "Standard",
//         price: "₦7,500",
//         cadence: "/mon",
//         bullets: [
//           "3 free deliveries in a month (household can share)",
//           "Overnight delivery window (10 pm – 6 am)",
//           "Fuel at pump price",
//         ],
//       },
//     ],
//     fleet: [
//       {
//         title: "Fleet Basic",
//         price: "Talk to Sales",
//         cadence: "/mon",
//         bullets: [
//           "GPS tracking",
//           "Fuel consumption monitoring",
//           "Driver behaviour scoring",
//           "Speed & location alerts",
//           "Monthly reports",
//           "5 user license",
//           "Mobile app access",
//           "30-day data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//       {
//         title: "Fleet Professional",
//         price: "Talk to Sales",
//         cadence: "/mon",
//         bullets: [
//           "Everything in Basic PLUS",
//           "Predictive maintenance alerts",
//           "Route optimization",
//           "Expense management",
//           "API integrations",
//           "Real-time diagnostics",
//           "Unlimited users",
//           "90-day data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//       {
//         title: "Fleet Enterprise",
//         price: "Talk to Sales",
//         cadence: "/mon",
//         bullets: [
//           "Everything in Professional PLUS",
//           "Custom dashboard",
//           "White label option",
//           "Dedicated success manager",
//           "Compliance management",
//           "ERP integration",
//           "Unlimited data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//     ],
//   },
//   annually: {
//     rescue: [
//       {
//         title: "Essential",
//         price: "₦75,000",
//         cadence: "/yr",
//         bullets: [
//           "4 call out per annum",
//           "5km Tow free per trip",
//           "Priority line",
//           "Roadside Assistance",
//         ],
//       },
//       {
//         title: "Plus",
//         price: "₦145,000",
//         cadence: "/yr",
//         bullets: [
//           "6 call out per annum",
//           "15km Tow free per trip",
//           "One free overnight refuel per month",
//           "Priority Lines",
//           "Free annual Healthcheck",
//           "Roadside Assistance",
//         ],
//       },
//       {
//         title: "Elite",
//         price: "₦245,000",
//         cadence: "/yr",
//         bullets: [
//           "12 call out per annum",
//           "30km Tow free per trip",
//           "2 free overnight refuel per month",
//           "Free Annual Healthcheck",
//           "Priority line",
//           "Roadside Assistance",
//         ],
//       },
//     ],
//     refuel: [
//       {
//         title: "Standard",
//         price: "₦75,000",
//         cadence: "/yr",
//         bullets: [
//           "3 free deliveries in a month (household can share)",
//           "Overnight delivery window (10 pm – 6 am)",
//           "Fuel at pump price",
//         ],
//       },
//     ],
//     fleet: [
//       {
//         title: "Fleet Basic",
//         price: "Talk to Sales",
//         cadence: "/yr",
//         bullets: [
//           "GPS tracking",
//           "Fuel consumption monitoring",
//           "Driver behaviour scoring",
//           "Speed & location alerts",
//           "Monthly reports",
//           "5 user license",
//           "Mobile app access",
//           "30-day data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//       {
//         title: "Fleet Professional",
//         price: "Talk to Sales",
//         cadence: "/yr",
//         bullets: [
//           "Everything in Basic PLUS",
//           "Predictive maintenance alerts",
//           "Route optimization",
//           "Expense management",
//           "API integrations",
//           "Real-time diagnostics",
//           "Unlimited users",
//           "90-day data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//       {
//         title: "Fleet Enterprise",
//         price: "Talk to Sales",
//         cadence: "/yr",
//         bullets: [
//           "Everything in Professional PLUS",
//           "Custom dashboard",
//           "White label option",
//           "Dedicated success manager",
//           "Compliance management",
//           "ERP integration",
//           "Unlimited data retention",
//         ],
//         cta: "Talk to Sales",
//       },
//     ],
//   },
// };

// types/plan-backend.ts
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

// ---- MOCK EXACTLY MATCHING YOUR API RESPONSE ----
export const MOCK_BACKEND_PLANS: BackendPlansResponse = {
  REFUEL: {
    MONTHLY: [
      {
        id: "278e1d03-5268-4177-b803-2516d8e7518c",
        name: "Refuel 10-30",
        plan_type: "REFUEL",
        billing_cycle: "MONTHLY",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: "7500",
        uses_per_month: 4,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:08.354Z",
        updated_at: "2025-10-29T13:25:08.354Z",
        paystack_plan_code: "PLN_dwtb215avi0r33j",
      },
      {
        id: "70a12688-7a51-4cf7-9f74-4b0886aee59a",
        name: "Refuel 31-70",
        plan_type: "REFUEL",
        billing_cycle: "MONTHLY",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: "6000",
        uses_per_month: 4,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:20.432Z",
        updated_at: "2025-10-29T13:25:20.432Z",
        paystack_plan_code: "PLN_c1dk3l18i92b76c",
      },
      {
        id: "af516662-1ae5-4170-a3ca-96f9d0bef153",
        name: "Refuel 71-100",
        plan_type: "REFUEL",
        billing_cycle: "MONTHLY",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: "5000",
        uses_per_month: 6,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:31.376Z",
        updated_at: "2025-10-29T13:25:31.376Z",
        paystack_plan_code: "PLN_ibfb7xk0ed9a1m0",
      },
    ],
    ANNUAL: [
      {
        id: "4af1656f-067d-4ff9-87af-b83525b35791",
        name: "Refuel 10-30 (Annual)",
        plan_type: "REFUEL",
        billing_cycle: "ANNUAL",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: "7500",
        uses_per_month: 4,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:08.707Z",
        updated_at: "2025-10-29T13:25:08.707Z",
        paystack_plan_code: "PLN_hta7owkb5mso46j",
      },
      {
        id: "79cb42c8-bbb0-4ac7-b398-c1c06bd09bbb",
        name: "Refuel 31-70 (Annual)",
        plan_type: "REFUEL",
        billing_cycle: "ANNUAL",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: "6000",
        uses_per_month: 4,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:20.572Z",
        updated_at: "2025-10-29T13:25:20.572Z",
        paystack_plan_code: "PLN_fq4n2ury07x5d5z",
      },
      {
        id: "3cc8692d-ea00-4335-972c-8738b5476977",
        name: "Refuel 71-100 (Annual)",
        plan_type: "REFUEL",
        billing_cycle: "ANNUAL",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: "5000",
        uses_per_month: 6,
        base_fee_per_asset: null,
        services: null,
        created_at: "2025-10-29T13:25:31.519Z",
        updated_at: "2025-10-29T13:25:31.519Z",
        paystack_plan_code: "PLN_77errsmpamvp8n1",
      },
    ],
  },
  FLEET: {
    MONTHLY: [
      {
        id: "483cbd88-17a5-4e5f-b323-f79a3e45d17b",
        name: "Fleet 10-30",
        plan_type: "FLEET",
        billing_cycle: "MONTHLY",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "2000",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 2 }],
        created_at: "2025-10-29T13:25:48.239Z",
        updated_at: "2025-10-29T13:25:48.239Z",
        paystack_plan_code: "PLN_08yh6g0f6gjs4qz",
      },
      {
        id: "e36436ac-2fd9-4b51-a696-0cdc9f5bceb7",
        name: "Fleet 31-70",
        plan_type: "FLEET",
        billing_cycle: "MONTHLY",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1800",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 3 }],
        created_at: "2025-10-29T13:25:58.819Z",
        updated_at: "2025-10-29T13:25:58.819Z",
        paystack_plan_code: "PLN_cf2qdpk92bbh5mo",
      },
      {
        id: "05708d28-e49d-4a44-b731-e6692bc85a87",
        name: "Fleet 71-100",
        plan_type: "FLEET",
        billing_cycle: "MONTHLY",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1500",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 4 }],
        created_at: "2025-10-29T13:26:13.267Z",
        updated_at: "2025-10-29T13:26:13.267Z",
        paystack_plan_code: "PLN_sz1hwizh60wgqom",
      },
    ],
    ANNUAL: [
      {
        id: "bffab01d-ae94-47ca-b640-2c5137d53a17",
        name: "Fleet 10-30 (Annual)",
        plan_type: "FLEET",
        billing_cycle: "ANNUAL",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "2000",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 2 }],
        created_at: "2025-10-29T13:25:48.400Z",
        updated_at: "2025-10-29T13:25:48.400Z",
        paystack_plan_code: "PLN_ls1fttalqa4cuw0",
      },
      {
        id: "538ffa69-eeba-4d95-9d57-c3d3b89c13aa",
        name: "Fleet 31-70 (Annual)",
        plan_type: "FLEET",
        billing_cycle: "ANNUAL",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1800",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 3 }],
        created_at: "2025-10-29T13:25:58.995Z",
        updated_at: "2025-10-29T13:25:58.995Z",
        paystack_plan_code: "PLN_ffquel5fnc6ngih",
      },
      {
        id: "eb4eff2c-3666-458d-967d-a87bc7beb3eb",
        name: "Fleet 71-100 (Annual)",
        plan_type: "FLEET",
        billing_cycle: "ANNUAL",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1500",
        services: [{ name: "HEALTH_CHECK", uses_per_month: 4 }],
        created_at: "2025-10-29T13:26:13.397Z",
        updated_at: "2025-10-29T13:26:13.397Z",
        paystack_plan_code: "PLN_tskfqn9t3s8chhh",
      },
    ],
  },
  RESCUE: {
    MONTHLY: [
      {
        id: "67149f38-d343-4b01-8ad2-21044a5b1d69",
        name: "Rescue 10-30",
        plan_type: "RESCUE",
        billing_cycle: "MONTHLY",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1500",
        services: [
          { name: "Towing", uses_per_month: 2 },
          { name: "Battery jump-start", uses_per_month: 2 },
          { name: "Flat tire change", uses_per_month: 2 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 1 },
          { name: "Other roadside assistance", uses_per_month: 2 },
        ],
        created_at: "2025-10-29T13:26:32.074Z",
        updated_at: "2025-10-29T13:26:32.074Z",
        paystack_plan_code: "PLN_nnfwo1jn1yi8j36",
      },
      {
        id: "d7f2b070-6a4a-46a9-bf15-97e684980856",
        name: "Rescue 31-70",
        plan_type: "RESCUE",
        billing_cycle: "MONTHLY",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1400",
        services: [
          { name: "Towing", uses_per_month: 3 },
          { name: "Battery jump-start", uses_per_month: 3 },
          { name: "Flat tire change", uses_per_month: 3 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 2 },
          { name: "Other roadside assistance", uses_per_month: 3 },
        ],
        created_at: "2025-10-29T13:26:45.095Z",
        updated_at: "2025-10-29T13:26:45.095Z",
        paystack_plan_code: "PLN_ihu515h11rtobjf",
      },
      {
        id: "60133c85-f834-40bd-9595-b71555212c53",
        name: "Rescue 71-100",
        plan_type: "RESCUE",
        billing_cycle: "MONTHLY",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1200",
        services: [
          { name: "Towing", uses_per_month: 3 },
          { name: "Battery jump-start", uses_per_month: 3 },
          { name: "Flat tire change", uses_per_month: 3 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 2 },
          { name: "Other roadside assistance", uses_per_month: 3 },
        ],
        created_at: "2025-10-29T13:27:33.600Z",
        updated_at: "2025-10-29T13:27:33.600Z",
        paystack_plan_code: "PLN_ppokje0yjutxk54",
      },
    ],
    ANNUAL: [
      {
        id: "46aafc52-d492-4de2-a665-9c0c8f793967",
        name: "Rescue 10-30 (Annual)",
        plan_type: "RESCUE",
        billing_cycle: "ANNUAL",
        min_assets: 10,
        max_assets: 30,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1500",
        services: [
          { name: "Towing", uses_per_month: 2 },
          { name: "Battery jump-start", uses_per_month: 2 },
          { name: "Flat tire change", uses_per_month: 2 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 1 },
          { name: "Other roadside assistance", uses_per_month: 2 },
        ],
        created_at: "2025-10-29T13:26:32.242Z",
        updated_at: "2025-10-29T13:26:32.242Z",
        paystack_plan_code: "PLN_d8kzoxjy3ye1y2n",
      },
      {
        id: "b0e5b828-b2aa-4430-9233-4051da6e6aea",
        name: "Rescue 31-70 (Annual)",
        plan_type: "RESCUE",
        billing_cycle: "ANNUAL",
        min_assets: 31,
        max_assets: 70,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1400",
        services: [
          { name: "Towing", uses_per_month: 3 },
          { name: "Battery jump-start", uses_per_month: 3 },
          { name: "Flat tire change", uses_per_month: 3 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 2 },
          { name: "Other roadside assistance", uses_per_month: 3 },
        ],
        created_at: "2025-10-29T13:26:45.201Z",
        updated_at: "2025-10-29T13:26:45.201Z",
        paystack_plan_code: "PLN_pj9dd8ake1meitb",
      },
      {
        id: "f0488445-ac3a-4bfb-a847-be2a67d173a6",
        name: "Rescue 71-100 (Annual)",
        plan_type: "RESCUE",
        billing_cycle: "ANNUAL",
        min_assets: 71,
        max_assets: 100,
        price_per_asset: null,
        uses_per_month: null,
        base_fee_per_asset: "1200",
        services: [
          { name: "Towing", uses_per_month: 3 },
          { name: "Battery jump-start", uses_per_month: 3 },
          { name: "Flat tire change", uses_per_month: 3 },
          { name: "Fuel delivery (emergency)", uses_per_month: 1 },
          { name: "Locked-out assistance", uses_per_month: 2 },
          { name: "Other roadside assistance", uses_per_month: 3 },
        ],
        created_at: "2025-10-29T13:27:33.732Z",
        updated_at: "2025-10-29T13:27:33.732Z",
        paystack_plan_code: "PLN_98cy74jzwsq07mr",
      },
    ],
  },
};

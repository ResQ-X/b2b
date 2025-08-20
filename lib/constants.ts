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

export type Billing = "monthly" | "annually";

export type CategoryKey = "rescue" | "refuel" | "fleet" | "enterprise";

export interface CardSpec {
  title: string;
  price: string;
  cadence: "/mon" | "/mo" | "/yr" | "/year";
  bullets: string[];
  cta?: string;
}

export const PLANS: Record<Billing, Record<CategoryKey, CardSpec[]>> = {
  monthly: {
    rescue: [
      {
        title: "Rescue Basic",
        price: "₦4,000",
        cadence: "/mon",
        bullets: [
          "1 rescue / vehicle",
          "Tow pool: 100 km free",
          "Member km rate: 25% off",
        ],
      },
      {
        title: "Rescue Plus",
        price: "₦8,000",
        cadence: "/mon",
        bullets: [
          "2 rescues / vehicle",
          "Tow pool: 150 km free",
          "Priority support",
        ],
      },
      {
        title: "Rescue Max",
        price: "₦12,500",
        cadence: "/mon",
        bullets: [
          "Quarterly checks",
          "Pick-and-return ≤ 10 km (2x / yr)",
          "+ priority concierge",
        ],
      },
    ],
    refuel: [
      {
        title: "Fuel Service Pack",
        price: "₦3,000",
        cadence: "/mon",
        bullets: [
          "Delivery fees waived",
          "Fuel at pump + ₦5–10",
          "Scheduled windows",
        ],
      },
      {
        title: "Fuel Plus",
        price: "₦5,000",
        cadence: "/mon",
        bullets: ["Driver PIN control", "Daily spend caps", "Invoice sync"],
      },
      {
        title: "Fuel Pro",
        price: "₦7,000",
        cadence: "/mon",
        bullets: ["Zone pricing", "SMS/Email alerts", "Dispute assistance"],
      },
    ],
    fleet: [
      {
        title: "Care Lite",
        price: "₦5,500",
        cadence: "/mon",
        bullets: ["Care Lite", "Tow pool: 100 km free", "Compliance reminders"],
      },
      {
        title: "Care Plus",
        price: "₦8,500",
        cadence: "/mon",
        bullets: [
          "30-pt annual + mid‑year mini‑check",
          "Service history",
          "Reminders",
        ],
      },
      {
        title: "Care Max",
        price: "₦12,500",
        cadence: "/mon",
        bullets: [
          "Quarterly checks",
          "Pick-and-return ≤ 10 km (2x / yr)",
          "+ priority concierge",
        ],
      },
    ],
    enterprise: [
      {
        title: "Everything (B2B per vehicle)",
        price: "₦12,000",
        cadence: "/mo",
        bullets: [
          "Fleet Plus + Fuel Service Pack + Care Plus",
          "Volume tiers: 10–49: ₦12k; 50–199: ₦10k; 200+: ₦8.5k per veh / mo",
        ],
      },
      {
        title: "Enterprise Plus",
        price: "₦16,000",
        cadence: "/mo",
        bullets: ["Dedicated manager", "Custom SLAs", "Quarterly reviews"],
      },
      {
        title: "Enterprise Max",
        price: "₦22,000",
        cadence: "/mo",
        bullets: ["24/7 hotline", "Onsite clinics (add‑on)", "Annual audits"],
      },
    ],
  },
  annually: {
    rescue: [
      {
        title: "Rescue Basic",
        price: "₦48,000",
        cadence: "/yr",
        bullets: [
          "1 rescue / vehicle",
          "Tow pool: 100 km free",
          "Member km rate: 25% off",
        ],
      },
      {
        title: "Rescue Plus",
        price: "₦96,000",
        cadence: "/yr",
        bullets: [
          "2 rescues / vehicle",
          "Tow pool: 100 km free",
          "Priority support",
        ],
      },
      {
        title: "Rescue Max",
        price: "₦144,000",
        cadence: "/yr",
        bullets: [
          "Quarterly checks",
          "Pick-and-return ≤ 10 km (2x / yr)",
          "+ priority concierge",
        ],
      },
    ],
    refuel: [
      {
        title: "Fuel Service Pack",
        price: "₦36,000",
        cadence: "/yr",
        bullets: [
          "Delivery fees waived",
          "Fuel at pump + ₦5–10",
          "Scheduled windows",
        ],
      },
      {
        title: "Fuel Plus",
        price: "₦60,000",
        cadence: "/yr",
        bullets: ["Driver PIN control", "Daily spend caps", "Invoice sync"],
      },
      {
        title: "Fuel Pro",
        price: "₦84,000",
        cadence: "/yr",
        bullets: ["Zone pricing", "SMS/Email alerts", "Dispute assistance"],
      },
    ],
    fleet: [
      {
        title: "Care Lite",
        price: "₦60,000",
        cadence: "/yr",
        bullets: ["Care Lite", "Tow pool: 100 km free", "Compliance reminders"],
      },
      {
        title: "Care Plus",
        price: "₦98,000",
        cadence: "/yr",
        bullets: [
          "30-pt annual + mid‑year mini‑check",
          "Service history",
          "Reminders",
        ],
      },
      {
        title: "Care Max",
        price: "₦138,000",
        cadence: "/yr",
        bullets: [
          "Quarterly checks",
          "Pick-and-return ≤ 10 km (2x / yr)",
          "+ priority concierge",
        ],
      },
    ],
    enterprise: [
      {
        title: "Everything (B2B per vehicle)",
        price: "₦144,000",
        cadence: "/yr",
        bullets: [
          "Fleet Plus + Fuel Service Pack + Care Plus",
          "Volume tiers on request",
        ],
      },
      {
        title: "Enterprise Plus",
        price: "₦186,000",
        cadence: "/yr",
        bullets: ["Dedicated manager", "Custom SLAs", "Quarterly reviews"],
      },
      {
        title: "Enterprise Max",
        price: "₦264,000",
        cadence: "/yr",
        bullets: ["24/7 hotline", "Onsite clinics (add‑on)", "Annual audits"],
      },
    ],
  },
};

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
        title: "Essential",
        price: "₦7,500",
        cadence: "/mon",
        bullets: [
          "4 call out per annum",
          "5km Tow free per trip",
          "Priority line",
          "Roadside Assistance",
        ],
      },
      {
        title: "Plus",
        price: "₦14,500",
        cadence: "/mon",
        bullets: [
          "6 call out per annum",
          "15km Tow free per trip",
          "One free overnight refuel per month",
          "Priority Lines",
          "Free annual Healthcheck",
          "Roadside Assistance",
        ],
      },
      {
        title: "Elite",
        price: "₦24,500",
        cadence: "/mon",
        bullets: [
          "12 call out per annum",
          "30km Tow free per trip",
          "2 free overnight refuel per month",
          "Free Annual Healthcheck",
          "Priority line",
          "Roadside Assistance",
        ],
      },
    ],
    refuel: [
      {
        title: "Standard",
        price: "₦7,500",
        cadence: "/mon",
        bullets: [
          "3 free deliveries in a month (household can share)",
          "Overnight delivery window (10 pm – 6 am)",
          "Fuel at pump price",
        ],
      },
    ],
    fleet: [
      {
        title: "Fleet Basic",
        price: "Talk to Sales",
        cadence: "/mon",
        bullets: [
          "GPS tracking",
          "Fuel consumption monitoring",
          "Driver behaviour scoring",
          "Speed & location alerts",
          "Monthly reports",
          "5 user license",
          "Mobile app access",
          "30-day data retention",
        ],
        cta: "Talk to Sales",
      },
      {
        title: "Fleet Professional",
        price: "Talk to Sales",
        cadence: "/mon",
        bullets: [
          "Everything in Basic PLUS",
          "Predictive maintenance alerts",
          "Route optimization",
          "Expense management",
          "API integrations",
          "Real-time diagnostics",
          "Unlimited users",
          "90-day data retention",
        ],
        cta: "Talk to Sales",
      },
      {
        title: "Fleet Enterprise",
        price: "Talk to Sales",
        cadence: "/mon",
        bullets: [
          "Everything in Professional PLUS",
          "Custom dashboard",
          "White label option",
          "Dedicated success manager",
          "Compliance management",
          "ERP integration",
          "Unlimited data retention",
        ],
        cta: "Talk to Sales",
      },
    ],
    enterprise: [
      {
        title: "Essential",
        price: "₦18,000",
        cadence: "/mo",
        bullets: [
          "4 call out per annum",
          "2 refuel per month",
          "15 km Tow free per trip",
          "Extra refuel at a discounted price",
          "Roadside Assistance",
          "Health Check",
        ],
      },
      {
        title: "Core",
        price: "₦28,000",
        cadence: "/mo",
        bullets: [
          "6 call out per annum",
          "5 refuel per month",
          "25km Tow free per trip",
          "One free overnight refuel per month",
          "Priority Repair",
          "Annual Healthcheck",
          "Roadside Assistance",
        ],
      },
      {
        title: "Elite",
        price: "₦45,000",
        cadence: "/mo",
        bullets: [
          "12 call out per annum",
          "10 refuel per month",
          "45km Tow free per trip",
          "2 free overnight refuel per month",
          "Annual Healthcheck",
          "Priority Repair",
          "Roadside Assistance",
        ],
      },
    ],
  },
  annually: {
    rescue: [
      {
        title: "Essential",
        price: "₦75,000",
        cadence: "/yr",
        bullets: [
          "4 call out per annum",
          "5km Tow free per trip",
          "Priority line",
          "Roadside Assistance",
        ],
      },
      {
        title: "Plus",
        price: "₦145,000",
        cadence: "/yr",
        bullets: [
          "6 call out per annum",
          "15km Tow free per trip",
          "One free overnight refuel per month",
          "Priority Lines",
          "Free annual Healthcheck",
          "Roadside Assistance",
        ],
      },
      {
        title: "Elite",
        price: "₦245,000",
        cadence: "/yr",
        bullets: [
          "12 call out per annum",
          "30km Tow free per trip",
          "2 free overnight refuel per month",
          "Free Annual Healthcheck",
          "Priority line",
          "Roadside Assistance",
        ],
      },
    ],
    refuel: [
      {
        title: "Standard",
        price: "₦75,000",
        cadence: "/yr",
        bullets: [
          "3 free deliveries in a month (household can share)",
          "Overnight delivery window (10 pm – 6 am)",
          "Fuel at pump price",
        ],
      },
    ],
    fleet: [
      {
        title: "Fleet Basic",
        price: "Talk to Sales",
        cadence: "/yr",
        bullets: [
          "GPS tracking",
          "Fuel consumption monitoring",
          "Driver behaviour scoring",
          "Speed & location alerts",
          "Monthly reports",
          "5 user license",
          "Mobile app access",
          "30-day data retention",
        ],
        cta: "Talk to Sales",
      },
      {
        title: "Fleet Professional",
        price: "Talk to Sales",
        cadence: "/yr",
        bullets: [
          "Everything in Basic PLUS",
          "Predictive maintenance alerts",
          "Route optimization",
          "Expense management",
          "API integrations",
          "Real-time diagnostics",
          "Unlimited users",
          "90-day data retention",
        ],
        cta: "Talk to Sales",
      },
      {
        title: "Fleet Enterprise",
        price: "Talk to Sales",
        cadence: "/yr",
        bullets: [
          "Everything in Professional PLUS",
          "Custom dashboard",
          "White label option",
          "Dedicated success manager",
          "Compliance management",
          "ERP integration",
          "Unlimited data retention",
        ],
        cta: "Talk to Sales",
      },
    ],
    enterprise: [
      {
        title: "Essential",
        price: "₦180,000",
        cadence: "/yr",
        bullets: [
          "4 call out per annum",
          "2 refuel per month",
          "15 km Tow free per trip",
          "Extra refuel at a discounted price",
          "Roadside Assistance",
          "Health Check",
        ],
      },
      {
        title: "Core",
        price: "₦280,000",
        cadence: "/yr",
        bullets: [
          "6 call out per annum",
          "5 refuel per month",
          "25km Tow free per trip",
          "One free overnight refuel per month",
          "Priority Repair",
          "Annual Healthcheck",
          "Roadside Assistance",
        ],
      },
      {
        title: "Elite",
        price: "₦450,000",
        cadence: "/yr",
        bullets: [
          "12 call out per annum",
          "10 refuel per month",
          "45km Tow free per trip",
          "2 free overnight refuel per month",
          "Annual Healthcheck",
          "Priority Repair",
          "Roadside Assistance",
        ],
      },
    ],
  },
};

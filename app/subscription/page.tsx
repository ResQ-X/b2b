/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import SubIcon from "@/public/sub.svg";
import AuthImage from "@/public/auth-page.png";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ACCENT = "#FF8500";

type Billing = "monthly" | "annually";

type CategoryKey = "rescue" | "refuel" | "fleet" | "enterprise";

interface CardSpec {
  title: string;
  price: string;
  cadence: "/mon" | "/mo" | "/yr" | "/year";
  bullets: string[];
  cta?: string;
}

const PLANS: Record<Billing, Record<CategoryKey, CardSpec[]>> = {
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

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [category, setCategory] = useState<CategoryKey>("rescue");
  const [index, setIndex] = useState(0); // active card within a category

  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cards = PLANS[billing][category];
  const max = cards.length - 1;

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return 0;
      if (next > max) return max;
      return next;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (dx > threshold) go(-1);
    else if (dx < -threshold) go(1);
    touchStartX.current = null;
  };

  // Reset index when tabs change
  const selectBilling = (b: Billing) => {
    setBilling(b);
    setIndex(0);
  };
  const selectCategory = (c: CategoryKey) => {
    setCategory(c);
    setIndex(0);
  };

  function handleChoosePlan(
    billing: Billing,
    category: CategoryKey,
    card: CardSpec,
    index: number
  ) {
    console.log({
      billing,
      category,
      index,
      ...card,
    });
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${AuthImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex justify-between items-center gap-10 px-4 lg:px-6 mx-auto">
        {/* Left: marketing text */}
        <div className="hidden lg:flex flex-col text-white max-w-[560px]">
          <p className="text-5xl font-semibold mb-8 leading-tight">
            Fuel. Fleet. Rescue. One platform.
          </p>
          <p className="text-2xl font-medium leading-8">
            Unify your fuel logistics, fleet management, and emergency services
            in one powerful platform. With ResQ-X B2B, you stay ahead always in
            control, always connected.
          </p>

          {[
            "Real- time fuel monitoring",
            "Advanced Analytics",
            "Optimized Scheduling",
            "Secure Payment Processing",
          ].map((line) => (
            <div key={line} className="flex items-center mt-3">
              <Image src={SubIcon} alt="feature" className="mr-2" />
              <p className="text-base font-medium">{line}</p>
            </div>
          ))}

          <p className="text-base font-semibold mt-10">
            Trusted by business across Industries
          </p>
        </div>

        {/* Right: plans */}
        <div className="w-full max-w-[600px] text-white">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold leading-[56px]">
              Choose your plan
            </h1>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                onClick={() => selectBilling("monthly")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  billing === "monthly"
                    ? "bg-orange text-[#FFFFFF]"
                    : "text-[#FFFFFF]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => selectBilling("annually")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  billing === "annually"
                    ? "bg-orange text-[#FFFFFF]"
                    : "text-[#FFFFFF]"
                }`}
              >
                Annually
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center justify-center gap-8 mb-6 text-[#FFFFFF]">
            {(
              [
                ["Rescue", "rescue"],
                ["Refuel", "refuel"],
                ["Fleet Care", "fleet"],
                ["Enterprise", "enterprise"],
              ] as [string, CategoryKey][]
            ).map(([label, key]) => (
              <button
                key={key}
                onClick={() => selectCategory(key)}
                className={`pb-2 text-base md:text-lg font-medium hover:font-semibold transition relative ${
                  category === key ? "text-orange" : ""
                }`}
              >
                {label}
                {category === key && (
                  <span
                    className="absolute -bottom-[3px] left-0 right-0 mx-auto h-[3px] w-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div className="relative mx-auto max-w-[500px]" ref={containerRef}>
            {/* arrows */}
            {index > 0 && (
              <button
                aria-label="Previous"
                onClick={() => go(-1)}
                className="hidden sm:flex items-center justify-center absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
              >
                <ChevronLeft className="text-orange h-5 w-5" />
              </button>
            )}
            {index < max && (
              <button
                aria-label="Next"
                onClick={() => go(1)}
                className="hidden sm:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
              >
                <ChevronRight className="text-orange h-5 w-5" />
              </button>
            )}

            <div
              className="overflow-hidden rounded-3xl"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {cards.map((card, i) => (
                  <div key={i} className="w-full shrink-0 px-2 sm:px-4">
                    <PlanCard
                      card={card}
                      onChoose={() =>
                        handleChoosePlan(billing, category, card, i)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6" : "w-3 opacity-60"
                  }`}
                  style={{ backgroundColor: ACCENT }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  card,
  onChoose,
}: {
  card: CardSpec;
  onChoose: () => void;
}) {
  return (
    <div
      className="bg-[#3B3835] relative w-full max-w-[392px] h-[423px] mx-auto rounded-3xl text-white border-2 border-[#FF8500] px-[30px] py-10"
      style={{ borderColor: `${ACCENT}33` }}
    >
      {/* <div className="p-8"> */}
      <p className="text-center text-xl font-semibold mb-5">{card.title}</p>
      <div className="flex items-end justify-center text-center mb-6">
        <span className="text-5xl font-semibold tracking-tight">
          {card.price}
        </span>
        <span className="ml-2 text-xl font-medium opacity-90">
          {card.cadence}
        </span>
      </div>

      <ul className="space-y-3 mb-8 text-sm">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full mr-4"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="opacity-95 text-base font-medium">{b}</span>
          </li>
        ))}
      </ul>

      <div className="pb-2">
        <Button
          onClick={onChoose}
          className="w-full h-11 rounded-xl font-semibold text-[#FFFFFF] text-sm "
          style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
        >
          Choose Plan
        </Button>
      </div>
    </div>
  );
}

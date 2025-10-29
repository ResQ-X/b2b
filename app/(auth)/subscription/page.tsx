// "use client";
// import axiosInstance from "@/lib/axios";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import SubIcon from "@/public/sub.svg";
// import AuthImage from "@/public/auth-page.png";
// import { useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { PlanCard } from "@/components/subscription/PlanCard";
// import { Billing, CategoryKey, CardSpec, PLANS } from "@/lib/constants";

// export default function SubscriptionPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [billing, setBilling] = useState<Billing>("monthly");
//   const [category, setCategory] = useState<CategoryKey>("rescue");
//   const [index, setIndex] = useState(0);
//   const [plansData, setPlansData] = useState();

//   const touchStartX = useRef<number | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const cards = PLANS[billing][category];
//   console.log("PLANS", PLANS);
//   console.log("PlansData:", plansData);
//   console.log("CARDS", cards);
//   const max = cards.length - 1;

//   const go = (dir: -1 | 1) => {
//     setIndex((i) => {
//       const next = i + dir;
//       if (next < 0) return 0;
//       if (next > max) return max;
//       return next;
//     });
//   };

//   const onTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//   };

//   const onTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current == null) return;
//     const dx = e.changedTouches[0].clientX - touchStartX.current;
//     const threshold = 40;
//     if (dx > threshold) go(-1);
//     else if (dx < -threshold) go(1);
//     touchStartX.current = null;
//   };

//   // Reset index when tabs change
//   const selectBilling = (b: Billing) => {
//     setBilling(b);
//     setIndex(0);
//   };

//   const selectCategory = (c: CategoryKey) => {
//     setCategory(c);
//     setIndex(0);
//   };

//   function handleChoosePlan(
//     event: React.MouseEvent,
//     billing: Billing,
//     category: CategoryKey,
//     card: CardSpec,
//     index: number
//   ) {
//     event.preventDefault();
//     console.log("Full Selection:", {
//       billing,
//       category,
//       index,
//       ...card,
//     });

//     router.push("/login");
//   }

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(
//           "/fleet-subscription/plans-grouped"
//         );
//         setPlansData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch user profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   // console.log("PlansData:", plansData);
//   // console.log("Loading:", loading);

//   return (
//     <div
//       className="relative flex min-h-screen w-full items-center justify-center"
//       style={{
//         backgroundImage: `url(${AuthImage.src})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       {/* overlay */}
//       <div className="absolute inset-0 bg-black/30" />

//       <div className="relative z-10 w-full max-w-7xl flex justify-between items-center gap-10 px-4 lg:px-6 mx-auto">
//         {/* Left: marketing text */}
//         <div className="hidden lg:flex flex-col text-white max-w-[560px]">
//           <p className="text-5xl font-semibold mb-8 leading-tight">
//             Fuel. Fleet. Rescue. One platform.
//           </p>
//           <p className="text-2xl font-medium leading-8">
//             Unify your fuel logistics, fleet management, and emergency services
//             in one powerful platform. With ResQ-X B2B, you stay ahead always in
//             control, always connected.
//           </p>

//           {[
//             "Real- time fuel monitoring",
//             "Advanced Analytics",
//             "Optimized Scheduling",
//             "Secure Payment Processing",
//           ].map((line) => (
//             <div key={line} className="flex items-center mt-3">
//               <Image src={SubIcon} alt="feature" className="mr-2" />
//               <p className="text-base font-medium">{line}</p>
//             </div>
//           ))}

//           <p className="text-base font-semibold mt-10">
//             Trusted by business across Industries
//           </p>
//         </div>

//         {/* Right: plans */}
//         <div className="w-full max-w-[600px] text-white">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-semibold leading-[56px]">
//               Choose your plan
//             </h1>
//           </div>

//           {/* Billing toggle */}
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <div className="inline-flex rounded-full bg-white/10 p-1">
//               <button
//                 onClick={() => selectBilling("monthly")}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//                   billing === "monthly"
//                     ? "bg-orange text-[#FFFFFF]"
//                     : "text-[#FFFFFF]"
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => selectBilling("annually")}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//                   billing === "annually"
//                     ? "bg-orange text-[#FFFFFF]"
//                     : "text-[#FFFFFF]"
//                 }`}
//               >
//                 Annually
//               </button>
//             </div>
//           </div>

//           {/* Category tabs */}
//           <div className="flex items-center justify-center gap-8 mb-6 text-[#FFFFFF]">
//             {(
//               [
//                 ["Rescue", "rescue"],
//                 ["Refuel", "refuel"],
//                 ["Fleet Care", "fleet"],
//               ] as [string, CategoryKey][]
//             ).map(([label, key]) => (
//               <button
//                 key={key}
//                 onClick={() => selectCategory(key)}
//                 className={`pb-2 text-base md:text-lg font-medium hover:font-semibold transition relative ${
//                   category === key ? "text-orange" : ""
//                 }`}
//               >
//                 {label}
//                 {category === key && (
//                   <span className="bg-[#FF8500] absolute -bottom-[3px] left-0 right-0 mx-auto h-[3px] w-full" />
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Carousel */}
//           <div className="relative mx-auto max-w-[500px]" ref={containerRef}>
//             {/* arrows */}
//             {index > 0 && (
//               <button
//                 aria-label="Previous"
//                 onClick={() => go(-1)}
//                 className="hidden sm:flex items-center justify-center absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
//               >
//                 <ChevronLeft className="text-orange h-5 w-5" />
//               </button>
//             )}
//             {index < max && (
//               <button
//                 aria-label="Next"
//                 onClick={() => go(1)}
//                 className="hidden sm:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
//               >
//                 <ChevronRight className="text-orange h-5 w-5" />
//               </button>
//             )}

//             <div
//               className="overflow-hidden rounded-3xl"
//               onTouchStart={onTouchStart}
//               onTouchEnd={onTouchEnd}
//             >
//               <div
//                 className="flex transition-transform duration-300 ease-out"
//                 style={{ transform: `translateX(-${index * 100}%)` }}
//               >
//                 {cards.map((card, i) => (
//                   <div key={i} className="w-full shrink-0 px-2 sm:px-4">
//                     <PlanCard
//                       card={card}
//                       onChoose={(e: any) =>
//                         handleChoosePlan(e, billing, category, card, i)
//                       }
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* dots */}
//             <div className="flex items-center justify-center gap-2 mt-4">
//               {cards.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setIndex(i)}
//                   className={`h-1.5 rounded-full transition-all ${
//                     i === index
//                       ? "bg-[#FF8500] w-6"
//                       : "bg-[#FFFFFF] w-3 opacity-60"
//                   }`}
//                   aria-label={`Go to slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import axiosInstance from "@/lib/axios";
import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import SubIcon from "@/public/sub.svg";
import AuthImage from "@/public/auth-page.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlanCard } from "@/components/subscription/PlanCard";
import {
  Billing,
  CategoryKey,
  BackendPlan,
  CardSpec,
  BackendPlansResponse,
  categoryToPlanType,
  billingToCycle,
  toCardSpec,
} from "@/types/plan";

export default function SubscriptionPage() {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [category, setCategory] = useState<CategoryKey>("rescue");
  const [index, setIndex] = useState(0);
  const [plansData, setPlansData] = useState<BackendPlansResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assigningIndex, setAssigningIndex] = useState<number | null>(null);

  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          "/fleet-subscription/plans-grouped"
        );
        const payload: BackendPlansResponse =
          response.data?.data ?? response.data;
        setPlansData(payload);
      } catch (err: any) {
        console.error("Failed to fetch plans:", err);
        setError(err?.message ?? "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Keep the *raw* list (for ids) and the transformed cards in lockstep order
  const { rawPlans, cards } = useMemo(() => {
    if (!plansData)
      return { rawPlans: [] as BackendPlan[], cards: [] as CardSpec[] };
    const planType = categoryToPlanType[category];
    const cycle = billingToCycle[billing];
    const raw = plansData[planType]?.[cycle] ?? [];
    return { rawPlans: raw, cards: raw.map((p) => toCardSpec(p, billing)) };
  }, [plansData, category, billing]);

  const max = Math.max(cards.length - 1, 0);

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return 0;
      if (next > max) return max;
      return next;
    });
  };
  const onTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (dx > threshold) go(-1);
    else if (dx < -threshold) go(1);
    touchStartX.current = null;
  };

  const selectBilling = (b: Billing) => {
    setBilling(b);
    setIndex(0);
  };
  const selectCategory = (c: CategoryKey) => {
    setCategory(c);
    setIndex(0);
  };

  async function handleChoosePlan(
    event: React.MouseEvent,
    _billing: Billing,
    _category: CategoryKey,
    card: CardSpec,
    i: number
  ) {
    event.preventDefault();
    const chosen = rawPlans[i];
    if (!chosen) return;

    try {
      setAssigningIndex(i);

      // Build payload
      const payload = {
        plan_id: chosen.id,
        billing_cycle: billingToCycle[_billing], // "MONTHLY" | "ANNUAL"
        starts_at: new Date().toISOString(), // or let user pick a date/time
      };

      const res = await axiosInstance.post(
        "/fleet-subscription/assign/init",
        payload
      );
      console.log("Assign init OK:", res.data);

      // TODO: route to next step if needed (e.g., checkout/confirmation)
      // router.push("/checkout"); // or wherever your flow continues
    } catch (err: any) {
      console.error("Assign init failed:", err?.response?.data ?? err);
      alert(
        err?.response?.data?.message ??
          "Failed to start subscription assignment"
      );
    } finally {
      setAssigningIndex(null);
    }
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
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex justify-between items-center gap-10 px-4 lg:px-6 mx-auto">
        {/* Left copy */}
        <div className="hidden lg:flex flex-col text-white max-w-[560px]">
          <p className="text-5xl font-semibold mb-8 leading-tight">
            Fuel. Fleet. Rescue. One platform.
          </p>
          <p className="text-2xl font-medium leading-8">
            Unify your fuel logistics, fleet management, and emergency services
            in one powerful platform. With ResQ-X B2B, you stay ahead—always in
            control, always connected.
          </p>

          {[
            "Real-time fuel monitoring",
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
            Trusted by businesses across industries
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
                  <span className="bg-[#FF8500] absolute -bottom-[3px] left-0 right-0 mx-auto h-[3px] w-full" />
                )}
              </button>
            ))}
          </div>

          {/* States */}
          {loading && <p className="text-center opacity-80">Loading plans…</p>}
          {error && <p className="text-center text-red-300">{error}</p>}
          {!loading && !error && cards.length === 0 && (
            <p className="text-center opacity-80">
              No plans available for this selection.
            </p>
          )}

          {/* Carousel */}
          {!loading && !error && cards.length > 0 && (
            <div className="relative mx-auto max-w-[500px]" ref={containerRef}>
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
                        onChoose={(e: any) =>
                          handleChoosePlan(e, billing, category, card, i)
                        }
                        // Optional: disable button while posting
                        // disabled={assigningIndex === i}
                        // loading={assigningIndex === i}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index
                        ? "bg-[#FF8500] w-6"
                        : "bg-[#FFFFFF] w-3 opacity-60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

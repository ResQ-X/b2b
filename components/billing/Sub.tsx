// "use client";
// import { useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Card } from "@/components/billing/Card";
// import { PlanCard } from "@/components/subscription/PlanCard";

// function Sub() {
//   const [billing, setBilling] = useState<Billing>("monthly");
//   const [category, setCategory] = useState<CategoryKey>("rescue");
//   const [index, setIndex] = useState(0);

//   const touchStartX = useRef<number | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const cards = PLANS[billing][category];
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
//     billing: Billing,
//     category: CategoryKey,
//     card: CardSpec,
//     index: number
//   ) {
//     console.log({
//       billing,
//       category,
//       index,
//       ...card,
//     });
//   }
//   return (
//     <div className="w-full max-w-[600px] text-white">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl md:text-5xl font-semibold leading-[56px]">
//           Choose your plan
//         </h1>
//       </div>
//       {/* Billing toggle */}
//       <div className="flex items-center justify-center gap-3 mb-6">
//         <div className="inline-flex rounded-full bg-white/10 p-1">
//           <button
//             onClick={() => selectBilling("monthly")}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//               billing === "monthly"
//                 ? "bg-orange text-[#FFFFFF]"
//                 : "text-[#FFFFFF]"
//             }`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => selectBilling("annually")}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//               billing === "annually"
//                 ? "bg-orange text-[#FFFFFF]"
//                 : "text-[#FFFFFF]"
//             }`}
//           >
//             Annually
//           </button>
//         </div>
//       </div>
//       {/* Category tabs */}
//       <div className="relative z-10 w-11/12 lg:w-full m-auto lg:m-0 flex items-center justify-center gap-8 mb-6 text-[#FFFFFF]">
//         {(
//           [
//             ["Rescue", "rescue"],
//             ["Refuel", "refuel"],
//             ["Fleet Care", "fleet"],
//             ["Enterprise", "enterprise"],
//           ] as [string, CategoryKey][]
//         ).map(([label, key]) => (
//           <button
//             key={key}
//             onClick={() => selectCategory(key)}
//             className={`pb-1 text-sm md:text-lg font-medium hover:font-semibold transition relative ${
//               category === key ? "text-orange" : ""
//             }`}
//           >
//             {label}
//             {category === key && (
//               <span className="bg-[#FF8500] absolute -bottom-[3px] left-0 right-0 mx-auto h-[3px] w-full" />
//             )}
//           </button>
//         ))}
//       </div>
//       {/* Carousel */}
//       <div
//         className="lg:mt-[-2em] relative mx-auto max-w-[450px]"
//         ref={containerRef}
//       >
//         {/* arrows */}
//         {index > 0 && (
//           <button
//             aria-label="Previous"
//             onClick={() => go(-1)}
//             className="hidden sm:flex items-center justify-center absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
//           >
//             <ChevronLeft className="text-orange h-5 w-5" />
//           </button>
//         )}
//         {index < max && (
//           <button
//             aria-label="Next"
//             onClick={() => go(1)}
//             className="hidden sm:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
//           >
//             <ChevronRight className="text-orange h-5 w-5" />
//           </button>
//         )}

//         <div
//           className="overflow-hidden rounded-3xl"
//           onTouchStart={onTouchStart}
//           onTouchEnd={onTouchEnd}
//         >
//           <div
//             className="flex transition-transform duration-300 ease-out"
//             style={{ transform: `translateX(-${index * 100}%)` }}
//           >
//             {cards.map((card, i) => (
//               <div key={i} className="w-full shrink-0 lg:px-2 lg:mt-16">
//                 <Card
//                   card={card}
//                   onChoose={() => handleChoosePlan(billing, category, card, i)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* dots */}
//         <div className="flex items-center justify-center gap-2 mt-4">
//           {cards.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setIndex(i)}
//               className={`h-1.5 rounded-full transition-all ${
//                 i === index ? "bg-[#FF8500] w-6" : "bg-[#FFFFFF] w-3 opacity-60"
//               }`}
//               aria-label={`Go to slide ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sub;

"use client";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "@/lib/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/billing/Card";
import {
  Billing,
  CategoryKey,
  CardSpec,
  BackendPlan,
  BackendPlansResponse,
  categoryToPlanType,
  billingToCycle,
  toCardSpec,
} from "@/types/plan";

/** ---------- Simple payment modal with iframe ---------- */
function PaymentModal({
  url,
  reference,
  onClose,
  onVerifyAndClose,
  verifying,
}: {
  url: string;
  reference: string;
  onClose: () => void;
  onVerifyAndClose: () => void;
  verifying: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close modal if clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-[95vw] max-w-3xl h-[85vh] rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Complete Payment
            </h2>
            <p className="text-xs text-gray-500">
              Ref: <span className="font-mono">{reference}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onVerifyAndClose}
              disabled={verifying}
              className="inline-flex items-center gap-2 h-8 px-3 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "I've Paid"}
            </button>
            <button
              onClick={onClose}
              disabled={verifying}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close payment modal"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="h-[calc(85vh-52px)]">
          <iframe
            src={url}
            className="w-full h-full rounded-b-2xl"
            title="Paystack Checkout"
          />
        </div>
      </div>
    </div>
  );
}

/** ---------- Main component ---------- */
function Sub() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [category, setCategory] = useState<CategoryKey>("rescue");
  const [index, setIndex] = useState(0);

  const [plansData, setPlansData] = useState<BackendPlansResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigningIndex, setAssigningIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Payment modal + verification state
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [payRef, setPayRef] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [startsAtIso, setStartsAtIso] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(
          "/fleet-subscription/plans-grouped"
        );
        const payload: BackendPlansResponse = res.data?.data ?? res.data;
        setPlansData(payload);
      } catch (e: any) {
        const errorMsg =
          e?.response?.data?.message || e?.message || "Failed to fetch plans";
        setError(errorMsg);
        toast.error(errorMsg);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Keep raw (for IDs) and transformed cards aligned
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

  const verifyPayment = async () => {
    if (!selectedPlanId || !payRef || !startsAtIso) {
      // Nothing to verify — just close
      closePaymentModal();
      return;
    }

    try {
      setVerifying(true);
      await axiosInstance.post("/fleet-subscription/assign/verify", {
        plan_id: selectedPlanId,
        payment_ref: payRef,
        start_date: startsAtIso,
      });
      toast.success("Payment verified successfully!");
      closePaymentModal();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to verify payment";
      toast.error(errorMsg);
      console.error("Payment verification failed:", err);
      // Keep modal open on error so user can retry
      setVerifying(false);
    }
  };

  const closePaymentModal = () => {
    setPayUrl(null);
    setPayRef(null);
    setSelectedPlanId(null);
    setStartsAtIso(null);
    setVerifying(false);
  };

  // 1) INIT payment -> open modal
  async function handleChoosePlan(
    _billing: Billing,
    _category: CategoryKey,
    _card: CardSpec,
    i: number
  ) {
    const chosen = rawPlans[i];
    if (!chosen) return;

    try {
      setAssigningIndex(i);

      const startsAt = new Date().toISOString();
      const payload = {
        plan_id: chosen.id,
        billing_cycle: billingToCycle[_billing],
        starts_at: startsAt,
      };

      const res = await axiosInstance.post(
        "/fleet-subscription/assign/init",
        payload
      );
      const { authorization_url, reference } = res.data?.data ?? {};
      if (authorization_url && reference) {
        setPayUrl(authorization_url);
        setPayRef(reference);
        setSelectedPlanId(chosen.id);
        setStartsAtIso(startsAt);
        toast.success("Payment initialized successfully!");
      } else {
        toast.error("Could not initialize payment. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to start subscription";
      toast.error(errorMsg);
      console.error("Assign init failed:", err);
    } finally {
      setAssigningIndex(null);
    }
  }

  return (
    <>
      <div className="w-full max-w-[600px] text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold leading-[56px]">
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
        <div className="relative z-10 w-11/12 lg:w-full m-auto lg:m-0 flex items-center justify-center gap-8 mb-6 text-[#FFFFFF]">
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
              className={`pb-1 text-sm md:text-lg font-medium hover:font-semibold transition relative ${
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

        {/* Carousel */}
        {!loading && !error && (
          <div
            className="lg:mt-[-2em] relative mx-auto max-w-[450px]"
            ref={containerRef}
          >
            {/* Empty */}
            {rawPlans.length === 0 && (
              <p className="text-center opacity-80">
                No plans available for this selection.
              </p>
            )}

            {/* Arrows */}
            {index > 0 && rawPlans.length > 0 && (
              <button
                aria-label="Previous"
                onClick={() => go(-1)}
                className="hidden sm:flex items-center justify-center absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
              >
                <ChevronLeft className="text-orange h-5 w-5" />
              </button>
            )}
            {index < Math.max(rawPlans.length - 1, 0) &&
              rawPlans.length > 0 && (
                <button
                  aria-label="Next"
                  onClick={() => go(1)}
                  className="hidden sm:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-orange"
                >
                  <ChevronRight className="text-orange h-5 w-5" />
                </button>
              )}

            {/* Slides */}
            {rawPlans.length > 0 && (
              <>
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
                      <div key={i} className="w-full shrink-0 lg:px-2 lg:mt-16">
                        <Card
                          card={card}
                          onChoose={() =>
                            handleChoosePlan(billing, category, card, i)
                          }
                          disabled={assigningIndex === i}
                          loading={assigningIndex === i}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots */}
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
              </>
            )}
          </div>
        )}
      </div>

      {/* Payment modal */}
      {payUrl && payRef && (
        <PaymentModal
          url={payUrl}
          reference={payRef}
          onClose={closePaymentModal}
          onVerifyAndClose={verifyPayment}
          verifying={verifying}
        />
      )}
    </>
  );
}

export default Sub;

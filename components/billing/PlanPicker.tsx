import { useState, useRef } from "react";
import { Billing, CategoryKey, CardSpec, PLANS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BillingCard } from "@/components/billing/BillingCard";

export function PlanPicker({}: { current?: string; onClose: () => void }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [category, setCategory] = useState<CategoryKey>("rescue");
  const [index, setIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);

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
    console.log({ billing, category, index, ...card });
  }

  return (
    <div className="w-full text-[#FFFFFF]">
      {/* Heading */}
      <div className="text-center mb-8 mt-10">
        <h1 className="text-lg lg:text-[32px] font-medium lg:font-semibold leading-[56px]">
          Choose your plan
        </h1>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-[70px]">
        <div className="inline-flex rounded-full bg-white/10 p-1">
          {(["monthly", "annually"] as Billing[]).map((b) => (
            <button
              key={b}
              onClick={() => selectBilling(b)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                billing === b ? "bg-orange text-white" : "text-white"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Annually"}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center justify-center gap-4 lg:gap-8 mb-6 text-[#FFFFFF]">
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
            className={`pb-2 text-sm md:text-lg font-medium transition ${
              category === key ? "text-orange" : ""
            }`}
          >
            {label}
            {category === key && (
              <span className="bg-[#FF8500] block mx-auto h-[3px] w-full" />
            )}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="w-full max-w-[425px] mx-auto space-y-4">
        {/* arrows + track in flex-row */}
        <div className="flex items-center gap-2">
          {/* Prev button */}

          {index === 0 ? (
            <></>
          ) : (
            <button
              disabled={index === 0}
              onClick={() => go(-1)}
              className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-orange disabled:opacity-40"
            >
              <ChevronLeft className="text-orange h-5 w-5" />
            </button>
          )}

          {/* Track */}
          <div
            className="flex-1 overflow-hidden rounded-3xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out will-change-transform"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="basis-full shrink-0 flex justify-center"
                >
                  <BillingCard
                    card={card}
                    onChoose={() =>
                      handleChoosePlan(billing, category, card, i)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          {index === max ? (
            <></>
          ) : (
            <button
              disabled={index === max}
              onClick={() => go(1)}
              className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-orange disabled:opacity-40"
            >
              <ChevronRight className="text-orange h-5 w-5" />
            </button>
          )}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "bg-[#FF8500] w-6" : "bg-white w-3 opacity-60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

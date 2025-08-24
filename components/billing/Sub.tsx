"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/billing/Card";
import { Billing, CategoryKey, CardSpec, PLANS } from "@/lib/constants";

function Sub() {
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
      <div className="w-11/12 lg:w-full m-auto lg:m-0 flex items-center justify-center gap-8 mb-6 text-[#FFFFFF]">
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
            className={`pb-2 text-sm md:text-lg font-medium hover:font-semibold transition relative ${
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

      {/* Carousel */}
      <div className="relative mx-auto max-w-[450px]" ref={containerRef}>
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
              <div key={i} className="w-full shrink-0 lg:px-2 lg:mt-16">
                <Card
                  card={card}
                  onChoose={() => handleChoosePlan(billing, category, card, i)}
                />
                {/* <Card
                  card={card}
                  onChoose={() => handleChoosePlan(billing, category, card, i)}
                /> */}
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
                i === index ? "bg-[#FF8500] w-6" : "bg-[#FFFFFF] w-3 opacity-60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sub;

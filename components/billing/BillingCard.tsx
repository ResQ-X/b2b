import { Button } from "@/components/ui/Button";
import { CardSpec } from "@/lib/constants";

export function BillingCard({
  card,
  onChoose,
}: {
  card: CardSpec;
  onChoose: () => void;
}) {
  return (
    <div className="bg-[#272727] relative w-full max-w-[392px] h-[423px] mx-auto rounded-3xl text-white px-[30px] py-10">
      {/* <div className="p-8"> */}

      {card.title === "Rescue Basic" && (
        <p className="text-orange text-sm font-semibold text-center mb-[17px]">
          Current Plan
        </p>
      )}

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
            <span className="bg-[#FF8500] inline-block h-1.5 w-1.5 rounded-full mr-4" />
            <span className="opacity-95 text-base font-medium">{b}</span>
          </li>
        ))}
      </ul>

      {card.title === "Rescue Basic" ? (
        <></>
      ) : (
        <div className="pb-2">
          <Button
            onClick={onChoose}
            className="bg-[#FF8500] w-full h-11 rounded-xl font-semibold text-[#FFFFFF] text-sm "
          >
            Choose Plan
          </Button>
        </div>
      )}
    </div>
  );
}

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
    <div className="bg-[#272727] w-11/12 lg:w-full mx-auto rounded-2xl sm:rounded-3xl text-white flex flex-col p-2 overflow-hidden">
      {card.title === "Rescue Basic" && (
        <p className="text-[#FF8500] text-xs sm:text-sm font-semibold text-center my-6">
          Current Plan
        </p>
      )}

      <p className="text-center text-base lg:text-2xl font-normal lg:font-semibold mb-5">
        {card.title}
      </p>

      <div className="lg:hidden text-lg lg:text-5xl font-medium lg:font-bold text-center">
        {card.price} {card.cadence}
      </div>

      <div className="hidden lg:flex items-end justify-center mb-6">
        <span className="text-xl lg:text-5xl font-medium lg:font-bold">
          {card.price}
        </span>
        <span className="ml-2 text-sm lg:text-xl font-normal lg:font-medium">
          {card.cadence}
        </span>
      </div>

      <ul className="mb-6 text-base font-medium ml-4">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-center">
            <div className="bg-orange h-1.5 w-1.5 rounded-full mr-2" />
            <span className="">{b}</span>
          </li>
        ))}
      </ul>

      {/* <ul className="space-y-3 mb-6 text-sm sm:text-base flex-grow break-words">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="bg-[#FF8500] inline-block h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0" />
            <span className="opacity-95 leading-relaxed">{b}</span>
          </li>
        ))}
      </ul> */}

      <div className="lg:mt-auto flex justify-center mb-4 lg:mb-0">
        {card.title === "Rescue Basic" ? (
          <div className="h-11 flex items-center justify-center">
            <span className="text-sm sm:text-base text-white/60 font-medium">
              Active Plan
            </span>
          </div>
        ) : (
          // <p></p>
          <Button
            onClick={onChoose}
            className="bg-[#FF8500] w-[100px] h-11 rounded-xl font-semibold text-white text-sm sm:text-base hover:bg-[#FF8500]/90 transition-colors"
          >
            Choose Plan
          </Button>
        )}
      </div>
    </div>
  );
}

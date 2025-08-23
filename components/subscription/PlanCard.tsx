import { Button } from "@/components/ui/Button";
import { CardSpec } from "@/lib/constants";

export function PlanCard({
  card,
  onChoose,
}: {
  card: CardSpec;
  onChoose: () => void;
}) {
  return (
    <div className="bg-[#3B3835] relative w-11/12 lg:w-full lg:max-w-[392px] h-auto lg:h-[423px] mx-auto rounded-2xl lg:rounded-3xl text-[#fff] px-4 lg:px-[30px] py-10">
      <p className="text-center text-sm lg:text-xl font-medium lg:font-semibold mb-5">
        {card.title}
      </p>
      <div className="w-11/12 lg:w-full flex items-end justify-center text-center mb-6">
        <p className="text-xl lg:text-5xl font-medium lg:font-semibold tracking-tight">
          {card.price}
          <span className="lg:ml-2 text-xs lg:text-xl font-light lg:font-medium">
            {card.cadence}
          </span>
        </p>
      </div>

      {/* <ul className="space-y-3 mb-8 text-sm">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="bg-[#FF8500] inline-block h-1.5 w-1.5 rounded-full mr-4" />
            <span className="opacity-95 text-base font-medium">{b}</span>
          </li>
        ))}
      </ul> */}

      {/* <div className="pb-2">
        <Button
          onClick={onChoose}
          className="bg-[#FF8500] w-full h-11 rounded-xl font-semibold text-[#FFFFFF] text-sm "
        >
          Choose Plan
        </Button>
      </div> */}
    </div>
  );
}

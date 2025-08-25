import { CardSpec } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Card({
  card,
  onChoose,
}: {
  card: CardSpec;
  onChoose: () => void;
}) {
  return (
    <div className="bg-[#272727] relative w-11/12 lg:w-full lg:max-w-[392px] h-auto lg:h-[423px] mx-auto rounded-2xl lg:rounded-3xl text-[#fff] px-4 lg:px-[30px] py-10">
      <p className="text-[#FF8500] text-center text-sm lg:text-xl font-medium lg:font-semibold mb-5">
        Current Plan
      </p>
      <p className="text-center text-sm lg:text-xl font-medium lg:font-semibold mb-5">
        {card.title}
      </p>
      <div className="w-11/12 lg:full flex items-end justify-center text-center mb-6">
        <p className="text-xl lg:text-5xl font-medium lg:font-semibold tracking-tight">
          {card.price}{" "}
          <span className="lg:ml-2 text-xs lg:text-xl font-light lg:font-medium">
            {card.cadence}
          </span>
        </p>
      </div>

      <ul className="space-y-3 mb-8 text-xs lg:text-sm">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-1 lg:gap-2">
            <span className="bg-[#FF8500] inline-block h-1 w-1 lg:h-1.5 lg:w-1.5 rounded-full mr-2 lg:mr-4" />
            <span className="opacity-95 text-xs lg:text-base font-medium">
              {b}
            </span>
          </li>
        ))}
      </ul>

      <div className="w-3/5 lg:w-full pb-2 m-auto h-12 lg:h-16">
        <Button
          variant="orange"
          onClick={onChoose}
          className="w-11/12 lg:w-full m-auto h-full"
        >
          Choose Plan
        </Button>
      </div>
    </div>
  );
}

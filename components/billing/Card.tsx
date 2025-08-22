import { Button } from "@/components/ui/Button";
import { CardSpec } from "@/lib/constants";

export function Card({
  card,
  onChoose,
}: {
  card: CardSpec;
  onChoose: () => void;
}) {
  return (
    <div className="bg-[#272727] relative w-11/12 h-auto mx-auto rounded-3xl text-white px-4 py-10">
      {/* <div className="p-8"> */}
      <p className="text-center text-sm lg:text-xl font-medium lg:font-semibold mb-5">
        {card.title}
      </p>
      <div className="w-11/12 flex items-end justify-center text-center mb-6">
        <p className="text-xl font-medium tracking-tight">
          {card.price}{" "}
          <span className="text-xs font-light">{card.cadence}</span>
        </p>
      </div>

      <ul className="space-y-3 mb-8 text-xs">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-1">
            <div className="bg-[#FF8500] inline-block h-1 w-1 rounded-full mr-2" />
            <span className="opacity-95 text-xs font-medium">{b}</span>
          </li>
        ))}
      </ul>

      <div className="w-3/5 pb-2 m-auto h-10">
        <button
          onClick={onChoose}
          className="bg-[#FF8500] w-full m-auto h-full rounded-xl font-medium text-[#FFFFFF] text-sm"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
}

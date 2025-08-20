import { naira } from "@/app/(dashboard)/billing/page";
import { Button } from "../ui/button";

export function CurrentPlanCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="mt-6 rounded-2xl bg-[#3B3835] text-[#FFFFFF] p-5 md:p-6 border border-white/10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-medium text-[#9BFF95]">
            Active Subscription
          </div>

          <div className="my-[15px] text-2xl font-semibold">Rescue Basic</div>

          <div className="text-[#E2E2E2] text-sm font-medium">Renewal Date</div>

          <Button
            onClick={onUpgrade}
            className="w-full max-w-lg h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200 mt-6"
          >
            Upgrade Plan
          </Button>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">Price</div>
          <div className="text-2xl font-semibold my-[15px]">{naira(5500)}</div>
          <div className="text-[#E2E2E2] text-sm font-medium">
            August 30, 2025
          </div>
        </div>
      </div>
    </div>
  );
}

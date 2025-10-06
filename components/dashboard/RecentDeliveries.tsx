"use client";
import Image from "next/image";
import DeliveryIcon from "@/public/deliver.svg";
import { PackageX } from "lucide-react"; // empty-state icon

export function RecentDeliveries({
  items,
}: {
  items: {
    plate: string;
    where: string;
    when: string;
    volume: string;
    status: string;
  }[];
}) {
  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] p-6 text-white">
      <h3 className="text-[#FFFFFF] text-2xl font-semibold">
        Recent Deliveries
      </h3>

      {items.length > 0 ? (
        <div className="mt-4 space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={DeliveryIcon}
                  alt="Delivery Icon"
                  className="h-10 w-10"
                />
                <div>
                  <div className="text-[#E2E2E2] text-base font-medium">
                    {it.plate}
                  </div>
                  <div className="text-sm text-[#E2E2E2] font-normal">
                    {it.where} · {it.when}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-[3px]">
                <span className="text-[#E2E2E2] text-sm font-medium">
                  {it.volume}
                </span>
                <span className="h-[24px] inline-flex items-center gap-1 rounded-[8px] bg-[#9BFF95] px-2 py-1 text-[#005800] text-xs font-medium">
                  {it.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 mt-3 text-center text-white/70">
          <PackageX className="h-10 w-10 mb-2 opacity-60" />
          <span className="text-sm">No deliveries yet</span>
        </div>
      )}
    </div>
  );
}

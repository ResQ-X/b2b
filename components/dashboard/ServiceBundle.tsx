"use client";
import { LucideIcon } from "lucide-react";

export function ServiceBundle({
  status,
  services,
}: {
  status: "Active" | "Inactive";
  services: { icon: LucideIcon; title: string; desc: string }[];
}) {
  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl text-[#FFFFFF] font-semibold">
          Your Service Bundle
        </h3>
        <span className="text-base font-normal text-[#85FC81]">{status}</span>
      </div>
      <ul className="space-y-[14px]">
        {services.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="h-[65px] flex items-center gap-3">
            {/* <div className="rounded-lg bg-black/20 p-2"> */}
            <Icon className="h-[36px] w-[36px] mr-[13px]" />
            {/* </div> */}
            <div>
              <div className="text-[#F1F1F1] text-base font-medium">
                {title}
              </div>
              <div className="text-sm font-normal text-[#F1F1F1]">{desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

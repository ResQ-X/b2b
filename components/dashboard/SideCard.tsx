"use client";
import Image from "next/image";

export function SideCard({
  title,
  subtitle,
  actionText,
  onAction,
  icon,
  tone = "default",
}: {
  title: string;
  subtitle: string;
  actionText: string;
  onAction?: () => void;
  icon: string;
  tone?: "default" | "danger";
}) {
  const accent = tone === "danger" ? "#F87171" : "#FF8500";

  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] p-4 text-white">
      <Image src={icon} alt="Icon" className="h-6 w-6 mb-2" />

      <div className="flex justify-between">
        <div className="">
          <div className="text-[#FFFFFF] text-base font-semibold">{title}</div>
          <div className="text-[#FFFFFF] text-xs font-medium mt-[1px]">
            {subtitle}
          </div>
        </div>
        <button
          onClick={onAction}
          className="mt-4 w-[110px] rounded-xl bg-[#FFFFFF] text-orange py-2 text-xs font-medium hover:bg-white/15"
          style={{ color: accent }}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}

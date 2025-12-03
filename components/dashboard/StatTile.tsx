"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function StatTile({
  title,
  value,
  sub,
  icon: Icon,
  borderColor = "#FF8500",
  link,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: LucideIcon;
  borderColor?: string;
  link?: string;
}) {
  return (
    <div
      className="relative rounded-[28px] p-5 md:p-6 text-white min-h-[138px] border-2 mb-5 lg:mb-0"
      style={{
        background: "linear-gradient(179.52deg, #5E5E5E 0.42%, #763F04 99.58%)",
        borderColor,
      }}
    >
      {/* top-right icon */}
      <Icon className="absolute right-5 top-5 h-6 w-6 text-white/90" />

      {/* content */}
      <div className="space-y-2 pr-10">
        <div className="text-[#F1F1F1] text-base md:text-lg font-semibold">
          {title}
        </div>
        <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {value}
        </div>
        {link ? (
          <Link href={link}>
            {sub && (
              <div className="text-sm md:text-base text-white/90">{sub}</div>
            )}
          </Link>
        ) : (
          sub && <div className="text-sm md:text-base text-white/90">{sub}</div>
        )}
      </div>
    </div>
  );
}

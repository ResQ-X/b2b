import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/dashboard";
import Image from "next/image";

interface StatCardProps extends StatCard {
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  const Icon = Icons[icon as keyof typeof Icons] as React.ElementType;

  return (
    <div className={cn("bg-white rounded-xl p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[736250]">{title}</p>
          <p className="text-[28px] text-dark-brown font-bold mt-2">{value}</p>
        </div>
        <div className="h-[60px] w-[60px] rounded-[23px] bg-orange/10 flex items-center justify-center">
          <Icon className="h-[24px] w-[32px] text-orange" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        <Image
          src="/ic-trending-up-24px.svg"
          alt="arrow up"
          width={20}
          height={12}
        />
        <span className="text-[00B69B] text-sm">{change.value}</span>
        <span className="text-dark text-sm">{change.timeframe}</span>
      </div>
    </div>
  );
}

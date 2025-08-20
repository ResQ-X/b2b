import { CalendarClock } from "lucide-react";

export function RowCard({
  leftIcon: LeftIcon,
  title,
  subtitle,
  rightTop,
  rightLink = "View",
}: {
  leftIcon?: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  rightTop?: string;
  rightLink?: string;
}) {
  const Icon = LeftIcon ?? CalendarClock;
  return (
    <div className="rounded-2xl bg-[#3B3835] px-4 sm:px-6 py-4 border border-[#3B3835] shadow-[0_0_0_1px_#493C2F_inset]">
      <div className="flex items-center">
        {/* Left icon */}
        <div className="mr-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#2C2926]">
          <Icon className="h-5 w-5 text-[#FF8500]" />
        </div>

        {/* Middle text */}
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium text-[#F1F1F1] truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-sm font-normal text-[#E2E2E2] truncate">
              {subtitle}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="ml-4 text-right">
          {rightTop && (
            <div className="text-base font-semibold text-[#F1F1F1]">
              {rightTop}
            </div>
          )}
          <button className="text-orange text-base font-semibold hover:underline">
            {rightLink}
          </button>
        </div>
      </div>
    </div>
  );
}

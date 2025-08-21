"use client";
import Search from "@/components/ui/Search";
import Image from "next/image";
import ExportIcon from "@/public/export.svg";

type Tab = { key: string; label: string; count?: number };

export default function FuelTabs({
  tabs,
  value,
  onChange,
  search,
  onSearchChange,
  onExport,
}: {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  search: string;
  onSearchChange: (q: string) => void;
  onExport: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[#2C2926] border border-[#ABABAB] p-2 text-[#fff]">
      <div className="flex flex-wrap items-center gap-2">
        {/* Tabs: horizontal scroll on small screens */}
        <div className="order-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar mt-4 lg:mt-0">
          {tabs.map((t) => {
            const active = value === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={[
                  "whitespace-nowrap rounded-lg px-2 lg:px-4 py-2 text-base transition",
                  active
                    ? "bg-white text-[#FF8500] font-medium lg:font-bold"
                    : "text-[#E2E2E2] hover:bg-white/10 font-normal lg:font-medium",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Actions: full-width on mobile, inline on sm+ */}
        <div className="order-3 sm:order-2 flex w-full sm:w-auto items-center gap-3 justify-between sm:justify-end my-4 lg:my-0">
          <Search
            value={search}
            onChange={onSearchChange}
            className="w-full sm:w-[360px]"
          />

          <button
            type="button"
            onClick={onExport}
            className="shrink-0 rounded-md p-2 hover:bg-white/10 active:scale-95 transition"
            aria-label="Export"
            title="Export"
          >
            <Image src={ExportIcon} alt="Export" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

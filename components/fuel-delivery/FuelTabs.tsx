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
    <div className="h-[79px] rounded-2xl bg-[#2C2926] border border-[#ABABAB] p-2 text-white">
      <div className="relative h-[59px] flex flex-wrap items-center gap-2">
        {tabs.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "h-full px-4 py-2 rounded-lg text-base font-semibold transition",
                active
                  ? "bg-[#FFFFFF] text-[#FF8500] font-bold"
                  : "text-[#E2E2E2] hover:bg-white/10 font-medium",
              ].join(" ")}
            >
              {t.label}
              {/* {typeof t.count === "number" && (
                <span
                  className={[
                    "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs",
                    active ? "bg-black/10 text-black/70" : "bg-white/10",
                  ].join(" ")}
                >
                  {t.count}
                </span>
              )} */}
            </button>
          );
        })}

        <div className="absolute right-20">
          <Search value={search} onChange={onSearchChange} />
        </div>

        <Image
          onClick={onExport}
          src={ExportIcon}
          alt="Export"
          className="w-6 h-6 absolute right-5 cursor-pointer"
        />
      </div>
    </div>
  );
}

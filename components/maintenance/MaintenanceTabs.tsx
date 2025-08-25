"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import RequestServiceModal, {
  type RequestServiceForm,
} from "@/components/maintenance/RequestServiceModal";
import Search from "@/components/ui/Search";
import Image from "next/image";
import ExportIcon from "@/public/export.svg";

type Tab = {
  shortLabel: string;
  key: string;
  label: string;
  count?: number;
};

export default function MaintenanceTabs({
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
  const [open, setOpen] = useState(false);

  const typeOptions = [
    { label: "Oil Change", value: "oil-change" },
    { label: "Brake Inspection", value: "brake-inspection" },
    { label: "Tire Rotation", value: "tire-rotation" },
    { label: "Full Service", value: "full-service" },
  ];
  const vehicleOptions = [
    { label: "LND-451-AA", value: "LND-451-AA" },
    { label: "KJA-220-KD", value: "KJA-220-KD" },
    { label: "ABC-123-XY", value: "ABC-123-XY" },
  ];
  const locationOptions = [
    { label: "Lekki Office", value: "lekki-office" },
    { label: "VI Branch", value: "vi-branch" },
    { label: "Ikeja Depot", value: "ikeja-depot" },
  ];
  const slotOptions = [
    { label: "08:00–10:00", value: "08:00-10:00" },
    { label: "10:00–12:00", value: "10:00-12:00" },
    { label: "12:00–14:00", value: "12:00-14:00" },
  ];

  const handleSubmit = async (data: RequestServiceForm) => {
    console.log("submit", data);
  };

  return (
    <>
      <div className="rounded-2xl bg-[#3B3835] border border-[#ABABAB] p-2 text-white">
        <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0">
          {/* Tabs: scrollable on small screens */}
          <div className="order-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const active = value === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key)}
                  className={[
                    "whitespace-nowrap rounded-lg px-1 lg:px-4 py-2 text-xs lg:text-base transition",
                    active
                      ? "bg-white text-[#FF8500] font-medium lg:font-bold"
                      : "text-[#E2E2E2] hover:bg-white/10 font-normal lg:font-medium",
                  ].join(" ")}
                >
                  {/* Show short label on mobile, full label on lg+ */}
                  <span className="block lg:hidden">{t.shortLabel}</span>
                  <span className="hidden lg:block">{t.label}</span>

                  {/* {typeof t.count === "number" && (
                    <span
                      className={[
                        "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs",
                        value === t.key
                          ? "bg-black/10 text-black/70"
                          : "bg-white/10",
                      ].join(" ")}
                    >
                      {t.count}
                    </span>
                  )} */}
                </button>
              );
            })}
          </div>

          {/* Search + Export: full width on mobile, inline on sm+ */}
          <div className="order-2 flex w-full sm:w-auto items-center gap-3 justify-between sm:justify-end">
            <Search
              value={search}
              onChange={onSearchChange}
              className="w-full sm:w-[360px] my-4 lg:my-0"
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

          {/* CTA: full width on mobile, right-aligned on sm+ */}
          <div className="order-3 w-full sm:w-auto sm:ml-auto mb-4 lg:mb-0 flex justify-center lg:justify-start sm:block">
            <Button
              variant="orange"
              className="h-[58px] lg:h-[60px]"
              onClick={() => setOpen(true)}
              rightIcon={<Plus className="h-4 w-4" />}
            >
              Schedule Service
            </Button>
          </div>
        </div>
      </div>

      <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={typeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />
    </>
  );
}

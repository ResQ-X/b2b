"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RequestServiceModal, {
  type RequestServiceForm,
} from "@/components/maintenance/RequestServiceModal";

type Tab = { key: string; label: string; count?: number };

export default function FuelTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
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
  const slotOptions = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();

    const slots = [
      { label: "Now", value: "NOW" },
      {
        label: "05:00–07:00",
        value: new Date(new Date().setHours(5, 0, 0, 0)).toISOString(),
        hour: 5,
      },
      {
        label: "07:00–09:00",
        value: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
        hour: 7,
      },
      {
        label: "09:00–11:00",
        value: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
        hour: 9,
      },
      {
        label: "11:00–13:00",
        value: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        hour: 11,
      },
      {
        label: "13:00–15:00",
        value: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
        hour: 13,
      },
      {
        label: "15:00–17:00",
        value: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
        hour: 15,
      },
      {
        label: "17:00–19:00",
        value: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        hour: 17,
      },
      {
        label: "19:00–21:00",
        value: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
        hour: 19,
      },
      {
        label: "21:00–22:00",
        value: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(),
        hour: 21,
      },
    ];

    // Filter out past time slots for today
    return slots
      .filter((slot) => {
        if (slot.value === "NOW") return true;

        const slotDate = new Date(slot.value);
        const slotDateString = slotDate.toDateString();

        // If slot is for today, check if the time has passed
        if (slotDateString === currentDate) {
          return slot.hour && slot.hour > currentHour;
        }

        // Keep all future date slots
        return true;
      })
      .map(({ ...rest }) => rest);
  }, []);

  const handleSubmit = async (data: RequestServiceForm) => {
    // TODO: call your API
    // await axios.post('/api/maintenance/request', data)
    console.log("submit", data);
  };

  return (
    <>
      <div className="flex justify-between rounded-2xl bg-[#3B3835] border border-[#ABABAB] p-2 text-white">
        <div className="h-[59px] flex flex-wrap items-center gap-2">
          {tabs.map((t) => {
            const active = value === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={[
                  "h-full px-4 py-2 rounded-[10px] text-base font-semibold transition",
                  active
                    ? "bg-[#FFFFFF] text-[#FF8500] font-bold"
                    : "text-[#E2E2E2] hover:bg-white/10 font-medium",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <Button
          className="w-full max-w-[248px] h-[48px] bg-[#FF8500] hover:bg-[#ff9a33] mt-[5px]"
          onClick={() => setOpen(true)}
        >
          Schedule Service <Plus className="h-4 w-4 ml-2" />
        </Button>
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

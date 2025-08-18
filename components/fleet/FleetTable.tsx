// components/fleet/FleetTable.tsx
"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleModal, { type VehicleForm } from "@/components/fleet/FleetModal";

export type FleetRow = {
  vehicleId: string;
  fuelLevelPct: number;
  lastRefuelISO: string;
  location: string;
  vehicleType?: string;
  fuelType?: string;
  fuelCapacityL?: number;
  status?: "In Transit" | "Available" | "Maintenance" | "Offline";
};

export const fleetData: FleetRow[] = [
  {
    vehicleId: "#RF-2024-1000",
    fuelLevelPct: 65,
    lastRefuelISO: "2025-01-12T12:53:00Z",
    location: "Lekki Office",
    vehicleType: "SUV",
    fuelType: "Diesel",
    fuelCapacityL: 80,
    status: "In Transit",
  },
  {
    vehicleId: "#LND-234-CC",
    fuelLevelPct: 89,
    lastRefuelISO: "2025-01-12T12:53:00Z",
    location: "VI Branch",
    vehicleType: "Truck",
    fuelType: "Diesel",
    fuelCapacityL: 120,
    status: "Available",
  },
];

const fmtRefuel = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const h = d.getHours();
  const hour12 = ((h + 11) % 12) + 1;
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${dd}.${mm}.${yyyy} - ${hour12}.${min} ${ampm}`;
};

export default function FleetTable({ rows }: { rows?: FleetRow[] }) {
  const data = rows ?? fleetData;
  const [open, setOpen] = useState(false);

  const handleSave = async (v: VehicleForm) => {
    // TODO: POST to your API
    console.log("save vehicle", v);
  };

  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-[#1F1E1C] px-6 py-5">
        <div className="grid grid-cols-4 text-sm font-semibold text-white/90">
          <div>Vehicle ID</div>
          <div>Fuel Level</div>
          <div>Last Refuel</div>
          <div className="text-right md:text-left">Current Location</div>
        </div>
      </div>

      {/* Rows */}
      <ul>
        {data.map((r, i) => (
          <li key={r.vehicleId + i} className="px-6 py-6">
            <div className="grid grid-cols-4 items-center">
              <div className="text-white/90">{r.vehicleId}</div>
              <div className="text-white/90">{r.fuelLevelPct}%</div>
              <div className="text-white/90">{fmtRefuel(r.lastRefuelISO)}</div>
              <div className="text-white/90 text-right md:text-left">
                {r.location}
              </div>
            </div>
            {i < data.length - 1 && <div className="h-px bg-white/10 mt-6" />}
          </li>
        ))}
      </ul>

      {/* Footer with centered CTA */}
      <div className="border-t border-white/10 px-6 py-8">
        <div className="flex justify-center">
          <Button
            onClick={() => setOpen(true)}
            className="h-[48px] rounded-xl bg-[#FF8500] hover:bg-[#ff9a33] px-6"
          >
            Add New Fleet <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* ⬇️ Vehicle modal (no “fuel request” wording) */}
      <VehicleModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSave}
        title="Add Vehicle"
        vehicleTypes={[
          { label: "SUV", value: "suv" },
          { label: "Truck", value: "truck" },
          { label: "Sedan", value: "sedan" },
        ]}
        fuelTypes={[
          { label: "Diesel", value: "diesel" },
          { label: "Petrol", value: "petrol" },
        ]}
      />
    </div>
  );
}

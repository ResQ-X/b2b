"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssetModal from "@/components/fleet/FleetModal";
import Link from "next/link";

/* --- Mock data type used previously (kept for fallback) --- */
export type FleetRow = {
  vehicleId: string;
  assetId: string;
  fuelLevelPct: number;
  lastRefuelISO: string;
  location: string;
  vehicleType?: string;
  fuelType?: string;
  fuelCapacityL?: number;
  status?: "In Transit" | "Available" | "Maintenance" | "Offline";
  plateNumber?: string;
};

/* --- helper to format ISO datetimes into your short format --- */
const fmtRefuel = (iso: string | undefined | null) => {
  if (!iso) return "—";
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

/* --- shape expected when FleetPage passes data --- */
export type FleetAssetFromApi = {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype?: string | null;
  fuel_type?: string | null;
  capacity?: number | null;
  plate_number?: string | null;
  location_id?: string | null;
  location?: string | null;
  created_at?: string | null;
};

export default function FleetTable({
  data,
}: {
  data?: FleetAssetFromApi[] | FleetRow[];
}) {
  // if API data provided, render that; otherwise fallback to mock fleetData
  const rows = (data && data.length ? data : []) as any[];
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
      {/* Header */}
      <div className="h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
        <div className="grid grid-cols-7 text-sm font-semibold gap-x-4">
          <div className="col-span-2">Name / ID</div>
          <div>Type</div>
          <div>Fuel</div>
          <div>Capacity (L)</div>
          <div className="text-right md:text-left">Added</div>
          <div className="text-right">Action</div>
        </div>
      </div>

      {/* Rows */}
      {/* Empty State or Rows */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-white/70 text-lg font-medium mb-2">
            No fleet assets found
          </div>
          <div className="text-white/50 text-sm mb-6">
            Start by adding your first asset to track fuel, location, and more.
          </div>
          {/* <Button
            onClick={() => setOpen(true)}
            variant="orange"
            className="w-[200px] lg:w-[248px] h-[48px] lg:h-[52px]"
            rightIcon={<Plus className="h-4 w-4 ml-2" />}
          >
            Add New Fleet
          </Button> */}
        </div>
      ) : (
        <ul>
          {rows.map((r, i) => (
            <li
              key={(r.id ?? r.vehicleId) + i}
              className="px-6 py-6 border-b border-white/5"
            >
              <div className="grid grid-cols-7 items-center gap-x-4">
                {/* Name / ID */}
                <div className="col-span-2">
                  <div className="font-medium">
                    {r.asset_name ?? r.vehicleId ?? r.id}
                  </div>
                  {r.location ? (
                    <div className="text-sm text-white/60">{r.location}</div>
                  ) : null}
                </div>

                {/* Type */}
                <div>{r.asset_type ?? r.vehicleType ?? "—"}</div>

                {/* Fuel */}
                <div>{(r.fuel_type ?? r.fuelType ?? "—").toString()}</div>

                {/* Capacity */}
                <div>{r.capacity ?? r.fuelCapacityL ?? "—"}</div>

                {/* Created / last refuel */}
                <div className="text-right md:text-left text-sm text-white/70">
                  {r.created_at
                    ? fmtRefuel(r.created_at)
                    : r.lastRefuelISO
                      ? fmtRefuel(r.lastRefuelISO)
                      : "—"}
                </div>

                {/* Action */}
                <div className="text-right">
                  <Link
                    href={`/fleet/${encodeURIComponent(r.id ?? r.vehicleId)}`}
                    className="text-[#FF8500] font-semibold hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Footer with centered CTA */}
      <div className="border-t border-white/10 px-6 py-8">
        <div className="flex justify-center">
          <Button
            onClick={() => setOpen(true)}
            variant="orange"
            className="w-[200px] lg:w-[248px] h-[48px] lg:h-[52px]"
            rightIcon={<Plus className="h-4 w-4 ml-2" />}
          >
            Add New Fleet
          </Button>
        </div>
      </div>

      {/* Asset modal: modal handles create. We pass a no-op onSubmit here. */}
      <AssetModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={async () => { }}
        title="Add Asset"
        assetTypes={[
          { label: "Generator", value: "generator" },
          { label: "Vehicle", value: "vehicle" },
          { label: "Others", value: "other" },
        ]}
        assetSubtypes={[
          { label: "SUV", value: "suv" },
          { label: "Truck", value: "truck" },
          { label: "Sudan", value: "sudan" },
          { label: "Others", value: "other" },
        ]}
        fuelTypes={[
          { label: "Diesel", value: "diesel" },
          { label: "Petrol", value: "petrol" },
        ]}
      />
    </div>
  );
}

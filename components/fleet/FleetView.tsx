"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomInput from "@/components/ui/CustomInput";
import type { FleetRow } from "@/components/fleet/FleetTable";

interface FleetViewProps {
  vehicle: FleetRow & {
    vehicleType?: string;
    fuelType?: string;
    fuelCapacityL?: number;
    status?: "In Transit" | "Available" | "Maintenance" | "Offline";
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function FleetView({ vehicle }: FleetViewProps) {
  const router = useRouter();

  return (
    <div className="bg-[#242220] w-full space-y-8 text-white">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white/80 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Title + Meta */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Vehicle Details</h1>
      </div>

      <div className="space-y-2">
        <div className="text-white/80">
          Vehicle ID:&nbsp;
          <span className="font-medium">{vehicle.vehicleId}</span>
        </div>
        {vehicle.status && (
          <div className="flex items-center gap-2">
            <span className="text-white/70">Status:</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="text-white/90">{vehicle.status}</span>
            </span>
          </div>
        )}
      </div>

      {/* OVERVIEW */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Labeled label="Vehicle ID" value={vehicle.vehicleId} />
          <Labeled label="Vehicle Type" value={vehicle.vehicleType ?? "—"} />
          <Labeled label="Fuel Type" value={vehicle.fuelType ?? "—"} />
          <Labeled
            label="Fuel Capacity"
            value={vehicle.fuelCapacityL ? `${vehicle.fuelCapacityL}L` : "—"}
          />
          <Labeled
            label="Last Refuel"
            value={`${fmtDate(vehicle.lastRefuelISO)}`}
          />
          <Labeled label="Fuel Level" value={`${vehicle.fuelLevelPct}%`} />
        </div>

        {/* Optional note */}
        <p className="text-sm text-amber-300 mt-1">
          ⚠️ Refuel recommended within the next 2 days.
        </p>
      </div>

      {/* ACTIVITY LOG */}
      <div className="bg-[#3B3835] space-y-4 p-6 rounded-[14px] mt-8">
        <h2 className="text-lg font-semibold">Activity Log</h2>
        <div className="rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#262422]">
              <tr>
                <Th>Time</Th>
                <Th>Activity</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="">
              <Tr
                time="18 Mar 2025, 08:00 AM"
                activity="Refueled"
                status="Confirmed"
              />
              <Tr
                time="18 Mar 2025, 11:30 AM"
                activity="Low Fuel Alert"
                status="In Progress"
              />
              <Tr
                time="19 Mar 2025, 05:00 PM"
                activity="Low Fuel Alert"
                status="Out for Delivery"
              />
              <Tr
                time="22 Mar 2025, 10:15 AM"
                activity="Fueling Schedule"
                status="Out for Delivery"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Helpers */
function Labeled({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/60">{label}</label>
      <CustomInput
        value={value}
        disabled
        className="bg-white/[0.06] border border-white/10 text-white rounded-xl h-11"
      />
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left p-4 text-sm font-medium text-white/70">
      {children}
    </th>
  );
}
function Tr({
  time,
  activity,
  status,
}: {
  time: string;
  activity: string;
  status: string;
}) {
  return (
    <tr className="hover:bg-white/[0.03]">
      <td className="p-4 text-sm">{time}</td>
      <td className="p-4 text-sm">{activity}</td>
      <td className="p-4 text-sm">{status}</td>
    </tr>
  );
}

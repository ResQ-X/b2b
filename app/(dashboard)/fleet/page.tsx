"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import FleetTable, { fleetData } from "@/components/fleet/FleetTable";
import VehicleListCard from "@/components/fleet/VehicleListCard";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

function fmtRefuel(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const h = d.getHours();
  const hour12 = ((h + 11) % 12) + 1;
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${dd}.${mm}.${yyyy} - ${hour12}.${min} ${ampm}`;
}

export default function FleetPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch {
        setMetrics({
          active_order_count: 0,
          professionals: 0,
          active_order: [],
        });
      }
    })();
  }, []);

  if (!metrics) return <Loader />;

  const tiles = [
    { title: "Total Vehicles", value: "47", icon: Wallet },
    { title: "Generators", value: "12", icon: Wallet },
    { title: "Locations", value: "8", icon: Wallet },
  ];

  // 🔗 Build VehicleListCard items from fleetData
  const vehiclesWithIds = fleetData.map((r) => {
    const cleanId = r.vehicleId.replace(/^#/, "");
    const rightLabel = r.vehicleType ?? r.location ?? "Vehicle";
    return {
      vehicleId: cleanId, // used in /fleet/[id] route
      title: `${cleanId} - ${rightLabel}`,
      subtitle: `Last refuel: ${fmtRefuel(r.lastRefuelISO)}`,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="grid lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <StatTile key={t.title} {...t} />
        ))}
      </div>

      {/* Fleet table */}
      <FleetTable />

      {/* Vehicle List (now sourced from fleetData) */}
      <VehicleListCard items={vehiclesWithIds} />
    </div>
  );
}

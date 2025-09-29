"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import FleetTable from "@/components/fleet/FleetTable";
import VehicleListCard from "@/components/fleet/VehicleListCard";

interface ApiResponse {
  stats?: {
    vehicle?: number;
    generator?: number;
    others?: number;
  };
  assets?: FleetAssetFromApi[];
}

interface FleetAssetFromApi {
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
  // add other fields from API as needed
}

function fmtRefuel(iso?: string | null) {
  if (!iso) return "No date";
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

/** Safe date parser that returns timestamp (ms). If invalid, returns 0 (oldest). */
const createdAtToTs = (iso?: string | null) => {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
};

export default function FleetPage() {
  const [assets, setAssets] = useState<FleetAssetFromApi[]>([]);
  const [stats, setStats] = useState<{
    vehicle: number;
    generator: number;
    others: number;
  }>({
    vehicle: 0,
    generator: 0,
    others: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axiosInstance.get<ApiResponse>(
          "/fleet-asset/get-asset"
        );
        const payload = resp?.data || {};
        const serverStats = payload.stats || {};
        const serverAssets = payload.assets || [];

        setAssets(serverAssets);
        setStats({
          vehicle: serverStats.vehicle ?? 0,
          generator: serverStats.generator ?? 0,
          others: serverStats.others ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch fleet assets", err);
        setAssets([]);
        setStats({ vehicle: 0, generator: 0, others: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader content="Loading fleet data...." />;

  const tiles = [
    { title: "Total Vehicles", value: String(stats.vehicle), icon: Wallet },
    { title: "Generators", value: String(stats.generator), icon: Wallet },
    { title: "Others", value: String(stats.others), icon: Wallet },
  ];

  // pick the 2 most recently created assets
  const recentAssets = [...assets]
    .sort((a, b) => createdAtToTs(b.created_at) - createdAtToTs(a.created_at))
    .slice(0, 2);

  // Build VehicleListCard items from the real assets
  const vehiclesWithIds = assets.map((a) => {
    const idLabel = a.asset_name || a.id;
    const rightLabel = a.asset_type ?? a.location ?? "Asset";
    const subtitle = a.created_at
      ? `Added: ${fmtRefuel(a.created_at)}`
      : "No date";
    return {
      vehicleId: a.id,
      title: `${idLabel} - ${rightLabel}`,
      subtitle,
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

      {/* Fleet table — pass only the 2 most recent assets */}
      <FleetTable data={recentAssets} />

      {/* Vehicle List */}
      <VehicleListCard items={vehiclesWithIds} />
    </div>
  );
}

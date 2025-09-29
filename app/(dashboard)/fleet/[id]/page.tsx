"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Loader from "@/components/ui/Loader";
import { FleetView } from "@/components/fleet/FleetView";
import type { FleetRow } from "@/components/fleet/FleetTable";

interface ApiResponse {
  stats?: Record<string, number>;
  assets?: any[];
}

export default function FleetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<FleetRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // helper to map API asset -> FleetRow
  const mapAssetToFleetRow = (asset: any): FleetRow => {
    return {
      vehicleId: asset.asset_name
        ? asset.asset_name // you can prefer asset.id if you want stable ids
        : asset.id,
      fuelLevelPct:
        typeof asset.capacity === "number"
          ? Math.min(100, Math.max(0, Math.round((asset.capacity / 100) * 100)))
          : 0,
      // We don't have real lastRefuelISO in sample API; use created_at as placeholder
      lastRefuelISO: asset.created_at ?? new Date().toISOString(),
      location: asset.location ?? asset.location_id ?? "—",
      vehicleType: asset.asset_subtype ?? asset.asset_type ?? undefined,
      fuelType: asset.fuel_type ?? undefined,
      fuelCapacityL:
        typeof asset.capacity === "number" ? asset.capacity : undefined,
      status: undefined,
    };
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await axiosInstance.get<ApiResponse>(
          "/fleet-asset/get-asset"
        );
        const payload = resp?.data || {};
        const assets = payload.assets || [];

        // Try exact id match first (id field), then fallback to match by asset_name if needed
        const found =
          assets.find((a: any) => a.id === decodedId) ||
          assets.find(
            (a: any) => (a.asset_name ?? "").toString() === decodedId
          ) ||
          assets.find(
            (a: any) =>
              (a.asset_name ?? "").replace(/^#/, "") ===
              decodedId.replace(/^#/, "")
          );

        if (!mounted) return;

        if (!found) {
          setVehicle(null);
          setError("Vehicle not found.");
        } else {
          setVehicle(mapAssetToFleetRow(found));
        }
      } catch (err: any) {
        console.error("Error fetching asset:", err);
        if (!mounted) return;
        setError("Failed to fetch vehicle details.");
        setVehicle(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [decodedId]);

  if (loading) return <Loader content="Loading vehicle details..." />;

  if (error)
    return <div className="text-center py-20 text-white/60">{error}</div>;

  if (!vehicle) {
    return (
      <div className="text-center py-20 text-white/60">Vehicle not found.</div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10">
      <FleetView vehicle={vehicle} />
    </div>
  );
}

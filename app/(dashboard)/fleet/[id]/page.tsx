"use client";
import React from "react";
import { FleetView } from "@/components/fleet/FleetView";
import { fleetData } from "@/components/fleet/FleetTable";

export default function FleetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const decodedId = decodeURIComponent(id);

  // ✅ fleet rows use `vehicleId`
  const vehicle =
    fleetData.find((o) => o.vehicleId === decodedId) ||
    fleetData.find(
      (o) => o.vehicleId.replace(/^#/, "") === decodedId.replace(/^#/, "")
    );

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

"use client";
import React from "react";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { maintenanceData } from "@/components/maintenance/MaintenanceTable";

export default function MaintenanceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params with React.use
  const { id } = React.use(params);

  // decode `/Maintenance-delivery/%23RF-2024-1000` → `#RF-2024-1000`
  const decodedId = decodeURIComponent(id);

  const order =
    maintenanceData.find((o) => o.id === decodedId) ||
    maintenanceData.find(
      (o) => o.id.replace(/^#/, "") === decodedId.replace(/^#/, "")
    );

  if (!order) {
    return (
      <div className="text-center py-20 text-white/60">Order not found.</div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10">
      <MaintenanceView maintenance={order} />
    </div>
  );
}

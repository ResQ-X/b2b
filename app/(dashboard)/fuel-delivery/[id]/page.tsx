"use client";
import React from "react";
import { FuelView } from "@/components/fuel-delivery/FuelView";
import { MOCK_ORDERS } from "@/components/fuel-delivery/FuelTable";

export default function FuelDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params with React.use
  const { id } = React.use(params);

  // decode `/fuel-delivery/%23RF-2024-1000` → `#RF-2024-1000`
  const decodedId = decodeURIComponent(id);

  const order =
    MOCK_ORDERS.find((o) => o.id === decodedId) ||
    MOCK_ORDERS.find(
      (o) => o.id.replace(/^#/, "") === decodedId.replace(/^#/, "")
    );

  if (!order) {
    return (
      <div className="text-center py-20 text-white/60">Order not found.</div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10">
      <FuelView fuel={order} />
    </div>
  );
}

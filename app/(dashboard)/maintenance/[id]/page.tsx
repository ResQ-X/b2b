"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import type { Order } from "@/components/maintenance/MaintenanceTable";

export default function MaintenanceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const decodedId = decodeURIComponent(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try detail endpoint if exists, else fallback to list search
        try {
          const { data } = await axiosInstance.get(
            `/fleet-service/get-maintenance-service/${decodedId}`
          );
          const o = data.data;
          setOrder(mapToOrder(o));
          return;
        } catch {}

        const listRes = await axiosInstance.get(
          "/fleet-service/get-maintenance-service",
          { params: { page: 1, limit: 50 } }
        );
        const found = (listRes.data.data || []).find(
          (o: any) => o.id === decodedId
        );
        if (!found) {
          setError("Order not found.");
          return;
        }
        setOrder(mapToOrder(found));
      } catch (err) {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [decodedId]);

  if (loading)
    return <div className="text-center py-20 text-white/60">Loading...</div>;
  if (error || !order) {
    return (
      <div className="text-center py-20 text-white/60">
        {error || "Order not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10">
      <MaintenanceView maintenance={order} />
    </div>
  );
}

function mapToOrder(o: any): Order {
  return {
    id: o.id,
    vehicle: o.asset?.plate_number || o.asset?.asset_name || "N/A",
    serviceType: formatMaintenanceType(o.maintenance_type),
    mileageKm: 0,
    status:
      o.status === "COMPLETED"
        ? "Completed"
        : o.status === "IN_PROGRESS"
        ? "In Progress"
        : o.status === "PENDING"
        ? "Scheduled"
        : "Completed",
    dueDateISO: o.date_time,
    costNaira: 0,
  };
}

function formatMaintenanceType(t: string) {
  const map: Record<string, string> = {
    BRAKE_INSPECTION: "Brake Inspection",
    FULL_SERVICE: "Full Service",
    OIL_CHANGE: "Oil Change",
    TIRE_ROTATION: "Tire Rotation",
    OTHER: "Other",
  };
  return map[t] || t;
}

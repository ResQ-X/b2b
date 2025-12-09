"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import type { Order, OrderStatus } from "@/components/maintenance/MaintenanceTable";

export default function MaintenanceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const decodedId = decodeURIComponent(id);
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
            `/fleet-service/get-maintenance-service?id=${decodedId}`
          );
          const o = data.data;
          setOrder(mapToOrder(o));
          return;
        } catch { }

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
  let vehicleDisplay = "N/A";
  if (o.assets && o.assets.length > 0) {
    vehicleDisplay = o.assets
      .map((a: any) => a.plate_number || a.asset_name)
      .join(", ");
  } else if (o.asset) {
    vehicleDisplay = o.asset.plate_number || o.asset.asset_name || "N/A";
  }

  return {
    id: o.id,
    vehicle: vehicleDisplay,
    serviceType: formatMaintenanceType(o.maintenance_type),
    status:
      o.status === "COMPLETED"
        ? "Completed"
        : o.status === "IN_PROGRESS"
          ? "In Progress"
          : o.status === "PENDING"
            ? ("Pending" as OrderStatus)
            : ("Scheduled" as OrderStatus),
    dueDateISO: o.date_time,
    costNaira: o.total_cost ? parseFloat(o.total_cost) : 0,
    mileageKm: 0, // TODO: Update when API returns mileage
    assets: o.assets || [],
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

"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { FuelView } from "@/components/fuel-delivery/FuelView";
import type { Order } from "@/components/fuel-delivery/FuelTable";

export default function FuelDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Todo: Use react.use
  const decodedId = decodeURIComponent(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try dedicated detail endpoint first; fall back to list search if needed
        try {
          const { data } = await axiosInstance.get(
            `/fleet-service/get-fuel-service/${decodedId}`
          );
          const o = data.data;
          const mapped: Order = {
            id: o.id,
            vehicle: o.asset?.plate_number || o.asset?.asset_name || "N/A",
            location: o.location,
            quantityL: o.quantity ?? 0,
            costNaira: 0,
            status:
              o.status === "COMPLETED"
                ? "Completed"
                : o.status === "IN_PROGRESS"
                ? "In Progress"
                : "Scheduled",
            dateISO: o.date_time,
          };
          setOrder(mapped);
          return;
        } catch (e) {
          // ignore and try list-based fallback
        }

        const listRes = await axiosInstance.get(
          "/fleet-service/get-fuel-service",
          { params: { page: 1, limit: 50 } }
        );
        const found = (listRes.data.data || []).find(
          (o: any) => o.id === decodedId
        );
        if (!found) {
          setError("Order not found.");
          return;
        }
        const mapped: Order = {
          id: found.id,
          vehicle:
            found.asset?.plate_number || found.asset?.asset_name || "N/A",
          location: found.location,
          quantityL: found.quantity ?? 0,
          costNaira: 0,
          status:
            found.status === "COMPLETED"
              ? "Completed"
              : found.status === "IN_PROGRESS"
              ? "In Progress"
              : "Scheduled",
          dateISO: found.date_time,
        };
        setOrder(mapped);
      } catch (err) {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [decodedId]);

  if (loading) {
    return <div className="text-center py-20 text-white/60">Loading...</div>;
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-white/60">
        {error || "Order not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10">
      <FuelView fuel={order} />
    </div>
  );
}

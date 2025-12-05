"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { FuelView } from "@/components/fuel-delivery/FuelView";

import type { FuelOrderDetail } from "@/types/fuel";

export default function FuelDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Todo: Use react.use
  const decodedId = decodeURIComponent(params.id);
  const [order, setOrder] = useState<FuelOrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axiosInstance.get(
          `/fleet-service/get-fuel-service?id=${decodedId}`
        );

        // The API returns the object directly in data.data based on the user request example
        // "data": { "id": ... }
        // But in the user request JSON it was "data": [ ... ] for list, and "data": { ... } for single?
        // The user request showed:
        // { "success": true, "data": { "id": ... } }
        // So data.data is the object.

        if (data.data) {
          setOrder(data.data);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error(err);
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

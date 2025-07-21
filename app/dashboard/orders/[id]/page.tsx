"use client";
import { useState, useEffect } from "react";
import { use } from "react";
// import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { OrderView } from "@/components/orders/order-details/order-view";
import { OrderEdit } from "@/components/orders/order-details/order-edit";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Unwrap the `params` object using `React.use()`
  const { id } = use(params);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_all_orders");
        const foundOrder = response?.data?.data.find((o) => o.id === id);
        setOrder(foundOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  console.log("Order:", order);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl p-8">
      {isEditing ? (
        <OrderEdit order={order} />
      ) : (
        <OrderView order={order} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}

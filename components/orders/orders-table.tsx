"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateOrderDialog } from "./create-order/create-order-dialog";
import { CreateServiceDialog } from "./create-order/create-service-dialog";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-[#fcbe2d]",
  CANCELED: "bg-[#f00]",
  RESOLVED: "bg-[#00B69B]",
  UNASSIGNED: "bg-[#535353] bg-opacity-30",
};

export function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  const [createServiceDialogOpen, setCreateServiceDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_all_orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const shortenId = (id: string) => {
    return `ord-${id.split("-")[0].substring(0, 5)}`;
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] pb-2 font-semibold">Today</h2>
          <div className="flex gap-1 items-center">
            <div className="h-[5px] w-[5px] rounded-full bg-blue-600" />
            <p className="text-sm text-dark-brown">January 12th</p>
          </div>
        </div>
        <select className="text-sm border rounded-lg px-2 py-1">
          <option>January</option>
        </select>
      </div>

      <Table>
        <TableHeader className="w-full max-w-[1074px] mx-auto rounded-3xl bg-[#979797] bg-opacity-20">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Responder ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="hover:text-orange"
                >
                  {shortenId(order.id)}
                </Link>
              </TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{order.from_address}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleTimeString()}</TableCell>
              <TableCell>{order.professional.id}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 gap-3 rounded-full text-xs font-medium"
                  )}
                >
                  <div
                    className={`w-[12px] h-[12px] rounded-full ${
                      statusStyles[order.status]
                    }`}
                  />
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex gap-4">
        <Button className="bg-orange hover:bg-orange/90">View All</Button>
        <Button
          variant="outline"
          className="border-orange text-orange hover:bg-orange/10"
          onClick={() => setCreateOrderDialogOpen(true)}
        >
          Add New Order
        </Button>
        <Button
          variant="outline"
          className="border-orange text-orange hover:bg-orange/10"
          onClick={() => setCreateServiceDialogOpen(true)}
        >
          Add New Service
        </Button>
      </div>

      <CreateOrderDialog
        open={createOrderDialogOpen}
        onOpenChange={setCreateOrderDialogOpen}
      />
      <CreateServiceDialog
        open={createServiceDialogOpen}
        onOpenChange={setCreateServiceDialogOpen}
      />
    </div>
  );
}
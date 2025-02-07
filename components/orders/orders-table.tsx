"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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
  "In Progress": "bg-[#fcbe2d]",
  Canceled: "bg-[#f00]",
  Resolved: "bg-[#00B69B]",
  Unassigned: "bg-[#535353] bg-opacity-30",
};

const MOCK_ORDERS = [
  {
    id: "INC-00123",
    customerName: "Alex Johnson",
    location: "12 Awolowo Way, Ikeja",
    time: "12:53 PM",
    responderId: "FR-045",
    status: "Resolved",
  },
  {
    id: "INC-00456",
    customerName: "Sarah Miller",
    location: "5 Admiralty Road, Lekki",
    time: "12:53 PM",
    responderId: "FR-112",
    status: "In Progress",
  },
  {
    id: "INC-00789",
    customerName: "David Okafor",
    location: "21 Herbert Mac Street, Yaba",
    time: "12:53 PM",
    responderId: "FR-078",
    status: "Canceled",
  },
] as const;

export function OrdersTable() {
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  const [createServiceDialogOpen, setCreateServiceDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] pb-2 font-semibol">Today</h2>

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
            <TableHead>Incident ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Responder ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_ORDERS.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/dashboard/incidents/${order.id}`}
                  className="hover:text-orange"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.location}</TableCell>
              <TableCell>{order.time}</TableCell>
              <TableCell>{order.responderId}</TableCell>
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
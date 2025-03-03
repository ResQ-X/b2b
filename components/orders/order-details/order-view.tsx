"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OrderDetails } from "@/types/order";

interface OrderViewProps {
  order: any;
  onEdit: () => void;
}

export function OrderView({ order, onEdit }: OrderViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Order ID: {order?.id}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <span className="text-yellow-600">{order?.status}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Customer Name</label>
            <Input value={order?.user?.name || "N/A"} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Contact Number</label>
            <Input value={order?.user?.phone || "N/A"} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Email Address</label>
            <Input value={order?.user?.email || "N/A"} disabled className="bg-white" />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Location Information</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Pick Up Location</label>
            <Input value={order?.from_address || "N/A"} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Drop Off Location</label>
            <Input value={order?.to_address || "N/A"} disabled className="bg-white" />
          </div>
          <div className="relative h-[200px] rounded-lg overflow-hidden">
            <Image src="/map-placeholder.png" alt="Location Map" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* First Responder Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">First Responder Information</h2>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className="text-yellow-600">{order?.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Assigned To</label>
            <Input
              value={`${order?.professional?.name || "N/A"} | ${order?.professional?.id || "N/A"}`}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Role</label>
            <Input value="Responder" disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Current Location</label>
            <Input value="Unknown" disabled className="bg-white" />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Activity</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Note/ Performed By</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="p-4 text-sm">{new Date(order?.created_at).toLocaleString()}</td>
                <td className="p-4 text-sm">Order Created</td>
                <td className="p-4 text-sm">System</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={onEdit} className="bg-orange hover:bg-orange/90">
          Edit Order
        </Button>
        <Button variant="outline" className="border-orange text-orange hover:bg-orange/10">
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
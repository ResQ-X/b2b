"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
// import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSuccessDialog } from "./order-success-dialog";
// import type { OrderDetails } from "@/types/order"

interface OrderEditProps {
  order: OrderDetails;
}

interface Responder {
  id: string;
  name: string;
  status: string;
  eta: string;
  role: string;
  currentLocation: string;
}

interface OrderDetails {
  to_address: string;
  from_address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assigned_professional: any[];
  id: string;
  status: string;
  responder: Responder;
  requester: {
    phone: string;
    name: string;
    contact: string;
    email: string;
  };
  location: {
    pickup: string;
    dropoff: string;
  };
  activities: {
    time: string;
    activity: string;
    note: string;
  }[];
}

export function OrderEdit({ order: initialOrder }: OrderEditProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [showSuccess, setShowSuccess] = useState(false);

  console.log("Order Edit Component Rendered", order);

  const handleSave = async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // setShowSuccess(true);
    // console.log("Order saved:", order);
    // console.log("Order ID:", order.id);
    console.log("Edit order");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold mb-4">Incident Details</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Incident ID: {order.id}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <span className="text-yellow-600">{order.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            Assign/Reassign Responder
          </label>
          <Select defaultValue={order?.responder?.id}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={order?.responder?.id}>
                {order?.assigned_professional[0]?.name}
              </SelectItem>
              {/* <SelectItem value="FR-045">
                {order.assigned_professional[0]?.name}
              </SelectItem> */}
              <SelectItem value="FR-046">John Doe</SelectItem>
              <SelectItem value="FR-047">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            Update Incident Status
          </label>
          <Select defaultValue={order.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current status">{order.status}</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Customer Name</label>
            <Input
              value={order.requester.name}
              onChange={(e) =>
                setOrder({
                  ...order,
                  requester: { ...order.requester, name: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Contact Number</label>
            <Input
              value={order.requester.phone || order.requester.contact}
              onChange={(e) =>
                setOrder({
                  ...order,
                  requester: { ...order.requester, contact: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Email Address</label>
            <Input
              value={order.requester.email}
              onChange={(e) =>
                setOrder({
                  ...order,
                  requester: { ...order.requester, email: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Location Information</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Pick Up Location</label>
            <Input
              // value={order.location.pickup}
              value={order.from_address || order.location.pickup}
              onChange={(e) =>
                setOrder({
                  ...order,
                  location: { ...order.location, pickup: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Drop Off Location</label>
            <Input
              value={order.to_address || order?.location?.dropoff}
              onChange={(e) =>
                setOrder({
                  ...order,
                  location: { ...order.location, dropoff: e.target.value },
                })
              }
            />
          </div>
          <div className="relative h-[200px] rounded-lg overflow-hidden">
            {/* <Image
              src="/map-placeholder.png"
              alt="Location Map"
              fill
              className="object-cover"
            /> */}
          </div>
        </div>
      </div>

      {/* First Responder Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">First Responder Information</h2>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className="text-yellow-600">{order?.responder?.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Estimated Arrival Time:
            </span>
            <span>{order?.responder?.eta}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Assigned To</label>
            <Input
              value={`${order?.assigned_professional[0]?.name} | ${order?.assigned_professional[0]?.id}`}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Role</label>
            <Input
              value={order?.assigned_professional[0]?.userType}
              onChange={(e) =>
                setOrder({
                  ...order,
                  assigned_professional: [
                    { ...order.assigned_professional[0], role: e.target.value },
                  ],
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Current Location</label>
            <Input
              value={order?.responder?.currentLocation}
              onChange={(e) =>
                setOrder({
                  ...order,
                  responder: {
                    ...order.responder,
                    currentLocation: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium text-gray-500">
                  Time
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">
                  Activity
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">
                  Note/ Performed By
                </th>
              </tr>
            </thead>
            <tbody>
              {order.activities.map((activity, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="p-4 text-sm">{activity.time}</td>
                  <td className="p-4 text-sm">{activity.activity}</td>
                  <td className="p-4 text-sm">{activity.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="flex justify-center">
        <Button onClick={handleSave} className="bg-orange hover:bg-orange/90">
          Save Changes
        </Button>
      </div>

      <OrderSuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />
    </div>
  );
}

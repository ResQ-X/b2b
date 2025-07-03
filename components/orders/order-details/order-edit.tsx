/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
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
import axiosInstance from "@/lib/axios";
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
  assigned_first_responder: any;
  order_type: any;
  to_address: string;
  from_address: string;
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

// interface ResponderOption {
//   id: string;
//   name: string;
// }

export function OrderEdit({ order: initialOrder }: OrderEditProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [showSuccess, setShowSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [responderOptions, setResponderOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptionStatus = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_orders_types");
        setStatusOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOptionStatus();
  }, []);

  useEffect(() => {
    const fetchResponders = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get_available_professionals`,
          {
            params: {
              order_type: order.order_type,
              orderId: order.id,
            },
          }
        );

        setResponderOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching responders:", error);
      }
    };

    fetchResponders();
  }, [order.id, order.order_type]);

  // console.log("statusOptions:", statusOptions);
  // console.log("responderOptions", responderOptions);

  // console.log("Order Edit Component Rendered", order);

  const handleSave = async () => {
    console.log("Editted Details", statusOptions, responderOptions);
    setSaving(true);

    try {
      // ✅ Only reassign if a responder is selected
      if (order.responder?.id && responderOptions.length > 0) {
        await axiosInstance.post("/admin/reassign_professional", {
          orderId: order.id,
          proId: order.responder.id,
          password,
        });
      }

      // ✅ Always update order status
      // await axiosInstance.post("/admin/change_order_status", {
      //   orderId: order.id,
      //   status: order.status,
      // });

      await axiosInstance.post("/admin/change_order_status", {
        orderId: order.id,
        status: order.status,
        password,
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving order changes:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
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
          {/* <Select defaultValue={order?.responder?.id}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={order?.responder?.id}>
                {order?.assigned_professional?.name}
              </SelectItem>
              <SelectItem value="FR-045">
                {order.assigned_professional[0]?.name}
              </SelectItem>
              <SelectItem value="FR-046">John Doe</SelectItem>
              <SelectItem value="FR-047">Jane Smith</SelectItem>
            </SelectContent>
          </Select> */}

          <Select
            defaultValue={order?.responder?.id}
            onValueChange={(value) => {
              const selectedResponder = responderOptions.find(
                (r) => r.id === value
              );
              setOrder({
                ...order,
                responder: {
                  ...order.responder,
                  id: value,
                  name: selectedResponder?.name || "",
                },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Responder" />
            </SelectTrigger>
            <SelectContent>
              {responderOptions.length === 0 ? (
                <SelectItem value="none" disabled>
                  No responder for the order
                </SelectItem>
              ) : (
                responderOptions.map((responder) => (
                  <SelectItem key={responder.id} value={responder.id}>
                    {responder.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            Update Incident Status
          </label>
          <Select
            defaultValue={order.status}
            onValueChange={(value) => setOrder({ ...order, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
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
          {/* <div className="relative h-[200px] rounded-lg overflow-hidden">
            <Image
              src="/map-placeholder.png"
              alt="Location Map"
              fill
              className="object-cover"
            />
          </div> */}
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Admin Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to confirm update"
              // className="bg-white"
            />
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
            {order?.assigned_professional && (
              <Input
                value={`${order?.assigned_professional[0]?.name} | ${order?.assigned_professional[0]?.id}`}
                disabled
                className="bg-white"
              />
            )}
            {order?.assigned_first_responder && (
              <Input
                value={`${order?.assigned_first_responder?.name} | ${order?.assigned_first_responder?.id}`}
                disabled
                className="bg-white"
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Role</label>

            {order?.assigned_first_responder?.userType && (
              <Input
                value={order?.assigned_first_responder?.userType}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    assigned_first_responder: [
                      {
                        ...order.assigned_first_responder[0],
                        role: e.target.value,
                      },
                    ],
                  })
                }
              />
            )}

            {order?.assigned_professional?.[0]?.userType && (
              <Input
                value={order?.assigned_professional?.[0]?.userType}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    assigned_professional: [
                      {
                        ...order.assigned_professional[0],
                        role: e.target.value,
                      },
                    ],
                  })
                }
              />
            )}
            {/* <Input
              value={order?.assigned_professional?.userType}
              onChange={(e) =>
                setOrder({
                  ...order,
                  assigned_professional: [
                    { ...order.assigned_professional[0], role: e.target.value },
                  ],
                })
              }
            /> */}
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
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <OrderSuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />
    </div>
  );
}

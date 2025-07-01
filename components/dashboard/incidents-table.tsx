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
import { cn } from "@/lib/utils";

const statusStyles = {
  "In Progress": "bg-[#fcbe2d]",
  Canceled: "bg-[#f00]",
  Resolved: "bg-[#00B69B]",
  Unassigned: "bg-[#535353] bg-opacity-30",
};

type Order = {
  id: string;
  requester?: { name: string };
  from_address?: string;
  location?: string;
  created_at?: string;
  time?: string;
  assigned_first_responder?: { id: string };
  status: string;
};

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("Orders:", orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/get_all_orders");
        // setOrders(response.data);
        setLoading(false);
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback to mock data if API fails
        // setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Optional: Set up polling for real-time updates
    // const intervalId = setInterval(fetchOrders, 30000); // Refresh every 30 seconds

    // return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Format date to display only the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  console.log("Orders:", orders);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] pb-2 font-semibold">Recent Orders</h2>
          <div className="flex gap-1 items-center">
            <div className="h-[5px] w-[5px] rounded-full bg-blue-600" />
            <p className="text-sm text-dark-brown">{currentDate}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading orders...</p>
        </div>
      ) : (
        <>
          <Table className="rounded-3xl">
            <TableHeader className="w-full max-w-[1074px] mx-auto rounded-3xl bg-[#979797] bg-opacity-20">
              <TableRow className="rounded-3xl">
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
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order?.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/orders/${order?.id}`}
                      className="hover:text-orange"
                    >
                      {order?.id}
                    </Link>
                  </TableCell>
                  {/* <TableCell>
                    {order.user?.name || order.customerName}
                  </TableCell> */}
                  <TableCell>{order?.requester?.name}</TableCell>
                  <TableCell>{order.from_address || order.location}</TableCell>
                  <TableCell>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : order.time}
                  </TableCell>
                  {/* <TableCell>
                    {order.professional?.id || order.responderId}
                  </TableCell> */}
                  <TableCell>{order?.assigned_first_responder?.id}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 gap-3 rounded-full text-xs font-medium"
                      )}
                    >
                      <div
                        className={`w-[12px] h-[12px] rounded-full ${
                          statusStyles[
                            order.status as keyof typeof statusStyles
                          ]
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

          <div className="mt-6 w-full flex items-center justify-center">
            <Link
              href="/dashboard/orders"
              className="w-full max-w-[168px] mx-auto"
            >
              <Button className="w-full text-[14px] rounded-[14px] font-medium bg-orange hover:bg-orange/90">
                View All Orders
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Fallback mock data in case the API fails
// const MOCK_ORDERS = [
//   {
//     id: "ORD-00123",
//     customerName: "Alex Johnson",
//     location: "12 Awolowo Way, Ikeja",
//     time: "12:53 PM",
//     responderId: "FR-045",
//     status: "Resolved",
//   },
//   {
//     id: "ORD-00456",
//     customerName: "Sarah Miller",
//     location: "5 Admiralty Road, Lekki",
//     time: "12:53 PM",
//     responderId: "FR-112",
//     status: "In Progress",
//   },
//   {
//     id: "ORD-00789",
//     customerName: "David Okafor",
//     location: "21 Herbert Mac Street, Yaba",
//     time: "12:53 PM",
//     responderId: "FR-078",
//     status: "Canceled",
//   },
//   {
//     id: "ORD-00234",
//     customerName: "Grace Adebayo",
//     location: "15 Opebi Road, Ikeja",
//     time: "1:15 PM",
//     responderId: "FR-089",
//     status: "Unassigned",
//   },
//   {
//     id: "ORD-00567",
//     customerName: "Emmanuel Nwosu",
//     location: "8 Badagry Express, Festac",
//     time: "2:30 PM",
//     responderId: "FR-102",
//     status: "In Progress",
//   },
// ];

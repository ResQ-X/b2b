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
// import { CreateOrderDialog } from "./create-order/create-order-dialog";
// import { CreateServiceDialog } from "./create-order/create-service-dialog";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-[#FCBE2D]",
  ACCEPTED: "bg-[#00B69B]",
  ARRIVED: "bg-[#6ADE11]",
  COMPLETED: "bg-[#6ADE11]",
  CANCELED: "bg-[#FD5454]",
  // RESOLVED: "bg-[#00B69B]",
  // UNASSIGNED: "bg-[#535353] bg-opacity-30",
};

const MOCK_ORDERS = [
  {
    id: "ord-12345",
    requester: { name: "John Doe" },
    from_address: "123 Main St, City, Country",
    created_at: "2023-01-12T10:00:00Z",
    assigned_first_responder: { id: "res-001" },
    status: "PENDING",
  },
  {
    id: "ord-67890",
    requester: { name: "Jane Smith" },
    from_address: "456 Elm St, City, Country",
    created_at: "2023-01-12T11:00:00Z",
    assigned_first_responder: { id: "res-002" },
    status: "RESOLVED",
  },
];

export function OrdersTable() {
  const [orders, setOrders] = useState<typeof MOCK_ORDERS>(MOCK_ORDERS);
  // const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  // const [createServiceDialogOpen, setCreateServiceDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_all_orders");
        // setOrders(response.data);
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  console.log("Orders:", orders);

  const shortenId = (id: string) => {
    return `ord-${id.split("-")[0].substring(0, 5)}`;
  };

  return (
    <div className="">
      <form className="max-w-md mb-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-[#A89887]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-[#F2E7DA] rounded-[19px] bg-[#FAF8F5] outline-none"
            placeholder="Search Orders"
            required
          />
        </div>
      </form>

      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* <h2 className="text-[24px] pb-2 font-semibold">Today</h2> */}
            {/* <div className="flex gap-1 items-center">
              <div className="h-[5px] w-[5px] rounded-full bg-blue-600" />
              <p className="text-sm text-dark-brown">January 12th</p>
            </div> */}
          </div>
          {/* <select className="text-sm border rounded-lg px-2 py-1">
            <option>January</option>
          </select> */}
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
                <TableCell>{order.requester.name}</TableCell>
                <TableCell>{order.from_address}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleTimeString()}
                </TableCell>
                <TableCell>{order?.assigned_first_responder?.id}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 gap-3 rounded-full text-xs font-medium"
                    )}
                  >
                    <div
                      className={`w-[12px] h-[12px] rounded-full ${
                        // statusStyles[order.status]
                        statusStyles[
                          order.status as keyof typeof statusStyles
                        ] || "bg-gray-300"
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

        {/* <div className="mt-6 flex gap-4">
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
        </div> */}

        {/* <CreateOrderDialog
          open={createOrderDialogOpen}
          onOpenChange={setCreateOrderDialogOpen}
        />
        <CreateServiceDialog
          open={createServiceDialogOpen}
          onOpenChange={setCreateServiceDialogOpen}
        /> */}
      </div>
      <div className="flex items-center justify-end mt-5">
        <Button type="button" variant="outline" className="bg-transparent">
          Previous
        </Button>

        <p className="mx-2">
          Page <span className="mx-2">1</span> of{" "}
          <span className="mx-2">3</span>
        </p>

        <Button type="button" variant="outline" className="bg-transparent">
          Next
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateServiceDialog } from "./dialogs/create-service-dialog";
// Fixed imports with PascalCase names
import { Truck, Fuel, Key, Battery, Heart } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
// import { Pagination } from "@/components/ui/pagination";

// Updated icons object with PascalCase names
const icons = {
  "Tow Truck": Truck,
  "Fuel Delivery": Fuel,
  "Key Replacement": Key,
  "Battery Jump Start": Battery,
  "Health Check": Heart,
  "FLAT TYRES": Truck,
  "OUT OF FUEL": Fuel,
};

type Service = {
  id: string;
  name: string;
  unit_price: string;
  delivery_price: string;
  service_price: string;
  created_at: string;
  updated_at: string;
};

export function ServicesTable() {
  const [createServiceDialogOpen, setCreateServiceDialogOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async (page: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/resqx-services/get?page=${page}`
      );
      setServices(response.data.data);
      setTotalPages(response.data.totalPages || 1); // Adjust based on your API response
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log(handlePageChange, totalPages);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-semibold">Services List</h2>
          <p className="text-sm text-gray-500">Manage your service offerings</p>
        </div>
      </div>

      {loading ? (
        <div className="w-full text-center py-10">
          <svg
            className="animate-spin h-6 w-6 text-orange mx-auto mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="text-sm text-gray-500">Fetching orders...</p>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-gray-50 rounded-lg">
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Delivery Price</TableHead>
              <TableHead>Service Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => {
                // Use a default icon if the service name is not in the icons object
                const Icon = icons[service.name as keyof typeof icons] || Truck;

                if (!Icon) {
                  console.error(`No icon found for service: ${service.name}`);
                  return null; // Skip rendering this row if icon is undefined
                }

                return (
                  <TableRow key={service.id}>
                    <TableCell className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-500" />
                      {service.name}
                    </TableCell>
                    <TableCell>₦{service.unit_price}</TableCell>
                    <TableCell>₦{service.delivery_price}</TableCell>
                    <TableCell>₦{service.service_price}</TableCell>
                    <TableCell>
                      {new Date(service.created_at).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </TableCell> */}
                    <TableCell>
                      <Link href={`/dashboard/services/${service.id}`}>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      <div className="mt-6 w-full flex items-center justify-center">
        <Button
          onClick={() => setCreateServiceDialogOpen(true)}
          className="bg-orange hover:bg-orange/90"
        >
          Add New Service
        </Button>
      </div>
      <div className="mt-6 flex justify-between items-center">
        {/* <Button
          onClick={() => setCreateServiceDialogOpen(true)}
          className="bg-orange hover:bg-orange/90"
        >
          Add New Service
        </Button> */}

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        /> */}
      </div>

      <CreateServiceDialog
        open={createServiceDialogOpen}
        onOpenChange={setCreateServiceDialogOpen}
        onServiceCreated={() => fetchServices(currentPage)}
      />
    </div>
  );
}

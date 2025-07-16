"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

const statusStyles = {
  online: "text-green-600 bg-green-50",
  Offline: "text-red-600 bg-red-50",
};

interface Props {
  activeTab: string;
}

export type Admin = {
  userType: string;
  created_at: string | number | Date;
  is_online: boolean;
  id: string;
  name: string;
  location: string;
  role?: string;
  dateAdded?: string;
  status: "online" | "Offline";
  resolved?: number;
  avgResponseTime?: string;
};

export function AdminTable({ activeTab }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        let data: Admin[] = [];

        switch (activeTab) {
          case "isOnline": {
            const completedRes = await axiosInstance.get(
              "/admin/get_all_pros?isOnline=true"
            );
            data = [...(completedRes.data.data.users || [])];
            break;
          }

          case "isOffline": {
            const completedRes = await axiosInstance.get(
              "/admin/get_all_pros?isOnline=false"
            );
            data = [...(completedRes.data.data.users || [])];
            break;
          }

          case "isVerified": {
            const res = await axiosInstance.get(
              "/admin/get_all_pros?isVerified=true"
            );
            data = res.data.data.users || [];
            break;
          }

          default: {
            const res = await axiosInstance.get("/admin/get_all_pros");
            data = res.data.data.users || [];
          }
        }

        setAdmins(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [activeTab]);

  console.log("admins", admins);

  return (
    <div className="bg-white rounded-xl p-6">
      {/* <h2 className="text-lg font-semibold mb-6">Admin Staff</h2> */}

      <div className="w-2/5 relative mb-5">
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
          placeholder="Search professional"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
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
          <TableHeader>
            <TableRow>
              <TableHead>Staff ID</TableHead>
              <TableHead>Name</TableHead>
              {/* <TableHead>Location</TableHead> */}
              <TableHead>Role</TableHead>
              <TableHead>Date added</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins
              ?.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  {/* <TableCell>{member.location}</TableCell> */}
                  <TableCell>{member.userType}</TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const status = member.is_online ? "online" : "Offline";
                      return (
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            statusStyles[status]
                          )}
                        >
                          {status === "online" ? "Online" : "Offline"}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/staff/admin/${member.id}`}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-6 flex gap-4">
        <Button className="bg-orange hover:bg-orange/90">View All</Button>
        <Button
          variant="outline"
          className="border-orange text-orange hover:bg-orange/10"
        >
          Update List
        </Button>
      </div>
    </div>
  );
}

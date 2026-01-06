/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/ui/CustomInput";
import {
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

type SubAdmin = {
  id: string;
  email: string;
  name: string;
};

type Activity = {
  type: "transaction" | "fund_request";
  id: string;
  amount: number;
  reference?: string;
  status: string;
  transactionType?: "CREDIT" | "DEBIT";
  description?: string;
  note?: string;
  timestamp: string;
};

type ActivityResponse = {
  success: boolean;
  subAdmin: SubAdmin;
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    type: string;
    startDate?: string;
    endDate?: string;
  };
};

export default function SubAdminActivityPage() {
  const params = useParams();
  const router = useRouter();
  const subAdminId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ActivityResponse | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (filterType && filterType !== "all") {
        params.append("type", filterType);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      const res = await axiosInstance.get<ActivityResponse>(
        `/super/team/${subAdminId}/activities?${params.toString()}`
      );

      setData(res.data);
    } catch (e: any) {
      console.error("Failed to load activities:", e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to load activities.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subAdminId) {
      fetchActivities();
    }
  }, [subAdminId, currentPage, filterType, startDate, endDate]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchActivities();
  };

  const handleResetFilters = () => {
    setFilterType("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const totalPages = data
    ? Math.ceil(data.pagination.total / data.pagination.limit)
    : 0;

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "SUCCESS":
      case "APPROVED":
      case "COMPLETED":
        return "bg-green-500/20 text-green-400";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400";
      case "FAILED":
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === "transaction") {
      return activity.transactionType === "CREDIT" ? (
        <ArrowDownCircle className="w-5 h-5 text-green-400" />
      ) : (
        <ArrowUpCircle className="w-5 h-5 text-red-400" />
      );
    }
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !data) {
    return (
      <div className="p-8 text-white/70 text-center">Loading activities…</div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8">
        <Button
          //   variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-red-400 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            // variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {/* Back */}
          </Button>
          <div>
            <h1 className="text-white text-2xl font-semibold">
              Activity Log: {data?.subAdmin.name}
            </h1>
            <p className="text-white/60 text-sm mt-1">{data?.subAdmin.email}</p>
          </div>
        </div>
        <div className="text-white/60 text-sm">
          Total Activities: {data?.pagination.total || 0}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 bg-[#2D2A27]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Activity Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-[#1F1E1C] border-white/10 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2A27] border-white/10 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="fund_request">Fund Requests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <CustomInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // className="bg-[#1F1E1C] border-white/10 text-white"
              className="bg-[#1F1E1C] border-white/10 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <CustomInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // className="bg-[#1F1E1C] border-white/10 text-white"
              className="bg-[#1F1E1C] border-white/10 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex gap-2">
              <Button
                variant="orange"
                onClick={handleApplyFilters}
                className="flex-1 text-white"
              >
                Apply
              </Button>
              <Button
                onClick={handleResetFilters}
                // variant="outline"
                className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      {!data?.activities || data.activities.length === 0 ? (
        <div className="p-8 text-white/80 text-center rounded-xl border border-white/10 bg-[#2D2A27]">
          No activities found for the selected filters.
        </div>
      ) : (
        <>
          <div className="overflow-visible rounded-2xl border border-white/10 bg-[#2D2A27]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-white">
                <thead className="bg-[#1F1E1C] text-white/80 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Reference/Note</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {data.activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity)}
                          <span className="capitalize">
                            {activity.type.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span
                          className={
                            activity.transactionType === "CREDIT"
                              ? "text-green-400"
                              : activity.transactionType === "DEBIT"
                              ? "text-red-400"
                              : "text-white"
                          }
                        >
                          {activity.transactionType === "CREDIT" && "+"}
                          {activity.transactionType === "DEBIT" && "-"}
                          {formatCurrency(activity.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {activity.reference || activity.note || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70 max-w-xs truncate">
                        {activity.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {formatDate(activity.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-white/60 text-sm">
                Page {currentPage} of {totalPages} ({data.pagination.total}{" "}
                total activities)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  //   variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="bg-transparent border-white/10 text-white hover:bg-white/5 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        // variant={
                        //   currentPage === pageNum ? "default" : "outline"
                        // }
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`w-10 h-10 p-0 ${
                          currentPage === pageNum
                            ? "bg-white text-black"
                            : "bg-transparent border-white/10 text-white hover:bg-white/5"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  //   variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || loading}
                  className="bg-transparent border-white/10 text-white hover:bg-white/5 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

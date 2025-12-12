"use client";
import jsPDF from "jspdf";
import { naira } from "@/app/(dashboard)/billing/page";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

type Transaction = {
  id: string;
  status: string;
  reference_number: string;
  type: string;
  amount: string;
  created_at: string;
  updated_at: string;
};

type BillRow = {
  product: string;
  date: string;
  invoiceNo: string;
  method: string;
  amount: number;
  status: "Paid" | "Pending";
};

export function BillingTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();

        // Add search query
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        // Add date range
        if (dateRange.start) {
          params.append("startDate", dateRange.start);
        }
        if (dateRange.end) {
          params.append("endDate", dateRange.end);
        }

        // Add type filter (DEBIT, CREDIT, INFO)
        if (selectedType !== "ALL") {
          params.append("type", selectedType);
        }

        // Add status filter (SUCCESS, PENDING, FAILED, DECLINED)
        if (selectedStatus !== "ALL") {
          params.append("status", selectedStatus);
        }

        // Add pagination
        params.append("page", "1");
        params.append("limit", "100");

        const queryString = params.toString();
        const endpoint = queryString
          ? `/fleet-wallet/transactions?${queryString}`
          : "/fleet-wallet/get-wallet-balance";

        const response = await axiosInstance.get(endpoint);

        // Handle response based on endpoint
        if (queryString) {
          setTransactions(response.data.data || []);
        } else {
          setTransactions(response.data.data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [searchQuery, dateRange, selectedType, selectedStatus]);

  // Transform transactions to BillRow format
  const transformedBills: BillRow[] = transactions.map((transaction) => {
    const date = new Date(transaction.created_at);
    // const formattedDate = date.toLocaleDateString("en-US", {
    //   month: "short",
    //   year: "numeric",
    // });
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Determine product name based on transaction type
    const productMap: Record<string, string> = {
      TOP_UP: "Wallet Top Up",
      FUEL_SERVICE: "Fuel Service",
      MAINTENANCE: "Maintenance",
      EMERGENCY: "Emergency Service",
    };

    return {
      product: productMap[transaction.type] || transaction.type,
      date: formattedDate,
      // invoiceNo: transaction.reference_number,
      invoiceNo: transaction.reference_number.split("-").slice(1).join("-"),
      method: transaction.reference_number,
      amount: parseFloat(transaction.amount),
      status: transaction.status === "SUCCESS" ? "Paid" : "Pending",
    };
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDateRange({ start: "", end: "" });
    setSelectedType("ALL");
    setSelectedStatus("ALL");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== "" ||
    dateRange.start !== "" ||
    dateRange.end !== "" ||
    selectedType !== "ALL" ||
    selectedStatus !== "ALL";

  const handleDownloadInvoice = (transaction: Transaction, bill: BillRow) => {
    try {
      const doc = new jsPDF();

      // Add header
      doc.setFontSize(20);
      doc.setTextColor(255, 133, 0); // Orange color
      doc.text("ResQ-X", 20, 20);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("INVOICE", 20, 35);

      // Add invoice details
      doc.setFontSize(10);
      doc.text(`Invoice No: ${bill.invoiceNo}`, 20, 50);
      doc.text(`Date Issued: ${bill.date}`, 20, 58);
      doc.text(`Status: ${bill.status}`, 20, 66);

      // Add line
      doc.line(20, 75, 190, 75);

      // Add transaction details
      doc.setFontSize(12);
      doc.text("Transaction Details", 20, 85);

      doc.setFontSize(10);
      doc.text(`Product: ${bill.product}`, 20, 95);
      doc.text(`Payment Method: TOP UP`, 20, 103);
      doc.text(`Reference: ${transaction.reference_number}`, 20, 111);

      // Add line
      doc.line(20, 120, 190, 120);

      // Add amount
      doc.setFontSize(14);
      doc.text(`Total Amount: ${naira(bill.amount)}`, 20, 135);

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text("Thank you for your business!", 20, 270);
      doc.text("ResQ-X Fleet Management System", 20, 278);

      // Save the PDF
      doc.save(`invoice-${bill.invoiceNo}.pdf`);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };
  if (loading) {
    return (
      <div className="bg-[#3B3835] rounded-b-[20px] text-white p-8 text-center">
        <p className="text-white/60">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
      {/* Filter Section */}
      <div className="p-6 border-b border-white/10">
        {/* Search and Toggle Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by invoice, product, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60 focus:outline-none focus:border-[#FF8500]/50"
            />
          </div>

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 rounded-xl border border-white/10 bg-[#2D2A27] text-white hover:bg-[#FF8500]/10 hover:border-[#FF8500]/50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>{showFilters ? "Hide" : "Show"} Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#FF8500] text-white text-xs font-semibold">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4">
            {/* Date Range Start */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#2D2A27] text-white focus:outline-none focus:border-[#FF8500]/50"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#2D2A27] text-white focus:outline-none focus:border-[#FF8500]/50"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Transaction Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#2D2A27] text-white focus:outline-none focus:border-[#FF8500]/50"
              >
                <option value="ALL">All Types</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
                <option value="INFO">Info</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#2D2A27] text-white focus:outline-none focus:border-[#FF8500]/50"
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-[#FF8500] hover:text-[#FF8500]/80 font-medium text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-white/60">
          Showing {transformedBills.length} of {transformedBills.length}{" "}
          transaction{transformedBills.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Desktop Table Header - Hidden on mobile */}
      <div className="hidden lg:block h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
        <div className="grid grid-cols-7 text-sm font-semibold text-white/90">
          <div>Product</div>
          <div>Date Issued</div>
          <div>Invoice No</div>
          <div>Payment Method</div>
          <div>Amount</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#262422] px-4 py-4 rounded-b-xl">
        <h3 className="text-lg font-semibold text-white/90">Billing History</h3>
      </div>

      {/* Table Body */}
      <ul className="bg-[#3B3835]">
        {transformedBills.length === 0 ? (
          <li className="p-8 text-center">
            <p className="text-white/60">No transactions found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-[#FF8500] hover:text-[#FF8500]/80 font-medium text-sm"
              >
                Clear all filters
              </button>
            )}
          </li>
        ) : (
          transformedBills.map((b, i) => {
            // Find the original transaction index
            const originalIndex = transformedBills.findIndex(
              (bill) => bill.invoiceNo === b.invoiceNo
            );
            return (
              <li key={i} className="border-b border-white/10 last:border-b-0">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-7 items-center px-6 py-8">
                  <div className="font-medium">{b.product}</div>
                  <div className="text-white/85">{b.date}</div>
                  <div className="text-white/85">{b.invoiceNo}</div>
                  <div className="text-white/85 ml-8">TOP UP</div>
                  <div className="text-white/85">{naira(b.amount)}</div>
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${b.status === "Paid" ? "bg-emerald-400" : "bg-yellow-400"
                        }`}
                    />
                    <span
                      className={`font-semibold ${b.status === "Paid" ? "text-emerald-300" : "text-yellow-300"
                        }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleDownloadInvoice(transactions[originalIndex], b)}
                      className="text-[#FF8500] font-semibold hover:underline"
                    >
                      Download
                    </button>
                  </div>
                </div>

                {/* Mobile Layout - Card Style */}
                <div className="lg:hidden px-4 py-6">
                  <div className="space-y-3">
                    {/* Product & Status Row */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{b.product}</h4>
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${b.status === "Paid" ? "bg-emerald-400" : "bg-yellow-400"
                            }`}
                        />
                        <span
                          className={`font-semibold text-sm ${b.status === "Paid"
                            ? "text-emerald-300"
                            : "text-yellow-300"
                            }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-white/60 text-xs mb-1">
                          Date Issued
                        </div>
                        <div className="text-white/85">{b.date}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs mb-1">Amount</div>
                        <div className="text-white/85 font-semibold">
                          {naira(b.amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs mb-1">Invoice No</div>
                        <div className="text-white/85">{b.invoiceNo}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs mb-1">
                          Payment Method
                        </div>
                        <div className="text-white/85">TOP UP</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleDownloadInvoice(transactions[originalIndex], b)}
                        className="text-[#FF8500] font-semibold text-sm hover:underline"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

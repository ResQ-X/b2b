"use client";
import jsPDF from "jspdf";
import { naira } from "@/app/(dashboard)/billing/page";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Transaction = {
  id: string;
  status: string;
  reference_number: string;
  type: string;
  description: string;
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

  // Modal state
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header - Company Logo/Name
      doc.setFontSize(24);
      doc.setTextColor(255, 133, 0); // Orange color
      doc.setFont("helvetica", "bold");
      doc.text("ResQ-X", 20, 25);

      // Company tagline
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Fleet Management System", 20, 32);

      // Invoice title (right aligned)
      doc.setFontSize(28);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 20, 25, { align: "right" });

      // Invoice metadata (right aligned)
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${bill.invoiceNo}`, pageWidth - 20, 35, {
        align: "right",
      });
      doc.text(`Date Issued: ${bill.date}`, pageWidth - 20, 42, {
        align: "right",
      });

      // Status badge
      const statusColor =
        bill.status === "Paid" ? [34, 197, 94] : [234, 179, 8];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      const statusWidth = doc.getTextWidth(bill.status) + 8;
      doc.roundedRect(
        pageWidth - 20 - statusWidth,
        46,
        statusWidth,
        7,
        2,
        2,
        "F"
      );
      doc.text(bill.status, pageWidth - 20 - statusWidth / 2, 51, {
        align: "center",
      });

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 60, pageWidth - 20, 60);

      // Transaction Information Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Transaction Information", 20, 72);

      // Transaction details in a box
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(20, 78, pageWidth - 40, 50, 3, 3, "F");

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");

      let yPos = 86;
      const leftCol = 25;
      // const rightCol = 110;

      // Left column
      doc.setFont("helvetica", "bold");
      doc.text("Transaction ID:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(transaction.id.substring(0, 24) + "...", leftCol + 35, yPos);

      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Reference Number:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(transaction.reference_number, leftCol + 35, yPos);

      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Transaction Type:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(transaction.type, leftCol + 35, yPos);

      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Product/Service:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(bill.product, leftCol + 35, yPos);

      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Payment Method:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text("Wallet", leftCol + 35, yPos);

      // Description section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Description", 20, 138);

      doc.setFillColor(250, 250, 250);
      doc.roundedRect(20, 144, pageWidth - 40, 20, 3, 3, "F");

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      const description = transaction.description || "No description provided";
      const splitDescription = doc.splitTextToSize(description, pageWidth - 50);
      doc.text(splitDescription, 25, 150);

      // Amount breakdown
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Amount Details", 20, 176);

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);

      yPos = 186;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text("Amount", 25, yPos);
      doc.text(
        `NGN ${bill.amount.toLocaleString("en-NG")}`,
        pageWidth - 25,
        yPos,
        { align: "right" }
      );
      doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);

      // Total (highlighted)
      yPos += 12;
      doc.setFillColor(255, 133, 0);
      doc.roundedRect(20, yPos - 8, pageWidth - 40, 12, 2, 2, "F");

      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount", 25, yPos);
      doc.text(
        `NGN ${bill.amount.toLocaleString("en-NG")}`,
        pageWidth - 25,
        yPos,
        { align: "right" }
      );

      // Timestamps section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Transaction Timeline", 20, 220);

      doc.setFillColor(250, 250, 250);
      doc.roundedRect(20, 226, pageWidth - 40, 20, 3, 3, "F");

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");

      yPos = 232;
      doc.setFont("helvetica", "bold");
      doc.text("Created:", 25, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(transaction.created_at).toLocaleString(), 50, yPos);

      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Updated:", 25, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(transaction.updated_at).toLocaleString(), 50, yPos);

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Thank you for doing business!",
        pageWidth / 2,
        pageHeight - 22,
        {
          align: "center",
        }
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        "ResQ-X Fleet Management System",
        pageWidth / 2,
        pageHeight - 16,
        { align: "center" }
      );
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 11,
        { align: "center" }
      );

      // Save the PDF
      doc.save(`ResQX-Invoice-${bill.invoiceNo}.pdf`);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(255, 133, 0);
      doc.setFont("helvetica", "bold");
      doc.text("ResQ-X", pageWidth / 2, yPos, { align: "center" });

      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Transaction Report", pageWidth / 2, yPos, { align: "center" });

      yPos += 5;
      doc.setFontSize(9);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );

      yPos += 10;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);

      yPos += 10;

      // Summary
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Transactions: ${transformedBills.length}`, 20, yPos);

      const totalAmount = transformedBills.reduce(
        (sum, b) => sum + b.amount,
        0
      );
      doc.text(
        `Total Amount: NGN ${totalAmount.toLocaleString("en-NG")}`,
        pageWidth - 20,
        yPos,
        {
          align: "right",
        }
      );

      yPos += 10;

      // Table Headers
      doc.setFillColor(255, 133, 0);
      doc.rect(20, yPos, pageWidth - 40, 8, "F");

      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      const colWidths = [35, 30, 35, 25, 30, 20];
      const headers = [
        "Product",
        "Date",
        // "Invoice No",
        "Type",
        "Amount",
        "Status",
      ];
      let xPos = 22;

      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos + 5.5);
        xPos += colWidths[i];
      });

      yPos += 8;

      // Table Rows
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");

      transformedBills.forEach((bill, index) => {
        const transaction = transactions[index];

        // Check if we need a new page
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 20;

          // Repeat headers on new page
          doc.setFillColor(255, 133, 0);
          doc.rect(20, yPos, pageWidth - 40, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          xPos = 22;
          headers.forEach((header, i) => {
            doc.text(header, xPos, yPos + 5.5);
            xPos += colWidths[i];
          });
          yPos += 8;
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
        }

        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, yPos, pageWidth - 40, 8, "F");
        }

        xPos = 22;

        // Product (truncated if too long)
        const productText = doc.splitTextToSize(bill.product, colWidths[0] - 2);
        doc.text(productText[0], xPos, yPos + 5.5);
        xPos += colWidths[0];

        // Date
        doc.text(bill.date, xPos, yPos + 5.5);
        xPos += colWidths[1];

        // Invoice No
        // doc.text(bill.invoiceNo, xPos, yPos + 5.5);
        // xPos += colWidths[2];

        // Type
        const typeColor =
          transaction?.type === "CREDIT" ? [34, 197, 94] : [239, 68, 68];
        doc.setTextColor(typeColor[0], typeColor[1], typeColor[2]);
        doc.text(transaction?.type || "N/A", xPos, yPos + 5.5);
        doc.setTextColor(60, 60, 60);
        xPos += colWidths[3];

        // Amount
        doc.text(`NGN ${bill.amount.toLocaleString("en-NG")}`, xPos, yPos + 5.5);
        xPos += colWidths[4];

        // Status
        const statusColor =
          bill.status === "Paid" ? [34, 197, 94] : [234, 179, 8];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(bill.status, xPos, yPos + 5.5);
        doc.setTextColor(60, 60, 60);

        yPos += 8;
      });

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "italic");
      doc.text(
        "ResQ-X Fleet Management System",
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
      );

      // Save the PDF
      doc.save(
        `ResQX-Transactions-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
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

          {/* Export CSV Button */}
          <button
            onClick={handleExportPDF}
            className="h-12 px-6 rounded-xl border border-white/10 bg-[#FF8500] text-white hover:bg-[#FF8500]/90 transition-colors flex items-center gap-2"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download PDF</span>
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
                      className={`font-semibold ${b.status === "Paid"
                        ? "text-emerald-300"
                        : "text-yellow-300"
                        }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() =>
                        handleViewDetails(transactions[originalIndex])
                      }
                      className="text-[#FF8500] font-semibold hover:underline"
                    >
                      View Details
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
                          className={`h-2.5 w-2.5 rounded-full ${b.status === "Paid"
                            ? "bg-emerald-400"
                            : "bg-yellow-400"
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
                        <div className="text-white/60 text-xs mb-1">
                          Invoice No
                        </div>
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
                        onClick={() =>
                          handleViewDetails(transactions[originalIndex])
                        }
                        className="text-[#FF8500] font-semibold text-sm hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#1E1D1B] text-white p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="mt-6 space-y-4">
              {/* Transaction ID */}
              <div className="bg-[#2D2B29] rounded-xl p-4">
                <label className="text-sm font-medium text-white/70 block mb-2">
                  Transaction ID
                </label>
                <div className="text-white font-mono text-sm break-all">
                  {selectedTransaction.id}
                </div>
              </div>

              {/* Reference Number */}
              <div className="bg-[#2D2B29] rounded-xl p-4">
                <label className="text-sm font-medium text-white/70 block mb-2">
                  Reference Number
                </label>
                <div className="text-white font-mono text-sm break-all">
                  {selectedTransaction.reference_number}
                </div>
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2D2B29] rounded-xl p-4">
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    Type
                  </label>
                  <div
                    className={`font-semibold ${selectedTransaction.type === "CREDIT"
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {selectedTransaction.type}
                  </div>
                </div>
                <div className="bg-[#2D2B29] rounded-xl p-4">
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    Status
                  </label>
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${selectedTransaction.status === "SUCCESS"
                        ? "bg-emerald-400"
                        : "bg-yellow-400"
                        }`}
                    />
                    <span
                      className={`font-semibold ${selectedTransaction.status === "SUCCESS"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                        }`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-[#2D2B29] rounded-xl p-4">
                <label className="text-sm font-medium text-white/70 block mb-2">
                  Amount
                </label>
                <div className="text-3xl font-bold text-[#FF8500]">
                  {naira(parseFloat(selectedTransaction.amount))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#2D2B29] rounded-xl p-4">
                <label className="text-sm font-medium text-white/70 block mb-2">
                  Description
                </label>
                <div className="text-white/90 text-sm">
                  {selectedTransaction.description}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2D2B29] rounded-xl p-4">
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    Created At
                  </label>
                  <div className="text-white text-sm">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#2D2B29] rounded-xl p-4">
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    Updated At
                  </label>
                  <div className="text-white text-sm">
                    {new Date(selectedTransaction.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    const bill = transformedBills.find(
                      (b) => b.method === selectedTransaction.reference_number
                    );
                    if (bill) {
                      handleDownloadInvoice(selectedTransaction, bill);
                    }
                  }}
                  className="w-full h-12 px-6 rounded-xl bg-[#FF8500] text-white font-medium hover:bg-[#E67600] transition-colors flex items-center justify-center gap-2"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Invoice
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";
import jsPDF from "jspdf";
import { naira } from "@/app/(dashboard)/billing/page";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

type Overdraft = {
  id: string;
  amount: string;
  reason: string;
  status: "PENDING" | "CLEARED";
  business: {
    id: string;
    name: string;
    company_name: string;
    email: string;
  };
  adminId: string;
  approvedById: string | null;
  approvedAt: string | null;
  created_at: string;
  updated_at: string;
};

type BillRow = {
  product: string;
  date: string;
  invoiceNo: string;
  reason: string;
  amount: number;
  status: "PENDING" | "CLEARED";
};

export function OverDraftTable() {
  const [overdrafts, setOverdrafts] = useState<Overdraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverdrafts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/fleet-overdrafts/my?page=1&limit=50"
        );
        setOverdrafts(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch overdrafts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdrafts();
  }, []);

  // Transform overdrafts to BillRow format
  const transformedBills: BillRow[] = overdrafts.map((overdraft) => {
    const date = new Date(overdraft.created_at);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const statusMap: Record<string, "PENDING" | "CLEARED"> = {
      PENDING: "PENDING",
      CLEARED: "CLEARED",
    };

    return {
      product: "Overdraft Request",
      date: formattedDate,
      invoiceNo: overdraft.id.slice(0, 8).toUpperCase(),
      reason: overdraft.reason,
      amount: parseFloat(overdraft.amount),
      status: statusMap[overdraft.status] || "Pending",
    };
  });

  const handleDownloadInvoice = (overdraft: Overdraft, bill: BillRow) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(255, 133, 0);
      doc.text("ResQ-X", 20, 20);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("OVERDRAFT REQUEST", 20, 35);

      doc.setFontSize(10);
      doc.text(`Request ID: ${bill.invoiceNo}`, 20, 50);
      doc.text(`Date Issued: ${bill.date}`, 20, 58);
      doc.text(`Status: ${bill.status}`, 20, 66);

      doc.line(20, 75, 190, 75);

      doc.setFontSize(12);
      doc.text("Overdraft Details", 20, 85);

      doc.setFontSize(10);
      doc.text(`Company: ${overdraft.business.company_name}`, 20, 95);
      doc.text(`Reason: ${bill.reason}`, 20, 103);
      doc.text(`Full ID: ${overdraft.id}`, 20, 111);

      doc.line(20, 120, 190, 120);

      doc.setFontSize(14);
      doc.text(`Overdraft Amount: ${naira(bill.amount)}`, 20, 135);

      if (overdraft.approvedAt) {
        const approvedDate = new Date(overdraft.approvedAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        );
        doc.setFontSize(10);
        doc.text(`Approved On: ${approvedDate}`, 20, 150);
      }

      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text("Thank you for using ResQ-X", 20, 270);
      doc.text("ResQ-X Fleet Management System", 20, 278);

      doc.save(`overdraft-${bill.invoiceNo}.pdf`);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#3B3835] rounded-b-[20px] text-white p-8 text-center">
        <p className="text-white/60">Loading overdrafts...</p>
      </div>
    );
  }

  if (transformedBills.length === 0) {
    return (
      <div className="bg-[#3B3835] rounded-b-[20px] text-white p-8 text-center">
        <p className="text-white/60">No overdrafts found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden lg:block h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
        <div className="grid grid-cols-5 text-sm font-semibold text-white/90">
          <div>Date Issued</div>
          <div>Request ID</div>
          <div>Reason</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#262422] px-4 py-4 rounded-b-xl">
        <h3 className="text-lg font-semibold text-white/90">
          Overdraft History
        </h3>
      </div>

      {/* Table Body */}
      <ul className="bg-[#3B3835]">
        {transformedBills.map((b, i) => {
          const overdraft = overdrafts[i];

          return (
            <li key={i} className="border-b border-white/10 last:border-b-0">
              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-5 items-center px-6 py-8">
                <div className="text-white/85">{b.date}</div>
                <div className="text-white/85">{b.invoiceNo}</div>
                <div className="text-white/85 truncate pr-4" title={b.reason}>
                  {b.reason}
                </div>
                <div className="text-white/85">{naira(b.amount)}</div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${b.status === "CLEARED"
                        ? "bg-emerald-400"
                        : b.status === "PENDING"
                          ? "bg-red-400"
                          : "bg-yellow-400"
                        }`}
                    />
                    <span
                      className={`font-semibold ${b.status === "CLEARED"
                        ? "text-emerald-300"
                        : b.status === "PENDING"
                          ? "text-red-300"
                          : "text-yellow-300"
                        }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(overdraft, b)}
                    className="text-[#FF8500] font-semibold hover:underline ml-4"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden px-4 py-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{b.product}</h4>
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${b.status === "CLEARED"
                          ? "bg-emerald-400"
                          : b.status === "PENDING"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                          }`}
                      />
                      <span
                        className={`font-semibold text-sm ${b.status === "CLEARED"
                          ? "text-emerald-300"
                          : "text-yellow-300"
                          }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

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
                        Request ID
                      </div>
                      <div className="text-white/85">{b.invoiceNo}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-white/60 text-xs mb-1">Reason</div>
                      <div className="text-white/85">{b.reason}</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleDownloadInvoice(overdraft, b)}
                      className="text-[#FF8500] font-semibold text-sm hover:underline text-left"
                    >
                      Download Document
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

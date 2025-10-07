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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setTransactions(response.data.data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  if (transformedBills.length === 0) {
    return (
      <div className="bg-[#3B3835] rounded-b-[20px] text-white p-8 text-center">
        <p className="text-white/60">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
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
        {transformedBills.map((b, i) => (
          <li key={i} className="border-b border-white/10 last:border-b-0">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-7 items-center px-6 py-8">
              <div className="font-medium">{b.product}</div>
              <div className="text-white/85">{b.date}</div>
              <div className="text-white/85">{b.invoiceNo}</div>
              {/* <div className="text-white/85">{b.method}</div> */}
              <div className="text-white/85 ml-8">TOP UP</div>
              <div className="text-white/85">{naira(b.amount)}</div>
              <div className="inline-flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    b.status === "Paid" ? "bg-emerald-400" : "bg-yellow-400"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    b.status === "Paid" ? "text-emerald-300" : "text-yellow-300"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <div className="text-right">
                <button
                  onClick={() => handleDownloadInvoice(transactions[i], b)}
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
                      className={`h-2.5 w-2.5 rounded-full ${
                        b.status === "Paid" ? "bg-emerald-400" : "bg-yellow-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        b.status === "Paid"
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
                    {/* <div className="text-white/85">{b.method}</div> */}
                    <div className="text-white/85">TOP UP</div>
                  </div>
                </div>

                {/* Action Button */}
                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleDownloadInvoice(transactions[i], b)}
                    className="text-[#FF8500] font-semibold text-sm hover:underline"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

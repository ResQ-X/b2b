import React from "react";
import { naira } from "@/app/(dashboard)/billing/page";

type BillRow = {
  product: string;
  date: string;
  invoiceNo: string;
  method: string;
  amount: number;
  status: "Paid" | "Pending";
};

const BILLS: BillRow[] = [
  {
    product: "Wallet Top Up",
    date: "Aug 2025",
    invoiceNo: "INV-012",
    method: "INV-012",
    amount: 25000,
    status: "Paid",
  },
  {
    product: "Fuel Service",
    date: "Aug 2025",
    invoiceNo: "INV-011",
    method: "INV-011",
    amount: 25000,
    status: "Paid",
  },
  {
    product: "Maintenance",
    date: "Aug 2025",
    invoiceNo: "INV-010",
    method: "INV-010",
    amount: 25000,
    status: "Paid",
  },
];

export function BillingTable() {
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
        {BILLS.map((b, i) => (
          <li key={i} className="border-b border-white/10 last:border-b-0">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-7 items-center px-6 py-8">
              <div className="font-medium">{b.product}</div>
              <div className="text-white/85">{b.date}</div>
              <div className="text-white/85">{b.invoiceNo}</div>
              <div className="text-white/85">{b.method}</div>
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
                <button className="text-[#FF8500] font-semibold hover:underline">
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
                    <div className="text-white/85">{b.method}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button className="text-[#FF8500] font-semibold text-sm hover:underline">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Horizontal Scroll Alternative (commented out) */}
      {/* 
      Alternative approach - uncomment if you prefer horizontal scroll on mobile:
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#262422]">
            <tr className="h-[80px]">
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Product</th>
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Date Issued</th>
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Invoice No</th>
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Payment Method</th>
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Amount</th>
              <th className="text-left px-6 py-8 text-sm font-semibold text-white/90">Status</th>
              <th className="text-right px-6 py-8 text-sm font-semibold text-white/90">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#3B3835]">
            {BILLS.map((b, i) => (
              <tr key={i} className="border-b border-white/10 last:border-b-0">
                <td className="px-6 py-8 font-medium">{b.product}</td>
                <td className="px-6 py-8 text-white/85">{b.date}</td>
                <td className="px-6 py-8 text-white/85">{b.invoiceNo}</td>
                <td className="px-6 py-8 text-white/85">{b.method}</td>
                <td className="px-6 py-8 text-white/85">{naira(b.amount)}</td>
                <td className="px-6 py-8">
                  <div className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${b.status === 'Paid' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    <span className={`font-semibold ${b.status === 'Paid' ? 'text-emerald-300' : 'text-yellow-300'}`}>{b.status}</span>
                  </div>
                </td>
                <td className="px-6 py-8 text-right">
                  <button className="text-[#FF8500] font-semibold hover:underline">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      */}
    </div>
  );
}

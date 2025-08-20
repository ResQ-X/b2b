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
      <div className="h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
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

      {/* <div className="px-6 pb-6"> */}
      <ul className="bg-[#3B3835]">
        {BILLS.map((b, i) => (
          <li key={i} className="grid grid-cols-7 items-center px-6 py-8">
            <div className="font-medium">{b.product}</div>
            <div className="text-white/85">{b.date}</div>
            <div className="text-white/85">{b.invoiceNo}</div>
            <div className="text-white/85">{b.method}</div>
            <div className="text-white/85">{naira(b.amount)}</div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-semibold">{b.status}</span>
            </div>
            <div className="text-right">
              <button className="text-[#FF8500] font-semibold hover:underline">
                Download
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

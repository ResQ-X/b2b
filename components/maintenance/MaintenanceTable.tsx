"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
import Link from "next/link";

export type OrderStatus = "Completed" | "In Progress" | "Scheduled" | "Overdue";

export type Order = {
  id: string; // RF-2024-1000
  vehicle: string; // LND-451-AA
  serviceType: string; // Oil Change, Brake Inspection...
  mileageKm: number; // 45000
  status: OrderStatus;
  dueDateISO: string; // 2025-04-05
  costNaira: number; // 22500
};

export const maintenanceData: Order[] = [
  {
    id: "RF-2024-1000",
    vehicle: "LND-451-AA",
    serviceType: "Oil Change",
    mileageKm: 45000,
    status: "Completed",
    dueDateISO: "2025-04-05",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Brake Inspection",
    mileageKm: 65000,
    status: "In Progress",
    dueDateISO: "2025-04-07",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Tire Rotation",
    mileageKm: 38000,
    status: "Overdue",
    dueDateISO: "2025-05-05",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Full Service",
    mileageKm: 50000,
    status: "Scheduled",
    dueDateISO: "2025-09-05",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Full Service",
    mileageKm: 50000,
    status: "Scheduled",
    dueDateISO: "2025-09-05",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Full Service",
    mileageKm: 50000,
    status: "Scheduled",
    dueDateISO: "2025-09-05",
    costNaira: 22500,
  },
  {
    id: "RF-2024-1000",
    vehicle: "RF-2024-1000",
    serviceType: "Full Service",
    mileageKm: 50000,
    status: "Scheduled",
    dueDateISO: "2025-09-05",
    costNaira: 22500,
  },
];

const PER_PAGE = 5;

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

const StatusPill = ({ status }: { status: OrderStatus }) => {
  const map = {
    Completed: { dot: "#22C55E", text: "#22C55E" },
    "In Progress": { dot: "#8B8CF6", text: "#8B8CF6" },
    Scheduled: { dot: "#FACC15", text: "#FACC15" },
    Overdue: { dot: "#EF4444", text: "#EF4444" },
  } as const;
  const c = map[status];
  return (
    <span className="inline-flex items-center gap-2 font-semibold">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: c.dot }}
      />
      <span style={{ color: c.text }}>{status}</span>
    </span>
  );
};

export default function MaintenanceTable({ orders }: { orders?: Order[] }) {
  const source = orders ?? maintenanceData;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(source.length / PER_PAGE);

  const data = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return source.slice(start, start + PER_PAGE);
  }, [page, source]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
      {/* Header */}
      <div className="h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
        <div className="grid grid-cols-7 text-sm font-semibold text-white/90">
          <div>Vehicle</div>
          <div>Service Type</div>
          <div>Current Mileage</div>
          <div>Status</div>
          <div>Due Date</div>
          <div>Cost</div>
          <div className="text-right">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <ul className="bg-[#3B3835]">
        {data.map((o, i) => (
          <li
            key={o.id + i}
            className="grid grid-cols-7 items-center px-6 py-8"
          >
            <div className="text-white/90">#{o.id}</div>
            <div className="text-white/90">{o.serviceType}</div>
            <div className="text-white/90">
              {o.mileageKm.toLocaleString()}km
            </div>
            <div>
              <StatusPill status={o.status} />
            </div>
            <div className="text-white/90">{formatDate(o.dueDateISO)}</div>
            <div className="text-white/90">{formatMoney(o.costNaira)}</div>
            <div className="flex items-center justify-end">
              <Link
                href={`/maintenance/${encodeURIComponent(o.id)}`}
                className="text-[#FF8500] font-semibold hover:underline"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer / Pagination */}
      <div className="border-t border-white/10">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => canPrev && setPage((p) => p - 1)}
              disabled={!canPrev}
              className="rounded-lg bg-white/10 p-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-white/80 min-w-[70px] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
              className="rounded-lg bg-white/10 p-2 disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* <Button className="w-full max-w-[248px] h-[48px] bg-[#FF8500] hover:bg-[#ff9a33]">
            Schedule Service <Plus className="h-4 w-4 ml-2" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}

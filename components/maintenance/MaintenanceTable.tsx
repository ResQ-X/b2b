"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// ton } from "@/components/ui/button";
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

const PER_PAGE = 3;

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
    <span className="inline-flex items-center gap-1 sm:gap-2 font-semibold whitespace-nowrap text-xs sm:text-sm">
      <span
        className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: c.dot }}
      />
      <span style={{ color: c.text }}>{status}</span>
    </span>
  );
};

export default function MaintenanceTable({ orders }: { orders?: Order[] }) {
  const source = useMemo(() => orders ?? [], [orders]);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(source.length / PER_PAGE);

  const data = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return source.slice(start, start + PER_PAGE);
  }, [page, source]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden w-full">
      {/* Horizontal Scroll Container - Only for the table content */}
      <div className="overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div className="h-[60px] sm:h-[80px] rounded-b-xl bg-[#262422] px-3 sm:px-6 py-4 sm:py-8">
            <div className="grid grid-cols-7 text-xs sm:text-sm font-semibold text-white/90 gap-1 sm:gap-2">
              <div className="truncate">Vehicle</div>
              <div className="truncate">Service</div>
              <div className="hidden sm:block truncate">Mileage</div>
              <div className="sm:hidden truncate">Miles</div>
              <div className="truncate">Status</div>
              <div className="truncate">Due Date</div>
              <div className="truncate">Cost</div>
              <div className="text-right truncate">Actions</div>
            </div>
          </div>

          {/* Rows */}
          <ul className="bg-[#3B3835] w-full">
            {data.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                <div className="text-white/40 mb-3">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                  No maintenance records
                </h3>
                <p className="text-white/60 text-sm sm:text-base text-center ">
                  Your vehicle maintenance history will appear here once
                  services are scheduled or completed
                </p>
              </li>
            ) : (
              data.map((o, i) => (
                <li
                  key={o.id + i}
                  className="grid grid-cols-7 items-center px-3 sm:px-6 py-4 sm:py-8 gap-1 sm:gap-2 border-b border-white/5 last:border-b-0"
                >
                  <div className="text-white/90 text-xs sm:text-sm font-medium truncate">
                    {o.vehicle}
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {o.serviceType.split(" ")[0]}
                    </span>
                    <span className="hidden sm:inline">{o.serviceType}</span>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {Math.round(o.mileageKm / 1000)}k
                    </span>
                    <span className="hidden sm:inline">
                      {o.mileageKm.toLocaleString()}km
                    </span>
                  </div>
                  <div className="truncate">
                    <StatusPill status={o.status} />
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {formatDate(o.dueDateISO).slice(0, 5)}
                    </span>
                    <span className="hidden sm:inline">
                      {formatDate(o.dueDateISO)}
                    </span>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      ₦{Math.round(o.costNaira / 1000)}k
                    </span>
                    <span className="hidden sm:inline">
                      {formatMoney(o.costNaira)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/maintenance/${encodeURIComponent(o.id)}`}
                      className="text-[#FF8500] font-semibold hover:underline text-xs sm:text-sm whitespace-nowrap"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Footer / Pagination - Outside scroll container */}
      <div className="border-t border-white/10">
        <div className="flex flex-col items-center gap-4 py-4 sm:py-6 px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => canPrev && setPage((p) => p - 1)}
              disabled={!canPrev}
              className="rounded-lg bg-white/10 p-2 disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="text-sm text-white/80 min-w-[70px] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
              className="rounded-lg bg-white/10 p-2 disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

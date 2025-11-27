"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestFuelModal from "@/components/fuel-delivery/RequestFuelModal";

export type OrderStatus = "Completed" | "In Progress" | "Scheduled" | "Pending";

export type Order = {
  id: string;
  vehicle: string;
  location: string;
  quantityL: number;
  costNaira: number;
  status: OrderStatus;
  dateISO: string;
};

//

type Asset = {
  id: string;
  asset_name: string;
  plate_number: string | null;
};

type Location = {
  id: string;
  location_name: string;
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
    Pending: { dot: "#F59E0B", text: "#F59E0B" },
  } as const;
  const c = map[status] ?? map.Scheduled;
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

export default function OrdersTable({
  assets = [],
  locations = [],
  filteredOrders = [],
  searchQuery = "",
}: {
  assets?: Asset[];
  locations?: Location[];
  filteredOrders?: Order[];
  searchQuery?: string;
}) {
  // client-side pagination for filtered results
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Calculate pagination for filtered orders
  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const endIdx = startIdx + PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, endIdx);

  console.log("paginatedOrders:", paginatedOrders);
  console.log("filteredOrders:", filteredOrders);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // dropdown options
  const fuelTypeOptions = [
    { label: "Petrol", value: "PETROL" },
    { label: "Diesel", value: "DIESEL" },
  ];

  const vehicleOptions = useMemo(
    () =>
      assets.map((asset) => ({
        label: asset.plate_number
          ? `${asset.asset_name} (${asset.plate_number})`
          : asset.asset_name,
        value: asset.id,
      })),
    [assets]
  );

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        label: location.location_name,
        value: location.id,
      })),
    [locations]
  );

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden w-full">
      {/* Scroll container */}
      <div className="overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div className="h-[60px] sm:h-[80px] rounded-b-xl bg-[#262422] px-3 sm:px-6 py-4 sm:py-8">
            <div className="grid grid-cols-7 text-xs sm:text-sm font-semibold text-white/90 gap-1 sm:gap-2">
              <div className="truncate">Order ID</div>
              <div className="truncate">Vehicle</div>
              <div className="truncate">Location</div>
              <div className="truncate">Quantity</div>
              <div className="truncate">Cost</div>
              <div className="truncate">Status</div>
              <div className="text-right truncate">Date / Actions</div>
            </div>
          </div>

          {/* Rows */}
          <ul className="bg-[#3B3835] w-full">
            {paginatedOrders.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                <div className="text-white/40 mb-2">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                  {searchQuery ? "No matching orders" : "No orders yet"}
                </h3>
                <p className="text-white/60 text-sm sm:text-base text-center max-w-md mb-2">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Start by requesting a new fuel delivery for your vehicles"}
                </p>
              </li>
            ) : (
              paginatedOrders.map((o, i) => (
                <li
                  key={o.id + i}
                  className="grid grid-cols-7 items-center px-3 sm:px-6 py-4 sm:py-8 gap-1 sm:gap-2 border-b border-white/5 last:border-b-0"
                >
                  <div className="font-medium text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {o.id.includes("-") ? o.id.split("-")[2] : o.id}
                    </span>
                    <span className="hidden sm:inline">{o.id}</span>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    {o.vehicle}
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {o.location.split(" ")[0]}
                    </span>
                    <span className="hidden sm:inline">{o.location}</span>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    {o.quantityL}L
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      ₦{Math.round(o.costNaira / 1000)}k
                    </span>
                    <span className="hidden sm:inline">
                      {formatMoney(o.costNaira)}
                    </span>
                  </div>
                  <div className="truncate">
                    <StatusPill status={o.status} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-5">
                    <span className="text-white/80 text-xs sm:text-sm whitespace-nowrap order-2 sm:order-1">
                      <span className="sm:hidden">
                        {formatDate(o.dateISO).slice(0, 5)}
                      </span>
                      <span className="hidden sm:inline">
                        {formatDate(o.dateISO)}
                      </span>
                    </span>
                    <Link
                      href={`/fuel-delivery/${o.id}`}
                      className="text-[#FF8500] font-semibold hover:underline text-xs sm:text-sm whitespace-nowrap order-1 sm:order-2"
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

      {/* Divider */}
      <div className="h-px bg-white/15 mt-6" />

      {/* Pagination + CTA */}
      <div className="flex flex-col items-center gap-4 py-4 sm:py-6 px-3 sm:px-6">
        {filteredOrders.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-[10px] bg-white/10 p-2 disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="text-sm text-white/80 min-w-[70px] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
              className="rounded-[10px] bg-white/10 p-2 disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        <Button
          variant="orange"
          className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          onClick={() => setOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Delivery
        </Button>
      </div>

      {/* Modal */}
      <RequestFuelModal
        open={open}
        onOpenChange={setOpen}
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
      />
    </div>
  );
}

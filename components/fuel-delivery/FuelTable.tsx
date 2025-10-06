"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RequestFuelModal, {
  type RequestFuelForm,
} from "@/components/fuel-delivery/RequestFuelModal";
import axiosInstance from "@/lib/axios";

export type OrderStatus = "Completed" | "In Progress" | "Scheduled";

export type Order = {
  id: string;
  vehicle: string;
  location: string;
  quantityL: number;
  costNaira: number;
  status: OrderStatus;
  dateISO: string;
};

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

type Asset = {
  id: string;
  asset_name: string;
  plate_number: string | null;
};

type Location = {
  id: string;
  location_name: string;
};

export default function OrdersTable({
  orders,
  assets = [],
  locations = [],
}: {
  orders?: Order[];
  assets?: Asset[];
  locations?: Location[];
}) {
  const source = useMemo(() => orders ?? [], [orders]);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(source.length / PER_PAGE);

  const data = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return source?.slice(start, start + PER_PAGE);
  }, [page, source]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const [open, setOpen] = useState(false);

  // Fuel type options
  const fuelTypeOptions = [
    { label: "Petrol", value: "PETROL" },
    { label: "Diesel", value: "DIESEL" },
  ];

  // Generate vehicle options from assets
  const vehicleOptions = assets.map((asset) => ({
    label: asset.plate_number
      ? `${asset.asset_name} (${asset.plate_number})`
      : asset.asset_name,
    value: asset.id,
  }));

  // Generate location options from locations
  const locationOptions = locations.map((location) => ({
    label: location.location_name,
    value: location.id,
  }));

  // Time slot options (generate for today and tomorrow)
  const slotOptions = [
    { label: "Now", value: "NOW" },
    {
      label: "08:00–10:00",
      value: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    },
    {
      label: "10:00–12:00",
      value: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    },
    {
      label: "12:00–14:00",
      value: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    },
    {
      label: "14:00–16:00",
      value: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    },
    {
      label: "16:00–18:00",
      value: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    },
  ];

  const handleSubmit = async (data: RequestFuelForm) => {
    try {
      const requestBody = {
        fuel_type: data.type,
        asset_id: data.vehicle,
        location_id: data.location,
        time_slot: data.slot === "NOW" ? new Date().toISOString() : data.slot,
        quantity: data.quantity,
        note: data.note,
        is_scheduled: data.slot !== "NOW",
      };

      const response = await axiosInstance.post(
        "/fleet-service/place-fuel-service",
        requestBody
      );

      console.log("Fuel service request successful:", response.data);

      // Refresh dashboard stats and assets
      // const [statsResponse, assetsResponse] = await Promise.all([
      //   axiosInstance.get("/fleets/dashboard-stats"),
      //   axiosInstance.get("/fleet-asset/get-asset"),
      // ]);

      // setStats(statsResponse.data.data);
      // setAssets(assetsResponse.data.assets || []);

      // Show success message (you can use a toast notification here)
      alert("Fuel service requested successfully!");
    } catch (error) {
      console.error("Failed to request fuel service:", error);
      // Show error message (you can use a toast notification here)
      alert("Failed to request fuel service. Please try again.");
      throw error; // Re-throw to let modal handle the error state
    }
  };

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden w-full">
      {/* Horizontal Scroll Container */}
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
            {data.map((o, i) => (
              <li
                key={o.id + i}
                className="grid grid-cols-7 items-center px-3 sm:px-6 py-4 sm:py-8 gap-1 sm:gap-2 border-b border-white/5 last:border-b-0"
              >
                <div className="font-medium text-xs sm:text-sm truncate">
                  <span className="sm:hidden">{o.id.split("-")[2]}</span>
                  <span className="hidden sm:inline">{o.id}</span>
                </div>
                <div className="text-white/90 text-xs sm:text-sm truncate">
                  {o.vehicle}
                </div>
                <div className="text-white/90 text-xs sm:text-sm truncate">
                  <span className="sm:hidden">{o.location.split(" ")[0]}</span>
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
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/15 mt-6" />

      {/* Pagination + CTA */}
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

        <Button
          variant="orange"
          className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          onClick={() => setOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Delivery
        </Button>
      </div>

      {/* <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={typeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      /> */}

      {/* <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      /> */}
      <RequestFuelModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />
    </div>
  );
}

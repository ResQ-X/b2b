"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RequestServiceModal, {
  type RequestServiceForm,
} from "@/components/fuel-delivery/FuelModal";

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

export const fuelData: Order[] = [
  {
    id: "RF-2024-1000",
    vehicle: "LND-451-AA",
    location: "Lekki Office",
    quantityL: 45,
    costNaira: 22500,
    status: "Completed",
    dateISO: "2025-04-05",
  },
  {
    id: "RF-2024-1001",
    vehicle: "ABC-123-XY",
    location: "VI Branch",
    quantityL: 60,
    costNaira: 30000,
    status: "In Progress",
    dateISO: "2025-04-05",
  },
  {
    id: "RF-2024-1002",
    vehicle: "GGE-772-BX",
    location: "Ikeja Depot",
    quantityL: 80,
    costNaira: 40000,
    status: "Scheduled",
    dateISO: "2025-04-06",
  },
  {
    id: "RF-2024-1003",
    vehicle: "KJA-220-KD",
    location: "Surulere",
    quantityL: 35,
    costNaira: 17500,
    status: "Completed",
    dateISO: "2025-04-06",
  },
  {
    id: "RF-2024-1004",
    vehicle: "LND-991-ZZ",
    location: "Yaba Office",
    quantityL: 55,
    costNaira: 27500,
    status: "In Progress",
    dateISO: "2025-04-06",
  },
  {
    id: "RF-2024-1005",
    vehicle: "APP-883-QW",
    location: "Lekki Office",
    quantityL: 45,
    costNaira: 22500,
    status: "Completed",
    dateISO: "2025-04-07",
  },
  {
    id: "RF-2024-1006",
    vehicle: "FKJ-001-AB",
    location: "Ikoyi HQ",
    quantityL: 70,
    costNaira: 35000,
    status: "Scheduled",
    dateISO: "2025-04-07",
  },
  {
    id: "RF-2024-1007",
    vehicle: "LND-777-TT",
    location: "Ajah Yard",
    quantityL: 90,
    costNaira: 45000,
    status: "Completed",
    dateISO: "2025-04-07",
  },
  {
    id: "RF-2024-1008",
    vehicle: "ABC-555-PQ",
    location: "VI Branch",
    quantityL: 45,
    costNaira: 22500,
    status: "In Progress",
    dateISO: "2025-04-08",
  },
  {
    id: "RF-2024-1009",
    vehicle: "GGE-100-CC",
    location: "Ikeja Depot",
    quantityL: 65,
    costNaira: 32500,
    status: "Scheduled",
    dateISO: "2025-04-08",
  },
  {
    id: "RF-2024-1010",
    vehicle: "KJA-220-KD",
    location: "Surulere",
    quantityL: 40,
    costNaira: 20000,
    status: "Completed",
    dateISO: "2025-04-08",
  },
  {
    id: "RF-2024-1011",
    vehicle: "LND-451-AA",
    location: "Lekki Office",
    quantityL: 45,
    costNaira: 22500,
    status: "In Progress",
    dateISO: "2025-04-09",
  },
  {
    id: "RF-2024-1012",
    vehicle: "APP-883-QW",
    location: "Yaba Office",
    quantityL: 55,
    costNaira: 27500,
    status: "Scheduled",
    dateISO: "2025-04-09",
  },
  {
    id: "RF-2024-1013",
    vehicle: "FKJ-001-AB",
    location: "Ikoyi HQ",
    quantityL: 60,
    costNaira: 30000,
    status: "Completed",
    dateISO: "2025-04-09",
  },
  {
    id: "RF-2024-1014",
    vehicle: "LND-777-TT",
    location: "Ajah Yard",
    quantityL: 50,
    costNaira: 25000,
    status: "In Progress",
    dateISO: "2025-04-10",
  },
  {
    id: "RF-2024-1015",
    vehicle: "ABC-555-PQ",
    location: "VI Branch",
    quantityL: 45,
    costNaira: 22500,
    status: "Scheduled",
    dateISO: "2025-04-10",
  },
  {
    id: "RF-2024-1016",
    vehicle: "GGE-100-CC",
    location: "Ikeja Depot",
    quantityL: 80,
    costNaira: 40000,
    status: "Completed",
    dateISO: "2025-04-10",
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

export default function OrdersTable({ orders }: { orders?: Order[] }) {
  const source = orders ?? fuelData;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(source.length / PER_PAGE);

  const data = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return source.slice(start, start + PER_PAGE);
  }, [page, source]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const [open, setOpen] = useState(false);

  const typeOptions = [
    { label: "Oil Change", value: "oil-change" },
    { label: "Brake Inspection", value: "brake-inspection" },
    { label: "Tire Rotation", value: "tire-rotation" },
    { label: "Full Service", value: "full-service" },
  ];

  const vehicleOptions = [
    { label: "LND-451-AA", value: "LND-451-AA" },
    { label: "KJA-220-KD", value: "KJA-220-KD" },
    { label: "ABC-123-XY", value: "ABC-123-XY" },
  ];
  const locationOptions = [
    { label: "Lekki Office", value: "lekki-office" },
    { label: "VI Branch", value: "vi-branch" },
    { label: "Ikeja Depot", value: "ikeja-depot" },
  ];
  const slotOptions = [
    { label: "08:00–10:00", value: "08:00-10:00" },
    { label: "10:00–12:00", value: "10:00-12:00" },
    { label: "12:00–14:00", value: "12:00-14:00" },
  ];

  const handleSubmit = async (data: RequestServiceForm) => {
    // TODO: call your API
    // await axios.post('/api/maintenance/request', data)
    console.log("submit", data);
  };

  return (
    <div className="bg-[#3B3835] rounded-b-[20px] text-white overflow-hidden">
      {/* Header */}
      {/* <div className=""> */}
      <div className="h-[80px] rounded-b-xl bg-[#262422] px-6 py-8">
        <div className="grid grid-cols-7 text-sm font-semibold text-white/90">
          <div>Order ID</div>
          <div>Vehicle</div>
          <div>Location</div>
          <div>Quantity</div>
          <div>Cost</div>
          <div>Status</div>
          <div className="text-right">Date / Actions</div>
        </div>
      </div>
      {/* </div> */}

      {/* Rows */}
      <ul className="bg-[#3B3835]">
        {data.map((o, i) => (
          <li
            key={o.id + i}
            className="grid grid-cols-7 items-center px-6 py-8"
          >
            <div className="font-medium">{o.id}</div>
            <div className="text-white/90">{o.vehicle}</div>
            <div className="text-white/90">{o.location}</div>
            <div className="text-white/90">{o.quantityL}L</div>
            <div className="text-white/90">{formatMoney(o.costNaira)}</div>
            <div>
              <StatusPill status={o.status} />
            </div>
            <div className="flex items-center justify-end gap-5">
              <span className="text-white/80">{formatDate(o.dateISO)}</span>
              <Link
                href={`/fuel-delivery/${o.id}`}
                className="text-[#FF8500] font-semibold hover:underline"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="h-px bg-white/15 mt-6" />

      {/* Pagination + CTA */}
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

        <Button
          className="w-full max-w-[248px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
          onClick={() => setOpen(true)}
        >
          New Delivery <Plus className="h-4 w-4" />
        </Button>
      </div>

      <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={typeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />
    </div>
  );
}

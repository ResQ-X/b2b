"use client";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Rows3 } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
// import Loader from "@/components/ui/Loader";
import FuelTable, {
  // fuelData,
  type Order,
} from "@/components/fuel-delivery/FuelTable";
import FuelTabs from "@/components/fuel-delivery/FuelTabs";
import { toCSV, downloadText } from "@/lib/export";

// interface DashboardMetrics {
//   active_order_count: number;
//   professionals: number;
//   active_order: unknown[];
//   wallet_balance?: number;
// }

const TABS = [
  { key: "all", label: "All Orders", shortLabel: "All" },
  { key: "completed", label: "Completed Orders", shortLabel: "Completed" },
  { key: "in-transit", label: "In transit Orders", shortLabel: "In transit" },
  { key: "scheduled", label: "Scheduled Orders", shortLabel: "Scheduled" },
];

type Asset = {
  id: string;
  asset_name: string;
  plate_number: string | null;
};

type Location = {
  id: string;
  location_name: string;
};

export default function FuelDeliveryPage() {
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const counts = useMemo(
    () => ({
      all:
        orders.filter((o) => o.status === "Completed").length +
        orders.filter((o) => o.status === "In Progress").length +
        orders.filter((o) => o.status === "Scheduled").length,
      completed: orders.filter((o) => o.status === "Completed").length,
      inprogress: orders.filter((o) => o.status === "In Progress").length,
      scheduled: orders.filter((o) => o.status === "Scheduled").length,
    }),
    [orders]
  );

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.key as keyof typeof counts],
  }));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const filteredByTab: Order[] = useMemo(() => {
    if (tab === "completed")
      return orders.filter((o) => o.status === "Completed");
    if (tab === "inprogress")
      return orders.filter((o) => o.status === "In Progress");
    if (tab === "scheduled")
      return orders.filter((o) => o.status === "Scheduled");
    return orders;
  }, [tab, orders]);

  const filtered: Order[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredByTab;

    return filteredByTab.filter((o) => {
      const hay = [o.id, o.vehicle, o.location, formatDate(o.dateISO)]
        .join(" ")
        .toLowerCase();

      // also allow numeric matches (quantity, cost)
      const numHay = `${o.quantityL} ${o.costNaira}`;

      return hay.includes(q) || numHay.includes(q);
    });
  }, [filteredByTab, search]);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [assetsRes, locationsRes, ordersRes] = await Promise.all([
          axiosInstance.get("/fleet-asset/get-asset"),
          axiosInstance.get("/fleet-asset/get-locations"),
          axiosInstance.get("/fleet-service/get-fuel-service", {
            params: { page: 1, limit: 5 },
          }),
        ]);

        setAssets(assetsRes.data.assets || []);
        setLocations(locationsRes.data.data || []);

        type ApiOrder = {
          id: string;
          status: string;
          date_time: string;
          fuel_type?: string;
          service_time_type?: string;
          quantity?: number;
          note?: string;
          location: string;
          location_longitude?: string;
          location_latitude?: string;
          business_id?: string;
          asset_id?: string;
          created_at?: string;
          updated_at?: string;
          asset?: {
            id: string;
            asset_name: string;
            plate_number: string | null;
          };
        };

        const apiOrders = (ordersRes.data.data || []) as ApiOrder[];
        const mapped: Order[] = apiOrders.map((o) => ({
          id: o.id,
          vehicle: o.asset?.plate_number || o.asset?.asset_name || "N/A",
          location: o.location,
          quantityL: o.quantity ?? 0,
          costNaira: 0,
          status:
            o.status === "COMPLETED"
              ? "Completed"
              : o.status === "IN_PROGRESS"
              ? "In Progress"
              : "Scheduled",
          dateISO: o.date_time,
        }));
        setOrders(mapped);
      } catch (e) {
        console.error("Failed to fetch fuel delivery data", e);
      }
    };
    fetchInit();
  }, []);

  // if (!metrics) return <Loader />;

  const tiles = [
    {
      title: "All Orders",
      value: counts.all,
      sub: "Fuel Delivery",
      icon: Rows3,
    },
    {
      title: "Completed Orders",
      value: counts.completed,
      sub: "Fuel Consumption",
      icon: Rows3,
    },
    {
      title: "In Progress",
      value: counts.inprogress,
      sub: "Fuel Consumption",
      icon: Rows3,
    },
    {
      title: "Scheduled",
      value: counts.scheduled,
      sub: "Fuel Consumption",
      icon: Rows3,
    },
  ];

  const exportFuel = () => {
    // Flat rows for CSV (use your formatters so it reads nicely)
    const rows = filtered.map((o) => ({
      "Order ID": o.id,
      Vehicle: o.vehicle,
      Location: o.location,
      QuantityL: o.quantityL,
      CostNGN: o.costNaira, // keep numeric; Excel can sum
      Status: o.status,
      Date: formatDate(o.dateISO),
    }));
    const csv = toCSV(rows);
    downloadText(
      `fuel-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      csv
    );
  };

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="flex flex-col md:flex-row md:gap-[52px]">
        {tiles.map((t, idx) => (
          <div key={t.title} className="relative flex-1">
            <StatTile {...t} />
            {idx < tiles.length - 1 && (
              <span className="hidden md:block absolute -right-[26px] top-1/2 -translate-y-1/2 h-[41px] w-px bg-white" />
            )}
          </div>
        ))}
      </div>

      <FuelTabs
        tabs={tabsWithCounts}
        value={tab}
        onChange={setTab}
        search={search}
        onSearchChange={setSearch}
        onExport={exportFuel}
      />

      {/* Table */}
      <FuelTable orders={filtered} assets={assets} locations={locations} />
    </div>
  );
}

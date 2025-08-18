"use client";
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { Rows3 } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import OrdersTable, {
  MOCK_ORDERS,
  type Order,
} from "@/components/fuel-delivery/FuelTable";
import FuelTabs from "@/components/fuel-delivery/FuelTabs";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "completed", label: "Completed Orders" },
  { key: "inprogress", label: "In Transit Orders" }, // maps to "In Progress"
  { key: "scheduled", label: "Scheduled Orders" },
];

export default function FuelDeliveryPage() {
  const [tab, setTab] = useState<string>("all");

  const counts = useMemo(
    () => ({
      all: MOCK_ORDERS.length,
      completed: MOCK_ORDERS.filter((o) => o.status === "Completed").length,
      inprogress: MOCK_ORDERS.filter((o) => o.status === "In Progress").length,
      scheduled: MOCK_ORDERS.filter((o) => o.status === "Scheduled").length,
    }),
    []
  );

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.key as keyof typeof counts],
  }));

  const filtered: Order[] = useMemo(() => {
    if (tab === "completed")
      return MOCK_ORDERS.filter((o) => o.status === "Completed");
    if (tab === "inprogress")
      return MOCK_ORDERS.filter((o) => o.status === "In Progress");
    if (tab === "scheduled")
      return MOCK_ORDERS.filter((o) => o.status === "Scheduled");
    return MOCK_ORDERS;
  }, [tab]);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return <Loader />;

  const tiles = [
    {
      title: "All Orders",
      value: counts.all,
      sub: "Maintenance & Fuel Delivery",
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

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="flex flex-col md:flex-row md:gap-[52px]">
        {tiles.map((t, idx) => (
          <div key={t.title} className="relative flex-1">
            <StatTile {...t} />
            {idx < tiles.length - 1 && (
              <span className="hidden md:block absolute -right-[26px] top-1/2 -translate-y-1/2 h-[41px] w-px bg-[#FFFFFF]" />
            )}
          </div>
        ))}
      </div>

      <FuelTabs tabs={tabsWithCounts} value={tab} onChange={setTab} />

      {/* Table */}
      <OrdersTable orders={filtered} />
    </div>
  );
}

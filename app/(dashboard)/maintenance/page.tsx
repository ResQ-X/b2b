/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import MaintenanceTable, {
  maintenanceData,
  type Order,
} from "@/components/maintenance/MaintenanceTable";
import MaintenanceTabs from "@/components/maintenance/MaintenanceTabs";
import ServiceHistoryCard, {
  type ServiceHistoryItem,
} from "@/components/maintenance/ServiceHistoryCard";
// import { Button } from "@/components/ui/button";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

const TABS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "inprogress", label: "In Progress" },
  { key: "scheduled", label: "Scheduled" },
  { key: "overdue", label: "Overdue" },
];

export default function MaintenancePage() {
  const [tab, setTab] = useState<string>("all");

  const counts = useMemo(
    () => ({
      all: maintenanceData.length,
      completed: maintenanceData.filter((o) => o.status === "Completed").length,
      inprogress: maintenanceData.filter((o) => o.status === "In Progress")
        .length,
      scheduled: maintenanceData.filter((o) => o.status === "Scheduled").length,
      overdue: maintenanceData.filter((o) => o.status === "Overdue").length,
    }),
    []
  );

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.key as keyof typeof counts] ?? 0,
  }));

  const filtered: Order[] = useMemo(() => {
    switch (tab) {
      case "completed":
        return maintenanceData.filter((o) => o.status === "Completed");
      case "inprogress":
        return maintenanceData.filter((o) => o.status === "In Progress");
      case "scheduled":
        return maintenanceData.filter((o) => o.status === "Scheduled");
      case "overdue":
        return maintenanceData.filter((o) => o.status === "Overdue");
      default:
        return maintenanceData;
    }
  }, [tab]);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch (e) {
        // fail silently in mock env
        setMetrics({
          active_order_count: 0,
          professionals: 0,
          active_order: [],
        });
      }
    })();
  }, []);

  if (!metrics) return <Loader />;

  // Top cards (text matches screenshot)
  const tiles = [
    {
      title: "Monthly Cost",
      value: "₦450K",
      sub: "12% with bundled services",
      icon: Wallet,
    },
    {
      title: "Avg Service Time",
      value: "2.5 days",
      sub: "Industry avg: 4 days",
      icon: Wallet,
    },
    {
      title: "Vehicle Uptime",
      value: "98.5%",
      sub: "Vehicle Uptime",
      icon: Wallet,
    },
  ];

  const history: ServiceHistoryItem[] = [
    {
      title: "LND-234-CC - Full Service",
      subtitle: "ResQ-X Service Center • 5 days ago",
      amount: 22500,
    },
    {
      title: "LND-789-DD - Brake Replacement",
      subtitle: "Ajose, Lekki",
      amount: 30900,
    },
    {
      title: "LND-451-AA - Oil Change",
      subtitle: "Ogba, Ikeja",
      amount: 50000,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="grid lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <StatTile key={t.title} {...t} />
        ))}
      </div>

      {/* Toolbar */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#2C2926] px-3 py-2 text-white/80">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#2C2926] px-3 py-2 text-white/80">
            <span className="text-sm">Filter by</span>
            <span className="rounded-md bg-white text-black text-xs px-2 py-1">
              All
            </span>
          </div>
        </div>
        <Button className="bg-[#FF8500] hover:bg-[#ff9a33] rounded-xl">
          Schedule Service +
        </Button>
      </div> */}

      {/* Tabs */}
      <MaintenanceTabs tabs={tabsWithCounts} value={tab} onChange={setTab} />

      {/* Table */}
      <MaintenanceTable orders={filtered} />

      {/* Service History */}
      <ServiceHistoryCard items={history} />
    </div>
  );
}

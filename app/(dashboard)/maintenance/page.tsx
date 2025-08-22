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
import { toCSV, downloadText } from "@/lib/export";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

const TABS = [
  { key: "all", label: "All Orders", shortLabel: "All" },
  { key: "completed", label: "Completed Orders", shortLabel: "Completed" },
  { key: "inprogress", label: "In Progress Orders", shortLabel: "In Progress" },
  { key: "scheduled", label: "Scheduled Orders", shortLabel: "Scheduled" },
  { key: "overdue", label: "Overdue Orders", shortLabel: "Overdue" },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return { dd, mm, yyyy, full: `${dd}-${mm}-${yyyy}` };
};

export default function MaintenancePage() {
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

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

  // Step 1: filter by tab
  const filteredByTab: Order[] = useMemo(() => {
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

  // Step 2: filter by search (supports id, vehicle, serviceType, status, mileage, cost, and date)
  const filtered: Order[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredByTab;

    return filteredByTab.filter((o) => {
      const { dd, mm, yyyy, full } = formatDate(o.dueDateISO);
      const hay = [
        o.id,
        o.vehicle,
        o.serviceType,
        o.status,
        full, // dd-mm-yyyy
        `${yyyy}-${mm}-${dd}`, // ISO-like
        dd,
        mm,
        String(yyyy),
      ]
        .join(" ")
        .toLowerCase();

      const numbers = `${o.mileageKm} ${o.costNaira}`; // allow numeric text matches

      return hay.includes(q) || numbers.includes(q);
    });
  }, [filteredByTab, search]);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch {
        setMetrics({
          active_order_count: 0,
          professionals: 0,
          active_order: [],
        });
      }
    })();
  }, []);

  if (!metrics) return <Loader />;

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

  const exportMaintenance = () => {
    const fmt = (iso: string) => {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };

    const rows = filtered.map((o) => ({
      "Order ID": o.id,
      Vehicle: o.vehicle,
      "Service Type": o.serviceType,
      "Mileage (km)": o.mileageKm,
      Status: o.status,
      "Due Date": fmt(o.dueDateISO),
      "Cost (NGN)": o.costNaira, // keep numeric; Excel can sum
    }));

    const csv = toCSV(rows);
    downloadText(
      `maintenance-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      csv
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <StatTile key={t.title} {...t} />
        ))}
      </div>

      <MaintenanceTabs
        tabs={tabsWithCounts}
        value={tab}
        onChange={setTab}
        search={search}
        onSearchChange={setSearch}
        onExport={exportMaintenance}
      />

      <MaintenanceTable orders={filtered} />

      <ServiceHistoryCard items={history} />
    </div>
  );
}

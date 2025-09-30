"use client";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet, Plus } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import { Button } from "@/components/ui/button";
import MaintenanceTable, {
  maintenanceData,
  type Order,
} from "@/components/maintenance/MaintenanceTable";
import MaintenanceTabs from "@/components/maintenance/MaintenanceTabs";
import RequestServiceModal from "@/components/maintenance/RequestServiceModal";
import ServiceHistoryCard, {
  type ServiceHistoryItem,
} from "@/components/maintenance/ServiceHistoryCard";
import { toCSV, downloadText } from "@/lib/export";

// (removed unused DashboardMetrics)

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

type Asset = {
  id: string;
  asset_name: string;
  plate_number: string | null;
};

type Location = {
  id: string;
  location_name: string;
};

export default function MaintenancePage() {
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<Order[]>(maintenanceData);
  const [open, setOpen] = useState(false);

  const counts = useMemo(
    () => ({
      all: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      inprogress: orders.filter((o) => o.status === "In Progress").length,
      scheduled: orders.filter((o) => o.status === "Scheduled").length,
      overdue: orders.filter((o) => o.status === "Overdue").length,
    }),
    [orders]
  );

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.key as keyof typeof counts] ?? 0,
  }));

  // Step 1: filter by tab
  const filteredByTab: Order[] = useMemo(() => {
    switch (tab) {
      case "completed":
        return orders.filter((o) => o.status === "Completed");
      case "inprogress":
        return orders.filter((o) => o.status === "In Progress");
      case "scheduled":
        return orders.filter((o) => o.status === "Scheduled");
      case "overdue":
        return orders.filter((o) => o.status === "Overdue");
      default:
        return orders;
    }
  }, [tab, orders]);

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

  const fetchAll = async () => {
    const [assetsRes, locationsRes, listRes] = await Promise.all([
      axiosInstance.get("/fleet-asset/get-asset"),
      axiosInstance.get("/fleet-asset/get-locations"),
      axiosInstance.get("/fleet-service/get-maintenance-service", {
        params: { page: 1, limit: 20 },
      }),
    ]);

    setAssets(assetsRes.data.assets || []);
    setLocations(locationsRes.data.data || []);

    type ApiItem = {
      id: string;
      status: string; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
      date_time: string;
      maintenance_type: string; // BRAKE_INSPECTION, FULL_SERVICE, OIL_CHANGE, TIRE_ROTATION, OTHER
      note?: string;
      location: string;
      asset?: { id: string; asset_name: string; plate_number: string | null };
    };

    const apiOrders = (listRes.data.data || []) as ApiItem[];
    const mapped: Order[] = apiOrders.map((o) => ({
      id: o.id,
      vehicle: o.asset?.plate_number || o.asset?.asset_name || "N/A",
      serviceType: formatMaintenanceType(o.maintenance_type),
      mileageKm: 0,
      status:
        o.status === "COMPLETED"
          ? "Completed"
          : o.status === "IN_PROGRESS"
          ? "In Progress"
          : o.status === "PENDING"
          ? "Scheduled"
          : "Completed",
      dueDateISO: o.date_time,
      costNaira: 0,
    }));
    setOrders(mapped);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchAll();
      } catch (e) {
        console.error("Failed to fetch maintenance data", e);
      }
    })();
  }, []);

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

  // Build select options for the modal
  const vehicleOptions = useMemo(() => vehicleOptionsFrom(assets), [assets]);
  const locationOptions = useMemo(
    () => locationOptionsFrom(locations),
    [locations]
  );

  const handleSubmit = async (data: {
    type: string;
    vehicle: string;
    location: string;
    slot: string;
    notes: string;
  }) => {
    const payload = {
      maintenance_type: data.type,
      asset_id: data.vehicle,
      location_id: data.location,
      time_slot: data.slot,
      note: data.notes,
    };
    await axiosInstance.post(
      "/fleet-service/place-maintenance-service",
      payload
    );
    await fetchAll();
  };

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

      <div className="flex justify-center">
        <Button
          variant="orange"
          className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          onClick={() => setOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Maintenance
        </Button>
      </div>

      <ServiceHistoryCard items={history} />

      {/* Request Maintenance Modal */}
      <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={maintenanceTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
        title="Request Maintenance Service"
      />
    </div>
  );
}

function formatMaintenanceType(t: string) {
  const map: Record<string, string> = {
    BRAKE_INSPECTION: "Brake Inspection",
    FULL_SERVICE: "Full Service",
    OIL_CHANGE: "Oil Change",
    TIRE_ROTATION: "Tire Rotation",
    OTHER: "Other",
  };
  return map[t] || t;
}

// Select options
const maintenanceTypeOptions = [
  { label: "Brake Inspection", value: "BRAKE_INSPECTION" },
  { label: "Full Service", value: "FULL_SERVICE" },
  { label: "Oil Change", value: "OIL_CHANGE" },
  { label: "Tire Rotation", value: "TIRE_ROTATION" },
  { label: "Other", value: "OTHER" },
];

const vehicleOptionsFrom = (assets: Asset[]) =>
  assets.map((asset) => ({
    label: asset.plate_number
      ? `${asset.asset_name} (${asset.plate_number})`
      : asset.asset_name,
    value: asset.id,
  }));

const locationOptionsFrom = (locations: Location[]) =>
  locations.map((l) => ({ label: l.location_name, value: l.id }));

const slotOptions = [
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

// Derived options bound to current state will be computed in component

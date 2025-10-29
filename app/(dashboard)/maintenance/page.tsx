"use client";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet, Plus } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import { Button } from "@/components/ui/button";
import MaintenanceTable, {
  type Order,
} from "@/components/maintenance/MaintenanceTable";
import MaintenanceTabs from "@/components/maintenance/MaintenanceTabs";
import RequestServiceModal from "@/components/maintenance/RequestServiceModal";
import { toCSV, downloadText } from "@/lib/export";
import type { RequestServiceForm } from "@/components/maintenance/RequestServiceModal";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [menTMetrics, setMenTMetrics] = useState<any>(null);

  const counts = useMemo(
    () => ({
      all: orders?.length,
      completed: orders.filter((o) => o.status === "Completed")?.length,
      inprogress: orders.filter((o) => o.status === "In Progress")?.length,
      scheduled: orders.filter((o) => o.status === "Scheduled")?.length,
      overdue: orders.filter((o) => o.status === "Overdue")?.length,
    }),
    [orders]
  );

  const slotOptions = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();

    const slots = [
      { label: "Now", value: "NOW" },
      {
        label: "05:00–07:00",
        value: new Date(new Date().setHours(5, 0, 0, 0)).toISOString(),
        hour: 5,
      },
      {
        label: "07:00–09:00",
        value: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
        hour: 7,
      },
      {
        label: "09:00–11:00",
        value: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
        hour: 9,
      },
      {
        label: "11:00–13:00",
        value: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        hour: 11,
      },
      {
        label: "13:00–15:00",
        value: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
        hour: 13,
      },
      {
        label: "15:00–17:00",
        value: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
        hour: 15,
      },
      {
        label: "17:00–19:00",
        value: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        hour: 17,
      },
      {
        label: "19:00–21:00",
        value: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
        hour: 19,
      },
      {
        label: "21:00–22:00",
        value: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(),
        hour: 21,
      },
    ];

    return slots
      .filter((slot) => {
        if (slot.value === "NOW") return true;

        const slotDate = new Date(slot.value);
        const slotDateString = slotDate.toDateString();

        if (slotDateString === currentDate) {
          return slot.hour && slot.hour > currentHour;
        }

        return true;
      })
      .map(({ ...rest }) => rest);
  }, []);

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.key as keyof typeof counts] ?? 0,
  }));

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

  console.log("Filtered by tab:", menTMetrics);

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
        full,
        `${yyyy}-${mm}-${dd}`,
        dd,
        mm,
        String(yyyy),
      ]
        .join(" ")
        .toLowerCase();

      const numbers = `${o.mileageKm} ${o.costNaira}`;

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
      status: string;
      date_time: string;
      maintenance_type: string;
      note?: string;
      location: string;
      assets?: Array<{
        id: string;
        asset_name: string;
        plate_number: string | null;
        asset_type?: string;
        asset_subtype?: string;
      }>;
    };

    const apiOrders = (listRes.data.data || []) as ApiItem[];
    const mapped: Order[] = apiOrders.map((o) => {
      // Handle multiple assets
      let vehicleDisplay = "N/A";

      if (o.assets && o.assets.length > 0) {
        const assetNames = o.assets.map(
          (asset) => asset.plate_number || asset.asset_name
        );
        vehicleDisplay = assetNames.join(", ");
      }

      return {
        id: o.id,
        vehicle: vehicleDisplay,
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
      };
    });

    setOrders(mapped);
    setMenTMetrics(listRes.data.metrics);
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
      title: "Pending Maintenance",
      value: menTMetrics?.pending ?? "0",
      sub: "Maintenance",
      icon: Wallet,
    },
    {
      title: "In Progress Maintenance",
      value: menTMetrics?.inProgress ?? "0",
      sub: "Maintenance",
      icon: Wallet,
    },
    {
      title: "Completed Maintenance",
      value: menTMetrics?.completed ?? "0",
      sub: "Maintenance",
      icon: Wallet,
    },
    {
      title: "Cancelled Maintenance",
      value: menTMetrics?.cancelled ?? "0",
      sub: "Maintenance",
      icon: Wallet,
    },
  ];

  const vehicleOptions = useMemo(() => vehicleOptionsFrom(assets), [assets]);
  const locationOptions = useMemo(
    () => locationOptionsFrom(locations),
    [locations]
  );

  const handleSubmit = async (data: RequestServiceForm) => {
    try {
      const isManual = data.location_id === "__manual__";
      const isScheduled = data.time_slot !== "NOW";

      const payload: any = {
        maintenance_type: data.maintenance_type,
        asset_ids: data.asset_ids,
        time_slot:
          data.time_slot === "NOW" ? new Date().toISOString() : data.time_slot,
        is_scheduled: isScheduled,
        note: data.note || "",
      };

      if (isManual) {
        if (data.location_address) {
          payload.location_address = data.location_address;
        }
        if (data.location_longitude) {
          payload.location_longitude = data.location_longitude;
        }
        if (data.location_latitude) {
          payload.location_latitude = data.location_latitude;
        }
      } else {
        payload.location_id = data.location_id;
      }

      console.log("Submitting maintenance request:", payload);

      const response = await axiosInstance.post(
        "/fleet-service/place-maintenance-service",
        payload
      );

      console.log("Maintenance request successful:", response.data);

      await fetchAll();

      toast.success("Maintenance service requested successfully!");
    } catch (error) {
      console.error(
        "Failed to request maintenance service:",
        error.response.data.message
      );
      toast.error(error.response.data.message);
      // toast.error("Failed to request maintenance service. Please try again.");
    }
  };

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
      "Cost (NGN)": o.costNaira,
    }));

    const csv = toCSV(rows);
    downloadText(
      `maintenance-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      csv
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-4 gap-4">
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
          Schedule Service
        </Button>
      </div>

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

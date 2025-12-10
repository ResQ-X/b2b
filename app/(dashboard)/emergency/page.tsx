"use client";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import { ServiceHistoryList } from "@/components/emergency/ServiceHistoryList";
import { RequestEmergencyServiceCard } from "@/components/emergency/RequestEmergencyServiceCard";
import EmergencyDetailsModal from "@/components/emergency/EmergencyDetailsModal";

type Asset = { id: string; asset_name: string; plate_number: string | null };
type Location = { id: string; location_name: string };

type EmergencyRow = {
  id: string;
  title: string;
  subtitle: string;
  status: "Completed" | "Cancelled" | "Pending";
};

type EmergencyService = {
  id: string;
  status: string;
  date_time: string;
  emergency_type: string;
  note?: string;
  location: string;
  location_longitude?: string;
  location_latitude?: string;
  to_location?: string | null;
  to_location_longitude?: string | null;
  to_location_latitude?: string | null;
  towing_method?: string;
  assets: Array<{
    id: string;
    asset_name: string;
    plate_number: string | null;
    asset_type?: string;
    asset_subtype?: string;
  }>;
  business_id: string;
  total_cost?: string;
  total_service_charge?: string;
  total_delivery_charge?: string;
  is_under_subscription?: boolean;
  created_at: string;
  updated_at: string;
  order_date: string;
};

export default function EmergencyPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [history, setHistory] = useState<EmergencyRow[]>([]);
  const [allServices, setAllServices] = useState<EmergencyService[]>([]);
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const counts = useMemo(
    () => ({
      pending: history.filter((o) => o.status === "Pending").length,
      completed: history.filter((o) => o.status === "Completed").length,
      // inProgress: history.filter((o) => o.status === "In Progress").length,
      cancelled: history.filter((o) => o.status === "Cancelled").length,
    }),
    [history]
  );

  const fetchAll = async () => {
    const [assetsRes, locationsRes, listRes] = await Promise.all([
      axiosInstance.get("/fleet-asset/get-asset"),
      axiosInstance.get("/fleet-asset/get-locations"),
      axiosInstance.get("/fleet-service/get-emergency-service", {
        params: { page: 1, limit: 20 },
      }),
    ]);

    setAssets(assetsRes.data.assets || []);
    setLocations(locationsRes.data.data || []);

    // Store all services for modal access
    const services = listRes.data.data || [];
    setAllServices(services);

    const rows: EmergencyRow[] = services.map((o: EmergencyService) => {
      const when = new Date(o.date_time).toLocaleString();

      // Handle multiple assets
      let vehicleDisplay = "N/A";
      if (o.assets && o.assets.length > 0) {
        const assetNames = o.assets.map(
          (asset) => asset.plate_number || asset.asset_name
        );
        vehicleDisplay = assetNames.join(", ");
      }

      const status =
        o.status === "COMPLETED"
          ? "Completed"
          : o.status === "IN_PROGRESS"
          ? "In Progress"
          : o.status === "CANCELLED"
          ? "Cancelled"
          : "Pending";

      return {
        id: o.id,
        title: `${vehicleDisplay}`,
        subtitle: `${o.location} • ${when}`,
        status,
      };
    });
    setHistory(rows);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchAll();
      } catch (e) {
        console.error("Failed to fetch emergency data", e);
      }
    })();
  }, []);

  const tiles = [
    {
      title: "Pending Order",
      value: counts.pending,
      sub: "",
      icon: Wallet,
    },
    {
      title: "Completed Order",
      value: counts.completed,
      sub: "",
      icon: Wallet,
    },
    {
      title: "In Cancelled Order",
      value: counts.cancelled,
      sub: "",
      icon: Wallet,
    },
  ];

  const slotOptions = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();

    const slots = [
      { label: "Now", value: "NOW" as const },
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
          return typeof slot.hour === "number" && slot.hour > currentHour;
        }
        return true;
      })
      .map(({ label, value }) => ({ label, value: value as string }));
  }, []);

  const handleHistoryItemClick = (id: string) => {
    const service = allServices.find((s) => s.id === id);
    if (service) {
      setSelectedService(service);
      setModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="grid lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <StatTile key={t.title} {...t} />
        ))}
      </div>

      {/* Request Emergency Service */}
      <RequestEmergencyServiceCard
        vehicleOptions={assets.map((a) => ({
          label: a.plate_number
            ? `${a.asset_name} (${a.plate_number})`
            : a.asset_name,
          value: a.id,
        }))}
        locationOptions={locations.map((l) => ({
          label: l.location_name,
          value: l.id,
        }))}
        typeOptions={[
          { label: "Flat Tire", value: "FLAT_TIRE" },
          { label: "Jump Start", value: "JUMP_START" },
          // { label: "Out of Fuel", value: "OUT_OF_FUEL" }, // Commented out - use fuel delivery instead
          { label: "Towing Service", value: "TOWING" },
          { label: "Other", value: "OTHER" },
        ]}
        slotOptions={slotOptions}
        onSuccess={fetchAll}
      />

      {/* Service History */}
      <ServiceHistoryList items={history} onItemClick={handleHistoryItemClick} />

      {/* Emergency Details Modal */}
      <EmergencyDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        service={selectedService}
      />
    </div>
  );
}

// function formatEmergencyType(t: string) {
//   const map: Record<string, string> = {
//     FLAT_TIRE: "Flat Tire",
//     BATTERY_JUMP_START: "Battery Jump Start",
//     JUMP_START: "Jump Start",
//     OUT_OF_FUEL: "Out of Fuel",
//     TOWING: "Towing",
//     HEALTH_CHECK: "Health Check",
//     OTHER: "Other",
//   };
//   return map[t] || t;
// }

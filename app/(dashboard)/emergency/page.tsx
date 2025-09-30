"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import { ServiceHistoryList } from "@/components/emergency/ServiceHistoryList";
import { RequestEmergencyServiceCard } from "@/components/emergency/RequestEmergencyServiceCard";

type Asset = { id: string; asset_name: string; plate_number: string | null };
type Location = { id: string; location_name: string };

type EmergencyRow = {
  id: string;
  title: string;
  subtitle: string;
  status: "Completed" | "In Progress" | "Pending";
};

export default function EmergencyPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [history, setHistory] = useState<EmergencyRow[]>([]);

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

    // Map API list into simple history rows for now
    type ApiEmergency = {
      id: string;
      status: string;
      date_time: string;
      emergency_type?: string;
      note?: string;
      location: string;
      asset?: { id: string; asset_name: string; plate_number: string | null };
    };

    const rows: EmergencyRow[] = (listRes.data.data || []).map(
      (o: ApiEmergency) => {
        const when = new Date(o.date_time).toLocaleString();
        const vehicle = o.asset?.plate_number || o.asset?.asset_name || "N/A";
        const status =
          o.status === "COMPLETED"
            ? "Completed"
            : o.status === "IN_PROGRESS"
            ? "In Progress"
            : "Pending";
        return {
          id: o.id,
          title: `${vehicle} - ${formatEmergencyType(
            o.emergency_type || "OTHER"
          )}`,
          subtitle: `${o.location} • ${when}`,
          status,
        };
      }
    );
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
      title: "Emergencies Resolved",
      value: "16",
      sub: "This month",
      icon: Wallet,
    },
    {
      title: "Avg Service Time",
      value: "18 min",
      sub: "Industry avg: 4 days",
      icon: Wallet,
    },
    {
      title: "Saved on Towing",
      value: "₦200k",
      sub: "With bundle discount",
      icon: Wallet,
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
          { label: "Out of Fuel", value: "OUT_OF_FUEL" },
          { label: "Towing", value: "TOWING" },
          { label: "Other", value: "OTHER" },
        ]}
        slotOptions={buildTimeSlots()}
        onSubmit={async (data) => {
          await axiosInstance.post("/fleet-service/place-emergency-service", {
            emergency_type: data.type,
            asset_id: data.vehicle,
            location_id: data.location,
            time_slot: data.slot,
            note: data.notes,
          });
          await fetchAll();
        }}
      />

      {/* Service History */}
      <ServiceHistoryList items={history} />
    </div>
  );
}

function buildTimeSlots() {
  return [8, 10, 12, 14, 16].map((h) => ({
    label: `${String(h).padStart(2, "0")}:00–${String(h + 2).padStart(
      2,
      "0"
    )}:00`,
    value: new Date(new Date().setHours(h, 0, 0, 0)).toISOString(),
  }));
}

function formatEmergencyType(t: string) {
  const map: Record<string, string> = {
    FLAT_TIRE: "Flat Tire",
    JUMP_START: "Jump Start",
    OUT_OF_FUEL: "Out of Fuel",
    TOWING: "Towing",
    OTHER: "Other",
  };
  return map[t] || t;
}

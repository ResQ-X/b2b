"use client";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
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
  status: "Completed" | "Cancelled" | "Pending";
};

export default function EmergencyPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [history, setHistory] = useState<EmergencyRow[]>([]);

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

    type ApiEmergency = {
      id: string;
      status: string;
      date_time: string;
      emergency_type?: string;
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

    const rows: EmergencyRow[] = (listRes.data.data || []).map(
      (o: ApiEmergency) => {
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
            : "Pending";

        return {
          id: o.id,
          title: `${vehicleDisplay}`,
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
          { label: "Towing Service", value: "TOWING" },
          { label: "Other", value: "OTHER" },
        ]}
        slotOptions={slotOptions}
        onSubmit={async (data) => {
          try {
            const isScheduled = data.slot !== "NOW";

            const base: any = {
              emergency_type: data.type,
              asset_ids: data.asset_ids,
              time_slot:
                data.slot === "NOW" ? new Date().toISOString() : data.slot,
              is_scheduled: isScheduled,
              note: data.notes || "",
            };

            if (data.type !== "TOWING") {
              // Non-towing flow
              if (data.location_id && data.location_id !== "__manual__") {
                base.location_id = data.location_id;
              } else {
                if (data.location_name)
                  base.location_address = data.location_name;
                if (data.location_latitude != null)
                  base.location_latitude = data.location_latitude;
                if (data.location_longitude != null)
                  base.location_longitude = data.location_longitude;
              }
            } else {
              // TOWING: pickup & dropoff handling
              base.towing_method = data.towing_method || "";

              const pickupIsSaved =
                data.pickup_location_id &&
                data.pickup_location_id !== "__manual__";
              const dropoffIsSaved =
                data.dropoff_location_id &&
                data.dropoff_location_id !== "__manual__";

              // Pickup
              if (pickupIsSaved) {
                base.location_id = data.pickup_location_id;
              } else {
                if (data.pickup_location_name)
                  base.location_address = data.pickup_location_name;
                if (data.pickup_latitude != null)
                  base.location_latitude = data.pickup_latitude;
                if (data.pickup_longitude != null)
                  base.location_longitude = data.pickup_longitude;
              }

              // Dropoff
              if (dropoffIsSaved) {
                base.to_location_id = data.dropoff_location_id;
              } else {
                if (data.dropoff_location_name)
                  base.to_location_address = data.dropoff_location_name;
                if (data.dropoff_latitude != null)
                  base.to_location_latitude = data.dropoff_latitude;
                if (data.dropoff_longitude != null)
                  base.to_location_longitude = data.dropoff_longitude;
              }

              const hasPickup =
                pickupIsSaved ||
                !!base.location_address ||
                (base.location_latitude != null &&
                  base.location_longitude != null) ||
                !!base.location_id;

              const hasDropoff =
                dropoffIsSaved ||
                !!base.to_location_address ||
                (base.to_location_latitude != null &&
                  base.to_location_longitude != null) ||
                !!base.to_location_id;

              if (!hasPickup) {
                toast.error("Please select or enter a pickup location.");
                return;
              }
              if (!hasDropoff) {
                toast.error("Please select or enter a drop-off location.");
                return;
              }
            }

            await axiosInstance.post(
              "/fleet-service/place-emergency-service",
              base
            );

            toast.success("Emergency service request submitted successfully!");
            await fetchAll();
          } catch (error: any) {
            console.error("Emergency request failed:", error);
            const message =
              error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while submitting your request.";
            toast.error(message);
          }
        }}
      />

      {/* Service History */}
      <ServiceHistoryList items={history} />
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

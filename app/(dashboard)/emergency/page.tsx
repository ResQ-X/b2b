// "use client";
// import { toast } from "react-toastify";
// import { useEffect, useState, useMemo } from "react";
// import axiosInstance from "@/lib/axios";
// import { Wallet } from "lucide-react";
// import { StatTile } from "@/components/dashboard/StatTile";
// import { ServiceHistoryList } from "@/components/emergency/ServiceHistoryList";
// import { RequestEmergencyServiceCard } from "@/components/emergency/RequestEmergencyServiceCard";

// type Asset = { id: string; asset_name: string; plate_number: string | null };
// type Location = { id: string; location_name: string };

// type EmergencyRow = {
//   id: string;
//   title: string;
//   subtitle: string;
//   status: "Completed" | "In Progress" | "Pending";
// };

// export default function EmergencyPage() {
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [history, setHistory] = useState<EmergencyRow[]>([]);

//   const fetchAll = async () => {
//     const [assetsRes, locationsRes, listRes] = await Promise.all([
//       axiosInstance.get("/fleet-asset/get-asset"),
//       axiosInstance.get("/fleet-asset/get-locations"),
//       axiosInstance.get("/fleet-service/get-maintenance-service", {
//         params: { page: 1, limit: 20 },
//       }),
//     ]);

//     setAssets(assetsRes.data.assets || []);
//     setLocations(locationsRes.data.data || []);

//     // Map API list into simple history rows for now
//     type ApiEmergency = {
//       id: string;
//       status: string;
//       date_time: string;
//       emergency_type?: string;
//       note?: string;
//       location: string;
//       asset?: { id: string; asset_name: string; plate_number: string | null };
//     };

//     const rows: EmergencyRow[] = (listRes.data.data || []).map(
//       (o: ApiEmergency) => {
//         const when = new Date(o.date_time).toLocaleString();
//         const vehicle = o.asset?.plate_number || o.asset?.asset_name || "N/A";
//         const status =
//           o.status === "COMPLETED"
//             ? "Completed"
//             : o.status === "IN_PROGRESS"
//             ? "In Progress"
//             : "Pending";
//         return {
//           id: o.id,
//           title: `${vehicle} - ${formatEmergencyType(
//             o.emergency_type || "OTHER"
//           )}`,
//           subtitle: `${o.location} • ${when}`,
//           status,
//         };
//       }
//     );
//     setHistory(rows);
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         await fetchAll();
//       } catch (e) {
//         console.error("Failed to fetch emergency data", e);
//       }
//     })();
//   }, []);

//   const tiles = [
//     {
//       title: "Emergencies Resolved",
//       value: "16",
//       sub: "This month",
//       icon: Wallet,
//     },
//     {
//       title: "Avg Service Time",
//       value: "18 min",
//       sub: "Industry avg: 4 days",
//       icon: Wallet,
//     },
//     {
//       title: "Saved on Towing",
//       value: "₦200k",
//       sub: "With bundle discount",
//       icon: Wallet,
//     },
//   ];

//   const slotOptions = useMemo(() => {
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentDate = now.toDateString();

//     const slots = [
//       { label: "Now", value: "NOW" },
//       {
//         label: "05:00–07:00",
//         value: new Date(new Date().setHours(5, 0, 0, 0)).toISOString(),
//         hour: 5,
//       },
//       {
//         label: "07:00–09:00",
//         value: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
//         hour: 7,
//       },
//       {
//         label: "09:00–11:00",
//         value: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
//         hour: 9,
//       },
//       {
//         label: "11:00–13:00",
//         value: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
//         hour: 11,
//       },
//       {
//         label: "13:00–15:00",
//         value: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
//         hour: 13,
//       },
//       {
//         label: "15:00–17:00",
//         value: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
//         hour: 15,
//       },
//       {
//         label: "17:00–19:00",
//         value: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
//         hour: 17,
//       },
//       {
//         label: "19:00–21:00",
//         value: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
//         hour: 19,
//       },
//       {
//         label: "21:00–22:00",
//         value: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(),
//         hour: 21,
//       },
//     ];

//     // Filter out past time slots for today
//     return slots
//       .filter((slot) => {
//         if (slot.value === "NOW") return true;

//         const slotDate = new Date(slot.value);
//         const slotDateString = slotDate.toDateString();

//         // If slot is for today, keep only future windows
//         if (slotDateString === currentDate) {
//           return typeof slot.hour === "number" && slot.hour > currentHour;
//         }

//         // Keep all future dates as-is
//         return true;
//       })
//       .map(({ label, value }) => ({ label, value }));
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Top tiles */}
//       <div className="grid lg:grid-cols-3 gap-4">
//         {tiles.map((t) => (
//           <StatTile key={t.title} {...t} />
//         ))}
//       </div>

//       {/* Request Emergency Service */}
//       <RequestEmergencyServiceCard
//         vehicleOptions={assets.map((a) => ({
//           label: a.plate_number
//             ? `${a.asset_name} (${a.plate_number})`
//             : a.asset_name,
//           value: a.id,
//         }))}
//         locationOptions={locations.map((l) => ({
//           label: l.location_name,
//           value: l.id,
//         }))}
//         typeOptions={[
//           { label: "Flat Tire", value: "FLAT_TIRE" },
//           { label: "Jump Start", value: "JUMP_START" },
//           { label: "Out of Fuel", value: "OUT_OF_FUEL" },
//           { label: "Towing Service", value: "TOWING" },
//           { label: "Other", value: "OTHER" },
//         ]}
//         // slotOptions={buildTimeSlots()}
//         onSubmit={async (data) => {
//           try {
//             const isScheduled = data.slot !== "NOW";

//             // Common base
//             const base: any = {
//               emergency_type: data.type, // "TOWING" or others
//               asset_id: data.vehicle,
//               time_slot:
//                 data.slot === "NOW" ? new Date().toISOString() : data.slot,
//               is_scheduled: isScheduled,
//               note: data.notes || "",
//             };

//             if (data.type !== "TOWING") {
//               // ---- Non-towing: unchanged ----
//               if (data.location_id && data.location_id !== "__manual__") {
//                 base.location_id = data.location_id;
//               } else {
//                 if (data.location_name)
//                   base.location_address = data.location_name;
//                 if (data.location_latitude != null)
//                   base.location_latitude = data.location_latitude;
//                 if (data.location_longitude != null)
//                   base.location_longitude = data.location_longitude;
//               }
//             } else {
//               // ---- TOWING: use the exact keys you requested ----
//               base.towing_method = data.towing_method || "";

//               const pickupIsSaved =
//                 data.pickup_location_id &&
//                 data.pickup_location_id !== "__manual__";
//               const dropoffIsSaved =
//                 data.dropoff_location_id &&
//                 data.dropoff_location_id !== "__manual__";

//               // Pickup
//               if (pickupIsSaved) {
//                 // Saved pickup: send "location_id"
//                 base.location_id = data.pickup_location_id;
//               } else {
//                 // Manual pickup: send "location_*"
//                 if (data.pickup_location_name)
//                   base.location_address = data.pickup_location_name;
//                 if (data.pickup_latitude != null)
//                   base.location_latitude = data.pickup_latitude;
//                 if (data.pickup_longitude != null)
//                   base.location_longitude = data.pickup_longitude;
//               }

//               // Dropoff
//               if (dropoffIsSaved) {
//                 // Saved dropoff: send "to_location_id"
//                 base.to_location_id = data.dropoff_location_id;
//               } else {
//                 // Manual dropoff: send "to_location_*"
//                 if (data.dropoff_location_name)
//                   base.to_location_address = data.dropoff_location_name;
//                 if (data.dropoff_latitude != null)
//                   base.to_location_latitude = data.dropoff_latitude;
//                 if (data.dropoff_longitude != null)
//                   base.to_location_longitude = data.dropoff_longitude;
//               }

//               // Optional: guard against empty pickup/dropoff
//               const hasPickup =
//                 pickupIsSaved ||
//                 !!base.location_address ||
//                 (base.location_latitude != null &&
//                   base.location_longitude != null) ||
//                 !!base.location_id;

//               const hasDropoff =
//                 dropoffIsSaved ||
//                 !!base.to_location_address ||
//                 (base.to_location_latitude != null &&
//                   base.to_location_longitude != null) ||
//                 !!base.to_location_id;

//               if (!hasPickup) {
//                 toast.error("Please select or enter a pickup location.");
//                 return;
//               }
//               if (!hasDropoff) {
//                 toast.error("Please select or enter a drop-off location.");
//                 return;
//               }
//             }

//             console.log("Submitting emergency request:", base);

//             await axiosInstance.post(
//               "/fleet-service/place-emergency-service",
//               base
//             );

//             toast.success("Emergency service request submitted successfully!");
//             await fetchAll();
//           } catch (error: any) {
//             console.error("Emergency request failed:", error);
//             const message =
//               error?.response?.data?.message ||
//               error?.message ||
//               "Something went wrong while submitting your request.";
//             toast.error(message);
//           }
//         }}
//       />

//       {/* Service History */}
//       <ServiceHistoryList items={history} />
//     </div>
//   );
// }

// // function buildTimeSlots() {
// //   return [
// //     { label: "Now", value: "NOW" }, // Added "Now" option
// //     ...[8, 10, 12, 14, 16].map((h) => ({
// //       label: `${String(h).padStart(2, "0")}:00–${String(h + 2).padStart(
// //         2,
// //         "0"
// //       )}:00`,
// //       value: new Date(new Date().setHours(h, 0, 0, 0)).toISOString(),
// //     })),
// //   ];
// // }

// function buildTimeSlots(): { label: string; value: string }[] {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const today = now.toDateString();

//   // generate windows between 5am and 10pm (so 05:00–07:00 up to 21:00–23:00)
//   const hours = Array.from({ length: 8 }, (_, i) => 5 + i * 2); // [5, 7, 9, 11, 13, 15, 17, 19]

//   const raw = [
//     { label: "Now", value: "NOW" as const },
//     ...hours.map((h) => ({
//       label: `${String(h).padStart(2, "0")}:00–${String(h + 2).padStart(
//         2,
//         "0"
//       )}:00`,
//       value: new Date(new Date().setHours(h, 0, 0, 0)).toISOString(),
//       hour: h,
//     })),
//   ];

//   // filter out past windows for today
//   const filtered = raw.filter((slot) => {
//     if (slot.value === "NOW") return true;
//     const slotDate = new Date(slot.value);
//     const isToday = slotDate.toDateString() === today;
//     return isToday ? (slot as any).hour > currentHour : true;
//   });

//   return filtered.map(({ label, value }) => ({ label, value }));
// }

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

  // 5am–10pm windows, filtered to hide past windows for today
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
        slotOptions={slotOptions} // ✅ pass the computed windows
        onSubmit={async (data) => {
          try {
            const isScheduled = data.slot !== "NOW";

            // Common base
            const base: any = {
              emergency_type: data.type, // "TOWING" or others
              // asset_id: data.vehicle,
              // asset_id: data.asset_id || data.vehicle,
              ...(data.asset_ids && data.asset_ids.length > 1
                ? { asset_id: data.asset_ids }
                : { asset_id: data.asset_id }),
              time_slot:
                data.slot === "NOW" ? new Date().toISOString() : data.slot,
              is_scheduled: isScheduled,
              note: data.notes || "",
            };

            if (data.type !== "TOWING") {
              // ---- Non-towing flow ----
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
              // ---- TOWING: pickup & dropoff handling ----
              base.towing_method = data.towing_method || "";

              const pickupIsSaved =
                data.pickup_location_id &&
                data.pickup_location_id !== "__manual__";
              const dropoffIsSaved =
                data.dropoff_location_id &&
                data.dropoff_location_id !== "__manual__";

              // Pickup
              if (pickupIsSaved) {
                base.location_id = data.pickup_location_id; // saved
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
                base.to_location_id = data.dropoff_location_id; // saved
              } else {
                if (data.dropoff_location_name)
                  base.to_location_address = data.dropoff_location_name;
                if (data.dropoff_latitude != null)
                  base.to_location_latitude = data.dropoff_latitude;
                if (data.dropoff_longitude != null)
                  base.to_location_longitude = data.dropoff_longitude;
              }

              // Optional guards
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

function formatEmergencyType(t: string) {
  const map: Record<string, string> = {
    FLAT_TIRE: "Flat Tire",
    BATTERY_JUMP_START: "Battery Jump Start",
    JUMP_START: "Jump Start",
    OUT_OF_FUEL: "Out of Fuel",
    TOWING: "Towing",
    HEALTH_CHECK: "Health Check",
    OTHER: "Other",
  };
  return map[t] || t;
}

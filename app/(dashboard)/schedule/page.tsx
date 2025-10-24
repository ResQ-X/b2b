// // "use client";
// // import { Wrench, Fuel, Truck } from "lucide-react";
// // import { ThisWeekSchedule } from "@/components/schedule/ThisWeekSchedule";
// // import { RecurringServices } from "@/components/schedule/RecurringServices";

// // export type OneOffItem = {
// //   id: string;
// //   dateISO: string;
// //   time: string;
// //   title: string;
// //   subtitle?: string;
// //   icon?: React.ComponentType<any>;
// // };

// // export type RecurringItem = {
// //   id: string;
// //   title: string; // e.g. "Fleet Refuel - Lekki"
// //   nextDate: string; // e.g. "Jan 11, 2025"
// //   sub?: string; // e.g. "200L" or "12 vehicles"
// //   cadence: string; // e.g. "Weekly (Every Friday)"
// //   icon?: React.ComponentType<any>;
// // };

// // export const WEEK_ITEMS: OneOffItem[] = [
// //   {
// //     id: "w1",
// //     dateISO: "2025-05-11",
// //     time: "10:00 AM",
// //     title: "LND-789-DD Full Service",
// //     subtitle: "ResQ-X Service Center",
// //     icon: Wrench,
// //   },
// //   {
// //     id: "w2",
// //     dateISO: "2025-05-11",
// //     time: "2:00 AM",
// //     title: "Generator Refuel",
// //     subtitle: "Head Office",
// //     icon: Fuel,
// //   },
// //   {
// //     id: "w3",
// //     dateISO: "2025-05-12",
// //     time: "2:00 AM",
// //     title: "Generator Refuel",
// //     subtitle: "Head Office",
// //     icon: Fuel,
// //   },
// //   {
// //     id: "w4",
// //     dateISO: "2025-05-14",
// //     time: "10:00 AM",
// //     title: "LND-789-DD Full Service",
// //     subtitle: "ResQ-X Service Center",
// //     icon: Wrench,
// //   },
// // ];

// // export const RECURRING: RecurringItem[] = [
// //   {
// //     id: "r1",
// //     title: "Fleet Refuel - Lekki",
// //     nextDate: "Jan 11, 2025",
// //     sub: "200L",
// //     cadence: "Weekly (Every Friday)",
// //     icon: Fuel,
// //   },
// //   {
// //     id: "r2",
// //     title: "Fleet Refuel - Lekki",
// //     nextDate: "Jan 11, 2025",
// //     sub: "200L",
// //     cadence: "Weekly (Every Friday)",
// //     icon: Fuel,
// //   },
// //   {
// //     id: "r3",
// //     title: "Fleet Inspection",
// //     nextDate: "Feb 2, 2025",
// //     sub: "12 vehicles",
// //     cadence: "Monthly (1st Tuesday)",
// //     icon: Truck,
// //   },
// // ];

// // export const formatDateHeader = (iso: string) => {
// //   const d = new Date(iso);
// //   const dd = String(d.getDate()).padStart(2, "0");
// //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// //   const yyyy = d.getFullYear();
// //   return `${dd} - ${mm} - ${yyyy}`;
// // };

// // export function groupByDate(items: OneOffItem[]) {
// //   return items.reduce<Record<string, OneOffItem[]>>((acc, item) => {
// //     (acc[item.dateISO] ||= []).push(item);
// //     return acc;
// //   }, {});
// // }

// // export default function SchedulePage() {
// //   return (
// //     <div className="space-y-6">
// //       <ThisWeekSchedule items={WEEK_ITEMS} />
// //       <RecurringServices items={RECURRING} />
// //     </div>
// //   );
// // }

// "use client";
// import { useState, useEffect } from "react";
// // import Link from "next/link";
// import { Wrench, Fuel, Truck, AlertTriangle } from "lucide-react";
// import axiosInstance from "@/lib/axios";

// // Types
// export type OneOffItem = {
//   id: string;
//   dateISO: string; // YYYY-MM-DD
//   time: string; // e.g. 10:00 AM
//   title: string;
//   subtitle?: string; // location
//   icon?: React.ComponentType<any>;
//   status: string; // PENDING | COMPLETED | ...
//   serviceCategory: string; // FUEL | MAINTENANCE | EMERGENCY | ...
// };

// export type RecurringItem = {
//   id: string;
//   title: string; // e.g. Fleet Refuel - Lekki
//   nextDate: string; // ISO or friendly date
//   sub?: string; // e.g. "200L", "12 vehicles"
//   cadence: string; // e.g. "Weekly (Every Friday)"
//   icon?: React.ComponentType<any>;
// };

// // API Types
// type ServiceData = {
//   id: string;
//   status: string;
//   date_time: string; // ISO
//   fuel_type?: string;
//   service_time_type?: string;
//   quantity?: number;
//   note?: string;
//   location: string;
//   emergency_type?: string;
//   maintenance_type?: string;
//   asset: {
//     asset_name: string;
//     asset_type: string;
//     plate_number?: string;
//   };
//   service_category: string;
// };

// // -------- Helpers (UI formatting) --------
// const pad = (n: number) => String(n).padStart(2, "0");

// export const formatDateHeader = (isoYYYYMMDD: string) => {
//   // expects YYYY-MM-DD
//   const d = new Date(isoYYYYMMDD);
//   const dd = pad(d.getDate());
//   const mm = pad(d.getMonth() + 1);
//   const yyyy = d.getFullYear();
//   return `${dd} - ${mm} - ${yyyy}`;
// };

// const formatTime = (dateTime: string) => {
//   const d = new Date(dateTime);
//   return d.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// // const formatNextDate = (dateLike: string) => {
// //   const d = new Date(dateLike);
// //   return d.toLocaleDateString("en-US", {
// //     month: "short",
// //     day: "numeric",
// //     year: "numeric",
// //   });
// // };

// const getServiceIcon = (category: string) => {
//   switch (category) {
//     case "FUEL":
//       return Fuel;
//     case "MAINTENANCE":
//       return Wrench;
//     case "EMERGENCY":
//       return AlertTriangle;
//     default:
//       return Truck;
//   }
// };

// const getServiceTitle = (service: ServiceData) => {
//   const assetName = service.asset.plate_number || service.asset.asset_name;
//   switch (service.service_category) {
//     case "FUEL":
//       return `${assetName} Refuel${
//         service.quantity ? ` - ${service.quantity}L` : ""
//       }`;
//     case "MAINTENANCE":
//       return `${assetName} Full Service`;
//     case "EMERGENCY":
//       return `${assetName} Emergency Service`;
//     default:
//       return `${assetName} Service`;
//   }
// };

// export function groupByDate(items: OneOffItem[]) {
//   return items.reduce<Record<string, OneOffItem[]>>((acc, item) => {
//     (acc[item.dateISO] ||= []).push(item);
//     return acc;
//   }, {});
// }

// // -------- Presentational bits --------
// const CardRow = ({
//   leftIcon: LeftIcon,
//   title,
//   subtitle,
//   rightTop,
// }: // rightLinkHref,
// // rightLinkLabel = "View",
// // badge,
// {
//   leftIcon: React.ComponentType<any>;
//   title: string;
//   subtitle?: string;
//   rightTop?: string;
//   rightLinkHref?: string;
//   rightLinkLabel?: string;
//   badge?: { text: string; tone: "yellow" | "green" | "red" };
// }) => {
//   return (
//     <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#3B3835] px-4 py-4 shadow-[0_0_0_1px_rgba(255, 133, 0, 0.1)] hover:border-white/20 transition">
//       <div className="flex items-start gap-3 min-w-0">
//         <div className="mt-0.5">
//           <LeftIcon className="h-5 w-5 text-[#FF8500]" />
//         </div>
//         <div className="min-w-0">
//           <div className="text-white font-medium truncate">{title}</div>
//           {subtitle && (
//             <div className="text-sm text-white/70 truncate">{subtitle}</div>
//           )}
//           {/* {badge && (
//             <span
//               className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
//                 badge.tone === "yellow"
//                   ? "bg-yellow-500/20 text-yellow-300"
//                   : badge.tone === "green"
//                   ? "bg-green-500/20 text-green-300"
//                   : "bg-red-500/20 text-red-300"
//               }`}
//             >
//               {badge.text}
//             </span>
//           )} */}
//         </div>
//       </div>

//       <div className="flex items-center gap-6 pl-4 shrink-0">
//         {rightTop && <div className="text-sm text-white/70">{rightTop}</div>}
//         {/* {rightLinkHref && (
//           <Link
//             href={rightLinkHref}
//             className="text-sm text-[#7DB3FF] hover:underline"
//           >
//             {rightLinkLabel}
//           </Link>
//         )} */}
//       </div>
//     </div>
//   );
// };

// // -------- Sections --------
// function ThisWeekSchedule({ items }: { items: OneOffItem[] }) {
//   const grouped = groupByDate(items);
//   const dates = Object.keys(grouped).sort();

//   return (
//     <div className="rounded-2xl p-6">
//       <h2 className="text-xl font-semibold mb-4 text-white">
//         This Week Schedule
//       </h2>

//       {dates.length === 0 ? (
//         <p className="text-white/60 text-center py-8">
//           No scheduled services this week
//         </p>
//       ) : (
//         <div className="space-y-6">
//           {dates.map((date) => (
//             <div key={date} className="space-y-3">
//               <div className="text-xs font-medium text-white/60">
//                 {formatDateHeader(date)}
//               </div>

//               {grouped[date].map((item) => {
//                 const Icon = item.icon || Truck;
//                 const badge =
//                   item.status === "PENDING"
//                     ? { text: "Pending", tone: "yellow" as const }
//                     : undefined;

//                 return (
//                   <CardRow
//                     key={item.id}
//                     leftIcon={Icon}
//                     title={item.title}
//                     subtitle={item.subtitle}
//                     rightTop={item.time}
//                     rightLinkHref={`/schedule/${item.id}`}
//                     // rightLinkLabel="View"
//                     badge={badge}
//                   />
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // function RecurringServices({ items }: { items: RecurringItem[] }) {
// //   if (!items.length) return null;

// //   return (
// //     <div className="rounded-2xl border border-white/10 p-6">
// //       <h2 className="text-xl font-semibold mb-4 text-white">
// //         Recurring Services
// //       </h2>

// //       <div className="space-y-3">
// //         {items.map((item) => {
// //           const Icon = item.icon || Truck;
// //           return (
// //             <CardRow
// //               key={item.id}
// //               leftIcon={Icon}
// //               title={item.title}
// //               subtitle={[item.sub].filter(Boolean).join(" ")}
// //               rightTop={item.cadence}
// //               rightLinkHref={`/recurring/${item.id}`}
// //               rightLinkLabel="View"
// //             />
// //           );
// //         })}
// //       </div>

// //       {/* “Next:” line per card (like screenshot) */}
// //       <div className="sr-only" />
// //     </div>
// //   );
// // }

// // -------- Main --------
// export default function SchedulePage() {
//   const [weekItems, setWeekItems] = useState<OneOffItem[]>([]);
//   // const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // One-off / this week
//         const { data } = await axiosInstance.get(
//           "/fleet-service/get-scheduled-services",
//           {
//             params: { page: 1, limit: 20 },
//           }
//         );

//         if (data?.success && Array.isArray(data.data)) {
//           const transformed: OneOffItem[] = data.data.map((s: ServiceData) => {
//             const d = new Date(s.date_time);
//             const dateISO = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//               d.getDate()
//             )}`;
//             return {
//               id: s.id,
//               dateISO,
//               time: formatTime(s.date_time),
//               title: getServiceTitle(s),
//               subtitle: s.location,
//               icon: getServiceIcon(s.service_category),
//               status: s.status,
//               serviceCategory: s.service_category,
//             };
//           });
//           setWeekItems(transformed);
//         }

//         // If/when you have an endpoint for recurring, transform into this shape:
//         // const r = await axiosInstance.get("/fleet-service/get-recurring");
//         // setRecurringItems(r.data.map(...));
//         // For now, leave empty or mock if needed.
//       } catch (e) {
//         console.error(e);
//         setError("Failed to load scheduled services.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading)
//     return <div className="text-center py-20 text-white/60">Loading...</div>;
//   if (error)
//     return <div className="text-center py-20 text-white/60">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <ThisWeekSchedule items={weekItems} />
//       {/* <RecurringServices
//         items={recurringItems.map((r) => ({
//           ...r,
//           nextDate: formatNextDate(r.nextDate),
//           icon: r.icon || Truck,
//         }))}
//       /> */}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { Wrench, Fuel, Truck, AlertTriangle } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Types
export type OneOffItem = {
  id: string;
  dateISO: string;
  time: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  status: string;
  serviceCategory: string;
};

export type RecurringItem = {
  id: string;
  title: string;
  nextDate: string;
  sub?: string;
  cadence: string;
  icon?: React.ComponentType<any>;
};

// API Types - Fixed to match actual response
type Asset = {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype?: string;
  fuel_type?: string;
  capacity?: number;
  plate_number?: string;
  business_id: string;
  location_id: string;
  created_at: string;
  updated_at: string;
};

type ServiceData = {
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
  emergency_type?: string;
  maintenance_type?: string;
  assets: Asset[]; // Changed from 'asset' to 'assets' array
  service_category: string;
  business_id: string;
  created_at: string;
  updated_at: string;
};

// Helpers
const pad = (n: number) => String(n).padStart(2, "0");

export const formatDateHeader = (isoYYYYMMDD: string) => {
  const d = new Date(isoYYYYMMDD);
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd} - ${mm} - ${yyyy}`;
};

const formatTime = (dateTime: string) => {
  const d = new Date(dateTime);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getServiceIcon = (category: string) => {
  switch (category) {
    case "FUEL":
      return Fuel;
    case "MAINTENANCE":
      return Wrench;
    case "EMERGENCY":
      return AlertTriangle;
    default:
      return Truck;
  }
};

const getServiceTitle = (service: ServiceData) => {
  // Get first asset (or handle multiple assets if needed)
  const asset = service.assets?.[0];
  if (!asset) return "Service";

  const assetName = asset.plate_number || asset.asset_name;

  switch (service.service_category) {
    case "FUEL":
      return `${assetName} Refuel${
        service.quantity ? ` - ${service.quantity}L` : ""
      }`;
    case "MAINTENANCE":
      const maintenanceType = service.maintenance_type
        ?.split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
      return `${assetName} ${maintenanceType || "Service"}`;
    case "EMERGENCY":
      const emergencyType = service.emergency_type
        ?.split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
      return `${assetName} ${emergencyType || "Emergency"}`;
    default:
      return `${assetName} Service`;
  }
};

export function groupByDate(items: OneOffItem[]) {
  return items.reduce<Record<string, OneOffItem[]>>((acc, item) => {
    (acc[item.dateISO] ||= []).push(item);
    return acc;
  }, {});
}

// UI Components
const CardRow = ({
  leftIcon: LeftIcon,
  title,
  subtitle,
  rightTop,
}: {
  leftIcon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  rightTop?: string;
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#3B3835] px-4 py-4 shadow-[0_0_0_1px_rgba(255,133,0,0.1)] hover:border-white/20 transition">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5">
          <LeftIcon className="h-5 w-5 text-[#FF8500]" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-medium truncate">{title}</div>
          {subtitle && (
            <div className="text-sm text-white/70 truncate">{subtitle}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 pl-4 shrink-0">
        {rightTop && <div className="text-sm text-white/70">{rightTop}</div>}
      </div>
    </div>
  );
};

function ThisWeekSchedule({ items }: { items: OneOffItem[] }) {
  const grouped = groupByDate(items);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        This Week Schedule
      </h2>

      {dates.length === 0 ? (
        <p className="text-white/60 text-center py-8">
          No scheduled services this week
        </p>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date} className="space-y-3">
              <div className="text-xs font-medium text-white/60">
                {formatDateHeader(date)}
              </div>

              {grouped[date].map((item) => {
                const Icon = item.icon || Truck;
                return (
                  <CardRow
                    key={item.id}
                    leftIcon={Icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    rightTop={item.time}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Component
export default function SchedulePage() {
  const [weekItems, setWeekItems] = useState<OneOffItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axiosInstance.get(
          "/fleet-service/get-scheduled-services",
          {
            params: { page: 1, limit: 20 },
          }
        );

        console.log("API Response:", data); // Debug log

        if (data?.success && Array.isArray(data.data)) {
          const transformed: OneOffItem[] = data.data
            .filter((s: ServiceData) => s.assets && s.assets.length > 0) // Filter out services without assets
            .map((s: ServiceData) => {
              try {
                const d = new Date(s.date_time);
                const dateISO = `${d.getFullYear()}-${pad(
                  d.getMonth() + 1
                )}-${pad(d.getDate())}`;

                return {
                  id: s.id,
                  dateISO,
                  time: formatTime(s.date_time),
                  title: getServiceTitle(s),
                  subtitle: s.location,
                  icon: getServiceIcon(s.service_category),
                  status: s.status,
                  serviceCategory: s.service_category,
                };
              } catch (err) {
                console.error("Error transforming service:", s, err);
                return null;
              }
            })
            .filter((item): item is OneOffItem => item !== null); // Remove any null entries

          console.log("Transformed items:", transformed); // Debug log
          setWeekItems(transformed);
        } else {
          setError("Invalid response format from server");
        }
      } catch (e: any) {
        console.error("Error loading services:", e);
        setError(
          e?.response?.data?.message || "Failed to load scheduled services."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-white/60">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <ThisWeekSchedule items={weekItems} />
    </div>
  );
}

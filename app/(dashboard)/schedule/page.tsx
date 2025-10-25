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

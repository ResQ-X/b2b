"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import { ServiceHistoryList } from "@/components/emergency/ServiceHistoryList";
import { RequestEmergencyServiceCard } from "@/components/emergency/RequestEmergencyServiceCard";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

export default function MaintenancePage() {
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
      <RequestEmergencyServiceCard />

      {/* Service History */}
      <ServiceHistoryList
        items={[
          {
            title: "LND-234-CC - Flat Tire",
            subtitle: "Lekki-Epe Expressway • 2 hours ago",
            status: "Completed",
          },
          {
            title: "LND-789-DD - Jump Start",
            subtitle: "Victoria Island • Yesterday",
            status: "Completed",
          },
          {
            title: "LND-451-AA - Fuel Delivery",
            subtitle: "Third Mainland Bridge • 3 days ago",
            status: "Completed",
          },
        ]}
      />
    </div>
  );
}

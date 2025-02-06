"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { IncidentsTable } from "@/components/dashboard/incidents-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import axiosInstance from "@/lib/axios";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: any[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_dashboard_metrics");
        setMetrics(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: "Active Orders",
      value: metrics.active_order_count,
      change: { value: "+0%", timeframe: "this week" },
      icon: "ShoppingCart",
    },
    {
      title: "Professionals",
      value: metrics.professionals,
      change: { value: "+0%", timeframe: "this week" },
      icon: "Users",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <IncidentsTable />

      <RevenueChart />

      <footer className="text-center font-medium text-[16px] text-black">© 2025 ResQ-X. All Rights Reserved.</footer>
    </div>
  );
}
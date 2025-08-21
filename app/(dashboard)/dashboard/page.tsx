"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { CarFront, Bolt, Wallet, Fuel, AlertTriangle } from "lucide-react";
import FuelIcon from "@/public/gas-station.svg";
import Loader from "@/components/ui/Loader";
import { StatTile } from "@/components/dashboard/StatTile";
import { CTABanner } from "@/components/dashboard/CTABanner";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { FuelBarChart } from "@/components/dashboard/FuelBarChart";
import { DonutBreakdown } from "@/components/dashboard/DonutBreakdown";
import { RecentDeliveries } from "@/components/dashboard/RecentDeliveries";
import { UpcomingSchedules } from "@/components/dashboard/UpcomingSchedules";
import { SideCard } from "@/components/dashboard/SideCard";
import { ServiceBundle } from "@/components/dashboard/ServiceBundle";
import {
  getFuelChartData,
  getCostBreakdownChartData,
  getRecentDeliveriesForTable,
  getUpcomingSchedulesForTable,
  getAvailableYears,
} from "@/lib/mockData";
import RequestServiceModal, {
  type RequestServiceForm,
} from "@/components/fuel-delivery/FuelModal";

interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [open, setOpen] = useState(false);

  // Get mock data with selected year
  const fuelChartData = getFuelChartData(selectedYear);
  const costBreakdownData = getCostBreakdownChartData();
  const recentDeliveriesData = getRecentDeliveriesForTable();
  const upcomingSchedulesData = getUpcomingSchedulesForTable();
  const availableYears = getAvailableYears();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  // Handler for year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // You can add API calls here to fetch data for the selected year if needed
    console.log(`Year changed to: ${year}`);
  };

  if (!metrics) return <Loader />;

  const tiles = [
    {
      title: "Active Vehicles",
      value: metrics.active_order_count ?? 0,
      sub: "89% uptime",
      icon: CarFront,
    },
    {
      title: "Maintenance Pending",
      value: 8,
      sub: "View Schedule →",
      icon: Bolt,
    },
    {
      title: "Total Monthly Savings",
      value: "₦800k",
      sub: "Maintenance & Fuel Delivery",
      icon: Wallet,
    },
  ];

  const typeOptions = [
    { label: "Oil Change", value: "oil-change" },
    { label: "Brake Inspection", value: "brake-inspection" },
    { label: "Tire Rotation", value: "tire-rotation" },
    { label: "Full Service", value: "full-service" },
  ];

  const vehicleOptions = [
    { label: "LND-451-AA", value: "LND-451-AA" },
    { label: "KJA-220-KD", value: "KJA-220-KD" },
    { label: "ABC-123-XY", value: "ABC-123-XY" },
  ];
  const locationOptions = [
    { label: "Lekki Office", value: "lekki-office" },
    { label: "VI Branch", value: "vi-branch" },
    { label: "Ikeja Depot", value: "ikeja-depot" },
  ];
  const slotOptions = [
    { label: "08:00–10:00", value: "08:00-10:00" },
    { label: "10:00–12:00", value: "10:00-12:00" },
    { label: "12:00–14:00", value: "12:00-14:00" },
  ];

  const handleSubmit = async (data: RequestServiceForm) => {
    // TODO: call your API
    // await axios.post('/api/maintenance/request', data)
    console.log("submit", data);
  };

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-[#F1F1F1] text-2xl font-semibold">
          Welcome Emtech,
        </h1>
        <p className="text-[#E2E2E2] text-base font-medium">
          Today&apos;s snapshot of your operations.
        </p>
      </div>

      {/* Top tiles */}
      <div className="flex flex-col md:flex-row md:gap-[52px]">
        {tiles.map((t, idx) => (
          <div key={t.title} className="relative flex-1">
            <StatTile {...t} />

            {idx < tiles.length - 1 && (
              <span className="hidden md:block absolute -right-[26px] top-1/2 -translate-y-1/2 h-[41px] w-px bg-[#FFFFFF]" />
            )}
          </div>
        ))}
      </div>

      {/* Mid row: CTA + Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#777777] rounded-2xl">
          <CTABanner
            title="Hey! Running low on Fuel?"
            desc="Place your orders in seconds and keep your fleet fueled | without the hassle."
            buttonText="Order Fuel"
            illustration="/fuel-truck.svg"
            onAction={() => setOpen(true)}
          />
        </div>

        <WalletCard
          balance={metrics.wallet_balance ?? 64500}
          onTopUp={() => console.log("Top up wallet")}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#777777] rounded-2xl">
          <FuelBarChart
            title="Monthly Fuel Consumption"
            data={fuelChartData.data}
            labels={fuelChartData.labels}
            availableYears={availableYears}
            onYearChange={handleYearChange}
          />
        </div>

        <DonutBreakdown
          title="Cost Breakdown"
          legend={costBreakdownData.legend}
          slices={costBreakdownData.slices}
          colors={costBreakdownData.colors}
        />
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentDeliveries items={recentDeliveriesData} />

          <UpcomingSchedules items={upcomingSchedulesData} />
        </div>

        <div className="space-y-6">
          <SideCard
            title="Schedule Service"
            subtitle="6 vehicles need maintenance"
            actionText="View Schedule"
            icon={FuelIcon}
            onAction={() => console.log("View Schedule")}
          />

          <SideCard
            title="Emergency?"
            subtitle="24/7 roadside assistance"
            actionText="Get Help Here"
            icon={FuelIcon}
            tone="danger"
            onAction={() => console.log("Get Help")}
          />

          <ServiceBundle
            status="Active"
            services={[
              {
                icon: Fuel,
                title: "Fuel Delivery",
                desc: "On-demand & scheduled",
              },
              {
                icon: Bolt,
                title: "Maintenance",
                desc: "Preventive & repairs",
              },
              {
                icon: AlertTriangle,
                title: "Emergency",
                desc: "24/7 roadside & towing",
              },
            ]}
          />
        </div>
      </div>

      <RequestServiceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        typeOptions={typeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />
    </div>
  );
}

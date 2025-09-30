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
import RequestServiceModal, {
  type RequestServiceForm,
} from "@/components/fuel-delivery/FuelModal";

interface Asset {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype: string;
  fuel_type: string;
  capacity: number;
  plate_number: string | null;
  business_id: string;
  location_id: string;
  created_at: string;
  updated_at: string;
}

interface Location {
  id: string;
  location_name: string;
  location_longitude: string;
  location_latitude: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

interface FuelBarData {
  month: string;
  quantity: number;
}

interface FuelChartData {
  data: number[];
  labels: string[];
}

interface PieChartData {
  legend: Array<{ label: string; value: string; color: string }>;
  slices: number[];
  colors: string[];
}

interface PieDataResponse {
  fuelCost: number;
  emergencyDeliveries: number;
  maintenanceCost: number;
  serviceCharges: number;
  percentages: {
    fuel: string;
    emergency: string;
    maintenance: string;
    service: string;
  };
}

interface UpcomingOrder {
  id: string;
  status: string;
  date_time: string;
  fuel_type?: string;
  service_time_type?: string;
  quantity?: number;
  maintenance_type?: string;
  emergency_type?: string;
  note: string;
  location: string;
  location_longitude: string;
  location_latitude: string;
  business_id: string;
  asset_id: string;
  created_at: string;
  updated_at: string;
  asset: Asset;
}

interface DashboardStats {
  assetCount: number;
  pendingMaintenanceServices: number;
  recentDeliveries: any[];
  upcomingOrdersCount: number;
  upcomingOrders: UpcomingOrder[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [fuelBarData, setFuelBarData] = useState<FuelChartData>({
    data: [],
    labels: [],
  });
  const [pieChartData, setPieChartData] = useState<PieChartData>({
    legend: [],
    slices: [],
    colors: ["#FF6B35", "#FFB84D", "#4ECDC4", "#95E1D3"],
  });
  const [selectedYear, setSelectedYear] = useState(2025);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get available years - only 2025 since project just started
  const availableYears = [2025];

  // Fetch bar chart data
  const fetchBarChartData = async (year: number) => {
    try {
      const response = await axiosInstance.get("/fleets/dashboard-bar-data", {
        params: { year },
      });

      const barData: FuelBarData[] = response.data.data.data || [];

      // Transform API data to chart format
      const transformedData: FuelChartData = {
        data: barData.map((item) => item.quantity),
        labels: barData.map((item) => item.month),
      };

      setFuelBarData(transformedData);
    } catch (error) {
      console.error("Failed to fetch bar chart data:", error);
      // Set empty data on error
      setFuelBarData({ data: [], labels: [] });
    }
  };

  // Fetch pie chart data
  const fetchPieChartData = async () => {
    try {
      const response = await axiosInstance.get("/fleets/dashboard-pie-data");

      const pieData: PieDataResponse = response.data.data.data;

      // Format currency helper
      const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
          return `₦${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
          return `₦${(amount / 1000).toFixed(0)}k`;
        }
        return `₦${amount}`;
      };

      // Define colors for each category
      const colors = ["#FF8500", "#F59E0B", "#FDBA74", "#FFE6C7"];

      // Transform API data to chart format
      const transformedPieData: PieChartData = {
        legend: [
          {
            label: "Fuel Cost",
            value: `${pieData.percentages.fuel}% (${formatCurrency(
              pieData.fuelCost
            )})`,
            color: colors[0],
          },
          {
            label: "Maintenance Cost",
            value: `${pieData.percentages.maintenance}% (${formatCurrency(
              pieData.maintenanceCost
            )})`,
            color: colors[1],
          },
          {
            label: "Emergency Deliveries",
            value: `${pieData.percentages.emergency}% (${formatCurrency(
              pieData.emergencyDeliveries
            )})`,
            color: colors[2],
          },
          {
            label: "Service Charges",
            value: `${pieData.percentages.service}% (${formatCurrency(
              pieData.serviceCharges
            )})`,
            color: colors[3],
          },
        ],
        slices: [
          parseFloat(pieData.percentages.fuel),
          parseFloat(pieData.percentages.maintenance),
          parseFloat(pieData.percentages.emergency),
          parseFloat(pieData.percentages.service),
        ],
        colors: colors,
      };

      setPieChartData(transformedPieData);
    } catch (error) {
      console.error("Failed to fetch pie chart data:", error);
      // Keep default empty data on error
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsResponse, assetsResponse, locationsResponse] =
          await Promise.all([
            axiosInstance.get("/fleets/dashboard-stats"),
            axiosInstance.get("/fleet-asset/get-asset"),
            axiosInstance.get("/fleet-asset/get-locations"),
          ]);

        setStats(statsResponse.data.data);
        setAssets(assetsResponse.data.assets || []);
        setLocations(locationsResponse.data.data || []);

        // Fetch bar chart data for current year and pie chart data
        await Promise.all([
          fetchBarChartData(selectedYear),
          fetchPieChartData(),
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for year change
  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    await fetchBarChartData(year);
    console.log(`Year changed to: ${year}`);
  };

  // Transform upcoming orders for the table
  const getUpcomingSchedulesData = () => {
    if (!stats?.upcomingOrders || stats.upcomingOrders.length === 0) return [];

    return stats.upcomingOrders.map((order) => {
      // Determine service type and volume info
      let serviceType = "Unknown";
      let volumeInfo = "";

      if (order.fuel_type) {
        serviceType = "Fuel Delivery";
        volumeInfo = order.quantity ? `${order.quantity}L` : "";
      } else if (order.maintenance_type) {
        serviceType =
          order.maintenance_type === "OTHER"
            ? "Maintenance"
            : order.maintenance_type;
        volumeInfo = "";
      } else if (order.emergency_type) {
        serviceType =
          order.emergency_type === "OTHER" ? "Emergency" : order.emergency_type;
        volumeInfo = "";
      }

      const orderDate = new Date(order.date_time);
      const dateStr = orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const timeStr = orderDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const vehicleLabel = order.asset.plate_number || order.asset.asset_name;

      return {
        title: `${serviceType} - ${vehicleLabel}`,
        where: order.location,
        when: `${dateStr}, ${timeStr}`,
        vol: volumeInfo,
      };
    });
  };

  // Transform recent deliveries for the table
  const getRecentDeliveriesData = () => {
    if (!stats?.recentDeliveries || stats.recentDeliveries.length === 0)
      return [];

    return stats.recentDeliveries.map((delivery) => {
      const deliveryDate = new Date(delivery.date_time);
      const dateStr = deliveryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const timeStr = deliveryDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        plate:
          delivery.asset?.plate_number || delivery.asset?.asset_name || "N/A",
        where: delivery.location,
        when: `${dateStr}, ${timeStr}`,
        volume: delivery.quantity ? `${delivery.quantity}L` : "N/A",
        status:
          delivery.status === "COMPLETED"
            ? "Delivered"
            : delivery.status === "PENDING"
            ? "Pending"
            : delivery.status,
      };
    });
  };

  if (loading) return <Loader content="Loading dashbaord data..." />;

  const tiles = [
    {
      title: "Active Vehicles",
      value: stats?.assetCount || 0,
      sub: "Total assets",
      icon: CarFront,
    },
    {
      title: "Maintenance Pending",
      value: stats?.pendingMaintenanceServices || 0,
      sub: "View Schedule →",
      icon: Bolt,
    },
    {
      title: "Total Upcoming Orders",
      value: stats?.upcomingOrdersCount || 0,
      sub: "Upcoming orders",
      icon: Wallet,
    },
  ];

  // Fuel type options
  const fuelTypeOptions = [
    { label: "Petrol", value: "PETROL" },
    { label: "Diesel", value: "DIESEL" },
  ];

  // Generate vehicle options from assets
  const vehicleOptions = assets.map((asset) => ({
    label: asset.plate_number
      ? `${asset.asset_name} (${asset.plate_number})`
      : asset.asset_name,
    value: asset.id,
  }));

  // Generate location options from locations
  const locationOptions = locations.map((location) => ({
    label: location.location_name,
    value: location.id,
  }));

  // Time slot options (generate for today and tomorrow)
  const slotOptions = [
    { label: "Now", value: "NOW" },
    {
      label: "08:00–10:00",
      value: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    },
    {
      label: "10:00–12:00",
      value: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    },
    {
      label: "12:00–14:00",
      value: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    },
    {
      label: "14:00–16:00",
      value: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    },
    {
      label: "16:00–18:00",
      value: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    },
  ];

  const handleSubmit = async (data: RequestServiceForm) => {
    try {
      const requestBody = {
        fuel_type: data.type, // "PETROL" or "DIESEL"
        asset_id: data.vehicle,
        location_id: data.location,
        time_slot: data.slot === "NOW" ? new Date().toISOString() : data.slot,
        quantity: data.quantity,
        note: data.notes,
        is_scheduled: data.slot !== "NOW",
      };

      const response = await axiosInstance.post(
        "/fleet-service/place-fuel-service",
        requestBody
      );

      console.log("Fuel service request successful:", response.data);

      // Refresh dashboard stats and assets
      const [statsResponse, assetsResponse] = await Promise.all([
        axiosInstance.get("/fleets/dashboard-stats"),
        axiosInstance.get("/fleet-asset/get-asset"),
      ]);

      setStats(statsResponse.data.data);
      setAssets(assetsResponse.data.assets || []);

      // Show success message (you can use a toast notification here)
      alert("Fuel service requested successfully!");
    } catch (error) {
      console.error("Failed to request fuel service:", error);
      // Show error message (you can use a toast notification here)
      alert("Failed to request fuel service. Please try again.");
      throw error; // Re-throw to let modal handle the error state
    }
  };

  return (
    <div className="space-y-6">
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
        <div className="bg-[#3B3835] lg:col-span-2 border border-[#777777] rounded-2xl">
          <CTABanner
            title="Hey! Running low on Fuel?"
            desc="Place your orders in seconds and keep your fleet fueled | without the hassle."
            buttonText="Order Fuel"
            illustration="/fuel-truck.svg"
            onAction={() => setOpen(true)}
          />
        </div>

        <WalletCard
          balance={64500}
          onTopUp={() => console.log("Top up wallet")}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#777777] rounded-2xl">
          <FuelBarChart
            title="Monthly Fuel Consumption"
            data={fuelBarData.data}
            labels={fuelBarData.labels}
            availableYears={availableYears}
            onYearChange={handleYearChange}
          />
        </div>

        <DonutBreakdown
          title="Cost Breakdown"
          legend={pieChartData.legend}
          slices={pieChartData.slices}
          colors={pieChartData.colors}
        />
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentDeliveries items={getRecentDeliveriesData()} />

          <UpcomingSchedules items={getUpcomingSchedulesData()} />
        </div>

        <div className="space-y-6">
          <SideCard
            title="Schedule Service"
            subtitle={`${
              stats?.pendingMaintenanceServices || 0
            } vehicles need maintenance`}
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
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />
    </div>
  );
}

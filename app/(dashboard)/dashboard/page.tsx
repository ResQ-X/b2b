"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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
import RequestFuelModal from "@/components/fuel-delivery/RequestFuelModal";
import TopUpModal from "@/components/billing/TopUpModal";
import {
  Asset,
  Location,
  FuelBarData,
  FuelChartData,
  PieChartData,
  // PieDataResponse,
  DashboardStats,
} from "@/types/dashboard";
import RequestMoneyModal from "@/components/billing/RequestMoneyModal";

type UserProfile = {
  id: string;
  name: string;
  company_name: string;
  email: string;
  company_email: string;
  phone: string;
  company_phone: string;
  role?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [topUpOpen, setTopUpOpen] = useState(false);
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
  type WalletBalance = { balance: number };
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const availableBalance = walletBalance?.balance ?? 0.0;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/fleets/profile");
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const availableYears = [2025];

  const fetchBarChartData = async (year: number) => {
    try {
      const response = await axiosInstance.get("/fleets/dashboard-bar-data", {
        params: { year },
      });

      const barData: FuelBarData[] = response.data.data.data || [];

      const transformedData: FuelChartData = {
        data: barData.map((item) => item.quantity),
        labels: barData.map((item) => item.month),
      };

      setFuelBarData(transformedData);
    } catch (error) {
      console.error("Failed to fetch bar chart data:", error);
      setFuelBarData({ data: [], labels: [] });
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axiosInstance.get("/fleets/dashboard-pie-data");

      const resData = response.data.data;

      const colors = ["#FF8500", "#F59E0B", "#FDBA74", "#FFE6C7", "#9CA3AF"];

      // Transform chart data into your PieChartData shape
      const transformedPieData = {
        legend: resData.data.map((asset: any, index: number) => ({
          label: asset.asset_name,
          value: `${asset.total_orders} orders`,
          color: colors[index % colors.length],
          details: {
            total_orders: asset.total_orders,
            fuel_orders: asset.fuel_orders,
            maintenance_orders: asset.maintenance_orders,
            emergency_orders: asset.emergency_orders,
          },
        })),
        slices: resData.chart.series,
        colors: colors.slice(0, resData.chart.series.length),
      };

      setPieChartData(transformedPieData);
    } catch (error) {
      console.error("Failed to fetch pie chart data:", error);
    }
  };

  console.log("pieChartData", pieChartData);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsResponse, assetsResponse, locationsResponse] =
          await Promise.all([
            axiosInstance.get("/fleets/dashboard-stats"),
            axiosInstance.get("/fleet-asset/get-asset"),
            axiosInstance.get("/fleet-asset/get-locations"),
          ]);

        setStats(statsResponse.data.data);
        setAssets(assetsResponse.data.assets || []);
        setLocations(locationsResponse.data.data || []);

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

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    await fetchBarChartData(year);
    console.log(`Year changed to: ${year}`);
  };

  const getUpcomingSchedulesData = () => {
    if (!stats?.upcomingOrders || stats.upcomingOrders.length === 0) return [];

    return stats.upcomingOrders.map((order) => {
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

      // Handle multiple assets
      let vehicleLabel = "N/A";
      if (order.assets && order.assets.length > 0) {
        const assetNames = order.assets.map(
          (asset) => asset.plate_number || asset.asset_name
        );
        vehicleLabel = assetNames.join(", ");
      }

      return {
        title: `${serviceType} - ${vehicleLabel}`,
        where: order.location,
        when: `${dateStr}, ${timeStr}`,
        vol: volumeInfo,
      };
    });
  };

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

      // Handle multiple assets
      let plateDisplay = "N/A";
      if (delivery.assets && delivery.assets.length > 0) {
        const assetNames = delivery.assets.map(
          (asset) => asset.plate_number || asset.asset_name
        );
        plateDisplay = assetNames.join(", ");
      }

      return {
        plate: plateDisplay,
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

  if (loading) return <Loader content="Loading dashboard data..." />;

  const tiles = [
    {
      title: "Total Asset",
      value: stats?.assetCount || 0,
      sub: "Total assets →",
      icon: CarFront,
      link: "/fleet",
    },
    {
      title: "Maintenance Pending",
      value: stats?.pendingMaintenanceServices || 0,
      sub: "View maintenance →",
      icon: Bolt,
      link: "/maintenance",
    },
    {
      title: "Total Upcoming Orders",
      value: stats?.upcomingOrdersCount || 0,
      sub: "Upcoming orders →",
      icon: Wallet,
      link: "/schedule",
    },
  ];

  const fuelTypeOptions = [
    { label: "Petrol", value: "PETROL" },
    { label: "Diesel", value: "DIESEL" },
  ];

  const vehicleOptions = assets.map((asset) => ({
    label: asset.plate_number
      ? `${asset.asset_name} (${asset.plate_number})`
      : asset.asset_name,
    value: asset.id,
  }));

  const locationOptions = locations.map((location) => ({
    label: location.location_name,
    value: location.id,
  }));

  const handleTopUpInitiate = async () => {
    try {
      setIsProcessing(true);

      const response = await axiosInstance.post(
        "/fleet-wallet/top-up-initiate",
        {
          amount: parseFloat(topUpAmount),
        }
      );

      const { authorization_url, reference } = response.data.data;

      sessionStorage.setItem("paystack_reference", reference);

      const popup = window.open(
        authorization_url,
        "PaystackPayment",
        "width=600,height=700,left=200,top=100"
      );

      if (!popup) {
        toast.error("Please allow popups for this site to complete payment");
        setIsProcessing(false);
        return;
      }

      setTopUpOpen(false);
      setTopUpAmount("");
      setIsProcessing(false);

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          verifyPayment(reference);
        }
      }, 500);
    } catch (error) {
      console.error("Failed to initiate top-up:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    try {
      toast.info("Verifying payment...");

      const response = await axiosInstance.post(
        "/fleet-wallet/verify-payment",
        {
          ref,
          action: "TOP_UP",
        }
      );

      if (response.data.status === "OK") {
        toast.success(response.data.message);

        const balanceResponse = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(balanceResponse?.data?.data);

        sessionStorage.removeItem("paystack_reference");
      } else {
        toast.error("Payment verification failed.");
        sessionStorage.removeItem("paystack_reference");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
      sessionStorage.removeItem("paystack_reference");
    }
  };

  const handleRequestSubmit = async (data: any) => {
    console.log("Request data:", data);

    try {
      // Start request
      toast.info("Submitting fund request...");
      const response = await axiosInstance.post("/sub/fund-requests", data);

      if (response.data?.status === "OK" || response.data?.success) {
        toast.success(
          response.data?.message || "Fund request submitted successfully!"
        );
        setShowRequest(false); // close modal
      } else {
        toast.error(response.data?.message || "Failed to submit fund request.");
      }
    } catch (error: any) {
      console.error("Fund request failed:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to submit fund request. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-6">
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
          balance={walletBalance?.balance ?? 0}
          onTopUp={() => setTopUpOpen(true)}
          role={userProfile?.role}
          setShowRequest={setShowRequest}
        />
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentDeliveries
            items={[...getRecentDeliveriesData()].reverse().slice(0, 2)}
          />
          <UpcomingSchedules
            items={[...getUpcomingSchedulesData()].reverse().slice(0, 3)}
          />
        </div>

        <div className="space-y-6">
          <SideCard
            title="Schedule Service"
            subtitle={`${
              stats?.pendingMaintenanceServices || 0
            } vehicles need maintenance`}
            actionText="View Schedule"
            icon={FuelIcon}
            onAction={() => router.push("/schedule")}
          />

          <SideCard
            title="Emergency?"
            subtitle="24/7 roadside assistance"
            actionText="Get Help Here"
            icon={FuelIcon}
            tone="danger"
            onAction={() => router.push("/emergency")}
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

      <RequestFuelModal
        open={open}
        onOpenChange={setOpen}
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        assets={assets}
      />

      <TopUpModal
        open={topUpOpen}
        onOpenChange={(v) => {
          setTopUpOpen(v);
          if (!v) setTopUpAmount("");
        }}
        amount={topUpAmount}
        onAmountChange={setTopUpAmount}
        isProcessing={isProcessing}
        onSubmit={handleTopUpInitiate}
      />

      <RequestMoneyModal
        open={showRequest}
        availableBalance={availableBalance}
        onOpenChange={setShowRequest}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}

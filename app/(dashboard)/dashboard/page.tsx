"use client";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/auth.context";
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
import RequestFuelModal, {
  type RequestFuelForm,
} from "@/components/fuel-delivery/RequestFuelModal";
import TopUpModal from "@/components/billing/TopUpModal";
import { startPaystackInline } from "@/lib/startPaystackInline";
import {
  Asset,
  Location,
  FuelBarData,
  FuelChartData,
  PieChartData,
  PieDataResponse,
  DashboardStats,
} from "@/types/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
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

  console.log("Wallet Balance:", walletBalance);

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
      // const formatCurrency = (amount: number) => {
      //   if (amount >= 1000000) {
      //     return `₦${(amount / 1000000).toFixed(1)}M`;
      //   } else if (amount >= 1000) {
      //     return `₦${(amount / 1000).toFixed(0)}k`;
      //   }
      //   return `₦${amount}`;
      // };

      // Define colors for each category
      const colors = ["#FF8500", "#F59E0B", "#FDBA74", "#FFE6C7"];

      // Transform API data to chart format
      const transformedPieData: PieChartData = {
        legend: [
          {
            label: "Fuel Cost",
            value: `${pieData.percentages.fuel}%`,
            // value: `${pieData.percentages.fuel}% (${formatCurrency(
            //   pieData.fuelCost
            // )})`,
            color: colors[0],
          },
          {
            label: "Maintenance Cost",
            value: `${pieData.percentages.maintenance}%`,
            // value: `${pieData.percentages.maintenance}% (${formatCurrency(
            //   pieData.maintenanceCost
            // )})`,
            color: colors[1],
          },
          {
            label: "Emergency Deliveries",
            // value: `${pieData.percentages.emergency}% (${formatCurrency(
            //   pieData.emergencyDeliveries
            // )})`,
            value: `${pieData.percentages.emergency}%`,
            color: colors[2],
          },
          {
            label: "Service Charges",
            // value: `${pieData.percentages.service}% (${formatCurrency(
            //   pieData.serviceCharges
            // )})`,
            value: `${pieData.percentages.service}%`,
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
      link: "/schedule",
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

  const handleSubmit = async (data: RequestFuelForm) => {
    try {
      // Check if it's a manual location (location_id will be MANUAL_LOCATION_VALUE)
      const isManualLocation = data.location_id === "__manual__";

      const requestBody = {
        fuel_type: data.fuel_type, // "PETROL" or "DIESEL"
        asset_id: data.asset_id,
        // Only send location_id if it's NOT a manual location
        ...(isManualLocation ? {} : { location_id: data.location_id }),
        // Send manual location details if applicable
        ...(isManualLocation
          ? {
              location_address: data.location_address || "",
              location_longitude: data.location_longitude || "",
              location_latitude: data.location_latitude || "",
            }
          : {}),
        time_slot:
          data.time_slot === "NOW" ? new Date().toISOString() : data.time_slot,
        quantity: data.quantity,
        note: data.note,
        is_scheduled: data.time_slot !== "NOW",
      };
      await axiosInstance.post(
        "/fleet-service/place-fuel-service",
        requestBody
      );
      toast.success("Fuel service requested successfully!");
    } catch (error) {
      toast.error(`Failed to request fuel service. Please try again. ${error}`);
      throw error;
    }
  };

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

      // Store reference to verify later
      sessionStorage.setItem("paystack_reference", reference);

      // Open Paystack in a popup window
      const popup = window.open(
        authorization_url,
        "PaystackPayment",
        "width=600,height=700,left=200,top=100"
      );

      // Check if popup was blocked
      if (!popup) {
        toast.error("Please allow popups for this site to complete payment");
        setIsProcessing(false);
        return;
      }

      // Close the top-up modal
      setTopUpOpen(false);
      setTopUpAmount("");
      setIsProcessing(false);

      // Monitor popup window
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // When popup closes, verify payment
          verifyPayment(reference);
        }
      }, 500);
    } catch (error) {
      console.error("Failed to initiate top-up:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  // const handleTopUpInitiate = async () => {
  //   try {
  //     setIsProcessing(true);

  //     // OPTION A (simplest): let Paystack generate the reference.
  //     // If you prefer to generate your own ref in the backend, see OPTION B below.

  //     await startPaystackInline({
  //       amountNaira: parseFloat(topUpAmount),
  //       email: user?.email || "no-reply@resqx.fake", // ideally a real user email
  //       metadata: {
  //         product: "fleet_wallet_topup",
  //         userId: user?.id,
  //       },
  //       onSuccess: async (psRef) => {
  //         toast.info("Verifying payment…");
  //         try {
  //           const resp = await axiosInstance.post(
  //             "/fleet-wallet/verify-payment",
  //             {
  //               ref: psRef,
  //               action: "TOP_UP",
  //             }
  //           );

  //           if (resp.data.status === "OK") {
  //             toast.success(resp.data.message || "Wallet topped up!");
  //             // refresh balance
  //             const balanceResponse = await axiosInstance.get(
  //               "/fleet-wallet/get-wallet-balance"
  //             );
  //             setWalletBalance(balanceResponse?.data?.data);
  //             setTopUpOpen(false);
  //             setTopUpAmount("");
  //           } else {
  //             toast.error("Payment verification failed.");
  //           }
  //         } catch (err) {
  //           console.error(err);
  //           toast.error("Payment verification failed. Please contact support.");
  //         } finally {
  //           setIsProcessing(false);
  //         }
  //       },
  //       onClose: () => {
  //         // user closed the inline widget
  //         setIsProcessing(false);
  //         toast.info("Payment window closed.");
  //       },
  //     });
  //   } catch (e: any) {
  //     console.error(e);
  //     toast.error(e?.message || "Failed to start payment.");
  //     setIsProcessing(false);
  //   }
  // };

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

        // Refresh wallet balance
        const balanceResponse = await axiosInstance.get(
          "/fleet-wallet/get-wallet-balance"
        );
        setWalletBalance(balanceResponse?.data?.data);

        // Remove stored reference
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
          balance={walletBalance?.balance ?? 0}
          onTopUp={() => setTopUpOpen(true)}
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
          {/* <RecentDeliveries items={getRecentDeliveriesData().slice(0, 2)} />

          <UpcomingSchedules items={getUpcomingSchedulesData().slice(0, 3)} /> */}

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
        onSubmit={handleSubmit}
        typeOptions={fuelTypeOptions}
        vehicleOptions={vehicleOptions}
        locationOptions={locationOptions}
        slotOptions={slotOptions}
      />

      <TopUpModal
        open={topUpOpen}
        onOpenChange={(v) => {
          setTopUpOpen(v);
          if (!v) setTopUpAmount("");
        }}
        amount={topUpAmount} // keep as raw digits string
        onAmountChange={setTopUpAmount}
        isProcessing={isProcessing}
        onSubmit={handleTopUpInitiate}
      />
    </div>
  );
}

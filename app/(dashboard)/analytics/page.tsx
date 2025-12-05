// "use client";
// import { useState, useEffect } from "react";
// import axiosInstance from "@/lib/axios";
// import {
//   Filter,
//   Calendar,
//   ExternalLink,
//   Car,
//   TrendingUp,
//   Award,
// } from "lucide-react";
// import { StatTile } from "@/components/dashboard/StatTile";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // Helper function to format period for chart display
// function formatPeriodForChart(period: string, groupBy: string = "month") {
//   const date = new Date(period);

//   if (groupBy === "day") {
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   } else if (groupBy === "week") {
//     return `Week ${Math.ceil(date.getDate() / 7)}`;
//   } else {
//     // month
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
//   }
// }

// function formatCurrency(amount: number) {
//   return `₦${amount.toLocaleString()}`;
// }

// function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-GB", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   });
// }

// export default function AnalyticsPage() {
//   const [loading, setLoading] = useState(true);
//   const [filterVehicle, setFilterVehicle] = useState("");
//   const [filterMonth, setFilterMonth] = useState("November");
//   const [chartView, setChartView] = useState<"day" | "week" | "month">("month");
//   const [chartYear, setChartYear] = useState("2025");
//   const [analysisData, setAnalysisData] = useState<any>(null);
//   const [topAssetsData, setTopAssetsData] = useState<any>(null);
//   const [vehicles, setVehicles] = useState<any[]>([]);

//   // Prepare chart data from API response
//   const chartData =
//     analysisData?.data?.map((item: any) => ({
//       period: formatPeriodForChart(item.period, chartView),
//       amount: item.total_amount,
//       orders: item.orders_count,
//     })) || [];

//   // Table data from API response
//   const tableData = analysisData?.data || [];

//   // Summary stats
//   const totalSpending = analysisData?.totals?.total_amount || 0;
//   const totalOrders = analysisData?.totals?.total_count || 0;
//   const highestSpender = topAssetsData?.top_assets?.[0]?.asset_name || "N/A";
//   const highestSpenderAmount =
//     topAssetsData?.top_assets?.[0]?.total_amount || 0;
//   const highestSpenderPlate =
//     topAssetsData?.top_assets?.[0]?.plate_number || "";

//   const statTiles = [
//     {
//       title: "Total Spending",
//       value: formatCurrency(totalSpending),
//       subtitle: "All time",
//       icon: Car,
//     },
//     {
//       title: "Total Orders",
//       value: totalOrders,
//       subtitle: `${totalOrders} orders`,
//       icon: TrendingUp,
//     },
//     {
//       title: "Highest Spender",
//       value: highestSpender,
//       subtitle: highestSpenderPlate
//         ? `${highestSpenderPlate} - ${formatCurrency(highestSpenderAmount)}`
//         : formatCurrency(highestSpenderAmount),
//       icon: Award,
//     },
//   ];

//   // Fetch vehicles list for filter dropdown
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "/fleet-order-logging/analytics",
//           { params: { type: "top-assets" } }
//         );
//         setVehicles(response.data.data.top_assets || []);
//       } catch (error) {
//         console.error("Failed to fetch vehicles:", error);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   // Fetch analytics data based on filters
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);

//         // Build query params based on filters
//         const params: any = {
//           groupBy: chartView, // Use the chart view as groupBy parameter
//         };

//         if (filterVehicle && filterVehicle !== "") {
//           params.asset_id = filterVehicle;
//         }

//         // You can add date filtering here when you implement the date filter
//         // if (startDate) params.startDate = startDate;
//         // if (endDate) params.endDate = endDate;

//         // Fetch summary analytics
//         const summaryResponse = await axiosInstance.get(
//           "/fleet-order-logging/analytics",
//           { params }
//         );
//         setAnalysisData(summaryResponse.data.data);

//         // Fetch top assets (highest spenders)
//         const topAssetsResponse = await axiosInstance.get(
//           "/fleet-order-logging/analytics",
//           { params: { ...params, type: "top-assets" } }
//         );
//         setTopAssetsData(topAssetsResponse.data.data);
//       } catch (error) {
//         console.error("Failed to fetch analytics data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [filterVehicle, chartView]);

//   console.log("Analysis Data:", analysisData);
//   console.log("Top Assets Data:", topAssetsData);
//   console.log("Table Data:", tableData);
//   console.log("Table Data Length:", tableData.length);

//   return (
//     <div className="space-y-6">
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="text-white/70">Loading analytics...</div>
//         </div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {statTiles.map((tile) => (
//               <StatTile key={tile.title} {...tile} />
//             ))}
//           </div>

//           {/* Filters Bar */}
//           <div className="bg-[#2B2A28] rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
//             <div className="flex flex-wrap items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-white/70" />
//                 <span className="text-sm text-white/70">Filter by</span>
//               </div>
//               <select
//                 value={filterVehicle}
//                 onChange={(e) => setFilterVehicle(e.target.value)}
//                 className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
//               >
//                 <option value="">All Vehicles</option>
//                 {vehicles.map((vehicle) => (
//                   <option key={vehicle.asset_id} value={vehicle.asset_id}>
//                     {vehicle.asset_name} ({vehicle.plate_number})
//                   </option>
//                 ))}
//               </select>

//               {/* <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-white/70" />
//                 <span className="text-sm text-white/70">Filter by</span>
//               </div>
//               <select
//                 value={filterMonth}
//                 onChange={(e) => setFilterMonth(e.target.value)}
//                 className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
//               >
//                 <option>November</option>
//                 <option>October</option>
//                 <option>September</option>
//               </select> */}
//             </div>

//             <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
//               <ExternalLink className="h-5 w-5 text-white/70" />
//             </button>
//           </div>

//           {/* Chart */}
//           <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold">Vehicle Monthly Spend</h2>
//               <div className="flex items-center gap-3">
//                 <select
//                   value={chartView}
//                   onChange={(e) =>
//                     setChartView(e.target.value as "day" | "week" | "month")
//                   }
//                   className="bg-[#3B3835] text-white rounded-lg px-3 py-1.5 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
//                 >
//                   <option value="month">Monthly</option>
//                   <option value="week">Weekly</option>
//                   <option value="day">Daily</option>
//                 </select>
//                 <select
//                   value={chartYear}
//                   onChange={(e) => setChartYear(e.target.value)}
//                   className="bg-[#3B3835] text-white rounded-lg px-3 py-1.5 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
//                 >
//                   <option>2025</option>
//                   <option>2024</option>
//                 </select>
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart data={chartData} barGap={8}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
//                 <XAxis
//                   dataKey="period"
//                   stroke="#ffffff50"
//                   tick={{ fill: "#ffffff70", fontSize: 12 }}
//                 />
//                 <YAxis
//                   stroke="#ffffff50"
//                   tick={{ fill: "#ffffff70", fontSize: 12 }}
//                   tickFormatter={(value) => `₦${value / 1000}k`}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#3B3835",
//                     border: "1px solid #ffffff20",
//                     borderRadius: "8px",
//                     color: "#fff",
//                   }}
//                   formatter={(value: number) => formatCurrency(value)}
//                 />
//                 <Bar
//                   dataKey="amount"
//                   fill="#FF8500"
//                   radius={[4, 4, 0, 0]}
//                   name="Total Amount"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Recent Transactions */}
//           <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
//             <div className="p-6 border-b border-white/10">
//               <h2 className="text-xl font-semibold">Transaction History</h2>
//             </div>

//             {/* Table Header */}
//             <div className="px-6 py-4 bg-[#262422]">
//               <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
//                 <div>Period</div>
//                 <div>Vehicle</div>
//                 <div>Orders Count</div>
//                 <div className="text-right">Total Amount</div>
//               </div>
//             </div>

//             {/* Table Rows */}
//             <div className="divide-y divide-white/5">
//               {tableData.map((item: any, index: number) => {
//                 const uniqueKey = `${item.period}-${
//                   item.asset_id || "all"
//                 }-${index}`;
//                 return (
//                   <div
//                     key={uniqueKey}
//                     className="px-6 py-5 hover:bg-white/5 transition-colors"
//                   >
//                     <div className="grid grid-cols-4 gap-4 items-center">
//                       <div className="text-sm text-white/90">
//                         {formatDate(item.period)}
//                       </div>
//                       <div className="text-sm font-medium">
//                         {item.asset_name || "All Vehicles"}
//                       </div>
//                       <div className="text-sm text-white/80">
//                         {item.orders_count}{" "}
//                         {item.orders_count === 1 ? "order" : "orders"}
//                       </div>
//                       <div className="text-sm font-semibold text-right">
//                         {formatCurrency(item.total_amount)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {tableData.length === 0 && (
//               <div className="px-6 py-16 text-center">
//                 <p className="text-white/50">No transactions found</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Filter,
  Calendar,
  ExternalLink,
  Car,
  TrendingUp,
  Award,
} from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper function to format period for chart display
function formatPeriodForChart(period: string, groupBy: string = "month") {
  const date = new Date(period);

  if (groupBy === "day") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else if (groupBy === "week") {
    return `Week ${Math.ceil(date.getDate() / 7)}`;
  } else {
    // month
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [filterVehicle, setFilterVehicle] = useState("");
  // const [filterMonth, setFilterMonth] = useState("November");
  const [filterType, setFilterType] = useState("trends");
  const [chartView, setChartView] = useState<"day" | "week" | "month">("month");
  const [chartYear, setChartYear] = useState("2025");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [topAssetsData, setTopAssetsData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [chartAnalytics, setChartAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          {
            params: {
              type: "trends",
              groupBy: chartView,
              asset_id: filterVehicle || undefined,
            },
          }
        );

        setChartAnalytics(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chart analytics:", error);
      }
    };

    fetchChartData();
  }, [chartView, filterVehicle]);

  // Prepare chart data from API response
  // const chartData =
  //   analysisData?.data?.map((item: any) => ({
  //     period: formatPeriodForChart(item.period, chartView),
  //     amount: item.total_amount,
  //     orders: item.orders_count,
  //   })) || [];
  const chartData =
    chartAnalytics?.data?.map((item: any) => ({
      period: formatPeriodForChart(item.period, chartView),
      amount: item.total_amount,
      orders: item.orders_count,
    })) || [];

  // Table data from API response
  const tableData = analysisData?.data || [];

  // Summary stats
  const totalSpending = analysisData?.totals?.total_amount || 0;
  const totalOrders = analysisData?.totals?.total_count || 0;
  const highestSpender = topAssetsData?.top_assets?.[0]?.asset_name || "N/A";
  const highestSpenderAmount =
    topAssetsData?.top_assets?.[0]?.total_amount || 0;
  const highestSpenderPlate =
    topAssetsData?.top_assets?.[0]?.plate_number || "";

  const statTiles = [
    {
      title: "Total Spending",
      value: formatCurrency(totalSpending),
      subtitle: "All time",
      icon: Car,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      subtitle: `${totalOrders} orders`,
      icon: TrendingUp,
    },
    {
      title: "Highest Spender",
      value: highestSpender,
      subtitle: highestSpenderPlate
        ? `${highestSpenderPlate} - ${formatCurrency(highestSpenderAmount)}`
        : formatCurrency(highestSpenderAmount),
      icon: Award,
    },
  ];

  // Fetch vehicles list for filter dropdown
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params: { type: "top-assets" } }
        );
        setVehicles(response.data.data.top_assets || []);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch analytics data based on filters
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Build query params based on filters
        const params: any = {
          groupBy: chartView, // Use the chart view as groupBy parameter
        };

        if (filterVehicle && filterVehicle !== "") {
          params.asset_id = filterVehicle;
        }

        if (filterType && filterType !== "") {
          params.type = filterType;
        }

        // You can add date filtering here when you implement the date filter
        // if (startDate) params.startDate = startDate;
        // if (endDate) params.endDate = endDate;

        // Fetch summary analytics
        const summaryResponse = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params }
        );
        setAnalysisData(summaryResponse.data.data);

        // Fetch top assets (highest spenders)
        const topAssetsResponse = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params: { ...params, type: "top-assets" } }
        );
        setTopAssetsData(topAssetsResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [filterVehicle, chartView, filterType]);

  console.log("Analysis Data:", analysisData);
  console.log("Top Assets Data:", topAssetsData);
  console.log("Table Data:", tableData);
  console.log("Table Data Length:", tableData.length);

  const { rows, columns } = getTableConfig(filterType, analysisData);

  function renderCellValue(key: string, row: any) {
    if (key === "total_amount" || key.includes("spent")) {
      return formatCurrency(row[key]);
    }

    if (key === "period") {
      return formatDate(row.period);
    }

    return row[key] ?? "—";
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/70">Loading analytics...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statTiles.map((tile) => (
              <StatTile key={tile.title} {...tile} />
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-[#2B2A28] rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Filter by</span>
              </div>
              <select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.asset_id} value={vehicle.asset_id}>
                    {vehicle.asset_name} ({vehicle.plate_number})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Filter by</span>
              </div>
              {/* <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
              >
                <option>summary</option>
                <option>top-assets</option>
                <option>top-locations</option>
                <option>service-breakdown</option>
                <option>trends</option>
                <option>driver-stats</option>
                <option>payment-methods</option>
              </select> */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
              >
                <option value="trends">trends</option>
                <option value="summary">summary</option>
                <option value="top-assets">top-assets</option>
                <option value="top-locations">top-locations</option>
                <option value="service-breakdown">service-breakdown</option>
                <option value="driver-stats">driver-stats</option>
                <option value="payment-methods">payment-methods</option>
              </select>
            </div>

            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ExternalLink className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {/* Chart */}
          <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Vehicle Monthly Spend</h2>
              <div className="flex items-center gap-3">
                <select
                  value={chartView}
                  onChange={(e) =>
                    setChartView(e.target.value as "day" | "week" | "month")
                  }
                  className="bg-[#3B3835] text-white rounded-lg px-3 py-1.5 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
                >
                  <option value="month">Monthly</option>
                  <option value="week">Weekly</option>
                  <option value="day">Daily</option>
                </select>
                <select
                  value={chartYear}
                  onChange={(e) => setChartYear(e.target.value)}
                  className="bg-[#3B3835] text-white rounded-lg px-3 py-1.5 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
                >
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="period"
                  stroke="#ffffff50"
                  tick={{ fill: "#ffffff70", fontSize: 12 }}
                />
                <YAxis
                  stroke="#ffffff50"
                  tick={{ fill: "#ffffff70", fontSize: 12 }}
                  tickFormatter={(value) => `₦${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#3B3835",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar
                  dataKey="amount"
                  fill="#FF8500"
                  radius={[4, 4, 0, 0]}
                  name="Total Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Transaction History</h2>
            </div>

            {/* Table Header */}
            {/* <div className="px-6 py-4 bg-[#262422]">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
                <div>Period</div>
                <div>Vehicle</div>
                <div>Orders Count</div>
                <div className="text-right">Total Amount</div>
              </div>
            </div> */}

            <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70 px-5">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={col.align === "right" ? "text-right" : ""}
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {/* <div className="divide-y divide-white/5">
              {tableData.map((item: any, index: number) => {
                const uniqueKey = `${item.period}-${
                  item.asset_id || "all"
                }-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    className="px-6 py-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-sm text-white/90">
                        {formatDate(item.period)}
                      </div>
                      <div className="text-sm font-medium">
                        {item.asset_name || "All Vehicles"}
                      </div>
                      <div className="text-sm text-white/80">
                        {item.orders_count}{" "}
                        {item.orders_count === 1 ? "order" : "orders"}
                      </div>
                      <div className="text-sm font-semibold text-right">
                        {formatCurrency(item.total_amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
            {rows.map((row: any, idx: number) => (
              <div
                key={idx}
                className="px-6 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className={`text-sm ${
                        col.align === "right" ? "text-right font-semibold" : ""
                      }`}
                    >
                      {renderCellValue(col.key, row)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {tableData.length === 0 && (
              <div className="px-6 py-16 text-center">
                {/* <p className="text-white/50">No transactions found</p> */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function getTableConfig(type: string, analysisData: any) {
  switch (type) {
    case "trends":
      return {
        rows: analysisData?.data || [],
        columns: [
          { key: "period", label: "Period" },
          { key: "asset_name", label: "Vehicle" },
          { key: "orders_count", label: "Orders" },
          { key: "total_amount", label: "Total Amount", align: "right" },
        ],
      };

    case "summary":
      return {
        rows: analysisData?.summary ? [analysisData.summary] : [],
        columns: [
          { key: "total_orders", label: "Total Orders" },
          { key: "total_spent", label: "Total Spent" },
          { key: "avg_order_value", label: "Avg Order Value" },
          { key: "active_assets", label: "Active Assets" },
        ],
      };

    case "top-assets":
      return {
        rows: analysisData?.top_assets || [],
        columns: [
          { key: "asset_name", label: "Asset" },
          { key: "plate_number", label: "Plate" },
          { key: "total_orders", label: "Orders" },
          { key: "total_amount", label: "Total Amount", align: "right" },
        ],
      };

    case "top-locations":
      return {
        rows: analysisData?.top_locations || [],
        columns: [
          { key: "location_name", label: "Location" },
          { key: "visit_count", label: "Visits" },
          { key: "total_spent", label: "Total Spent", align: "right" },
        ],
      };

    case "service-breakdown":
      return {
        rows: analysisData?.service_breakdown || [],
        columns: [
          { key: "service_type", label: "Service" },
          { key: "order_count", label: "Orders" },
          { key: "total_amount", label: "Total Amount", align: "right" },
        ],
      };

    case "driver-stats":
      return {
        rows: analysisData?.driver_stats || [],
        columns: [
          { key: "driver_name", label: "Driver" },
          { key: "order_count", label: "Orders" },
          { key: "total_amount", label: "Total Amount", align: "right" },
        ],
      };

    case "payment-methods":
      return {
        rows: analysisData?.payment_methods || [],
        columns: [
          { key: "payment_method", label: "Method" },
          { key: "usage_count", label: "Usage Count" },
          { key: "total_amount", label: "Total Amount", align: "right" },
        ],
      };

    default:
      return { rows: [], columns: [] };
  }
}

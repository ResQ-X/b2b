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
  MapPin,
  Users,
  CreditCard,
  Wrench,
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
  PieChart,
  Pie,
  Cell,
  Legend,
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

const CHART_COLORS = ["#FF8500", "#FFA940", "#FFC266", "#FFD699", "#FFE5B3"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterType, setFilterType] = useState("summary");
  const [chartView, setChartView] = useState<"day" | "week" | "month">("month");
  const [chartYear, setChartYear] = useState("2025");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [topAssetsData, setTopAssetsData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [chartAnalytics, setChartAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

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

  console.log("Chart Analytics Data:", vehicles);

  // Prepare chart data from API response
  const chartData =
    chartAnalytics?.data?.map((item: any) => ({
      period: formatPeriodForChart(item.period, chartView),
      amount: item.total_amount,
      orders: item.orders_count,
    })) || [];

  // Summary stats from summary endpoint
  const summary = summaryData?.summary || {};
  const totalSpending = summary.total_spent || 0;
  const totalOrders = summary.total_orders || 0;

  // Get highest spender from top assets
  const topAssets = topAssetsData?.top_assets || [];
  const highestSpender = topAssets[0];
  const highestSpenderName = highestSpender?.asset_name || "N/A";
  const highestSpenderAmount = highestSpender?.total_amount || 0;
  const highestSpenderPlate = highestSpender?.plate_number || "";

  const statTiles = [
    {
      title: "Total Spending",
      value: formatCurrency(totalSpending),
      subtitle: "All time",
      icon: Car,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      subtitle: `${totalOrders} orders`,
      icon: TrendingUp,
    },
    {
      title: "Highest Spender",
      value: highestSpenderName,
      subtitle: highestSpenderPlate
        ? `${highestSpenderPlate} - ${formatCurrency(highestSpenderAmount)}`
        : formatCurrency(highestSpenderAmount),
      icon: Award,
    },
  ];

  // Fetch vehicles list for filter dropdown and top assets for stat tiles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params: { type: "top-assets" } }
        );
        const topAssetsResponse = response.data.data;
        setTopAssetsData(topAssetsResponse);
        setVehicles(topAssetsResponse.top_assets || []);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch transactions separately
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await axiosInstance.get("/fleet-wallet/transactions", {
          params: { page: 1, limit: 20, sort: "DESC" },
        });
        setTransactions(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Fetch analytics data based on filters
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Build query params based on filters
        const params: any = {
          type: filterType,
        };

        if (filterVehicle && filterVehicle !== "") {
          params.asset_id = filterVehicle;
        }

        // Fetch the selected analytics type
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params }
        );
        setAnalysisData(response.data.data);

        // Always fetch summary for stat tiles
        const summaryResponse = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params: { type: "summary", asset_id: filterVehicle || undefined } }
        );
        setSummaryData(summaryResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [filterVehicle, filterType]);

  // Determine if we should show chart or cards based on data type
  const shouldShowChart = filterType === "trends" && chartData.length > 0;
  const shouldShowPieChart =
    (filterType === "service-breakdown" || filterType === "payment-methods") &&
    analysisData &&
    (analysisData.service_breakdown?.length > 0 ||
      analysisData.payment_methods?.length > 0);

  function renderCellValue(key: string, row: any) {
    if (
      key === "total_amount" ||
      key.includes("spent") ||
      key.includes("amount") ||
      key === "avg_order_value"
    ) {
      return formatCurrency(row[key] || 0);
    }

    if (key === "period") {
      return formatDate(row.period);
    }

    if (key === "percentage") {
      return `${(row[key] || 0).toFixed(1)}%`;
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
                <span className="text-sm text-white/70">View</span>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
              >
                <option value="summary">Summary</option>
                <option value="trends">Trends</option>
                <option value="top-assets">Top Assets</option>
                <option value="top-locations">Top Locations</option>
                <option value="service-breakdown">Service Breakdown</option>
                <option value="driver-stats">Driver Stats</option>
                <option value="payment-methods">Payment Methods</option>
              </select>

              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Vehicle</span>
              </div>
              <div className="relative inline-block w-auto">
                {" "}
                {/* 1. Add relative positioning to the wrapper */}
                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                  className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500] appearance-none pr-10"
                >
                  <option value="">All Vehicles</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.asset_id} value={vehicle.asset_id}>
                      {vehicle.asset_name} ({vehicle.plate_number})
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

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
              <div className="relative inline-block w-auto">
                {" "}
                {/* Make the wrapper relative and fit content */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500] appearance-none pr-10"
                >
                  <option value="trends">trends</option>
                  <option value="summary">summary</option>
                  <option value="top-assets">top-assets</option>
                  <option value="top-locations">top-locations</option>
                  <option value="service-breakdown">service-breakdown</option>
                  <option value="driver-stats">driver-stats</option>
                  <option value="payment-methods">payment-methods</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ExternalLink className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {/* Conditional Chart/Visualization */}
          {shouldShowChart && (
            <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Spending Trends</h2>
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
          )}

          {shouldShowPieChart && (
            <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-6">
                {filterType === "service-breakdown"
                  ? "Service Distribution"
                  : "Payment Methods"}
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={
                      filterType === "service-breakdown"
                        ? analysisData.service_breakdown?.map((item: any) => ({
                          name: item.service_type || "Unknown",
                          value: item.order_count,
                        }))
                        : analysisData.payment_methods?.map((item: any) => ({
                          name: item.payment_method || "Unknown",
                          value: item.usage_count,
                        }))
                    }
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(filterType === "service-breakdown"
                      ? analysisData.service_breakdown
                      : analysisData.payment_methods
                    )?.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Data Display */}
          {renderDataView(filterType, analysisData, renderCellValue)}

          {/* Transaction History - Always visible */}
          <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden mt-6">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
            </div>

            {transactionsLoading ? (
              <div className="px-6 py-16 text-center">
                <p className="text-white/50">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-white/50">No transactions found</p>
              </div>
            </div> */}

            <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70 px-5 m-5">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={col.align === "right" ? "text-right" : ""}
                >
                  {col.label}
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
                className="px-10 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  {columns.map((col) => (
                    <div
                      key={txn.id}
                      className="px-6 py-5 hover:bg-white/5 transition-colors"
                    >
                      <div className="grid grid-cols-6 gap-4 items-center">
                        <div className="text-sm text-white/90">
                          {new Date(txn.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm font-medium">
                          {txn.type || "—"}
                        </div>
                        <div className="text-sm text-white/80 truncate">
                          {txn.description || txn.reference || "—"}
                        </div>
                        <div className="text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${txn.status === "COMPLETED" || txn.status === "SUCCESS"
                              ? "bg-green-500/20 text-green-400"
                              : txn.status === "PENDING"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {txn.status || "—"}
                          </span>
                        </div>
                        <div
                          className={`text-sm font-semibold text-right ${txn.type === "CREDIT" || txn.type === "TOP_UP"
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                        >
                          {txn.type === "CREDIT" || txn.type === "TOP_UP" ? "+" : "-"}
                          {formatCurrency(Math.abs(txn.amount || 0))}
                        </div>
                        <div className="text-sm text-white/80 text-right">
                          {formatCurrency(txn.balanceAfter || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function renderDataView(
  type: string,
  analysisData: any,
  renderCellValue: (key: string, row: any) => any
) {
  switch (type) {
    case "summary":
      return renderSummaryCards(analysisData?.summary);
    case "trends":
      return renderTrendsTable(analysisData?.data || [], renderCellValue);
    case "top-assets":
      return renderTopAssetsTable(
        analysisData?.top_assets || [],
        renderCellValue
      );
    case "top-locations":
      return renderTopLocationsTable(
        analysisData?.top_locations || [],
        renderCellValue
      );
    case "service-breakdown":
      return renderServiceBreakdownTable(
        analysisData?.service_breakdown || [],
        renderCellValue
      );
    case "driver-stats":
      return renderDriverStatsTable(
        analysisData?.driver_stats || [],
        renderCellValue
      );
    case "payment-methods":
      return renderPaymentMethodsTable(
        analysisData?.payment_methods || [],
        renderCellValue
      );
    default:
      return null;
  }
}

function renderSummaryCards(summary: any) {
  if (!summary) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No summary data available</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: summary.total_orders || 0,
      icon: TrendingUp,
    },
    {
      label: "Total Spent",
      value: formatCurrency(summary.total_spent || 0),
      icon: Car,
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(summary.avg_order_value || 0),
      icon: Award,
    },
    {
      label: "Total Fuel Volume",
      value: `${summary.total_fuel_volume || 0}L`,
      icon: Car,
    },
    {
      label: "Active Assets",
      value: summary.active_assets || 0,
      icon: Car,
    },
    {
      label: "Active Drivers",
      value: summary.active_drivers || 0,
      icon: Users,
    },
    {
      label: "Unique Locations",
      value: summary.unique_locations || 0,
      icon: MapPin,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">{card.label}</span>
            <card.icon className="h-5 w-5 text-[#FF8500]" />
          </div>
          <div className="text-2xl font-semibold">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

function renderTrendsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No trends data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Transaction History</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
          <div>Period</div>
          <div>Vehicle</div>
          <div>Orders</div>
          <div className="text-right">Total Amount</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="text-sm text-white/90">
                {renderCellValue("period", item)}
              </div>
              <div className="text-sm font-medium">
                {item.asset_name || "All Vehicles"}
              </div>
              <div className="text-sm text-white/80">{item.orders_count}</div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTopAssetsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No assets data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Top Assets</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-white/70">
          <div>Asset Name</div>
          <div>Plate Number</div>
          <div>Orders</div>
          <div>Fuel Volume</div>
          <div className="text-right">Total Amount</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-sm font-medium">{item.asset_name}</div>
              <div className="text-sm text-white/80">{item.plate_number}</div>
              <div className="text-sm text-white/80">{item.total_orders}</div>
              <div className="text-sm text-white/80">
                {item.total_fuel_volume}L
              </div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTopLocationsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No locations data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Top Locations</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
          <div className="col-span-2">Location</div>
          <div>Visits</div>
          <div className="text-right">Total Spent</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="text-sm font-medium col-span-2 truncate">
                {item.location_name}
              </div>
              <div className="text-sm text-white/80">{item.visit_count}</div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_spent)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderServiceBreakdownTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">
          No service breakdown data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Service Breakdown</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-white/70">
          <div>Service Type</div>
          <div>Orders</div>
          <div>Percentage</div>
          <div>Avg Amount</div>
          <div className="text-right">Total Amount</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-sm font-medium">
                {item.service_type || "Unknown"}
              </div>
              <div className="text-sm text-white/80">{item.order_count}</div>
              <div className="text-sm text-white/80">
                {renderCellValue("percentage", item)}
              </div>
              <div className="text-sm text-white/80">
                {formatCurrency(item.avg_amount)}
              </div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderDriverStatsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">
          No driver stats data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Driver Statistics</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-white/70">
          <div>Driver Name</div>
          <div>Orders</div>
          <div>Assets Used</div>
          <div>Fuel Volume</div>
          <div className="text-right">Total Spent</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-sm font-medium">
                {item.driver_name || "Unknown"}
              </div>
              <div className="text-sm text-white/80">{item.order_count}</div>
              <div className="text-sm text-white/80">{item.assets_used}</div>
              <div className="text-sm text-white/80">
                {item.total_fuel_volume}L
              </div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_spent)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderPaymentMethodsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">
          No payment methods data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
          <div>Payment Method</div>
          <div>Usage Count</div>
          <div>Percentage</div>
          <div className="text-right">Total Amount</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="text-sm font-medium">
                {item.payment_method || "Unknown"}
              </div>
              <div className="text-sm text-white/80">{item.usage_count}</div>
              <div className="text-sm text-white/80">
                {renderCellValue("percentage", item)}
              </div>
              <div className="text-sm font-semibold text-right">
                {formatCurrency(item.total_amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

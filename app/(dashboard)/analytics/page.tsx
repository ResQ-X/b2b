"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Filter,
  ExternalLink,
  Car,
  TrendingUp,
  Award,
  MapPin,
  Users,
} from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import { TransactionDetailsModal } from "@/components/dashboard/TransactionDetailsModal";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
  LineChart,
  Line,
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
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [chartAnalytics, setChartAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Get highest spender from summary
  const highestSpender = summary.highest_spender || {};
  const highestSpenderName = highestSpender.asset_name || "N/A";
  const highestSpenderAmount = highestSpender.amount || 0;
  const highestSpenderPlate = highestSpender.plate_number || "";

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

  // Fetch vehicles list for filter dropdown
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics",
          { params: { type: "top-assets" } }
        );
        const topAssetsResponse = response.data.data;
        setVehicles(topAssetsResponse.top_assets || []);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterVehicle]);

  // Fetch transactions separately
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);

        const endpoint =
          filterVehicle && filterVehicle !== ""
            ? `/fleet-order-logging/asset/${filterVehicle}`
            : "/fleet-order-logging/my";

        const response = await axiosInstance.get(endpoint, {
          params: { page: currentPage, limit: 40 },
        });
        setTransactions(response.data.data || []);
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, filterVehicle]);

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

  const shouldShowChart = filterType === "trends" && chartData.length > 0;

  // Render Chart Content based on filter type
  const renderChartContent = () => {
    if (!analysisData) {
      if (filterType === "summary") return null;
      // return <div className="text-white/50 py-4">Loading chart data...</div>;
    }

    if (filterType === "summary") return null;

    let chartTitle = "Analytics";
    let ChartComponent = null;

    switch (filterType) {
      case "trends":
        chartTitle = "Spending Trends";
        ChartComponent = (
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
        );
        break;

      case "top-assets":
        chartTitle = "Top Assets by Spending";
        const topAssetsChartData = analysisData?.top_assets?.slice(0, 10).map((item: any) => ({
          name: item.asset_name,
          value: item.total_amount,
        })) || [];

        ChartComponent = (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topAssetsChartData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} tickFormatter={(value) => `₦${value / 1000}k`} />
              <YAxis dataKey="name" type="category" width={100} stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#3B3835", border: "1px solid #ffffff20", borderRadius: "8px", color: "#fff" }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="value" fill="#FF8500" radius={[0, 4, 4, 0]} name="Total Amount" />
            </BarChart>
          </ResponsiveContainer>
        );
        break;

      case "top-locations":
        chartTitle = "Top Locations by Visits";
        const topLocationsChartData = analysisData?.top_locations?.slice(0, 10).map((item: any) => ({
          name: item.location_name?.split(',')[0] || "Unknown", // Truncate long addresses
          value: item.visit_count,
        })) || [];

        ChartComponent = (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topLocationsChartData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={120} stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#3B3835", border: "1px solid #ffffff20", borderRadius: "8px", color: "#fff" }}
              />
              <Bar dataKey="value" fill="#FF8500" radius={[0, 4, 4, 0]} name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        );
        break;

      case "odometer-trends":
        chartTitle = "Odometer Trends";
        const odoTrendsData = analysisData?.trends?.map((item: any) => ({
          period: formatPeriodForChart(item.period, chartView),
          value: item.avg_reading || item.reading || 0
        })) || []; // Assuming structure, adjust as needed

        if (odoTrendsData.length === 0) return null;

        ChartComponent = (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={odoTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="period" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} />
              <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#3B3835", border: "1px solid #ffffff20", borderRadius: "8px", color: "#fff" }}
              />
              <Line type="monotone" dataKey="value" stroke="#FF8500" strokeWidth={2} name="Reading" />
            </LineChart>
          </ResponsiveContainer>
        );
        break;

      case "service-breakdown":
      case "payment-methods":
        chartTitle = filterType === "service-breakdown" ? "Service Distribution" : "Payment Methods";
        const pieData = filterType === "service-breakdown"
          ? analysisData?.service_breakdown?.map((item: any) => ({
            name: item.service_type || "Unknown",
            value: item.order_count,
          }))
          : analysisData?.payment_methods?.map((item: any) => ({
            name: item.payment_method || "Unknown",
            value: item.usage_count,
          }));

        if (!pieData || pieData.length === 0) return null;

        ChartComponent = (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{chartTitle}</h2>
          {filterType === "trends" && (
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
          )}
        </div>
        {ChartComponent}
      </div>
    );
  };

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
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/70">View</span>
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#3B3835] text-white rounded-lg pl-4 pr-10 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500] appearance-none"
                  >
                    <option value="summary">Summary</option>
                    <option value="trends">Trends</option>
                    <option value="top-assets">Top Assets</option>
                    <option value="top-locations">Top Locations</option>
                    <option value="service-breakdown">Service Breakdown</option>
                    <option value="driver-stats">Driver Stats</option>
                    <option value="odometer-stats">Odometer Stats</option>
                    <option value="odometer-trends">Odometer Trends</option>
                    <option value="payment-methods">Payment Methods</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">

                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/70">Vehicle</span>
                </div>
                <div className="relative">
                  <select
                    value={filterVehicle}
                    onChange={(e) => setFilterVehicle(e.target.value)}
                    className="bg-[#3B3835] text-white rounded-lg pl-4 pr-10 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500] appearance-none"
                  >
                    <option value="">All Vehicles</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.asset_id} value={vehicle.asset_id}>
                        {vehicle.asset_name} ({vehicle.plate_number})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              {/* <ExternalLink className="h-5 w-5 text-white/70" /> */}
            </button>
          </div>

          {/* Conditional Chart/Visualization */}
          {renderChartContent()}

          {/* Data Display */}
          {renderDataView(filterType, analysisData, renderCellValue)}

          {/* Transaction History - Always visible */}
          <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden mt-6">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
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
            ) : (
              <>
                <div className="px-6 py-4 bg-[#262422]">
                  <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-white/70">
                    <div>Date</div>
                    <div>Service</div>
                    <div className="col-span-2">Location</div>
                    <div className="text-right">Amount</div>
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {transactions.map((txn: any) => (
                    <div
                      key={txn.id}
                      onClick={() => {
                        setSelectedTransaction(txn);
                        setIsModalOpen(true);
                      }}
                      className="px-6 py-5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="text-sm text-white/90">
                          {new Date(
                            txn.fulfilled_at || txn.created_at
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          <div className="text-xs text-white/50 mt-1">
                            {txn.status}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {txn.service_type || "—"}
                        </div>
                        <div className="text-sm text-white/80 col-span-2 truncate">
                          {txn.location_name || "—"}
                        </div>
                        <div className="text-sm font-semibold text-right">
                          {formatCurrency(Number(txn.amount) || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-sm text-white/50">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-[#3B3835] text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-[#3B3835] text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
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
    case "odometer-stats":
      return renderOdometerStatsTable(
        analysisData?.odometer_stats || [],
        renderCellValue
      );
    case "odometer-trends":
      return renderOdometerTrendsTable(
        analysisData?.trends || [],
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

function renderOdometerStatsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No odometer stats available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Odometer Stats</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
          <div>Asset ID</div>
          <div>Reading</div>
          <div>Date</div>
          <div className="text-right">Total Distance</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="text-sm font-medium">{item.asset_id || "—"}</div>
              <div className="text-sm text-white/80">
                {item.reading ? `${item.reading} km` : "—"}
              </div>
              <div className="text-sm text-white/80">
                {renderCellValue("period", item)}
              </div>
              <div className="text-sm font-semibold text-right">
                {item.distance ? `${item.distance} km` : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderOdometerTrendsTable(data: any[], renderCellValue: any) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#2B2A28] rounded-2xl p-6 border border-white/10">
        <p className="text-white/50 text-center">No odometer trends data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Odometer History</h2>
      </div>

      <div className="px-6 py-4 bg-[#262422]">
        <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-white/70">
          <div>Period</div>
          <div>Reading</div>
          <div className="text-right">Change</div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-white/5 transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm text-white/90">
                {renderCellValue("period", item)}
              </div>
              <div className="text-sm font-medium">
                {item.reading ? `${item.reading} km` : "—"}
              </div>
              <div className="text-sm text-white/80 text-right">
                {item.change ? `${item.change > 0 ? '+' : ''}${item.change} km` : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
      label: "Odometer Records",
      value: summary.odometer_records || 0,
      icon: Car,
    },
    {
      label: "Avg Odometer",
      value: summary.avg_odometer || 0,
      icon: Car,
    },
    {
      label: "Max Odometer",
      value: summary.max_odometer || 0,
      icon: Car,
    },
    {
      label: "Min Odometer",
      value: summary.min_odometer || 0,
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

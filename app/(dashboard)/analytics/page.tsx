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

const mockChartData = [
  { day: "Mon", spent: 500000, other: 400000 },
  { day: "Tue", spent: 0, other: 400000 },
  { day: "Wed", spent: 0, other: 250000 },
  { day: "Thu", spent: 350000, other: 0 },
  { day: "Fri", spent: 550000, other: 0 },
  { day: "Sat", spent: 0, other: 250000 },
  { day: "Sun", spent: 600000, other: 0 },
];

const mockTransactions = [
  {
    id: "1",
    date: "2025-11-20",
    vehicle: "ABC-123-XY",
    description: "Fuel purchase",
    amount: 15000,
  },
  {
    id: "2",
    date: "2025-11-20",
    vehicle: "ABC-123-XY",
    description: "Replace Headlights",
    amount: 10000,
  },
  {
    id: "3",
    date: "2024-11-20",
    vehicle: "ABC-123-XY",
    description: "Fuel purchase",
    amount: 15000,
  },
];

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
  const [filterVehicle, setFilterVehicle] = useState("All Vehicles");
  const [filterMonth, setFilterMonth] = useState("November");
  const [chartView, setChartView] = useState("Monthly");
  const [chartYear, setChartYear] = useState("2025");
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Summary stats
  const totalSpending = analysisData?.totals?.total_amount || 0;
  const totalVehicles = analysisData?.totals?.total_count || 0;
  const highestSpender = "GHI-789-UV";
  // const totalVehicles = 40;
  const highestSpenderAmount = 62200;

  const statTiles = [
    {
      title: "Total Spending",
      value: formatCurrency(totalSpending),
      subtitle: "This month",
      icon: Car,
    },
    {
      title: "Total Vehicles",
      value: totalVehicles,
      subtitle: `${totalVehicles} vehicles`,
      icon: TrendingUp,
    },
    {
      title: "Highest Spender",
      value: highestSpender,
      subtitle: formatCurrency(highestSpenderAmount),
      icon: Award,
    },
  ];

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/fleet-order-logging/analytics"
        );
        setAnalysisData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  console.log("Analysis Data:", analysisData);

  return (
    <div className="space-y-6">
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
            <option>All Vehicles</option>
            <option>ABC-123-XY</option>
            <option>GHI-789-UV</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/70">Filter by</span>
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-[#3B3835] text-white rounded-lg px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
          >
            <option>November</option>
            <option>October</option>
            <option>September</option>
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
              onChange={(e) => setChartView(e.target.value)}
              className="bg-[#3B3835] text-white rounded-lg px-3 py-1.5 text-sm border border-white/10 focus:outline-none focus:border-[#FF8500]"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
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
          <BarChart data={mockChartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="day"
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
            <Bar dataKey="spent" fill="#FF8500" radius={[4, 4, 0, 0]} />
            <Bar dataKey="other" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>

        {/* Table Header */}
        <div className="px-6 py-4 bg-[#262422]">
          <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white/70">
            <div>Date</div>
            <div>Vehicle</div>
            <div>Description</div>
            <div className="text-right">Amount</div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/5">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="px-6 py-5 hover:bg-white/5 transition-colors"
            >
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-sm text-white/90">
                  {formatDate(tx.date)}
                </div>
                <div className="text-sm font-medium">{tx.vehicle}</div>
                <div className="text-sm text-white/80">{tx.description}</div>
                <div className="text-sm font-semibold text-right">
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockTransactions.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-white/50">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

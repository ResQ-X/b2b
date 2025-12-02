"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { ArrowLeft } from "lucide-react";

type LogItem = {
  id: string;
  order_id: string;
  status: string;
  location_name: string;
  fuel_volume: string;
  amount: string;
  items: {
    fuel_type: string;
    litres: number;
  };
  metadata?: {
    notes?: string;
  };
  created_at: string;
};

export default function Page() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);

  async function fetchLogs() {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/fleet-order-logging/my");
      setLogs(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatCurrency = (n: string) =>
    `₦${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="black"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>
      <h1 className="text-xl font-semibold">My Service Logs</h1>

      <div className="bg-[#2B2A28] rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#262422]">
          <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-white/70">
            <div>Order ID</div>
            <div>Fuel Type</div>
            <div>Litres</div>
            <div>Amount</div>
            <div>Location</div>
            <div>Status</div>
            <div className="text-right">Date</div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-6 py-10 text-center text-white/60">
            Loading logs…
          </div>
        )}

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-white/50">No logs found</p>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {!loading &&
            logs.map((item) => (
              <div
                key={item.id}
                className="px-6 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div className="text-sm text-white/90 truncate">
                    {item.order_id.slice(0, 10)}...
                  </div>

                  <div className="text-sm font-medium">
                    {item.items?.fuel_type}
                  </div>

                  <div className="text-sm text-white/80">
                    {item.items?.litres}L
                  </div>

                  <div className="text-sm font-semibold">
                    {formatCurrency(item.amount)}
                  </div>

                  <div className="text-sm text-white/70 truncate">
                    {item.location_name}
                  </div>

                  <div className="text-sm capitalize text-white/80">
                    {item.status}
                  </div>

                  <div className="text-sm text-right text-white/70">
                    {formatDate(item.created_at)}
                  </div>
                </div>

                {/* Notes */}
                {item.metadata?.notes && (
                  <p className="mt-2 text-xs text-white/50">
                    Note: {item.metadata.notes}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

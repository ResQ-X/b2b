/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";
import { StatTile } from "@/components/dashboard/StatTile";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function MaintenancePage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          "/admin/get_dashboard_metrics"
        );
        setMetrics(data.data);
      } catch {
        // mock fallback so the page renders
        setMetrics({
          active_order_count: 0,
          professionals: 0,
          active_order: [],
        });
      }
    })();
  }, []);

  if (!metrics) return <Loader />;

  const tiles = [
    {
      title: "Emergencies Resolved",
      value: "16",
      sub: "This month",
      icon: Wallet,
    },
    {
      title: "Avg Service Time",
      value: "18 min",
      sub: "Industry avg: 4 days",
      icon: Wallet,
    },
    {
      title: "Saved on Towing",
      value: "₦200k",
      sub: "With bundle discount",
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top tiles */}
      <div className="grid lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <StatTile key={t.title} {...t} />
        ))}
      </div>

      {/* Request Emergency Service */}
      <RequestEmergencyServiceCard />

      {/* Service History */}
      <ServiceHistoryList
        items={[
          {
            title: "LND-234-CC - Flat Tire",
            subtitle: "Lekki-Epe Expressway • 2 hours ago",
            status: "Completed",
          },
          {
            title: "LND-789-DD - Jump Start",
            subtitle: "Victoria Island • Yesterday",
            status: "Completed",
          },
          {
            title: "LND-451-AA - Fuel Delivery",
            subtitle: "Third Mainland Bridge • 3 days ago",
            status: "Completed",
          },
        ]}
      />
    </div>
  );
}

/* ---------------- types ---------------- */
interface DashboardMetrics {
  active_order_count: number;
  professionals: number;
  active_order: unknown[];
  wallet_balance?: number;
}

/* ---------------- local components to match design ---------------- */

function RequestEmergencyServiceCard() {
  const [form, setForm] = useState({
    vehicle: "",
    service: "",
    location: "",
  });

  const canSubmit = form.vehicle && form.service && form.location;

  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-2xl font-semibold mb-6">Request Emergency Service</h3>

      <div className="space-y-5">
        <Field label="Select Vehicle">
          <Select
            value={form.vehicle}
            onValueChange={(v) => setForm((p) => ({ ...p, vehicle: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="LND-234-CC">LND-234-CC</SelectItem>
              <SelectItem value="LND-789-DD">LND-789-DD</SelectItem>
              <SelectItem value="LND-451-AA">LND-451-AA</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Service Needed">
          <Select
            value={form.service}
            onValueChange={(v) => setForm((p) => ({ ...p, service: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="flat-tire">Flat Tire</SelectItem>
              <SelectItem value="jump-start">Jump Start</SelectItem>
              <SelectItem value="fuel-delivery">Fuel Delivery</SelectItem>
              <SelectItem value="towing">Towing</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Location">
          <Select
            value={form.location}
            onValueChange={(v) => setForm((p) => ({ ...p, location: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="lekki-epe">Lekki-Epe Expressway</SelectItem>
              <SelectItem value="vi">Victoria Island</SelectItem>
              <SelectItem value="third-mainland">
                Third Mainland Bridge
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Button
          disabled={!canSubmit}
          className="w-full h-[48px] bg-[#FF8500] hover:bg-[#ff9a33] rounded-xl mt-2 disabled:opacity-50"
        >
          Request Service
        </Button>
      </div>
    </div>
  );
}

function ServiceHistoryList({
  items,
}: {
  items: Array<{
    title: string;
    subtitle: string;
    status: "Completed" | "In Progress" | "Pending";
  }>;
}) {
  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Service History</h3>
      <ul className="">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-white/70">{it.subtitle}</div>
            </div>
            <StatusPill status={it.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- tiny UI helpers ---------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80">{label}</Label>
      {children}
    </div>
  );
}

function Trigger() {
  return (
    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-[#2D2A27] text-white">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
  );
}

function StatusPill({
  status,
}: {
  status: "Completed" | "In Progress" | "Pending";
}) {
  const map = {
    Completed: {
      bg: "#9BFF95",
      text: "#005800",
      // dot: "bg-emerald-400",
    },
    "In Progress": {
      bg: "bg-indigo-400/20",
      text: "text-indigo-300",
      // dot: "bg-indigo-400",
    },
    Pending: {
      bg: "bg-yellow-400/20",
      text: "text-yellow-300",
      // dot: "bg-yellow-400",
    },
  } as const;
  const c = map[status] ?? map.Pending;
  return (
    <span
      className={`bg-[#9BFF95] text-[#005800] inline-flex items-center gap-2 px-3 py-1 rounded-[8px] ${c.bg} ${c.text} text-sm`}
    >
      {/* <span className={`h-2 w-2 rounded-full ${c.dot}`} /> */}
      {status}
    </span>
  );
}

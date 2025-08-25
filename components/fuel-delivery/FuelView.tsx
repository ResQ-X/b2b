"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import type { Order } from "@/components/fuel-delivery/FuelTable";

interface FuelViewProps {
  fuel: Order;
  onEdit?: () => void;
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

export function FuelView({ fuel }: FuelViewProps) {
  const router = useRouter();

  return (
    <div className="bg-[#242220] w-full space-y-8 text-white">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="black"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>

      {/* Title + Meta */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
      </div>

      <div className="space-y-2">
        <div className="text-white/80">
          Order ID:&nbsp;
          <span className="font-medium">#{fuel.id.replace(/^#/, "")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70">Status:</span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  fuel.status === "Completed"
                    ? "#22C55E"
                    : fuel.status === "In Progress"
                    ? "#8B8CF6"
                    : "#FACC15",
              }}
            />
            <span className="text-white/90">
              {fuel.status === "In Progress" ? "In Transit" : fuel.status}
            </span>
          </span>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Labeled value={fuel.vehicle} label="Vehicle" />
          <Labeled value={`${fuel.quantityL}L`} label="Quantity" />
          <Labeled value={fmtMoney(fuel.costNaira)} label="Total Cost" />

          <Labeled value={fmtDate(fuel.dateISO)} label="Order Date" />
          <Labeled value={fuel.location} label="Delivery Address" />
          <Labeled value={fmtDate(fuel.dateISO)} label="Delivery Date" />
          <Labeled value={fmtTime(fuel.dateISO)} label="Delivery Time" />
          <Labeled value={"128,476 km"} label="Odometer" />
        </div>
      </div>

      {/* ACTIVITY LOG */}
      <div className="bg-[#3B3835] space-y-4 p-2 rounded-[14px] mt-14">
        <h2 className="text-base lg:text-lg font-semibold">Activity Log</h2>
        <div className="rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#262422]">
              <tr>
                <Th>Time</Th>
                <Th>Activity</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <Tr
                time={`${fmtDate(fuel.dateISO)}, 08:00 AM`}
                activity="Order Placed"
                status="Confirmed"
              />
              <Tr
                time={`${fmtDate(fuel.dateISO)}, 11:30 AM`}
                activity="Order Processed"
                status={
                  fuel.status === "In Progress" ? "In Progress" : fuel.status
                }
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** ——— Small UI helpers to match the dark design ——— */
function Labeled({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/60">{label}</label>
      {/* Using your CustomInput; styled as dark pill boxes */}
      <CustomInput
        value={value}
        disabled
        className="bg-white/[0.06] border border-white/10 text-white rounded-xl h-11"
      />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left p-4 text-sm font-medium text-white/70">
      {children}
    </th>
  );
}

function Tr({
  time,
  activity,
  status,
}: {
  time: string;
  activity: string;
  status: string;
}) {
  return (
    <tr className="hover:bg-white/[0.03]">
      <td className="p-2 lg:p-4 text-sm">{time}</td>
      <td className="p-2 lg:p-4 text-sm">{activity}</td>
      <td className="p-2 lg:p-4 text-sm">{status}</td>
    </tr>
  );
}

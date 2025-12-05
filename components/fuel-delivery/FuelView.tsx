"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import type { FuelOrderDetail } from "@/types/fuel";

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

export function FuelView({ fuel }: { fuel: FuelOrderDetail }) {
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
                  fuel.status === "COMPLETED"
                    ? "#22C55E"
                    : fuel.status === "IN_PROGRESS"
                      ? "#8B8CF6"
                      : "#FACC15",
              }}
            />
            <span className="text-white/90">
              {fuel.status === "IN_PROGRESS"
                ? "In Transit"
                : fuel.status.charAt(0).toUpperCase() +
                fuel.status.slice(1).toLowerCase()}
            </span>
          </span>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Labeled
            value={
              fuel.assets && fuel.assets.length > 0
                ? fuel.assets.length > 1
                  ? `${fuel.assets.length} Assets`
                  : `${fuel.assets[0].asset_name} (${fuel.assets[0].plate_number})`
                : "N/A"
            }
            label="Vehicle(s)"
          />
          <Labeled value={`${fuel.quantity}L`} label="Quantity" />
          <Labeled
            value={fmtMoney(parseFloat(fuel.total_cost))}
            label="Total Cost"
          />

          <Labeled value={fmtDate(fuel.date_time)} label="Order Date" />
          <Labeled value={fuel.location} label="Delivery Address" />
          <Labeled value={fmtDate(fuel.date_time)} label="Delivery Date" />
          <Labeled value={fmtTime(fuel.date_time)} label="Delivery Time" />
          <Labeled value={"128,476 km"} label="Odometer" />
        </div>
      </div>

      {/* ASSETS TABLE */}
      <div className="bg-[#3B3835] rounded-[14px] overflow-hidden mt-14">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-base lg:text-lg font-semibold">Assets</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#262422] text-white/90 font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Asset Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Plate Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Fuel Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fuel.assets && fuel.assets.length > 0 ? (
                fuel.assets.map((assetItem) => (
                  <tr key={assetItem.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {assetItem.asset_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/80">
                      {assetItem.plate_number || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/80">
                      {assetItem.fuel_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/80">
                      {assetItem.capacity}L
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                    No asset information available.
                  </td>
                </tr>
              )}
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

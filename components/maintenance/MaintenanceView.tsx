"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CustomInput from "@/components/ui/CustomInput";
import type { Order } from "@/components/maintenance/MaintenanceTable";

interface MaintenanceViewProps {
  maintenance: Order;
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

export function MaintenanceView({ maintenance, onEdit }: MaintenanceViewProps) {
  const router = useRouter();

  const statusColor =
    maintenance.status === "Completed"
      ? "#22C55E"
      : maintenance.status === "In Progress"
      ? "#8B8CF6"
      : maintenance.status === "Scheduled"
      ? "#FACC15"
      : "#EF4444"; // Overdue

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
        <h1 className="text-2xl font-semibold">Service Details</h1>
      </div>

      <div className="space-y-2">
        <div className="text-white/80">
          Service ID:&nbsp;
          <span className="font-medium">
            #{maintenance.id.replace(/^#/, "")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70">Status:</span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <span className="text-white/90">{maintenance.status}</span>
          </span>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Labeled value={maintenance.vehicle} label="Vehicle" />
          <Labeled value={maintenance.serviceType} label="Service Type" />
          <Labeled
            value={`${maintenance.mileageKm.toLocaleString()}km`}
            label="Current Mileage"
          />
          <Labeled value={fmtDate(maintenance.dueDateISO)} label="Due Date" />
          <Labeled value={fmtMoney(maintenance.costNaira)} label="Cost" />
          <Labeled value={maintenance.status} label="Status" />
        </div>
      </div>

      {/* ACTIVITY LOG */}
      {/* <div className="bg-[#3B3835] space-y-4 p-6 rounded-[14px] mt-14">
        <h2 className="text-lg font-semibold">Activity Log</h2>
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
                time={`${fmtDate(maintenance.dueDateISO)} • 08:00 AM`}
                activity="Service Scheduled"
                status="Confirmed"
              />
              <Tr
                time={`${fmtDate(maintenance.dueDateISO)} • 11:30 AM`}
                activity={
                  maintenance.status === "Completed"
                    ? "Service Completed"
                    : maintenance.status === "In Progress"
                    ? "Service In Progress"
                    : maintenance.status === "Overdue"
                    ? "Service Overdue"
                    : "Awaiting Service"
                }
                status={maintenance.status}
              />
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Actions (optional) */}
      {onEdit && (
        <div className="flex justify-center gap-4">
          <Button
            variant="orange"
            onClick={onEdit}
            className="w-[224px] h-[48px] lg:h-[52px]"
          >
            Edit Service
          </Button>

          <Button variant="grey" className="w-[224px] h-[48px] lg:h-[52px]">
            Cancel Service
          </Button>
        </div>
      )}
    </div>
  );
}

/** ——— Small UI helpers to match the dark design ——— */
function Labeled({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/60">{label}</label>
      <CustomInput
        value={value}
        disabled
        className="bg-white/[0.06] border border-white/10 text-white rounded-xl h-11"
      />
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left p-4 text-sm font-medium text-white/70">
      {children}
    </th>
  );
}

export function Tr({
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
      <td className="p-4 text-sm">{time}</td>
      <td className="p-4 text-sm">{activity}</td>
      <td className="p-4 text-sm">{status}</td>
    </tr>
  );
}

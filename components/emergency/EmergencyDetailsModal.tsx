"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Truck,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
} from "lucide-react";

type Asset = {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype?: string;
  fuel_type?: string;
  capacity?: number;
  plate_number?: string;
};

type EmergencyDetails = {
  id: string;
  status: string;
  date_time: string;
  emergency_type: string;
  note?: string;
  location: string;
  location_longitude?: string;
  location_latitude?: string;
  to_location?: string | null;
  to_location_longitude?: string | null;
  to_location_latitude?: string | null;
  towing_method?: string;
  assets: Asset[];
  business_id: string;
  total_cost?: string;
  total_service_charge?: string;
  total_delivery_charge?: string;
  is_under_subscription?: boolean;
  created_at: string;
  updated_at: string;
  order_date: string;
};

function formatCurrency(amount: string | number) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${num.toLocaleString()}`;
}

function formatDateTime(dateTime: string) {
  const d = new Date(dateTime);
  return d.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatServiceType(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-white/70 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}

export default function EmergencyDetailsModal({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: EmergencyDetails | null;
}) {
  if (!service) return null;

  const isTowing = service.emergency_type === "TOWING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#1E1D1B] text-white p-6 md:p-8">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF8500]/20">
              <AlertTriangle className="h-6 w-6 text-[#FF8500]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                Emergency Service
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-400"
                      : service.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : service.status === "IN_PROGRESS"
                      ? "bg-blue-500/20 text-blue-400"
                      : service.status === "CANCELLED"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {service.status}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Service Details Section */}
          <div className="bg-[#2D2B29] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FF8500]" />
              Service Details
            </h3>
            <div className="space-y-1">
              <InfoRow
                label="Emergency Type"
                value={formatServiceType(service.emergency_type)}
              />
              {isTowing && service.towing_method && (
                <InfoRow
                  label="Towing Method"
                  value={formatServiceType(service.towing_method)}
                />
              )}
            </div>
          </div>

          {/* Vehicle(s) Section */}
          <div className="bg-[#2D2B29] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#FF8500]" />
              Vehicle{service.assets.length > 1 ? "s" : ""}
            </h3>
            <div className="space-y-2">
              {service.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 bg-[#3B3835] rounded-lg"
                >
                  <div>
                    <div className="font-medium">{asset.asset_name}</div>
                    <div className="text-sm text-white/70">
                      {asset.plate_number || "No plate number"}
                    </div>
                  </div>
                  <div className="text-right text-sm text-white/70">
                    <div>{formatServiceType(asset.asset_type)}</div>
                    {asset.fuel_type && (
                      <div>{formatServiceType(asset.fuel_type)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-[#2D2B29] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#FF8500]" />
              Location
            </h3>
            <div className="space-y-1">
              <InfoRow
                label={isTowing ? "Pickup Location" : "Service Location"}
                value={service.location}
              />
              {isTowing && service.to_location && (
                <InfoRow label="Drop-off Location" value={service.to_location} />
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-[#2D2B29] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FF8500]" />
              Schedule
            </h3>
            <div className="space-y-1">
              <InfoRow
                label="Service Time"
                value={formatDateTime(service.date_time)}
              />
              <InfoRow
                label="Order Date"
                value={formatDateTime(service.order_date)}
              />
            </div>
          </div>

          {/* Cost Breakdown Section */}
          {service.total_cost && (
            <div className="bg-[#2D2B29] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#FF8500]" />
                Cost Breakdown
              </h3>
              <div className="space-y-1">
                {service.total_service_charge && (
                  <InfoRow
                    label="Service Charge"
                    value={formatCurrency(service.total_service_charge)}
                  />
                )}
                {service.total_delivery_charge && (
                  <InfoRow
                    label="Delivery Charge"
                    value={formatCurrency(service.total_delivery_charge)}
                  />
                )}
                <div className="flex items-center justify-between py-2 border-t border-white/10 mt-2">
                  <span className="text-white font-semibold">Total Cost</span>
                  <span className="text-[#FF8500] font-bold text-lg">
                    {formatCurrency(service.total_cost)}
                  </span>
                </div>
                {service.is_under_subscription && (
                  <div className="mt-2 p-2 bg-green-500/10 rounded-lg">
                    <p className="text-green-400 text-sm text-center">
                      ✓ Covered by subscription
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {service.note && (
            <div className="bg-[#2D2B29] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
              <p className="text-white/80 text-sm">{service.note}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

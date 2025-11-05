"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ===================== Types ===================== */

export type OrderDetails = {
  serviceType: string;
  fuelType: string;
  quantity: number; // litres
  location: string;
  additionalNotes?: string;
};

type PaymentSummary = {
  fuelCost: number;
  serviceFee: number;
  totalAmount: number;
};

/* ===================== Helpers ===================== */

const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[#ABABAB] text-sm font-medium">{label}</span>
      <span className="text-[#ABABAB] text-sm font-medium">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-4">
      <h3 className="text-[#FFFFFF] text-[16px] font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

/* ===================== Main ===================== */

export default function FuelCheckoutModal({
  open,
  onOpenChange,
  onCheckout,
  orderDetails,
  title = "Checkout",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: (orderDetails: OrderDetails) => Promise<void> | void;
  orderDetails: OrderDetails;
  title?: string;
}) {
  const [processing, setProcessing] = React.useState(false);

  /* ------- Pricing (replace with real logic) ------- */
  const fuelPrices = { petrol: 1250, diesel: 1150, premium: 1400 }; // NGN / litre (example)
  const serviceFees = { delivery: 5000, emergency: 10000, scheduled: 3000 };

  const fuelPricePerLiter =
    fuelPrices[orderDetails.fuelType as keyof typeof fuelPrices] ?? 0;
  const serviceFee =
    serviceFees[orderDetails.serviceType as keyof typeof serviceFees] ?? 0;

  const fuelCost = orderDetails.quantity * fuelPricePerLiter;
  const totalAmount = fuelCost + serviceFee;

  const paymentSummary: PaymentSummary = {
    fuelCost,
    serviceFee,
    totalAmount,
  };

  /* ------- Handlers ------- */
  const handleCheckout = async () => {
    setProcessing(true);
    try {
      await onCheckout(orderDetails);
      onOpenChange(false);
    } catch (e) {
      console.error("Checkout error:", e);
    } finally {
      setProcessing(false);
    }
  };

  console.log("Rendering FuelCheckoutModal with:", {
    orderDetails,
    paymentSummary,
  });

  /* ===================== UI ===================== */

  // const handleSubmit = async (data: RequestFuelForm) => {
  //   try {
  //     const isManualLocation = data.location_id === "__manual__";

  //     const requestBody: any = {
  //       fuel_type: data.fuel_type,
  //       asset_ids: data.asset_ids,
  //       ...(isManualLocation ? {} : { location_id: data.location_id }),
  //       ...(isManualLocation
  //         ? {
  //             location_address: data.location_address || "",
  //             location_longitude: data.location_longitude || "",
  //             location_latitude: data.location_latitude || "",
  //           }
  //         : {}),
  //       time_slot:
  //         data.time_slot === "NOW" ? new Date().toISOString() : data.time_slot,
  //       quantity: data.quantity,
  //       note: data.note,
  //       is_scheduled: data.time_slot !== "NOW",
  //     };

  //     await axiosInstance.post(
  //       "/fleet-service/place-fuel-service",
  //       requestBody
  //     );
  //     toast.success("Fuel service requested successfully!");
  //   } catch (error) {
  //     // toast.error(`Failed to request fuel service. Please try again. ${error}`);
  //     toast.error(error.response.data.message);
  //     throw error;
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-11/12 lg:max-w-[640px]
          rounded-[28px]
          border border-white/10
          bg-[#1F1E1C] text-white
          p-7 md:p-9
          max-h-[90vh] overflow-y-auto overscroll-contain
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Section title="Order Summary">
            <div className="space-y-1">
              <SummaryRow
                label="Service Type"
                value={
                  orderDetails.serviceType
                    ? orderDetails.serviceType.charAt(0).toUpperCase() +
                      orderDetails.serviceType.slice(1)
                    : "-"
                }
              />
              <SummaryRow
                label="Fuel Type"
                value={
                  orderDetails.fuelType
                    ? orderDetails.fuelType.charAt(0).toUpperCase() +
                      orderDetails.fuelType.slice(1)
                    : "-"
                }
              />
              <SummaryRow
                label="Quantity"
                value={`${orderDetails.quantity} litres`}
              />
              <SummaryRow
                label="Location"
                value={orderDetails.location || "-"}
              />
            </div>
          </Section>

          {/* Additional Note */}
          {orderDetails.additionalNotes && (
            <div className="bg-[#3B3835] h-[120px] py-3 px-5 border-l-4 border-[#FF8500] rounded-xl">
              <h3 className="text-white text-[15px] font-semibold mb-3">
                Additional Note
              </h3>
              <p className="text-white/80 mt-5">
                {orderDetails.additionalNotes}
              </p>
            </div>
          )}

          {/* Payment Summary */}
          <Section title="Payment Summary">
            <div className="space-y-1">
              <SummaryRow
                label="Fuel Cost"
                value={formatNaira(paymentSummary.fuelCost)}
              />
              <SummaryRow
                label="Service Fee"
                value={formatNaira(paymentSummary.serviceFee)}
              />

              <div className="pt-2 mt-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-white font-semibold text-lg">
                    Total Amount:
                  </span>
                  <span className="text-white font-bold text-lg">
                    {formatNaira(paymentSummary.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleCheckout}
            variant="orange"
            disabled={processing}
            className="w-full h-[58px] lg:h-[60px] rounded-xl disabled:opacity-50"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

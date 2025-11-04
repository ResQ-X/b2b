"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ===================== Types ===================== */

export type OrderDetails = {
  serviceType: string;
  fuelType: string;
  quantity: number;
  location: string;
  additionalNotes?: string;
};

type PaymentSummary = {
  fuelCost: number;
  serviceFee: number;
  totalAmount: number;
};

/* ===================== Small UI helpers ===================== */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-white/70">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      {children}
    </div>
  );
}

/* ===================== Main Component ===================== */

export default function CheckoutModal({
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

  /* -------- Pricing Calculations -------- */
  
  // Mock pricing data - replace with your actual pricing logic
  const fuelPrices = {
    petrol: 2.50,
    diesel: 2.20,
    premium: 3.00,
  };

  const serviceFees = {
    delivery: 15.00,
    emergency: 25.00,
    scheduled: 10.00,
  };

  const fuelPricePerLiter = fuelPrices[orderDetails.fuelType as keyof typeof fuelPrices] || 0;
  const serviceFee = serviceFees[orderDetails.serviceType as keyof typeof serviceFees] || 0;
  
  const fuelCost = orderDetails.quantity * fuelPricePerLiter;
  const totalAmount = fuelCost + serviceFee;

  const paymentSummary: PaymentSummary = {
    fuelCost,
    serviceFee,
    totalAmount,
  };

  /* -------- Checkout Handler -------- */

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      await onCheckout(orderDetails);
      onOpenChange(false);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setProcessing(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-11/12
          lg:max-w-[640px]
          rounded-[28px]
          border border-white/10
          bg-[#1F1E1C]
          text-white
          p-7 md:p-9
          max-h-[90vh]
          overflow-y-auto
          overscroll-contain
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
                value={orderDetails.serviceType ? orderDetails.serviceType.charAt(0).toUpperCase() + orderDetails.serviceType.slice(1) : "-"} 
              />
              <SummaryRow 
                label="Fuel Type" 
                value={orderDetails.fuelType ? orderDetails.fuelType.charAt(0).toUpperCase() + orderDetails.fuelType.slice(1) : "-"} 
              />
              <SummaryRow 
                label="Quantity" 
                value={`${orderDetails.quantity} L`} 
              />
              <SummaryRow 
                label="Location" 
                value={orderDetails.location} 
              />
            </div>
          </Section>

          {/* Additional Comments - Moved below Order Summary */}
          {orderDetails.additionalNotes && (
            <div className="pt-4 ">
              <h3 className="text-lg font-semibold mb-3 text-white">Additional Comments</h3>
              <div className="bg-[#2D2A27] rounded-2xl p-4 border border-white/10 border-l-2">
                <p className="text-amber-500/80">{orderDetails.additionalNotes}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <Section title="Payment Summary">
            <div className="space-y-1">
              <SummaryRow 
                label="Fuel Cost" 
                value={`$${paymentSummary.fuelCost.toFixed(2)}`} 
              />
              <SummaryRow 
                label="Service Fee" 
                value={`$${paymentSummary.serviceFee.toFixed(2)}`} 
              />
              <div className="pt-2 mt-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-white font-semibold text-lg">Total Amount</span>
                  <span className="text-white font-bold text-lg">
                    ${paymentSummary.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Payment Method */}
          <Section title="Payment Method">
            <div className="bg-[#2D2A27] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Credit/Debit Card</span>
                <span className="text-orange-500 font-medium">Selected</span>
              </div>
              <p className="text-white/60 text-sm mt-2">
                Payment will be processed securely
              </p>
            </div>
          </Section>
        </div>

        <DialogFooter className="mt-6 flex w-full gap-4">
          <Button
            onClick={handleCheckout}
            variant="orange"
            disabled={processing}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
          >
            {processing ? "Processing..." : `Pay $${paymentSummary.totalAmount.toFixed(2)}`}
          </Button>

          <Button
            type="button"
            variant="black"
            onClick={() => onOpenChange(false)}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CheckoutModal, { OrderDetails } from "../checkoutModal";

export function CTABanner({
  title,
  desc,
  buttonText,
  illustration,
  onAction,
}: {
  title: string;
  desc: string;
  buttonText: string;
  illustration: string;
  onAction?: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock order details - replace with your actual data
  const orderDetails: OrderDetails = {
    serviceType: "delivery",
    fuelType: "petrol",
    quantity: 50,
    location: "123 Main St, City, State",
    additionalNotes: "Please call before delivery",
  };

  const formatDesc = (text: string) =>
    text.split("|").map((part, idx) => (
      <span key={idx}>
        {part.trim()}
        {idx < text.split("|").length - 1 && <br />}
      </span>
    ));

  const handleCheckout = async (orderDetails: OrderDetails) => {
    // Handle the actual payment processing here
    console.log("Processing payment for:", orderDetails);
    // Integrate with your payment gateway (Stripe, PayPal, etc.)
  };

  return (
    <div className="rounded-2xl bg-[#3B3835] text-white p-6 flex items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-semibold text-[#FFFFFF]">{title}</h3>
        <p className="text-sm font-medium mt-[16px] mb-6">{formatDesc(desc)}</p>
        <div className="flex flex-col gap-3 ">
          <Button
            variant="orange"
            onClick={onAction}
            className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          >
            {buttonText}
          </Button>

          <Button
            variant="orange"
            onClick={() => setIsModalOpen(true)}
            className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          >
            Checkout
          </Button>
        </div>
      </div>
      
      <Image
        src={illustration}
        width={350}
        height={150}
        alt="cta"
        className="hidden sm:block"
      />

      <CheckoutModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCheckout={handleCheckout}
        orderDetails={orderDetails}
      />
    </div>
  );
}
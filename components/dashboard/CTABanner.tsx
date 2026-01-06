"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import FuelCheckoutModal, {
//   OrderDetails,
// } from "../fuel-delivery/FuelCheckoutModal";

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
  // Mock order details - replace with your actual data

  const formatDesc = (text: string) =>
    text.split("|").map((part, idx) => (
      <span key={idx}>
        {part.trim()}
        {idx < text.split("|").length - 1 && <br />}
      </span>
    ));

  return (
    <div className="rounded-2xl bg-[#3B3835] text-white p-6 flex items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-semibold text-[#FFFFFF]">{title}</h3>
        <p className="text-sm font-medium mt-[16px] mb-6">{formatDesc(desc)}</p>
        <div className="flex flex-col gap-3">
          <div className="relative inline-block">
            <Button
              variant="orange"
              onClick={onAction}
              className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px] relative z-10 animate-wiggle"
            >
              {buttonText}
            </Button>

            <div className="w-[180px] lg:w-[262px] absolute inset-0 rounded-lg animate-ring"></div>

            <style jsx>{`
              @keyframes wiggle {
                0%,
                100% {
                  transform: rotate(0deg);
                }
                25% {
                  transform: rotate(-2deg);
                }
                75% {
                  transform: rotate(2deg);
                }
              }

              @keyframes ring {
                0% {
                  box-shadow: 0 0 0 0 rgba(255, 138, 0, 0.7);
                }
                50% {
                  box-shadow: 0 0 0 10px rgba(255, 138, 0, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(255, 138, 0, 0);
                }
              }

              .animate-wiggle {
                animation: wiggle 0.5s ease-in-out infinite;
              }

              .animate-ring {
                animation: ring 1s ease-out infinite;
                pointer-events: none;
              }
            `}</style>
          </div>
          {/* 
          <Button
            variant="orange"
            onClick={() => setIsModalOpen(true)}
            className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
          >
            Checkout
          </Button> */}
        </div>
      </div>

      <Image
        src={illustration}
        width={350}
        height={150}
        alt="cta"
        className="hidden sm:block"
      />

      {/* <FuelCheckoutModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCheckout={handleCheckout}
        orderDetails={orderDetails}
      /> */}
    </div>
  );
}

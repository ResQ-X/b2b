import Image from "next/image";
import CardImage from "@/public/resq-x-card.svg";
import { Button } from "../ui/button";

export function WalletHeaderCard() {
  return (
    <div className="relative w-full h-auto rounded-[28px] overflow-hidden p-6 md:p-7 lg:p-8 flex justify-between items-center bg-gradient-to-r from-[#9A6200] to-[#3B3835] text-white border border-[#A33F00]">
      <div className="relative z-10 min-w-0 text-[#FFFFFF]">
        <p className="text-sm font-medium">Total Balance</p>
        <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight mt-3 mb-7">
          ₦64,500.00
        </h2>

        <Button
          variant="orange"
          className="w-full lg:w-[159px] h-[48px] lg:h-[52px]"
        >
          Top Up Wallet
        </Button>
      </div>

      <div className="hidden absolute inset-0 lg:flex justify-end items-end">
        <Image
          src={CardImage}
          alt="ResQ-X Card"
          className="w-auto h-full object-contain"
          priority
        />
      </div>
    </div>
  );
}

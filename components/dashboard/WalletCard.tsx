"use client";
import { Button } from "@/components/ui/button";

export function WalletCard({
  balance,
  onTopUp,
}: {
  balance: number;
  onTopUp?: () => void;
}) {
  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] text-white">
      <div className="p-6">
        <div className="text-sm font-medium opacity-80">Wallet Balance</div>
        <div className="mt-2 text-3xl font-extrabold tracking-tight">
          ₦{balance.toLocaleString()}
        </div>
      </div>
      <hr className="mt-[27px] border-[#5E5E5E]" />

      <div className="w-[159px] m-auto mt-[13px] mb-5">
        <Button
          onClick={onTopUp}
          variant="orange"
          className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
        >
          Top Up Wallet
        </Button>
      </div>
    </div>
  );
}

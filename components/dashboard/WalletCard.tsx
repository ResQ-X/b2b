"use client";
import { Button } from "@/components/ui/Button";

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
      {/* <button
        onClick={onTopUp}
        className="mt-4 w-full rounded-xl bg-[#FF8500] py-2 text-sm font-medium text-black hover:opacity-90"
      >
        Top Up Wallet
      </button> */}
      <hr className="mt-[27px] border-[#5E5E5E]" />

      <div className="w-[159px] m-auto mt-[13px] mb-5">
        <Button
          onClick={onTopUp}
          className="w-full max-w-[226px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200 mt-6"
        >
          Top Up Wallet
        </Button>
      </div>
    </div>
  );
}

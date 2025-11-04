'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisburseMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: DisburseData) => void;
}

interface DisburseData {
  recipient: string;
  amount: string;
  note: string;
  password: string;
}

export default function DisburseMoneyModal({ 
  open, 
  onOpenChange,
  onSubmit 
}: DisburseMoneyModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('5,500');
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const availableBalance = '220,000';

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      if (onSubmit) {
        await onSubmit({ recipient, amount, note, password });
      }
      // Reset form
      setRecipient('');
      setAmount('');
      setNote('');
      setPassword('');
      onOpenChange(false);
    } catch (error) {
      console.error('Disburse error:', error);
    } finally {
      setProcessing(false);
    }
  };

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
            Disburse Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Recipient */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Select Recipient
            </label>
            <div className="relative">
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10"
              >
                <option value="">Select Sub - Admin</option>
                <option value="admin1">Sub Admin 1</option>
                <option value="admin2">Sub Admin 2</option>
                <option value="admin3">Sub Admin 3</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Enter Amount */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Enter Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 pr-28"
                placeholder="₦5,500"
              />
              
            </div>
            <div className="flex justify-between mt-2">
                <p className="text-xs text-white/60 ">Available Balance</p>
                <div className="  text-[#FF8500] font-medium text-xs ">
                    ₦{availableBalance}
                </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional note/reference"
              rows={3}
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 border border-white/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your login password"
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 border border-white/10"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex w-full gap-4">
          <Button
            onClick={handleSubmit}
            variant="orange"
            disabled={processing}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
          >
            {processing ? "Processing..." : "Disburse Money"}
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
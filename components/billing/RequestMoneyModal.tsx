'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RequestMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: RequestData) => void;
}

interface RequestData {
  recipient: string;
  amount: string;
  note: string;
}

export default function RequestMoneyModal({ 
  open, 
  onOpenChange,
  onSubmit 
}: RequestMoneyModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('55,500');
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const availableBalance = '0.00';
  const quickAmounts = [82000, 100000, 115000, 500000, 802000];

  const handleQuickSelect = (value: number) => {
    setAmount(value.toLocaleString());
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      if (onSubmit) {
        await onSubmit({ recipient, amount, note });
      }
      // Reset form
      setRecipient('');
      setAmount('');
      setNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Request error:', error);
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
            Request Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient */}
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">
              Recipient
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Super Admin"
              className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 border border-white/10"
            />
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
                className="w-full bg-[#2D2A27] text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-white/10 pr-20"
                placeholder="₦55,500"
              />
            </div>
            <div className="flex justify-between mt-2">
                <p className="text-xs text-white/60 ">Available Balance</p>
                <div className="  text-[#FF8500] font-medium text-sm ">
                    ₦{availableBalance}
                </div>
            </div>          </div>

          {/* Quick Select */}
          <div>
            <label className="block text-sm text-white mb-3 font-semibold text-lg">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(value)}
                  className="bg-[#2D2A27] hover:bg-[#3D3A37] text-white font-medium py-4 rounded-2xl transition-colors text-sm border border-white/10"
                >
                  ₦{value.toLocaleString()}
                </button>
              ))}
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
        </div>

        <DialogFooter className="mt-6 flex w-full gap-4">
          <Button
            onClick={handleSubmit}
            variant="orange"
            disabled={processing}
            className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
          >
            {processing ? "Processing..." : "Request Money"}
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
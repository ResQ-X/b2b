"use client";

import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ServiceSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceSuccessDialog({
  open,
  onOpenChange,
}: ServiceSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="py-12 flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">
              Changes Saved Successfully!
            </h2>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateOrderForm } from "./create-order-form";
import { CreateOrderLoading } from "./create-order-loading";
import { CreateOrderSuccess } from "./create-order-success";
import type { CreateOrderState } from "@/types/order-form";

export function CreateOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, setState] = React.useState<CreateOrderState>({
    step: "form",
    progress: 0,
  });

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setState({ step: "form", progress: 0 });
      }, 300);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        {state.step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#332414]">
                Create New Order
              </DialogTitle>
            </DialogHeader>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <CreateOrderForm
              onSubmit={async () => {
                setState({ step: "creating", progress: 0 });

                // Simulate progress
                for (let i = 0; i <= 100; i += 20) {
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  setState((prev) => ({ ...prev, progress: i }));
                }

                setState({ step: "success", progress: 100 });
              }}
            />
          </>
        )}

        {state.step === "creating" && (
          <CreateOrderLoading progress={state.progress} />
        )}

        {state.step === "success" && (
          <CreateOrderSuccess onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

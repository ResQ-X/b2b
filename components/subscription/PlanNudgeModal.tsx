"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanNudgeModal({
  onClose,
  onGoToPlans,
}: {
  onClose: () => void;
  onGoToPlans: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[92vw] max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              No Active Plan
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              You don’t have an active subscription yet. Choose a plan to unlock
              refuel, fleet care, and rescue features.
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <Button variant="orange" onClick={onGoToPlans}>
            Browse Plans
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function CreateOrderLoading({ progress }: { progress: number }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center space-y-6">
      <AlertTriangle className="h-16 w-16 text-orange animate-pulse" />
      <h2 className="text-xl font-semibold text-center">
        Creating Incident Order...
      </h2>
      <div className="w-full max-w-xs">
        <Progress value={progress} className="h-2 bg-orange/20" />
      </div>
    </div>
  );
}

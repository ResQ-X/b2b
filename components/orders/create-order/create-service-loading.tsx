"use client"

import { Progress } from "@/components/ui/progress"

export function CreateServiceLoading({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p>Creating service...</p>
      <Progress value={progress} className="w-[60%]" />
    </div>
  )
}
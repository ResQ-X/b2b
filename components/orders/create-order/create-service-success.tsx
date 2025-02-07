"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function CreateServiceSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <CheckCircle className="h-12 w-12 text-green-500" />
      <p>Service created successfully!</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  )
}
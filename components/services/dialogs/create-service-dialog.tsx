"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateServiceForm } from "./create-service-form"
import { CreateServiceLoading } from "./create-service-loading"
import { CreateServiceSuccess } from "./create-service-success"
import axiosInstance from "@/lib/axios"

type CreateServiceState = {
  step: "form" | "creating" | "success"
  progress: number
}

export function CreateServiceDialog({
  open,
  onOpenChange,
  onServiceCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceCreated: () => void
}) {
  const [state, setState] = useState<CreateServiceState>({
    step: "form",
    progress: 0,
  })

  const handleCreateService = async (data: {
    service_name: string
    unit_price: number
    delivery_price: number
    service_price: number
  }) => {
    try {
      setState({ step: "creating", progress: 0 })

      await axiosInstance.post("/resqx-services/create", data)

      setState({ step: "success", progress: 100 })
      onServiceCreated()
    } catch (error) {
      console.error("Failed to create service:", error)
      setState({ step: "form", progress: 0 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {state.step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create New Service</DialogTitle>
            </DialogHeader>
            <CreateServiceForm
              onSubmit={handleCreateService}
            />
          </>
        )}

        {state.step === "creating" && <CreateServiceLoading progress={state.progress} />}

        {state.step === "success" && <CreateServiceSuccess onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
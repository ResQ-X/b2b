"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateServiceForm } from "./create-service-form"
import { CreateServiceLoading } from "./create-service-loading"
import { CreateServiceSuccess } from "./create-service-success"
import type { CreateServiceState } from "@/types/service-form"
import { AuthService } from "@/services/auth.service"

export function CreateServiceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [state, setState] = React.useState<CreateServiceState>({
    step: "form",
    progress: 0,
  })

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setState({ step: "form", progress: 0 })
      }, 300)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {state.step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create New Service</DialogTitle>
            </DialogHeader>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <CreateServiceForm
              onSubmit={async (data) => {
                setState({ step: "creating", progress: 0 })

                try {
                  await AuthService.createService(data);

                  // Simulate progress
                  for (let i = 0; i <= 100; i += 20) {
                    await new Promise((resolve) => setTimeout(resolve, 500))
                    setState((prev) => ({ ...prev, progress: i }))
                  }

                  setState({ step: "success", progress: 100 })
                } catch (error) {
                  setState({ step: "form", progress: 0 })
                }
              }}
            />
          </>
        )}

        {state.step === "creating" && <CreateServiceLoading progress={state.progress} />}

        {state.step === "success" && <CreateServiceSuccess onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
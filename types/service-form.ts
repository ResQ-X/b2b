export type CreateServiceState = {
    step: "form" | "creating" | "success"
    progress: number
  }
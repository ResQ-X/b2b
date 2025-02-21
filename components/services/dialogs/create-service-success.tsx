import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreateServiceSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center space-y-6">
      <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="h-8 w-8 text-white" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Service Created Successfully!</h2>
        <p className="text-gray-500">The new service has been added to your list</p>
      </div>
      <Button onClick={onClose} className="bg-orange hover:bg-orange/90">
        View Services
      </Button>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateServiceForm({ onSubmit }: { onSubmit: (data: { service_name: string; unit_price: number; delivery_price: number; service_price: number }) => void }) {
  const [serviceName, setServiceName] = useState("")
  const [unitPrice, setUnitPrice] = useState(0)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [servicePrice, setServicePrice] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      service_name: serviceName,
      unit_price: unitPrice,
      delivery_price: deliveryPrice,
      service_price: servicePrice,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="service_name">Service Name</Label>
        <Input
          id="service_name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="delivery_price">Delivery Price</Label>
        <Input
          id="delivery_price"
          type="number"
          value={deliveryPrice}
          onChange={(e) => setDeliveryPrice(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="service_price">Service Price</Label>
        <Input
          id="service_price"
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(Number(e.target.value))}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Create Service
      </Button>
    </form>
  )
}
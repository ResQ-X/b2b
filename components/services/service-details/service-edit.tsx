"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceSuccessDialog } from "./service-success-dialog";
import axiosInstance from "@/lib/axios";

interface ServiceEditProps {
  service: ServiceDetails;
}

interface ServiceDetails {
  created_at: Date;
  delivery_price: string;
  id: string;
  name: string;
  service_price: string;
  unit_price: string;
  updated_at: string;
}

export function ServiceEdit({ service: initialService }: ServiceEditProps) {
  const router = useRouter();
  const [service, setService] = useState(initialService);
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!password) {
      alert("Admin password is required to save changes.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        service_id: service.id,
        unit_price: parseFloat(service.unit_price),
        delivery_price: parseFloat(service.delivery_price),
        service_price: parseFloat(service.service_price),
        password,
      };

      await axiosInstance.patch("/resqx-services/edit", payload);

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold mb-4">Edit Service Details</h1>

        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Service Name</label>
            <Input value={service.name} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Unit Price</label>
            <Input
              type="number"
              value={service.unit_price}
              onChange={(e) =>
                setService({ ...service, unit_price: e.target.value })
              }
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Delivery Price</label>
            <Input
              type="number"
              value={service.delivery_price}
              onChange={(e) =>
                setService({ ...service, delivery_price: e.target.value })
              }
              className="bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Service Price</label>
            <Input
              type="number"
              value={service.service_price}
              onChange={(e) =>
                setService({ ...service, service_price: e.target.value })
              }
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Created At</label>
            <Input
              value={new Date(service.created_at).toLocaleDateString()}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Admin Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
              placeholder="Enter password to confirm"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <Button onClick={handleSave} className="bg-orange hover:bg-orange/90">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div> */}

      <div className="flex justify-center gap-4">
        <Button onClick={handleSave} className="bg-orange hover:bg-orange/90">
          {saving ? "Saving..." : "Save"}
        </Button>

        <Button
          variant="outline"
          className="border-orange text-orange hover:bg-orange/10"
        >
          Cancel
        </Button>
      </div>

      <ServiceSuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />
    </div>
  );
}

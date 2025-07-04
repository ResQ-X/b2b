"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// You can later replace this mock with an API call
const mockProfessionals = [
  {
    id: "1",
    name: "John Doe",
    service: "Tow Truck",
    status: "Available",
    location: "123 Main St, Lagos",
    latitude: 6.5244,
    longitude: 3.3792,
    professionalType: "Tow Truck Driver",
  },
  {
    id: "2",
    name: "Jane Smith",
    service: "Fuel Delivery",
    status: "Busy",
    location: "456 Elm St, Lagos",
    latitude: 6.4654,
    longitude: 3.4064,
    professionalType: "First Responder",
  },
  {
    id: "3",
    name: "Ahmed Bello",
    service: "Tire Change",
    status: "On Duty",
    location: "22 Broad St, Lagos Island",
    latitude: 6.451,
    longitude: 3.3905,
    professionalType: "Tow Truck Driver",
  },
  {
    id: "4",
    name: "Chioma Okeke",
    service: "Battery Boost",
    status: "Available",
    location: "Ikeja, Lagos",
    latitude: 6.6018,
    longitude: 3.3515,
    professionalType: "First Responder",
  },
];

export default function ProfessionalDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [professional, setProfessional] = useState<any>(null);

  useEffect(() => {
    const found = mockProfessionals.find((p) => p.id === id);
    setProfessional(found);
  }, [id]);

  if (!professional) {
    return (
      <div className="p-6">
        <p>Loading professional details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold mb-4">Professional Details</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Name</label>
            <Input value={professional.name} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Service</label>
            <Input value={professional.service} disabled className="bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Status</label>
            <Input value={professional.status} disabled className="bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Type</label>
            <Input
              value={professional.professionalType}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Location</label>
            <Input
              value={professional.location}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Coordinates</label>
            <Input
              value={`Lat: ${professional.latitude}, Lng: ${professional.longitude}`}
              disabled
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <Button
          onClick={() => alert("Edit flow coming soon")}
          className="bg-orange hover:bg-orange/90"
        >
          Edit Professional
        </Button>
      </div> */}
    </div>
  );
}

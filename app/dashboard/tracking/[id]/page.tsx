/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveProfessionals } from "@/lib/useLiveProfessionals";
import { Cookies } from "react-cookie";

export default function ProfessionalDetails() {
  const { id } = useParams();
  const router = useRouter();
  const cookies = new Cookies();
  const user = cookies.get("user");
  const userId = user?.id;

  const { allProfessionalsData, loading } = useLiveProfessionals(userId);
  const [professional, setProfessional] = useState<any>(null);

  useEffect(() => {
    if (!id || loading) return;
    const found = allProfessionalsData.find((p) => p.id === id);
    setProfessional(found);
  }, [id, allProfessionalsData, loading]);

  if (loading || !professional) {
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

      <h1 className="text-2xl font-semibold mb-4">Professional Details</h1>

      <div className="grid grid-cols-3 gap-6">
        <InputField label="Name" value={professional.name} />
        <InputField label="Email" value={professional.email} />
        <InputField label="Phone" value={professional.phone} />
        <InputField label="Country" value={professional.country} />
        <InputField
          label="Status"
          value={professional.is_online ? "Online" : "Offline"}
        />
        <InputField label="Type" value={professional.professionalType} />
        <InputField
          label="Coordinates"
          value={`Lat: ${professional.latitude}, Lng: ${professional.longitude}`}
        />
        <InputField
          label="Created At"
          value={new Date(professional.created_at).toLocaleString()}
        />
        <InputField
          label="Updated At"
          value={new Date(professional.updated_at).toLocaleString()}
        />
      </div>

      {/* Vehicle Details */}
      {professional.vehicle_details?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Vehicle Details</h2>
          {professional.vehicle_details.map((vehicle: any, idx: number) => (
            <div key={vehicle.id} className="grid grid-cols-3 gap-6 mb-4">
              <InputField label="Plate Number" value={vehicle.plate_number} />
              <InputField label="Vehicle Type" value={vehicle.vehicle_type} />
              <InputField label="VIN" value={vehicle.vehicle_vin} />
              <div className="col-span-3">
                <label className="text-sm text-gray-500">Vehicle Image</label>
                <Image
                  width={192}
                  height={128}
                  src={vehicle.vehicle_image}
                  alt="Vehicle"
                  className="w-48 h-32 rounded object-cover mt-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pro Details */}
      {professional.pro_details && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Identification</h2>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Role"
              value={professional.pro_details.pro_role}
            />
            <InputField
              label="ID Type"
              value={professional.pro_details.identification_type}
            />
            <div>
              <label className="text-sm text-gray-500">ID Front</label>
              <Image
                width={192}
                height={128}
                src={professional.pro_details.identification_front}
                alt="ID Front"
                className="w-48 h-32 rounded object-cover mt-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">ID Back</label>
              <Image
                width={192}
                height={128}
                src={professional.pro_details.identification_back}
                alt="ID Back"
                className="w-48 h-32 rounded object-cover mt-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank Details */}
      {professional.user_account && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Bank Details</h2>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Bank Name"
              value={professional.user_account.bank_name}
            />
            <InputField
              label="Account Number"
              value={professional.user_account.bank_account}
            />
            <InputField
              label="Account Name"
              value={professional.user_account.account_name}
            />
          </div>
        </div>
      )}

      {/* Wallet */}
      {professional.wallet && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Wallet</h2>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Balance"
              value={`₦${professional.wallet.balance}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-500">{label}</label>
      <Input value={value || "N/A"} disabled className="bg-white" />
    </div>
  );
}

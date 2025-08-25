"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function RequestEmergencyServiceCard() {
  const [form, setForm] = useState({
    vehicle: "",
    service: "",
    location: "",
  });

  const canSubmit = form.vehicle && form.service && form.location;

  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-2xl font-semibold mb-6">Request Emergency Service</h3>

      <div className="space-y-5">
        <Field label="Select Vehicle">
          <Select
            value={form.vehicle}
            onValueChange={(v) => setForm((p) => ({ ...p, vehicle: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="LND-234-CC">LND-234-CC</SelectItem>
              <SelectItem value="LND-789-DD">LND-789-DD</SelectItem>
              <SelectItem value="LND-451-AA">LND-451-AA</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Service Needed">
          <Select
            value={form.service}
            onValueChange={(v) => setForm((p) => ({ ...p, service: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="flat-tire">Flat Tire</SelectItem>
              <SelectItem value="jump-start">Jump Start</SelectItem>
              <SelectItem value="fuel-delivery">Fuel Delivery</SelectItem>
              <SelectItem value="towing">Towing</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Location">
          <Select
            value={form.location}
            onValueChange={(v) => setForm((p) => ({ ...p, location: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              <SelectItem value="lekki-epe">Lekki-Epe Expressway</SelectItem>
              <SelectItem value="vi">Victoria Island</SelectItem>
              <SelectItem value="third-mainland">
                Third Mainland Bridge
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Button
          disabled={!canSubmit}
          variant="orange"
          className="w-full h-[48px] lg:h-[52px]"
        >
          Request Service
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80">{label}</Label>
      {children}
    </div>
  );
}

function Trigger() {
  return (
    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-[#2D2A27] text-white">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
  );
}

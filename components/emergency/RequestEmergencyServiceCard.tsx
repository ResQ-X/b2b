"use client";
import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Option = { label: string; value: string };

export function RequestEmergencyServiceCard({
  vehicleOptions = [],
  locationOptions = [],
  typeOptions = [],
  slotOptions = [],
  onSubmit,
}: {
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  typeOptions?: Option[];
  slotOptions?: Option[];
  onSubmit?: (data: {
    type: string;
    vehicle: string;
    location: string;
    slot: string;
    notes: string;
  }) => Promise<void> | void;
}) {
  const [form, setForm] = useState({
    vehicle: "",
    type: "",
    location: "",
    slot: "",
    notes: "",
  });

  const canSubmit = useMemo(
    () => form.vehicle && form.type && form.location && form.slot,
    [form]
  );

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) return;
    await onSubmit({
      type: form.type,
      vehicle: form.vehicle,
      location: form.location,
      slot: form.slot,
      notes: form.notes,
    });
    setForm({ vehicle: "", type: "", location: "", slot: "", notes: "" });
  };

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
              {vehicleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Service Needed">
          <Select
            value={form.type}
            onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              {typeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
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
              {locationOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Preferred Time Slot">
          <Select
            value={form.slot}
            onValueChange={(v) => setForm((p) => ({ ...p, slot: v }))}
          >
            <Trigger />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              {slotOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Additional Notes">
          <Textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Add any details to help us locate and assist quickly"
            className="min-h-[110px] rounded-xl border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
          />
        </Field>

        <Button
          disabled={!canSubmit}
          variant="orange"
          className="w-full h-[48px] lg:h-[52px]"
          onClick={handleSubmit}
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

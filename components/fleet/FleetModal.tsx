"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import CustomInput from "@/components/ui/CustomInput";

export type VehicleForm = {
  name: string;
  plateNumber: string;
  type: string;
  fuel: string;
  capacity: string;
};

export default function VehicleModal({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  vehicleTypes = [],
  fuelTypes = [],
  title = "Request Service",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VehicleForm) => Promise<void> | void;
  initialValues?: Partial<VehicleForm>;
  vehicleTypes?: { label: string; value: string }[];
  fuelTypes?: { label: string; value: string }[];
  title?: string;
}) {
  const [form, setForm] = useState<VehicleForm>({
    name: initialValues?.name || "",
    plateNumber: initialValues?.plateNumber || "",
    type: initialValues?.type || "",
    fuel: initialValues?.fuel || "",
    capacity: initialValues?.capacity || "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialValues?.name || "",
        plateNumber: initialValues?.plateNumber || "",
        type: initialValues?.type || "",
        fuel: initialValues?.fuel || "",
        capacity: initialValues?.capacity || "",
      });
    }
  }, [open, initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] rounded-3xl border border-white/10 bg-[#1E1D1B] text-white p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Vehicle Name */}
          <Field label="Vehicle Name">
            <CustomInput
              id="vehicle_name"
              placeholder=" "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
            />
          </Field>

          {/* Vehicle Plate Number */}
          <Field label="Vehicle Plate Number">
            <CustomInput
              id="vehicle_plate"
              placeholder=" "
              value={form.plateNumber}
              onChange={(e) =>
                setForm({ ...form, plateNumber: e.target.value })
              }
              className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
            />
          </Field>

          {/* Vehicle Type */}
          <Field label="Vehicle Type">
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v })}
            >
              <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                {vehicleTypes.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Fuel Type */}
          <Field label="Fuel Type">
            <Select
              value={form.fuel}
              onValueChange={(v) => setForm({ ...form, fuel: v })}
            >
              <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                {fuelTypes.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Capacity */}
          <Field label="Capacity">
            <CustomInput
              id="vehicle_capacity"
              placeholder=" "
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
            />
          </Field>

          {/* Helper text */}
          <p className="text-sm text-white/70">
            Accurate vehicle details help improve fuel efficiency tracking and
            maintenance planning.
          </p>

          {/* Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-xl bg-[#FF8500] hover:bg-[#ff9a33] text-white font-medium"
            >
              {submitting ? "Saving..." : "Save Vehicle"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-xl border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------- small helper -------- */
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

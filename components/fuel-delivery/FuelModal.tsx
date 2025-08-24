"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

export type RequestServiceForm = {
  type: string;
  vehicle: string;
  location: string;
  slot: string;
  notes: string;
};

type Option = { label: string; value: string };

export default function RequestServiceModal({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  typeOptions = [],
  vehicleOptions = [],
  locationOptions = [],
  slotOptions = [],
  title = "Request Service",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestServiceForm) => Promise<void> | void;
  initialValues?: Partial<RequestServiceForm>;
  typeOptions?: Option[];
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  slotOptions?: Option[];
  title?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RequestServiceForm>({
    type: initialValues?.type || "",
    vehicle: initialValues?.vehicle || "",
    location: initialValues?.location || "",
    slot: initialValues?.slot || "",
    notes: initialValues?.notes || "",
  });

  // keep form in sync when reopening with new initial values
  useEffect(() => {
    if (open) {
      setForm({
        type: initialValues?.type || "",
        vehicle: initialValues?.vehicle || "",
        location: initialValues?.location || "",
        slot: initialValues?.slot || "",
        notes: initialValues?.notes || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSubmit = useMemo(
    () => form.type && form.vehicle && form.location && form.slot,
    [form]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
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
      <DialogContent
        className="
        w-11/12
          lg:max-w-[640px]
          rounded-[28px]
          border border-white/10
          bg-[#1F1E1C]
          text-white
          p-7 md:p-9
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fuel Service */}
          <Field label="Fuel Service">
            <Select
              value={form.type}
              onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
            >
              <Trigger />
              <List options={typeOptions} />
            </Select>
          </Field>

          {/* Vehicle */}
          <Field label="Vehicle">
            <Select
              value={form.vehicle}
              onValueChange={(v) => setForm((p) => ({ ...p, vehicle: v }))}
            >
              <Trigger />
              <List options={vehicleOptions} />
            </Select>
          </Field>

          {/* Service Location */}
          <Field label="Service Location">
            <Select
              value={form.location}
              onValueChange={(v) => setForm((p) => ({ ...p, location: v }))}
            >
              <Trigger />
              <List options={locationOptions} />
            </Select>
          </Field>

          {/* Time Slot */}
          <Field label="Time Slot">
            <Select
              value={form.slot}
              onValueChange={(v) => setForm((p) => ({ ...p, slot: v }))}
            >
              <Trigger />
              <List options={slotOptions} />
            </Select>
          </Field>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white/80">Additional Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Add any extra details to help us find your location or complete the request."
              className="
                min-h-[120px]
                rounded-2xl
                border border-white/10
                bg-[#2D2A27]
                text-white placeholder:text-white/60
              "
            />
          </div>

          <DialogFooter className="mt-4 flex w-full gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="
                flex-1 h-[56px]
                rounded-xl
                border border-white/15
                bg-transparent
                text-white
                hover:bg-white/10
              "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="
                flex-1 h-[56px]
                rounded-xl
                bg-[#FF8500]
                hover:bg-[#ff9a33]
              "
            >
              {submitting ? "Submitting..." : "Request Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- internal UI helpers (styled to the design) ---------- */

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
    <SelectTrigger
      className="
        h-14
        rounded-2xl
        border border-white/10
        bg-[#2D2A27]
        text-white
      "
    >
      <SelectValue placeholder="Select" />
    </SelectTrigger>
  );
}

function List({ options }: { options: { label: string; value: string }[] }) {
  return (
    <SelectContent className="bg-[#2D2A27] text-white border-white/10">
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

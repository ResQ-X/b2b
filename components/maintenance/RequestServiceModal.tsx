"use client";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/ui/CustomInput";

export type RequestServiceForm = {
  maintenance_type: string; // BRAKE_INSPECTION | FULL_SERVICE | OIL_CHANGE | TIRE_ROTATION | OTHER
  asset_id: string;
  location_id?: string;
  location_address?: string;
  location_longitude?: string;
  location_latitude?: string;
  time_slot: string; // ISO string
  note: string;
};

type Option = { label: string; value: string };

type GooglePlacePrediction = {
  description: string;
  place_id: string;
};

const MANUAL_LOCATION_VALUE = "__manual__";

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
    maintenance_type: initialValues?.maintenance_type || "",
    asset_id: initialValues?.asset_id || "",
    location_id: initialValues?.location_id || "",
    location_address: initialValues?.location_address || "",
    location_longitude: initialValues?.location_longitude || "",
    location_latitude: initialValues?.location_latitude || "",
    time_slot: initialValues?.time_slot || "",
    note: initialValues?.note || "",
  });

  // ---------- keep form in sync when modal reopens ----------
  useEffect(() => {
    if (!open) return;
    setForm({
      maintenance_type: initialValues?.maintenance_type || "",
      asset_id: initialValues?.asset_id || "",
      location_id: initialValues?.location_id || "",
      location_address: initialValues?.location_address || "",
      location_longitude: initialValues?.location_longitude || "",
      location_latitude: initialValues?.location_latitude || "",
      time_slot: initialValues?.time_slot || "",
      note: initialValues?.note || "",
    });
    setLookupError(null);
    setPredictions([]);
  }, [open, initialValues]);

  // ---------- Google Maps places/autocomplete (same as Fuel modal) ----------
  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    if (
      typeof window !== "undefined" &&
      (window as any).google &&
      (window as any).google.maps
    ) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const onLoad = () => setIsGoogleMapsLoaded(true);
      existingScript.addEventListener("load", onLoad);
      if ((window as any).google && (window as any).google.maps)
        setIsGoogleMapsLoaded(true);
      return () => existingScript.removeEventListener("load", onLoad);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => console.error("Failed to load Google Maps script");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [isMounted]);

  const getPredictions = (input: string) => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(async () => {
      if (!isMounted || !isGoogleMapsLoaded || !input.trim()) {
        setPredictions([]);
        return;
      }

      try {
        const service = new (
          window as any
        ).google.maps.places.AutocompleteService();
        const results: GooglePlacePrediction[] = await new Promise(
          (resolve) => {
            service.getPlacePredictions(
              { input, componentRestrictions: { country: "ng" } },
              (preds: any, status: string) => {
                if (status === "OK" && preds) {
                  resolve(
                    preds.map((p: any) => ({
                      description: p.description,
                      place_id: p.place_id,
                    }))
                  );
                } else {
                  resolve([]);
                }
              }
            );
          }
        );

        setPredictions(results);
      } catch (err) {
        console.error("Predictions error:", err);
        setPredictions([]);
      }
    }, 200);
  };

  const handleSuggestionSelect = async (description: string) => {
    setPredictions([]);
    setForm((prev) => ({ ...prev, location_address: description }));

    if (
      typeof window !== "undefined" &&
      (window as any).google &&
      (window as any).google.maps &&
      (window as any).google.maps.Geocoder
    ) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        const results: any = await new Promise((resolve, reject) => {
          geocoder.geocode(
            { address: description },
            (res: any, status: string) => {
              if (status === "OK" && res && res[0]) resolve(res);
              else reject(status);
            }
          );
        });

        if (results && results[0] && results[0].geometry) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          setForm((prev) => ({
            ...prev,
            location_latitude: String(lat),
            location_longitude: String(lng),
          }));
          return;
        }
      } catch (err) {
        console.warn("Geocoder failed:", err);
        setLookupError("Failed to resolve coordinates for that place.");
      }
    } else {
      setLookupError("Google Maps geocoder not available.");
    }
  };

  const handleLocationChange = (locationId: string) => {
    if (locationId === MANUAL_LOCATION_VALUE) {
      setForm((prev) => ({
        ...prev,
        location_id: MANUAL_LOCATION_VALUE,
        location_address: "",
        location_longitude: "",
        location_latitude: "",
      }));
      return;
    }

    const sel = locationOptions.find((l) => l.value === locationId);
    if (sel) {
      setForm((prev) => ({
        ...prev,
        location_id: locationId,
        location_address: sel.label,
        // if your options carry coords, set them here
        // location_longitude: (sel as any).longitude || "",
        // location_latitude: (sel as any).latitude || "",
      }));
    }
  };

  const manualMode = form.location_id === MANUAL_LOCATION_VALUE;

  const canSubmit = useMemo(
    () =>
      form.maintenance_type &&
      form.asset_id &&
      form.time_slot &&
      // For manual location, require address (coordinates are optional but helpful)
      (form.location_id === "__manual__"
        ? !!form.location_address
        : !!form.location_id),
    [form]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
      setForm({
        maintenance_type: "",
        asset_id: "",
        location_id: "",
        location_address: "",
        location_longitude: "",
        location_latitude: "",
        time_slot: "",
        note: "",
      });
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Failed to submit request. Please try again, " + err);
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
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Maintenance Type */}
          <Field label="Maintenance Type">
            <Select
              value={form.maintenance_type}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, maintenance_type: v }))
              }
            >
              <Trigger placeholder="Select maintenance type" />
              <List options={typeOptions} />
            </Select>
          </Field>

          {/* Vehicle (same UX as fuel modal) */}
          <Field label="Vehicle">
            <div>
              <Select
                value={form.asset_id}
                onValueChange={(v) => setForm((p) => ({ ...p, asset_id: v }))}
                disabled={vehicleOptions.length === 0}
              >
                <Trigger
                  placeholder={
                    vehicleOptions.length > 0
                      ? "Select vehicle"
                      : "No vehicles available"
                  }
                />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {vehicleOptions.length > 0 ? (
                    vehicleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-white/60 max-w-xs">
                      No vehicles available.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {vehicleOptions.length === 0 && (
              <div className="mt-2 text-sm text-white/70">
                No vehicles found. Go to the{" "}
                <Link href="/fleet" className="underline hover:text-white">
                  Fleet
                </Link>{" "}
                page and click{" "}
                <span className="font-semibold">Add New Fleet</span> to add an
                asset.
              </div>
            )}
          </Field>

          {/* Service Location (preset) */}
          {!manualMode && (
            <Field label="Service Location">
              <Select
                value={form.location_id || ""}
                onValueChange={handleLocationChange}
              >
                <Trigger placeholder="Select location" />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {locationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  <SelectItem key="manual" value={MANUAL_LOCATION_VALUE}>
                    Add location manually
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}

          {/* Manual Location (autocomplete + geocode) */}
          {manualMode && (
            <Field label="Location Name (Manual)">
              <div className="relative">
                <CustomInput
                  type="text"
                  placeholder="Enter location name"
                  value={form.location_address}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({ ...prev, location_address: val }));
                    getPredictions(val);
                  }}
                  className="
                    h-14
                    rounded-2xl
                    border border-white/10
                    bg-[#2D2A27]
                    text-white placeholder:text-white/60
                  "
                />

                {predictions.length > 0 && (
                  <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                    {predictions.map((p, idx) => (
                      <div
                        key={p.place_id || idx}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={async () => {
                          await handleSuggestionSelect(p.description);
                        }}
                      >
                        {p.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {lookupError && (
                <p className="text-sm text-rose-400 mt-2">{lookupError}</p>
              )}
            </Field>
          )}

          {/* Time Slot */}
          <Field label="Time Slot">
            <Select
              value={form.time_slot}
              onValueChange={(v) => setForm((p) => ({ ...p, time_slot: v }))}
            >
              <Trigger placeholder="Select time slot (ISO datetime)" />
              <List options={slotOptions} />
            </Select>
          </Field>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white/80">Additional Notes</Label>
            <Textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="Add any extra details to help us find your location or complete the request."
              className="
                min-h-[110px]
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
              variant="black"
              onClick={() => onOpenChange(false)}
              className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="orange"
              disabled={!canSubmit || submitting}
              className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- tiny internal helpers for consistent UI ---------- */

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

function Trigger({ placeholder = "Select" }: { placeholder?: string }) {
  return (
    <SelectTrigger className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white">
      <SelectValue placeholder={placeholder} />
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

"use client";
import { useEffect, useMemo, useState, useRef } from "react";
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
import CustomInput from "@/components/ui/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type RequestFuelForm = {
  slot: string;
  location: any;
  vehicle: any;
  type: any;
  fuel_type: string;
  asset_id: string;
  location_id?: string;
  location_address?: string;
  location_longitude?: string;
  location_latitude?: string;
  time_slot: string;
  quantity: number;
  note: string;
  is_scheduled: boolean;
};

type Option = { label: string; value: string };

type GooglePlacePrediction = {
  description: string;
  place_id: string;
};

const MANUAL_LOCATION_VALUE = "__manual__";

export default function RequestFuelModal({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  typeOptions = [],
  vehicleOptions = [],
  locationOptions = [],
  slotOptions = [],
  title = "Request Fuel Service",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFuelForm) => Promise<void> | void;
  initialValues?: Partial<RequestFuelForm>;
  typeOptions?: Option[];
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  slotOptions?: Option[];
  title?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RequestFuelForm>({
    slot: initialValues?.slot || "",
    location: initialValues?.location || "",
    vehicle: initialValues?.vehicle || "",
    type: initialValues?.type || "",
    fuel_type: initialValues?.fuel_type || "",
    asset_id: initialValues?.asset_id || "",
    location_id: initialValues?.location_id || "",
    location_address: initialValues?.location_address || "",
    location_longitude: initialValues?.location_longitude || "",
    location_latitude: initialValues?.location_latitude || "",
    time_slot: initialValues?.time_slot || "",
    quantity: initialValues?.quantity || 0,
    note: initialValues?.note || "",
    is_scheduled: initialValues?.is_scheduled || false,
  });

  // Google Maps state
  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const typingTimer = useRef<number | null>(null);

  // keep form in sync when reopening with new initial values
  useEffect(() => {
    if (open) {
      setForm({
        slot: initialValues?.slot || "",
        location: initialValues?.location || "",
        vehicle: initialValues?.vehicle || "",
        type: initialValues?.type || "",
        fuel_type: initialValues?.fuel_type || "",
        asset_id: initialValues?.asset_id || "",
        location_id: initialValues?.location_id || "",
        location_address: initialValues?.location_address || "",
        location_longitude: initialValues?.location_longitude || "",
        location_latitude: initialValues?.location_latitude || "",
        time_slot: initialValues?.time_slot || "",
        quantity: initialValues?.quantity || 0,
        note: initialValues?.note || "",
        is_scheduled: initialValues?.is_scheduled || false,
      });
      setLookupError(null);
      setPredictions([]);
    }
  }, [open, initialValues]);

  // Mount guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Google Maps JS (Places) if available
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

  /* ---------- Place predictions (debounced) ---------- */
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

  // When user clicks a suggestion, geocode and set coordinates & location name
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

    // Find the selected location and extract coordinates if available
    const sel = locationOptions.find((l) => l.value === locationId);
    if (sel) {
      setForm((prev) => ({
        ...prev,
        location_id: locationId,
        location_address: sel.label,
        // If your locationOptions include coordinates, set them here
        // location_longitude: sel.longitude || "",
        // location_latitude: sel.latitude || "",
      }));
    }
  };

  const manualMode = form.location_id === MANUAL_LOCATION_VALUE;

  const canSubmit = useMemo(
    () =>
      form.fuel_type &&
      form.asset_id &&
      (form.location_id || form.location_address) &&
      form.time_slot &&
      form.quantity > 0,
    [form]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
      // Reset form after successful submission
      setForm({
        slot: "",
        location: "",
        vehicle: "",
        type: "",
        fuel_type: "",
        asset_id: "",
        location_id: "",
        location_address: "",
        location_longitude: "",
        location_latitude: "",
        time_slot: "",
        quantity: 0,
        note: "",
        is_scheduled: false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
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
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fuel Type */}
          <Field label="Fuel Type">
            <Select
              value={form.fuel_type}
              onValueChange={(v) => setForm((p) => ({ ...p, fuel_type: v }))}
            >
              <Trigger placeholder="Select fuel type" />
              <List options={typeOptions} />
            </Select>
          </Field>

          {/* Vehicle */}
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

          {/* Service Location - Only show if not in manual mode */}
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

          {/* Manual Location Entry */}
          {manualMode && (
            <Field label="Location Name (Manual)">
              <div className="relative">
                {/* <div className="flex items-center gap-2 mb-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        location_id: "",
                        location: "",
                        longitude: "",
                        latitude: "",
                      }));
                      setPredictions([]);
                      setLookupError(null);
                    }}
                    className="text-sm underline text-white/70 hover:text-white h-auto p-0"
                  >
                    ← Back to location list
                  </Button>
                </div> */}
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

                {/* suggestions dropdown */}
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

              {/* Show coordinates when available */}
              {/* {form.latitude && form.longitude && (
                <p className="text-sm text-green-400 mt-2">
                  Coordinates captured: {parseFloat(form.latitude).toFixed(6)}
                  , {parseFloat(form.longitude).toFixed(6)}
                </p>
              )} */}
            </Field>
          )}

          {/* Time Slot */}
          <Field label="Time Slot">
            <Select
              value={form.time_slot}
              onValueChange={(v) => setForm((p) => ({ ...p, time_slot: v }))}
            >
              <Trigger placeholder="Select time slot" />
              <List options={slotOptions} />
            </Select>
          </Field>

          {/* Quantity */}
          <Field label="Quantity (Liters)">
            <CustomInput
              type="number"
              min="1"
              value={form.quantity || ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  quantity: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="Enter quantity in liters"
              className="
                h-14
                rounded-2xl
                border border-white/10
                bg-[#2D2A27]
                text-white placeholder:text-white/60
              "
            />
          </Field>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white/80">Additional Notes</Label>
            <Textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
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

function Trigger({ placeholder = "Select" }: { placeholder?: string }) {
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

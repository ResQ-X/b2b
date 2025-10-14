"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/ui/CustomInput";
import axiosInstance from "@/lib/axios";
import { AssetForm, Location, GooglePlacePrediction } from "@/types/asset";
import { toast } from "react-toastify";

const MANUAL_LOCATION_VALUE = "__manual__";

export default function AssetModal({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  assetTypes = [],
  assetSubtypes = [],
  fuelTypes = [],
  title = "Add Asset",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssetForm) => Promise<void> | void;
  initialValues?: Partial<AssetForm>;
  assetTypes?: { label: string; value: string }[];
  assetSubtypes?: { label: string; value: string }[];
  fuelTypes?: { label: string; value: string }[];
  title?: string;
}) {
  const [form, setForm] = useState<AssetForm>({
    asset_name: initialValues?.asset_name || "",
    asset_type: initialValues?.asset_type || "",
    asset_subtype: initialValues?.asset_subtype || "",
    fuel_type: initialValues?.fuel_type || "",
    capacity: initialValues?.capacity || 0,
    plate_number: initialValues?.plate_number || "",
    location_id: initialValues?.location_id || "",
    location: initialValues?.location || "",
    longitude: initialValues?.longitude || "",
    latitude: initialValues?.latitude || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // geocoding / prediction UI state
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const typingTimer = useRef<number | null>(null);

  // Fetch saved locations when modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await axiosInstance.get("/fleet-asset/get-locations");
        if (response.data?.success && response.data.data) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    if (open) fetchLocations();
  }, [open]);

  // reset form when modal opens / initial values change
  useEffect(() => {
    if (open) {
      setForm({
        asset_name: initialValues?.asset_name || "",
        asset_type: initialValues?.asset_type || "",
        asset_subtype: initialValues?.asset_subtype || "",
        fuel_type: initialValues?.fuel_type || "",
        capacity: initialValues?.capacity || 0,
        plate_number: initialValues?.plate_number || "",
        location_id: initialValues?.location_id || "",
        location: initialValues?.location || "",
        longitude: initialValues?.longitude || "",
        latitude: initialValues?.latitude || "",
      });
      setLookupError(null);
      setPredictions([]);
    }
  }, [open, initialValues]);

  // Mount guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Google Maps JS (Places) if available (safely)
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
    setForm((prev) => ({ ...prev, location: description }));

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
            latitude: String(lat),
            longitude: String(lng),
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

  /* ---------- events ---------- */
  const handleLocationChange = (locationId: string) => {
    if (locationId === MANUAL_LOCATION_VALUE) {
      setForm((prev) => ({
        ...prev,
        location_id: MANUAL_LOCATION_VALUE,
        location: "",
        longitude: "",
        latitude: "",
      }));
      return;
    }

    const sel = locations.find((l) => l.id === locationId);
    if (sel) {
      setForm((prev) => ({
        ...prev,
        location_id: locationId,
        location: sel.location_name,
        longitude: sel.location_longitude,
        latitude: sel.location_latitude,
      }));
    }
  };

  /* ---------- asset type change handler that clears subtype for generators ---------- */
  const handleAssetTypeChange = (v: string) => {
    const upper = v.toUpperCase();
    if (upper === "GENERATOR") {
      setForm((prev) => ({
        ...prev,
        asset_type: upper,
        asset_subtype: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, asset_type: upper }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Ensure capacity is a number
      const capacityNum = Number(form.capacity);
      if (!Number.isFinite(capacityNum)) {
        toast.warning("Please enter a valid numeric capacity.");
        setSubmitting(false);
        return;
      }

      // Build payload to send to backend
      const payload: any = {
        ...form,
        capacity: capacityNum,
      };

      // If asset type is GENERATOR, force subtype to OTHER
      if (String(payload.asset_type).toUpperCase() === "GENERATOR") {
        payload.asset_subtype = "OTHER";
        delete payload.plate_number;
      }

      if (payload.location_id === MANUAL_LOCATION_VALUE) {
        delete payload.location_id;
      }

      console.log("Saving asset — payload:", payload);

      // POST to create-asset endpoint
      const response = await axiosInstance.post(
        "/fleet-asset/create-asset",
        payload
      );

      console.log("Create asset response:", response?.data);

      if (response?.data?.message === "Asset created successfully") {
        try {
          await onSubmit?.(form);
        } catch (cbErr) {
          console.error("onSubmit callback error:", cbErr);
        }
        onOpenChange(false);
        toast.success("Asset created successfully!");
      } else {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Failed to create asset. Please try again.";
        console.error("Create asset failed:", response?.data);
        toast.error(errMsg);
      }
    } catch (err: any) {
      console.error("Create asset request error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An unexpected error occurred while creating the asset."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isVehicle = form.asset_type === "VEHICLE";
  const manualMode = form.location_id === MANUAL_LOCATION_VALUE;
  const showSubtype = form.asset_type !== "GENERATOR";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#1E1D1B] text-white p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Asset Name */}
          <Field label="Asset Name">
            <CustomInput
              id="asset_name"
              placeholder="Enter asset name"
              value={form.asset_name}
              onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
              className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
              required
            />
          </Field>

          {/* Asset Type */}
          <Field label="Asset Type">
            <Select
              value={form.asset_type ? form.asset_type.toLowerCase() : ""}
              onValueChange={handleAssetTypeChange}
              required
            >
              <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                {assetTypes.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toLowerCase()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Asset Subtype — only show when not a generator */}
          {showSubtype && (
            <Field label="Asset Subtype">
              <Select
                value={
                  form.asset_subtype ? form.asset_subtype.toLowerCase() : ""
                }
                onValueChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    asset_subtype: v.toUpperCase(),
                  }))
                }
                required={showSubtype}
              >
                <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                  <SelectValue placeholder="Select asset subtype" />
                </SelectTrigger>
                <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                  {assetSubtypes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toLowerCase()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {/* Fuel Type */}
          <Field label="Fuel Type">
            <Select
              value={form.fuel_type ? form.fuel_type.toLowerCase() : ""}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, fuel_type: v.toUpperCase() }))
              }
              required
            >
              <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                {fuelTypes.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toLowerCase()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Capacity */}
          <Field label="Capacity (Liters)">
            <CustomInput
              id="capacity"
              type="number"
              placeholder="Enter capacity"
              value={form.capacity === 0 ? "" : form.capacity}
              onChange={(e) => {
                const val = e.target.value;
                const num = val === "" ? 0 : Math.max(0, parseInt(val) || 0);
                setForm({ ...form, capacity: num });
              }}
              className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </Field>

          {/* Plate Number (only for vehicles) */}
          {/* {isVehicle && (
            <Field label="Plate Number">
              <CustomInput
                id="plate_number"
                placeholder="Enter plate number"
                value={form.plate_number}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, plate_number: e.target.value }))
                }
                className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
              />
            </Field>
          )} */}
          {/* Plate Number (only for vehicles) */}
          {/* {isVehicle && (
            <Field label="Plate Number">
              <CustomInput
                id="plate_number"
                placeholder="Enter plate number (e.g., ABC-1234)"
                value={form.plate_number}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  // Allow only letters, numbers, and hyphen
                  const filtered = value.replace(/[^A-Z0-9-]/g, "");

                  // Format: ABC-1234 (3 letters, hyphen, 4 numbers)
                  if (filtered.length <= 8) {
                    let formatted = filtered;

                    // Auto-add hyphen after 3 characters only if user has typed 4+ chars without hyphen
                    if (filtered.length >= 4 && !filtered.includes("-")) {
                      formatted =
                        filtered.slice(0, 3) + "-" + filtered.slice(3);
                    }

                    setForm((prev) => ({ ...prev, plate_number: formatted }));
                  }
                }}
                onBlur={(e) => {
                  // Validate format on blur only if there's a value
                  const regex = /^[A-Z]{3}-\d{4}$/;
                  if (e.target.value && !regex.test(e.target.value)) {
                    toast.warning(
                      "Plate number must be in format ABC-1234 (3 letters, hyphen, 4 numbers)"
                    );
                  }
                }}
                className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60 uppercase"
                maxLength={8}
                pattern="[A-Z]{3}-[0-9]{4}"
                title="Format: ABC-1234 (3 letters, hyphen, 4 numbers)"
              />
            </Field>
          )} */}

          {/* Plate Number (only for vehicles) */}
          {isVehicle && (
            <Field label="Plate Number">
              <CustomInput
                id="plate_number"
                placeholder="Enter plate number (e.g., ABC-1234)"
                value={form.plate_number}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  // Allow only letters, numbers, and hyphen
                  const filtered = value.replace(/[^A-Z0-9-]/g, "");

                  // Format: ABC-#### (3 letters, hyphen, any number of digits)
                  let formatted = filtered;

                  // Auto-add hyphen after 3 characters only if user has typed 4+ chars without hyphen
                  if (filtered.length >= 4 && !filtered.includes("-")) {
                    formatted = filtered.slice(0, 3) + "-" + filtered.slice(3);
                  }

                  setForm((prev) => ({ ...prev, plate_number: formatted }));
                }}
                onBlur={(e) => {
                  // Validate format on blur only if there's a value
                  // Adjusted regex to allow 4 or more digits
                  const regex = /^[A-Z]{3}-\d{4,}$/;
                  if (e.target.value && !regex.test(e.target.value)) {
                    toast.warning(
                      "Plate number must be in format ABC-#### (3 letters, hyphen, at least 4 numbers)"
                    );
                  }
                }}
                className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60 uppercase"
                pattern="[A-Z]{3}-[0-9]{4,}"
                title="Format: ABC-#### (3 letters, hyphen, at least 4 numbers)"
              />
            </Field>
          )}

          {/* Location select - Only show if not in manual mode */}
          {!manualMode && (
            <Field label="Location">
              <Select
                value={form.location_id || ""}
                onValueChange={handleLocationChange}
                disabled={loadingLocations}
              >
                <SelectTrigger className="h-14 rounded-xl border border-white/20 bg-[#2D2B29] text-white">
                  <SelectValue
                    placeholder={
                      loadingLocations
                        ? "Loading locations..."
                        : "Select location"
                    }
                  />
                </SelectTrigger>

                <SelectContent className="bg-[#2D2B29] text-white border-white/10">
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.location_name}
                    </SelectItem>
                  ))}
                  <SelectItem key="manual" value={MANUAL_LOCATION_VALUE}>
                    Add location manually
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}

          {/* Manual name + suggestions */}
          {manualMode && (
            <Field label="Location Name (Manual)">
              <div className="relative">
                <CustomInput
                  id="location"
                  type="text"
                  placeholder="Enter location name"
                  value={form.location}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({ ...prev, location: val }));
                    getPredictions(val);
                  }}
                  className="max-w-none h-14 rounded-xl bg-[#2D2B29] placeholder:text-white/60"
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
            </Field>
          )}

          <p className="text-sm text-white/70">
            Accurate asset details help improve fuel efficiency tracking and
            maintenance planning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-xl bg-[#FF8500] hover:bg-[#ff9a33] text-white font-medium"
            >
              {submitting ? "Saving..." : "Save Asset"}
            </Button>
            <Button
              type="button"
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

/* small helper */
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

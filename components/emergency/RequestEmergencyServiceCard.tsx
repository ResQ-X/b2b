"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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

type Option = {
  label: string;
  value: string;
  latitude?: string;
  longitude?: string;
};

const MANUAL_LOCATION_VALUE = "__manual__";
const GOOGLE_SCRIPT_SRC = (key?: string) =>
  `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;

export function RequestEmergencyServiceCard({
  vehicleOptions = [],
  locationOptions = [],
  typeOptions = [],
  slotOptions = [],
  onSubmit,
}: {
  vehicleOptions?: Option[];
  locationOptions?: Option[]; // optionally include latitude/longitude per item
  typeOptions?: Option[];
  slotOptions?: Option[];
  onSubmit?: (data: {
    type: string;
    vehicle: string;
    location?: string;
    slot: string;
    notes: string;
    towing_method?: string;
    pickup_location_id?: string;
    pickup_location_name?: string;
    pickup_latitude?: string;
    pickup_longitude?: string;
    dropoff_location_id?: string;
    dropoff_location_name?: string;
    dropoff_latitude?: string;
    dropoff_longitude?: string;
  }) => Promise<void> | void;
}) {
  /* ---------- Google script loader (auto) ---------- */
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  useEffect(() => {
    // already available?
    if (
      typeof window !== "undefined" &&
      (window as any).google &&
      (window as any).google.maps
    ) {
      setIsGoogleLoaded(true);
      return;
    }

    // script present?
    const existing = document.querySelector(
      `script[src^="https://maps.googleapis.com/maps/api/js"]`
    );
    if (existing) {
      const onLoad = () =>
        setIsGoogleLoaded(Boolean((window as any).google?.maps));
      existing.addEventListener?.("load", onLoad);
      if ((window as any).google?.maps) setIsGoogleLoaded(true);
      return () => existing.removeEventListener?.("load", onLoad);
    }

    // inject script
    const key = process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn(
        "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set; Places autocomplete will be disabled."
      );
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC(key);
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Maps script loaded.");
      setIsGoogleLoaded(Boolean((window as any).google?.maps));
    };
    script.onerror = (e) => {
      console.error("Failed to load Google Maps script", e);
    };
    document.head.appendChild(script);

    return () => {
      // don't remove script (avoids reloads), but if you want to remove uncomment next lines:
      // if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  /* ---------- basic form ---------- */
  const [form, setForm] = useState({
    vehicle: "",
    type: "",
    location: "", // non-towing
    slot: "",
    notes: "",
  });

  const isTowing = form.type === "TOWING";

  /* ---------- towing fields & coords ---------- */
  const [towingMethod, setTowingMethod] = useState<string>("");

  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [pickupManualName, setPickupManualName] = useState<string>("");
  const [pickupLatitude, setPickupLatitude] = useState<string>("");
  const [pickupLongitude, setPickupLongitude] = useState<string>("");

  const [dropoffLocationId, setDropoffLocationId] = useState<string>("");
  const [dropoffManualName, setDropoffManualName] = useState<string>("");
  const [dropoffLatitude, setDropoffLatitude] = useState<string>("");
  const [dropoffLongitude, setDropoffLongitude] = useState<string>("");

  /* ---------- predictions per field ---------- */
  const [pickupPredictions, setPickupPredictions] = useState<
    { description: string; place_id?: string }[]
  >([]);
  const [dropoffPredictions, setDropoffPredictions] = useState<
    { description: string; place_id?: string }[]
  >([]);

  /* ---------- separate debounce refs ---------- */
  const pickupTimer = useRef<number | null>(null);
  const dropoffTimer = useRef<number | null>(null);

  /* ---------- helpers: predictions & geocode ---------- */
  const fetchPredictions = (
    input: string,
    setter: typeof setPickupPredictions
  ) => {
    if (!isGoogleLoaded || !input.trim()) {
      setter([]);
      return;
    }
    try {
      const service = new (
        window as any
      ).google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input, componentRestrictions: { country: "ng" } },
        (preds: any, status: string) => {
          if (status === "OK" && preds) {
            setter(
              preds.map((p: any) => ({
                description: p.description,
                place_id: p.place_id,
              }))
            );
          } else {
            setter([]);
            // useful debug:
            // status could be "ZERO_RESULTS" or "OVER_QUERY_LIMIT" etc.
            // console.debug("Predictions status:", status, preds);
          }
        }
      );
    } catch (err) {
      console.warn("fetchPredictions error:", err);
      setter([]);
    }
  };

  const geocodeByPlaceId = (placeId: string) => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!isGoogleLoaded) return reject(new Error("Google not loaded"));
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ placeId }, (results: any, status: string) => {
          if (status === "OK" && results && results[0] && results[0].geometry) {
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng() });
          } else {
            reject(status || "NO_RESULTS");
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const geocodeByAddress = (address: string) => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!isGoogleLoaded) return reject(new Error("Google not loaded"));
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status === "OK" && results && results[0] && results[0].geometry) {
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng() });
          } else {
            reject(status || "NO_RESULTS");
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  /* ---------- handlers for typing & selecting predictions ---------- */
  const onPickupInputChange = (value: string) => {
    setPickupManualName(value);
    setPickupLatitude("");
    setPickupLongitude("");
    setPickupPredictions([]);
    if (pickupTimer.current) window.clearTimeout(pickupTimer.current);
    pickupTimer.current = window.setTimeout(() => {
      fetchPredictions(value, setPickupPredictions);
    }, 250);
  };

  const onDropoffInputChange = (value: string) => {
    setDropoffManualName(value);
    setDropoffLatitude("");
    setDropoffLongitude("");
    setDropoffPredictions([]);
    if (dropoffTimer.current) window.clearTimeout(dropoffTimer.current);
    dropoffTimer.current = window.setTimeout(() => {
      fetchPredictions(value, setDropoffPredictions);
    }, 250);
  };

  const selectPickupPrediction = async (pred: {
    description: string;
    place_id?: string;
  }) => {
    setPickupPredictions([]);
    setPickupManualName(pred.description);
    setPickupLocationId(MANUAL_LOCATION_VALUE);
    try {
      if (pred.place_id) {
        const coords = await geocodeByPlaceId(pred.place_id);
        setPickupLatitude(String(coords.lat));
        setPickupLongitude(String(coords.lng));
      } else {
        const coords = await geocodeByAddress(pred.description);
        setPickupLatitude(String(coords.lat));
        setPickupLongitude(String(coords.lng));
      }
    } catch (err) {
      console.warn("pickup geocode failed:", err);
      // leave coords blank and let backend handle, but keep name
    }
  };

  const selectDropoffPrediction = async (pred: {
    description: string;
    place_id?: string;
  }) => {
    setDropoffPredictions([]);
    setDropoffManualName(pred.description);
    setDropoffLocationId(MANUAL_LOCATION_VALUE);
    try {
      if (pred.place_id) {
        const coords = await geocodeByPlaceId(pred.place_id);
        setDropoffLatitude(String(coords.lat));
        setDropoffLongitude(String(coords.lng));
      } else {
        const coords = await geocodeByAddress(pred.description);
        setDropoffLatitude(String(coords.lat));
        setDropoffLongitude(String(coords.lng));
      }
    } catch (err) {
      console.warn("dropoff geocode failed:", err);
    }
  };

  /* ---------- selecting saved location fallback (use provided coords if present, otherwise geocode label) ---------- */
  const handlePickupLocationSelect = async (value: string) => {
    setPickupPredictions([]);
    setPickupManualName("");
    setPickupLatitude("");
    setPickupLongitude("");
    setPickupLocationId(value);

    if (!value || value === MANUAL_LOCATION_VALUE) return;

    const sel = locationOptions.find((o) => o.value === value);
    const label = sel?.label || "";

    if (sel?.latitude && sel?.longitude) {
      setPickupLatitude(String(sel.latitude));
      setPickupLongitude(String(sel.longitude));
      setPickupManualName(label);
      return;
    }

    // fallback geocode the label
    try {
      const coords = await geocodeByAddress(label);
      setPickupLatitude(String(coords.lat));
      setPickupLongitude(String(coords.lng));
      setPickupManualName(label);
    } catch (err) {
      console.warn("pickup fallback geocode failed:", err);
      setPickupManualName(label);
    }
  };

  const handleDropoffLocationSelect = async (value: string) => {
    setDropoffPredictions([]);
    setDropoffManualName("");
    setDropoffLatitude("");
    setDropoffLongitude("");
    setDropoffLocationId(value);

    if (!value || value === MANUAL_LOCATION_VALUE) return;

    const sel = locationOptions.find((o) => o.value === value);
    const label = sel?.label || "";

    if (sel?.latitude && sel?.longitude) {
      setDropoffLatitude(String(sel.latitude));
      setDropoffLongitude(String(sel.longitude));
      setDropoffManualName(label);
      return;
    }

    try {
      const coords = await geocodeByAddress(label);
      setDropoffLatitude(String(coords.lat));
      setDropoffLongitude(String(coords.lng));
      setDropoffManualName(label);
    } catch (err) {
      console.warn("dropoff fallback geocode failed:", err);
      setDropoffManualName(label);
    }
  };

  /* ---------- validation & submit ---------- */
  const canSubmit = useMemo(() => {
    const base =
      !!form.vehicle &&
      !!form.type &&
      !!form.slot &&
      (isTowing ? true : !!form.location);
    if (!base) return false;
    if (!isTowing) return true;

    const pickupOk =
      (pickupLocationId && pickupLocationId !== MANUAL_LOCATION_VALUE) ||
      (pickupManualName.trim() && pickupLatitude && pickupLongitude);
    const dropoffOk =
      (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) ||
      (dropoffManualName.trim() && dropoffLatitude && dropoffLongitude);

    return !!(towingMethod && pickupOk && dropoffOk);
  }, [
    form.vehicle,
    form.type,
    form.location,
    form.slot,
    isTowing,
    towingMethod,
    pickupLocationId,
    pickupManualName,
    pickupLatitude,
    pickupLongitude,
    dropoffLocationId,
    dropoffManualName,
    dropoffLatitude,
    dropoffLongitude,
  ]);

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) return;

    const payload: any = {
      type: form.type,
      vehicle: form.vehicle,
      slot: form.slot,
      notes: form.notes,
    };

    if (!isTowing) {
      payload.location = form.location;
    } else {
      payload.towing_method = towingMethod;
      // pickup
      if (pickupLocationId && pickupLocationId !== MANUAL_LOCATION_VALUE) {
        payload.pickup_location_id = pickupLocationId;
        const sel = locationOptions.find((o) => o.value === pickupLocationId);
        if (sel) {
          payload.pickup_location_name = sel.label;
          if (sel.latitude) payload.pickup_latitude = String(sel.latitude);
          if (sel.longitude) payload.pickup_longitude = String(sel.longitude);
        }
        if (!payload.pickup_latitude && pickupLatitude)
          payload.pickup_latitude = pickupLatitude;
        if (!payload.pickup_longitude && pickupLongitude)
          payload.pickup_longitude = pickupLongitude;
      } else {
        payload.pickup_location_name = pickupManualName;
        if (pickupLatitude) payload.pickup_latitude = pickupLatitude;
        if (pickupLongitude) payload.pickup_longitude = pickupLongitude;
      }

      // dropoff
      if (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) {
        payload.dropoff_location_id = dropoffLocationId;
        const sel = locationOptions.find((o) => o.value === dropoffLocationId);
        if (sel) {
          payload.dropoff_location_name = sel.label;
          if (sel.latitude) payload.dropoff_latitude = String(sel.latitude);
          if (sel.longitude) payload.dropoff_longitude = String(sel.longitude);
        }
        if (!payload.dropoff_latitude && dropoffLatitude)
          payload.dropoff_latitude = dropoffLatitude;
        if (!payload.dropoff_longitude && dropoffLongitude)
          payload.dropoff_longitude = dropoffLongitude;
      } else {
        payload.dropoff_location_name = dropoffManualName;
        if (dropoffLatitude) payload.dropoff_latitude = dropoffLatitude;
        if (dropoffLongitude) payload.dropoff_longitude = dropoffLongitude;
      }
    }

    console.debug("Submitting payload:", payload);
    await onSubmit(payload);

    // reset state
    setForm({ vehicle: "", type: "", location: "", slot: "", notes: "" });
    setTowingMethod("");
    setPickupLocationId("");
    setPickupManualName("");
    setPickupLatitude("");
    setPickupLongitude("");
    setDropoffLocationId("");
    setDropoffManualName("");
    setDropoffLatitude("");
    setDropoffLongitude("");
    setPickupPredictions([]);
    setDropoffPredictions([]);
  };

  /* ---------- cleanup ---------- */
  useEffect(() => {
    return () => {
      if (pickupTimer.current) window.clearTimeout(pickupTimer.current);
      if (dropoffTimer.current) window.clearTimeout(dropoffTimer.current);
    };
  }, []);

  /* ---------- UI ---------- */
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
            onValueChange={(v) =>
              setForm((p) => ({
                ...p,
                type: v,
                location: v === "TOWING" ? "" : p.location,
              }))
            }
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

        {/* TOWING UI */}
        {isTowing && (
          <>
            <Field label="Towing Method">
              <Select
                value={towingMethod}
                onValueChange={(v) => setTowingMethod(v)}
              >
                <Trigger />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  <SelectItem value="FLATBED">Flatbed Towing</SelectItem>
                  <SelectItem value="HOOK_AND_CHAIN">
                    Hook and Chain Towing
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Pick Up Location">
              <Select
                value={pickupLocationId}
                onValueChange={(v) => handlePickupLocationSelect(v)}
              >
                <Trigger />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {locationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  <SelectItem value={MANUAL_LOCATION_VALUE}>
                    Enter manually
                  </SelectItem>
                </SelectContent>
              </Select>

              {pickupLocationId === MANUAL_LOCATION_VALUE && (
                <div className="relative mt-2">
                  <input
                    value={pickupManualName}
                    onChange={(e) => onPickupInputChange(e.target.value)}
                    placeholder="Type an address or place"
                    className="w-full h-12 rounded-xl bg-[#2D2A27] placeholder:text-white/60 text-white border border-white/10 px-3"
                  />

                  {pickupPredictions.length > 0 && (
                    <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                      {pickupPredictions.map((p, idx) => (
                        <div
                          key={p.place_id || idx}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectPickupPrediction(p)}
                        >
                          {p.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {pickupLatitude && pickupLongitude && (
                <p className="text-sm text-white/60 mt-2">{`Coords: ${pickupLatitude}, ${pickupLongitude}`}</p>
              )}
            </Field>

            <Field label="Drop Off Location">
              <Select
                value={dropoffLocationId}
                onValueChange={(v) => handleDropoffLocationSelect(v)}
              >
                <Trigger />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {locationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  <SelectItem value={MANUAL_LOCATION_VALUE}>
                    Enter manually
                  </SelectItem>
                </SelectContent>
              </Select>

              {dropoffLocationId === MANUAL_LOCATION_VALUE && (
                <div className="relative mt-2">
                  <input
                    value={dropoffManualName}
                    onChange={(e) => onDropoffInputChange(e.target.value)}
                    placeholder="Type an address or place"
                    className="w-full h-12 rounded-xl bg-[#2D2A27] placeholder:text-white/60 text-white border border-white/10 px-3"
                  />

                  {dropoffPredictions.length > 0 && (
                    <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                      {dropoffPredictions.map((p, idx) => (
                        <div
                          key={p.place_id || idx}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectDropoffPrediction(p)}
                        >
                          {p.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dropoffLatitude && dropoffLongitude && (
                <p className="text-sm text-white/60 mt-2">{`Coords: ${dropoffLatitude}, ${dropoffLongitude}`}</p>
              )}
            </Field>
          </>
        )}

        {/* NON-TOWING: normal location */}
        {!isTowing && (
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
        )}

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

/* ---------- small helpers ---------- */
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

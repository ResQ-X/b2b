import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  SelectSeparator,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

/* ===================== Types ===================== */

export type RequestFuelForm = {
  slot: string;
  location: any;
  vehicle: any;
  type: any;
  fuel_type: string;
  asset_id: string;
  asset_ids?: string[];
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

type ValidationErrors = {
  fuel_type?: string;
  asset_id?: string;
  location_id?: string;
  location_address?: string;
  time_slot?: string;
  quantity?: string;
};

type CheckoutBreakdown = {
  fuel_type: string;
  quantity: number;
  consumablePrice: number;
  servicePrice: number;
  deliveryPrice: number;
  payAsYouUsePrice: number;
  subscriptionApplied: boolean;
  subscriptionCharge: number | null;
  estimatedCharge: number;
  walletBalance: number;
  subscriptionRemainingUses: number | null;
};

type InitFuelResponse = {
  success: boolean;
  breakdown: CheckoutBreakdown;
  assets: Array<{
    id: string;
    plate_number: string | null;
  }>;
  missingAssets: string[];
  locationPreview: {
    source: string;
    location: {
      id: string;
      name: string;
      latitude: string;
      longitude: string;
    } | null;
  };
};

const MANUAL_LOCATION_VALUE = "__manual__";

/* ===================== Checkout Modal ===================== */

function FuelCheckoutModal({
  open,
  onOpenChange,
  breakdown,
  locationPreview,
  assets,
  onConfirm,
  processing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakdown: CheckoutBreakdown | null;
  locationPreview: InitFuelResponse["locationPreview"] | null;
  assets: InitFuelResponse["assets"] | null;
  onConfirm: () => Promise<void>;
  processing: boolean;
}) {
  if (!breakdown) return null;

  const formatNaira = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-[#ABABAB] text-sm font-medium">{label}</span>
      <span className="text-[#ABABAB] text-sm font-medium">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 lg:max-w-[640px] rounded-[28px] border border-white/10 bg-[#1F1E1C] text-white p-7 md:p-9 max-h-[90vh] overflow-y-auto overscroll-contain">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <section className="pt-4">
            <h3 className="text-[#FFFFFF] text-[16px] font-semibold mb-3">
              Order Summary
            </h3>
            <div className="space-y-1">
              <SummaryRow
                label="Fuel Type"
                value={
                  breakdown.fuel_type.charAt(0) +
                  breakdown.fuel_type.slice(1).toLowerCase()
                }
              />
              <SummaryRow
                label="Quantity"
                value={`${breakdown.quantity} litres`}
              />
              {locationPreview?.location && (
                <SummaryRow
                  label="Location"
                  value={locationPreview.location.name}
                />
              )}
              {assets && assets.length > 0 && (
                <SummaryRow
                  label="Vehicle(s)"
                  value={
                    assets.length === 1
                      ? assets[0].plate_number || "Vehicle"
                      : `${assets.length} vehicles`
                  }
                />
              )}
            </div>
          </section>

          {/* Additional Note */}
          {/* {orderDetails.additionalNotes && ( */}
          <div className="bg-[#3B3835] h-[120px] py-3 px-5 border-l-4 border-[#FF8500] rounded-xl">
            <h3 className="text-white text-[15px] font-semibold mb-3">
              Additional Note
            </h3>
            <p className="text-white/80 mt-5">
              No additional note
              {/* {orderDetails.additionalNotes} */}
            </p>
          </div>
          {/* )} */}

          {/* Payment Summary */}
          <section className="pt-4">
            <h3 className="text-[#FFFFFF] text-[16px] font-semibold mb-3">
              Payment Summary
            </h3>
            <div className="space-y-1">
              <SummaryRow
                label="Fuel Cost"
                value={formatNaira(breakdown.consumablePrice)}
              />
              <SummaryRow
                label="Service Fee"
                value={formatNaira(breakdown.servicePrice)}
              />
              <SummaryRow
                label="Delivery Fee"
                value={formatNaira(breakdown.deliveryPrice)}
              />

              {breakdown.subscriptionApplied &&
                breakdown.subscriptionCharge && (
                  <SummaryRow
                    label="Subscription Charge"
                    value={formatNaira(breakdown.subscriptionCharge)}
                  />
                )}

              <div className="pt-2 mt-2 border-t border-white/10">
                <div className="flex items-center justify-between py-2">
                  <span className="text-white font-semibold text-lg">
                    Total Amount:
                  </span>
                  <span className="text-white font-bold text-lg">
                    {formatNaira(breakdown.estimatedCharge)}
                  </span>
                </div>
              </div>

              {breakdown.walletBalance > 0 && (
                <div className="pt-2">
                  <SummaryRow
                    label="Wallet Balance"
                    value={formatNaira(breakdown.walletBalance)}
                  />
                </div>
              )}

              {breakdown.subscriptionRemainingUses !== null && (
                <div className="bg-[#3B3835] p-3 rounded-xl mt-4">
                  <p className="text-white/80 text-sm">
                    Subscription remaining uses:{" "}
                    {breakdown.subscriptionRemainingUses}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={onConfirm}
            variant="orange"
            disabled={processing}
            className="w-full h-[58px] lg:h-[60px] rounded-xl disabled:opacity-50"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ===================== Small UI helpers ===================== */

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80">{label}</Label>
      {children}
      {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
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

/* ===================== Vehicles Multi-Select ===================== */

function VehiclesMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select vehicles",
  disabled = false,
}: {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const allValues = React.useMemo(() => options.map((o) => o.value), [options]);
  const allChecked = value.length > 0 && value.length === allValues.length;
  const indeterminate = value.length > 0 && value.length < allValues.length;

  const toggleAll = () => {
    onChange(allChecked ? [] : allValues);
  };

  const toggleOne = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  const labelText = React.useMemo(() => {
    if (value.length === 0)
      return <span className="text-white/60">{placeholder}</span>;
    if (value.length === 1) {
      const single =
        options.find((o) => o.value === value[0])?.label || "1 selected";
      return <span className="truncate">{single}</span>;
    }
    return <span className="truncate">{value.length} selected</span>;
  }, [value, options, placeholder]);

  const handleKeyActivate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAll();
    }
  };

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={[
            "w-full h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white px-4",
            "flex items-center justify-between gap-2 text-left",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {labelText}
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            className="opacity-80"
          >
            <path fill="currentColor" d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
          </svg>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="p-0 w-[min(520px,92vw)] bg-[#2D2A27] text-white border border-white/10 rounded-xl max-h-[70vh] overflow-y-auto touch-pan-y overscroll-contain z-[70]"
      >
        <Command className="bg-transparent text-white">
          <div className="p-2">
            <CommandInput
              placeholder="Search vehicles..."
              className="bg[#2D2A27] text-white placeholder:text-white/60"
            />
          </div>

          <div className="px-3 pb-2 pt-1">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={allChecked}
              onClick={toggleAll}
              onKeyDown={handleKeyActivate}
              className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2 hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 transition-colors outline-none"
            >
              <Checkbox
                checked={allChecked}
                className={[
                  "border-white/40",
                  "data-[state=checked]:bg-[#FF8500] data-[state=checked]:border-[#FF8500]",
                  indeterminate ? "opacity-80" : "",
                ].join(" ")}
              />
              <span className="font-medium">Select all vehicles</span>
              <span className="ml-auto text-xs text-white/60">
                {value.length}/{options.length}
              </span>
            </div>
          </div>

          <CommandList className="max-h-[50vh] overflow-y-auto touch-pan-y overscroll-contain">
            <CommandEmpty className="px-4 py-3 text-white/60">
              No vehicles found.
            </CommandEmpty>

            <CommandGroup>
              {options.map((opt, idx) => (
                <div key={opt.value}>
                  <CommandItem
                    value={opt.label}
                    onSelect={() => toggleOne(opt.value)}
                    className="ml-2 cursor-pointer rounded-[10px] px-3 py-2 transition-colors text-white hover:bg-[#FF8500]/20 hover:text-white focus:bg-[#FF8500]/25 focus:text-white"
                  >
                    <Checkbox
                      checked={value.includes(opt.value)}
                      onCheckedChange={() => toggleOne(opt.value)}
                      className="mr-3 border-white/40 data-[state=checked]:bg-[#FF8500] data-[state=checked]:border-[#FF8500]"
                    />
                    <span className="truncate">{opt.label}</span>
                  </CommandItem>

                  {idx < options.length - 1 && (
                    <div className="h-px bg-white/10 mx-3" />
                  )}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

//  onSubmit?: (data: RequestFuelForm) => Promise<void>;

/* ===================== Main Component ===================== */

export default function RequestFuelModal({
  open,
  onOpenChange,
  initialValues,
  typeOptions = [],
  vehicleOptions = [],
  locationOptions = [],
  title = "Request Fuel Service",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<RequestFuelForm>;
  typeOptions?: Option[];
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  title?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [form, setForm] = useState<RequestFuelForm>({
    slot: initialValues?.slot || "",
    location: initialValues?.location || "",
    vehicle: initialValues?.vehicle || "",
    type: initialValues?.type || "",
    fuel_type: initialValues?.fuel_type || "",
    asset_id: initialValues?.asset_id || "",
    asset_ids: initialValues?.asset_ids || [],
    location_id: initialValues?.location_id || "",
    location_address: initialValues?.location_address || "",
    location_longitude: initialValues?.location_longitude || "",
    location_latitude: initialValues?.location_latitude || "",
    time_slot: initialValues?.time_slot || "",
    quantity: initialValues?.quantity || 0,
    note: initialValues?.note || "",
    is_scheduled: initialValues?.is_scheduled || false,
  });

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<InitFuelResponse | null>(
    null
  );
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  // Google Maps state
  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const typingTimer = useRef<number | null>(null);

  // --- NEW: Amount & unit price cache ---
  const [amount, setAmount] = useState<number | "">(""); // ₦
  const [unitPrices, setUnitPrices] = useState<{
    petrol?: number;
    diesel?: number;
  } | null>(null);
  const [converting, setConverting] = useState(false);
  const upperFuel = (form.fuel_type || "").toUpperCase(); // "DIESEL" | "PETROL"

  // Fetch details (and unit prices) once; reuse afterwards
  const fetchFuelDetails = async (naira: number, fuelType: string) => {
    const params = {
      amount: String(Math.max(0, Math.floor(naira || 0))),
      fuel_type: (fuelType || "").toUpperCase(),
    };
    const res = await axiosInstance.get("/fleet-service/get-fuel-details", {
      params,
    });
    return res.data as {
      success: boolean;
      unit_price: { petrol?: number; diesel?: number };
      estimation: {
        amount: number;
        fuel_type: string;
        unit_price: number;
        litres: number;
      };
    };
  };

  // Ensure we have unit prices for local litre→amount math
  const ensureUnitPrices = async () => {
    if (unitPrices && (unitPrices.petrol || unitPrices.diesel))
      return unitPrices;
    if (!upperFuel) return unitPrices; // don't fetch until fuel selected
    // cheap call; amount=1 is enough to get unit prices
    const data = await fetchFuelDetails(1, upperFuel);
    setUnitPrices(data.unit_price || null);
    return data.unit_price || null;
  };

  // Convert NGN→Litres via API (authoritative)
  const convertAmountToLitres = async (naira: number) => {
    if (!upperFuel) return;
    setConverting(true);
    try {
      const data = await fetchFuelDetails(naira, upperFuel);
      const litres = data?.estimation?.litres ?? 0;
      // Round to whole litres to satisfy current validation rule
      const rounded = Math.max(0, Math.round(litres));
      setForm((p) => ({
        ...p,
        quantity: rounded,
      }));
    } catch (e) {
      // soft-fail: don't change quantity
      console.error("NGN→L conversion failed", e);
    } finally {
      setConverting(false);
    }
  };

  // Debounce helper for amount → litres conversion
  const amountDebounceRef = useRef<number | null>(null);
  const queueAmountConvert = (naira: number) => {
    if (amountDebounceRef.current)
      window.clearTimeout(amountDebounceRef.current);
    amountDebounceRef.current = window.setTimeout(() => {
      convertAmountToLitres(naira);
    }, 250);
  };

  // Convert Litres→NGN locally (uses cached unit price)
  const convertLitresToAmount = async (litresRaw: number) => {
    if (!upperFuel) return;
    const prices = await ensureUnitPrices();
    const perL =
      upperFuel === "DIESEL"
        ? prices?.diesel
        : upperFuel === "PETROL"
        ? prices?.petrol
        : undefined;

    if (!perL) return; // no change if unknown
    const naira = Math.max(0, Math.round((litresRaw || 0) * perL));
    setAmount(naira || "");
  };

  /* -------- Validation -------- */

  const validateForm = (): boolean => {
    const next: ValidationErrors = {};

    if (!form.fuel_type) next.fuel_type = "Please select a fuel type";

    if (!form.asset_id && (!form.asset_ids || form.asset_ids.length === 0)) {
      next.asset_id = "Please select at least one vehicle";
    }

    const manualMode = form.location_id === MANUAL_LOCATION_VALUE;
    if (!manualMode && !form.location_id) {
      next.location_id = "Please select a location";
    }
    if (manualMode && !form.location_address?.trim()) {
      next.location_address = "Please enter a location address";
    }

    if (!form.time_slot) next.time_slot = "Please select a time slot";

    if (!form.quantity || form.quantity <= 0) {
      next.quantity = "Quantity must be greater than 0";
    } else if (form.quantity < 25) {
      next.quantity = "Minimum quantity is 25 litres";
    } else if (form.quantity > 5000) {
      next.quantity = "Maximum quantity is 5000 litres";
    } else if (!Number.isInteger(Number(form.quantity))) {
      next.quantity = "Quantity must be a whole number";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const clearError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  /* -------- Sync on open -------- */

  useEffect(() => {
    if (open) {
      setForm({
        slot: initialValues?.slot || "",
        location: initialValues?.location || "",
        vehicle: initialValues?.vehicle || "",
        type: initialValues?.type || "",
        fuel_type: initialValues?.fuel_type || "",
        asset_id: initialValues?.asset_id || "",
        asset_ids: initialValues?.asset_ids || [],
        location_id: initialValues?.location_id || "",
        location_address: initialValues?.location_address || "",
        location_longitude: initialValues?.location_longitude || "",
        location_latitude: initialValues?.location_latitude || "",
        time_slot: initialValues?.time_slot || "",
        quantity: initialValues?.quantity || 0,
        note: initialValues?.note || "",
        is_scheduled: initialValues?.is_scheduled || false,
      });
      setErrors({});
      setLookupError(null);
      setPredictions([]);
    }
  }, [open, initialValues]);

  /* -------- Google Maps loader -------- */

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

  /* -------- Place predictions (debounced) -------- */

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
    clearError("location_address");

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

  /* -------- Location change -------- */

  const handleLocationChange = (locationId: string) => {
    clearError("location_id");

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
      }));
    }
  };

  const manualMode = form.location_id === MANUAL_LOCATION_VALUE;

  const canSubmit = useMemo(
    () =>
      form.fuel_type &&
      (form.asset_id || (form.asset_ids && form.asset_ids.length > 0)) &&
      (form.location_id || form.location_address) &&
      form.time_slot &&
      form.quantity > 0,
    [form]
  );

  /* -------- Build request payload -------- */

  const buildRequestPayload = () => {
    const isManualLocation = form.location_id === MANUAL_LOCATION_VALUE;

    return {
      fuel_type: form.fuel_type,
      asset_ids: form.asset_ids,
      ...(isManualLocation ? {} : { location_id: form.location_id }),
      ...(isManualLocation
        ? {
            location_address: form.location_address || "",
            location_longitude: form.location_longitude || "",
            location_latitude: form.location_latitude || "",
          }
        : {}),
      time_slot:
        form.time_slot === "NOW" ? new Date().toISOString() : form.time_slot,
      quantity: form.quantity,
      note: form.note,
      is_scheduled: form.time_slot !== "NOW",
    };
  };

  /* -------- Submit: Call init endpoint & show checkout -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = buildRequestPayload();

      const response = await axiosInstance.post(
        "/fleet-service/init-fuel-service",
        payload
      );

      if (response.data.success && response.data.breakdown) {
        setCheckoutData(response.data);
        setCheckoutOpen(true);
      } else {
        toast.error("Failed to initialize fuel service");
      }
    } catch (error: any) {
      console.error("Init fuel service error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to initialize fuel service"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- Confirm checkout: Call place endpoint -------- */

  const handleConfirmCheckout = async () => {
    setCheckoutProcessing(true);
    try {
      const payload = buildRequestPayload();

      await axiosInstance.post("/fleet-service/place-fuel-service", payload);

      toast.success("Fuel service requested successfully!");

      // Close both modals
      setCheckoutOpen(false);
      onOpenChange(false);

      // Reset form
      setForm({
        slot: "",
        location: "",
        vehicle: "",
        type: "",
        fuel_type: "",
        asset_id: "",
        asset_ids: [],
        location_id: "",
        location_address: "",
        location_longitude: "",
        location_latitude: "",
        time_slot: "",
        quantity: 0,
        note: "",
        is_scheduled: false,
      });
      setErrors({});
      setCheckoutData(null);
    } catch (error: any) {
      console.error("Place fuel service error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to place fuel service"
      );
    } finally {
      setCheckoutProcessing(false);
    }
  };

  // When dialog opens, reset amount mirror
  useEffect(() => {
    if (open) setAmount("");
  }, [open]);

  // When fuel type changes, clear amount and refetch prices lazily
  useEffect(() => {
    setAmount("");
    // prime unit prices in the background (best-effort)
    if (upperFuel) {
      ensureUnitPrices().catch(() => {});
    }
    // re-derive amount if we already have litres
    if (form.quantity && form.quantity > 0) {
      convertLitresToAmount(form.quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fuel_type]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-11/12 lg:max-w-[640px] rounded-[28px] border border-white/10 bg-[#1F1E1C] text-white p-7 md:p-9 max-h-[90vh] overflow-y-auto overscroll-contain">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-[28px] leading-8 font-semibold">
              {title}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fuel Type */}
            <Field label="Fuel Type" error={errors.fuel_type}>
              <Select
                value={form.fuel_type}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, fuel_type: v }));
                  clearError("fuel_type");
                }}
              >
                <Trigger placeholder="Select fuel type" />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {typeOptions.map((opt, idx) => (
                    <Fragment key={opt.value}>
                      <SelectItem
                        value={opt.value}
                        className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white font-medium"
                      >
                        {opt.label}
                      </SelectItem>
                      {idx < typeOptions.length - 1 && (
                        <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                      )}
                    </Fragment>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Vehicles (multi) */}
            <Field label="Vehicle(s)" error={errors.asset_id}>
              <VehiclesMultiSelect
                options={vehicleOptions}
                value={form.asset_ids || []}
                onChange={(ids) => {
                  setForm((prev) => ({
                    ...prev,
                    asset_ids: ids,
                    asset_id: ids[0] || "",
                  }));
                  if (ids.length > 0) clearError("asset_id");
                }}
                placeholder={
                  vehicleOptions.length > 0
                    ? "Select vehicles"
                    : "No vehicles available"
                }
                disabled={vehicleOptions.length === 0}
              />

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

            {/* Service Location (saved) */}
            {!manualMode && (
              <Field label="Service Location" error={errors.location_id}>
                <Select
                  value={form.location_id || ""}
                  onValueChange={handleLocationChange}
                >
                  <Trigger placeholder="Select location" />
                  <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                    {locationOptions.map((opt, i) => (
                      <Fragment key={opt.value}>
                        <SelectItem
                          value={opt.value}
                          className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
                        >
                          {opt.label}
                        </SelectItem>
                        {i < locationOptions.length - 1 && (
                          <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                        )}
                      </Fragment>
                    ))}

                    <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />

                    <SelectItem
                      value={MANUAL_LOCATION_VALUE}
                      className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white font-medium"
                    >
                      Add location manually
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}

            {/* Manual Location */}
            {manualMode && (
              <Field
                label="Location Name (Manual)"
                error={errors.location_address}
              >
                <div className="relative">
                  <CustomInput
                    type="text"
                    placeholder="Enter location name"
                    value={form.location_address}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({ ...prev, location_address: val }));
                      clearError("location_address");
                      getPredictions(val);
                    }}
                    className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
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

            {/* Date & Time Slot */}
            <Field label="Date & Time" error={errors.time_slot}>
              <DateTimePicker
                value={form.time_slot}
                onChange={(v) => {
                  setForm((p) => ({ ...p, time_slot: v }));
                  clearError("time_slot");
                }}
                placeholder="Select date and time"
              />
            </Field>

            {/* Quantity & Amount */}
            <div className="flex items-center gap-6">
              {/* Quantity (Litres) → updates Amount locally */}
              <div className="w-4/5">
                <Field label="Quantity (Litres)" error={errors.quantity}>
                  <CustomInput
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity === 0 ? "" : String(form.quantity)}
                    onChange={(e) => {
                      const val = e.target.value;
                      const litres =
                        val === "" ? 0 : Math.max(0, parseInt(val, 10) || 0);
                      setForm((p) => ({ ...p, quantity: litres }));
                      clearError("quantity");
                      // keep amount in sync (no API needed for this direction)
                      if (val === "") {
                        setAmount("");
                      } else {
                        convertLitresToAmount(litres);
                      }
                    }}
                    placeholder="Enter quantity in litres (min: 25L)"
                    className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                  />
                </Field>
              </div>

              {/* Amount (₦) → updates Quantity via API */}
              <Field label="Amount (₦)" error={errors.quantity}>
                <CustomInput
                  type="number"
                  min="0"
                  step="1"
                  value={amount === "" ? "" : String(amount)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setAmount("");
                      // don't force quantity to zero; keep last computed litres until user confirms/edits
                      return;
                    }
                    const naira = Math.max(0, Math.floor(Number(val) || 0));
                    setAmount(naira);
                    // debounce to avoid hammering the endpoint
                    if (upperFuel) queueAmountConvert(naira);
                  }}
                  placeholder="Enter amount in ₦"
                  className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                />
                {converting && (
                  <p className="text-xs text-white/60 mt-1">Converting…</p>
                )}
              </Field>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-white/80">Additional Notes</Label>
              <Textarea
                value={form.note}
                onChange={(e) =>
                  setForm((p) => ({ ...p, note: e.target.value }))
                }
                placeholder="Add any extra details to help us find your location or complete the request."
                className="min-h-[120px] rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
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

      {/* Checkout Modal */}
      <FuelCheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        breakdown={checkoutData?.breakdown || null}
        locationPreview={checkoutData?.locationPreview || null}
        assets={checkoutData?.assets || null}
        onConfirm={handleConfirmCheckout}
        processing={checkoutProcessing}
      />
    </>
  );
}

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
  apply_quantity_to_all_assets: boolean; // NEW
  per_vehicle_quantities?: Array<{ asset_id: string; quantity: number }>; // NEW
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
  fuelProductCost: number;
  serviceChargeAmount: number;
  deliveryFeeAmount: number;
  totalCostWithoutSubscription: number;
  subscriptionApplied: boolean;
  subscriptionCost: number | null;
  finalTotalCost: number;
  walletBalance: number;
  subscriptionRemainingUses: number | null;
};

type InitFuelResponse = {
  note?: string;
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
  note,
  open,
  onOpenChange,
  breakdown,
  locationPreview,
  assets,
  onConfirm,
  processing,
}: {
  note?: string;
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
            <p className="text-white/80 mt-5">{note}</p>
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
                value={formatNaira(breakdown.fuelProductCost)}
              />
              <SummaryRow
                label="Service Fee"
                value={formatNaira(breakdown.serviceChargeAmount)}
              />
              <SummaryRow
                label="Delivery Fee"
                value={formatNaira(breakdown.deliveryFeeAmount)}
              />

              {/* {breakdown.subscriptionApplied &&
                breakdown.subscriptionCharge && (
                  <SummaryRow
                    label="Subscription Charge"
                    value={formatNaira(breakdown.subscriptionCharge)}
                  />
                )} */}

              <div className="pt-2 mt-2 border-t border-white/10">
                <div className="flex items-center justify-between py-2">
                  <span className="text-white font-semibold text-lg">
                    Total Amount:
                  </span>
                  <span className="text-white font-bold text-lg">
                    {formatNaira(breakdown.finalTotalCost)}
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

/* ===================== Vehicle Quantity Card ===================== */

function VehicleQuantityCard({
  vehicleName,
  litres,
  amount,
  onLitresChange,
  error,
}: {
  vehicleName: string;
  litres: number;
  amount: number | "";
  onLitresChange: (litres: number) => void;
  error?: string;
}) {
  return (
    <div className="bg-[#2D2A27] rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-medium text-sm">{vehicleName}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label className="text-white/60 text-xs mb-1">Litres</Label>
          <CustomInput
            type="text"
            value={litres === 0 ? "" : litres.toLocaleString("en-NG")}
            onChange={(e) => {
              const val = e.target.value.replace(/,/g, "");
              const litresNum =
                val === "" ? 0 : Math.max(0, parseInt(val, 10) || 0);
              onLitresChange(litresNum);
            }}
            placeholder="Litres"
            className="h-12 bg-[#1F1E1C] border-white/10 rounded-xl"
          />
        </div>
        <div className="flex-1">
          <Label className="text-white/60 text-xs mb-1">Amount (₦)</Label>
          <CustomInput
            type="text"
            value={amount === "" ? "" : Number(amount).toLocaleString("en-NG")}
            readOnly
            className="h-12 bg-[#1F1E1C] border-white/10 text-white/60 rounded-xl cursor-not-allowed"
          />
        </div>
      </div>
      {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}
    </div>
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
  assets = [],
  title = "Request Fuel Service",
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<RequestFuelForm>;
  typeOptions?: Option[];
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  assets?: any[];
  title?: string;
  onSuccess?: () => void;
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
    apply_quantity_to_all_assets: true, // NEW: default to collective mode
    per_vehicle_quantities: [], // NEW
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

  // --- NEW: Per-vehicle data tracking ---
  const [perVehicleData, setPerVehicleData] = useState<
    Record<
      string,
      {
        litres: number;
        amount: number | "";
      }
    >
  >({});

  // --- NEW: Vehicle search and selection state ---
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const [orderMode, setOrderMode] = useState<'collective' | 'per-asset'>('per-asset');

  // Filter vehicles based on search
  const filteredVehicles = useMemo(() => {
    if (!assets || assets.length === 0) return [];

    // Use actual asset data
    const vehicles = assets.map((asset) => ({
      id: asset.id,
      asset_name: asset.asset_name,
      plate_number: asset.plate_number,
      capacity: asset.capacity || 0,
      fuel_type: asset.fuel_type,
    }));

    if (!vehicleSearch.trim()) return vehicles;

    const query = vehicleSearch.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.asset_name.toLowerCase().includes(query) ||
        (v.plate_number && v.plate_number.toLowerCase().includes(query))
    );
  }, [assets, vehicleSearch]);

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
    if (!upperFuel) return null; // don't fetch until fuel selected

    try {
      // Use a realistic amount to ensure backend returns valid pricing
      const data = await fetchFuelDetails(1000, upperFuel);
      if (data?.unit_price) {
        setUnitPrices(data.unit_price);
        return data.unit_price;
      }
    } catch (error) {
      console.error("Failed to fetch unit prices:", error);
    }
    return null;
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

    console.log("Validating form...");
    console.log("form.fuel_type:", form.fuel_type);
    console.log("selectedVehicles:", selectedVehicles);
    console.log("form.location_id:", form.location_id);
    console.log("form.time_slot:", form.time_slot);
    console.log("orderMode:", orderMode);
    console.log("form.quantity:", form.quantity);
    console.log("perVehicleData:", perVehicleData);

    if (!form.fuel_type) next.fuel_type = "Please select a fuel type";

    // Validate selected vehicles
    if (selectedVehicles.length === 0) {
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

    // Check if collective mode
    const isCollectiveMode = orderMode === 'collective';

    if (isCollectiveMode) {
      // Collective mode: validate single quantity
      if (!form.quantity || form.quantity <= 0) {
        next.quantity = "Quantity must be greater than 0";
      } else if (form.quantity < 25) {
        next.quantity = "Minimum quantity is 50 litres";
      } else if (form.quantity > 5000) {
        next.quantity = "Maximum quantity is 5000 litres";
      }
    } else {
      // Per-vehicle mode: validate each vehicle has quantity
      for (const assetId of selectedVehicles) {
        const vehicleData = perVehicleData[assetId];
        if (!vehicleData || !vehicleData.litres || vehicleData.litres <= 0) {
          next.quantity =
            "All selected vehicles must have a quantity greater than 0";
          break;
        } else if (vehicleData.litres < 25) {
          next.quantity = "Minimum quantity is 50 litres per vehicle";
          break;
        } else if (vehicleData.litres > 5000) {
          next.quantity = "Maximum quantity is 5000 litres per vehicle";
          break;
        }
      }
    }

    console.log("Validation errors:", next);
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
        apply_quantity_to_all_assets: true,
        per_vehicle_quantities: [],
      });
      setErrors({});
      setLookupError(null);
      setPredictions([]);
      setPerVehicleData({}); // Clear per-vehicle data
      setAmount(""); // Clear amount
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

  const canSubmit = useMemo(() => {
    if (!form.fuel_type) return false;
    if (selectedVehicles.length === 0) return false;
    if (!form.location_id) return false;
    if (!form.time_slot) return false;

    // Check mode explicitly using orderMode state
    if (orderMode === 'collective') {
      // Collective mode: check single quantity
      return form.quantity > 0;
    } else {
      // Per-vehicle mode: check all selected vehicles have quantity
      return selectedVehicles.every((assetId) => {
        const data = perVehicleData[assetId];
        return data && data.litres > 0;
      });
    }
  }, [
    form.fuel_type,
    form.location_id,
    form.time_slot,
    form.quantity,
    orderMode,
    selectedVehicles,
    perVehicleData,
    filteredVehicles,
  ]);

  /* -------- Build request payload -------- */

  const buildRequestPayload = () => {
    const isManualLocation = form.location_id === MANUAL_LOCATION_VALUE;
    const isCollectiveMode = orderMode === 'collective';

    if (isCollectiveMode) {
      // Collective mode: all vehicles get same quantity
      return {
        fuel_type: form.fuel_type,
        asset_ids: selectedVehicles,
        apply_quantity_to_all_assets: true,
        quantity: form.quantity,
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
        note: form.note,
        is_scheduled: form.time_slot !== "NOW",
      };
    } else {
      // Per-vehicle mode: each vehicle has individual quantity
      return {
        fuel_type: form.fuel_type,
        asset_ids: selectedVehicles,
        apply_quantity_to_all_assets: false,
        per_vehicle_quantities: selectedVehicles.map((assetId) => ({
          asset_id: assetId,
          quantity: perVehicleData[assetId]?.litres || 0,
        })),
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
        note: form.note,
        is_scheduled: form.time_slot !== "NOW",
      };
    }
  };

  /* -------- Submit: Call init endpoint & show checkout -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!validateForm()) return;
    console.log("Form is valid");

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
        apply_quantity_to_all_assets: true,
        per_vehicle_quantities: [],
      });
      setErrors({});
      setCheckoutData(null);

      // Trigger refresh
      if (onSuccess) {
        onSuccess();
      }
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
      ensureUnitPrices().catch(() => { });
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
            {/* Order Mode Selection */}
            <div className="space-y-3">
              <Label className="text-white/80">Order Mode</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Collective Mode Card */}
                <button
                  type="button"
                  onClick={() => setOrderMode('collective')}
                  className={`
                    relative h-28 rounded-2xl border-2 transition-all
                    flex flex-col items-center justify-center gap-2 p-4
                    ${orderMode === 'collective'
                      ? 'border-[#FF8500] bg-[#FF8500]/10'
                      : 'border-white/10 bg-[#2D2A27] hover:border-white/20'
                    }
                  `}
                >
                  {/* Icon */}
                  <svg
                    className={`w-8 h-8 ${orderMode === 'collective' ? 'text-[#FF8500]' : 'text-white/60'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {/* Text */}
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${orderMode === 'collective' ? 'text-[#FF8500]' : 'text-white'}`}>
                      Collective Order
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Shared by # of assets
                    </div>
                  </div>
                  {/* Selected Indicator */}
                  {orderMode === 'collective' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-[#FF8500]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Per Asset Mode Card */}
                <button
                  type="button"
                  onClick={() => setOrderMode('per-asset')}
                  className={`
                    relative h-28 rounded-2xl border-2 transition-all
                    flex flex-col items-center justify-center gap-2 p-4
                    ${orderMode === 'per-asset'
                      ? 'border-[#FF8500] bg-[#FF8500]/10'
                      : 'border-white/10 bg-[#2D2A27] hover:border-white/20'
                    }
                  `}
                >
                  {/* Icon */}
                  <svg
                    className={`w-8 h-8 ${orderMode === 'per-asset' ? 'text-[#FF8500]' : 'text-white/60'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  {/* Text */}
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${orderMode === 'per-asset' ? 'text-[#FF8500]' : 'text-white'}`}>
                      Per Asset Order
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Different per vehicle
                    </div>
                  </div>
                  {/* Selected Indicator */}
                  {orderMode === 'per-asset' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-[#FF8500]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

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

            {/* Vehicles List with Individual Inputs - COLLAPSIBLE DROPDOWN */}
            <div className="space-y-4">
              <Label className="text-white/80">Vehicle(s)</Label>

              {/* Dropdown Trigger Button */}
              <Popover
                open={vehicleDropdownOpen}
                onOpenChange={setVehicleDropdownOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white px-4 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-[#3B3835] transition-colors"
                  >
                    <span
                      className={
                        selectedVehicles.length === 0
                          ? "text-white/60"
                          : "text-white"
                      }
                    >
                      {selectedVehicles.length === 0
                        ? "Select vehicles"
                        : `${selectedVehicles.length} vehicle${selectedVehicles.length > 1 ? "s" : ""
                        } selected`}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      className={`opacity-80 transition-transform ${vehicleDropdownOpen ? "rotate-180" : ""
                        }`}
                    >
                      <path
                        fill="currentColor"
                        d="M5.5 7.5L10 12l4.5-4.5H5.5z"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="p-0 w-[min(644px,92vw)] bg-[#3B3835] text-white border border-white/10 rounded-2xl max-h-[500px] overflow-hidden z-[70]"
                >
                  <div className="p-6 space-y-4 space-x-4">
                    {/* Search Input */}
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <CustomInput
                        type="text"
                        placeholder="Search Vehicles"
                        value={vehicleSearch}
                        onChange={(e) => setVehicleSearch(e.target.value)}
                        className="h-12 rounded-xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60 ml-9 pl-12"
                      />
                    </div>

                    {/* Select All Checkbox */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#2D2A27] border border-white/10">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={
                            selectedVehicles.length ===
                            filteredVehicles.length &&
                            filteredVehicles.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              const allIds = filteredVehicles.map((v) => v.id);
                              setSelectedVehicles(allIds);
                              // Initialize per-vehicle data for all
                              const newData: Record<
                                string,
                                { litres: number; amount: number | "" }
                              > = {};
                              filteredVehicles.forEach((v) => {
                                newData[v.id] = perVehicleData[v.id] || {
                                  litres: 0,
                                  amount: "",
                                };
                              });
                              setPerVehicleData(newData);
                              // Close dropdown when selecting all
                              setVehicleDropdownOpen(false);
                            } else {
                              setSelectedVehicles([]);
                              setPerVehicleData({});
                            }
                          }}
                          className="border-white/40 data-[state=checked]:bg-[#FF8500] data-[state=checked]:border-[#FF8500]"
                        />
                        <span className="text-white font-medium">
                          #Vehicle ID
                        </span>
                      </div>
                      <span className="text-white/60 text-sm">
                        {selectedVehicles.length}/{filteredVehicles.length}
                      </span>
                    </div>

                    {/* Vehicle List - Scrollable */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {filteredVehicles.length === 0 ? (
                        <div className="text-center py-8 text-white/60">
                          {vehicleSearch
                            ? "No vehicles found"
                            : "No vehicles available"}
                        </div>
                      ) : (
                        filteredVehicles.map((vehicle) => {
                          const isSelected = selectedVehicles.includes(
                            vehicle.id
                          );
                          const vehicleData = perVehicleData[vehicle.id] || {
                            litres: 0,
                            amount: "",
                          };

                          return (
                            <div
                              key={vehicle.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-[#2D2A27] border border-white/10"
                            >
                              {/* Checkbox */}
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedVehicles((prev) => [
                                      ...prev,
                                      vehicle.id,
                                    ]);
                                    setPerVehicleData((prev) => ({
                                      ...prev,
                                      [vehicle.id]: prev[vehicle.id] || {
                                        litres: 0,
                                        amount: "",
                                      },
                                    }));
                                  } else {
                                    setSelectedVehicles((prev) =>
                                      prev.filter((id) => id !== vehicle.id)
                                    );
                                    setPerVehicleData((prev) => {
                                      const next = { ...prev };
                                      delete next[vehicle.id];
                                      return next;
                                    });
                                  }
                                }}
                                className="border-white/40 data-[state=checked]:bg-[#FF8500] data-[state=checked]:border-[#FF8500]"
                              />

                              {/* Vehicle Name/Plate */}
                              <div className="flex-1 min-w-0">
                                <span className="text-white font-medium text-sm truncate block">
                                  {`${vehicle.asset_name}-${vehicle.plate_number}`}
                                </span>
                              </div>

                              {/* Litres Input */}
                              <div className="w-40">
                                <CustomInput
                                  type="text"
                                  placeholder="Litres"
                                  value={
                                    orderMode === 'collective'
                                      ? "--"
                                      : vehicleData.litres === 0
                                        ? ""
                                        : vehicleData.litres.toLocaleString("en-NG")
                                  }
                                  onChange={async (e) => {
                                    const val = e.target.value.replace(/,/g, "");
                                    const litres =
                                      val === ""
                                        ? 0
                                        : Math.max(0, parseInt(val, 10) || 0);

                                    setPerVehicleData((prev) => ({
                                      ...prev,
                                      [vehicle.id]: {
                                        litres,
                                        amount: prev[vehicle.id]?.amount || "",
                                      },
                                    }));

                                    // Convert litres to amount
                                    if (litres > 0 && upperFuel) {
                                      const prices = await ensureUnitPrices();
                                      const perL =
                                        upperFuel === "DIESEL"
                                          ? prices?.diesel
                                          : upperFuel === "PETROL"
                                            ? prices?.petrol
                                            : undefined;

                                      if (perL) {
                                        const naira = Math.max(
                                          0,
                                          Math.round(litres * perL)
                                        );
                                        setPerVehicleData((prev) => ({
                                          ...prev,
                                          [vehicle.id]: {
                                            litres,
                                            amount: naira,
                                          },
                                        }));
                                      }
                                    } else if (litres === 0) {
                                      setPerVehicleData((prev) => ({
                                        ...prev,
                                        [vehicle.id]: { litres: 0, amount: "" },
                                      }));
                                    }
                                  }}
                                  disabled={!isSelected || orderMode === 'collective'}
                                  className="h-10 rounded-lg bg-[#1F1E1C] border-white/10 text-sm disabled:opacity-50"
                                />
                              </div>

                              {/* Amount Input */}
                              <div className="w-40">
                                <CustomInput
                                  type="text"
                                  placeholder="Amount"
                                  value={
                                    orderMode === 'collective'
                                      ? amount === "" || selectedVehicles.length === 0
                                        ? ""
                                        : Math.floor(Number(amount) / selectedVehicles.length).toLocaleString("en-NG")
                                      : vehicleData.amount === ""
                                        ? ""
                                        : Number(vehicleData.amount).toLocaleString("en-NG")
                                  }
                                  onChange={async (e) => {
                                    const val = e.target.value.replace(/,/g, "");
                                    const naira =
                                      val === ""
                                        ? 0
                                        : Math.max(
                                          0,
                                          Math.floor(Number(val) || 0)
                                        );

                                    setPerVehicleData((prev) => ({
                                      ...prev,
                                      [vehicle.id]: {
                                        litres: prev[vehicle.id]?.litres || 0,
                                        amount: naira || "",
                                      },
                                    }));

                                    // Convert amount to litres via API
                                    if (naira > 0 && upperFuel) {
                                      try {
                                        const data = await fetchFuelDetails(
                                          naira,
                                          upperFuel
                                        );
                                        const litres =
                                          data?.estimation?.litres ?? 0;
                                        const rounded = Math.max(
                                          0,
                                          Math.round(litres)
                                        );

                                        setPerVehicleData((prev) => ({
                                          ...prev,
                                          [vehicle.id]: {
                                            litres: rounded,
                                            amount: naira,
                                          },
                                        }));
                                      } catch (e) {
                                        console.error(
                                          "Amount conversion failed",
                                          e
                                        );
                                      }
                                    } else if (naira === 0) {
                                      setPerVehicleData((prev) => ({
                                        ...prev,
                                        [vehicle.id]: { litres: 0, amount: "" },
                                      }));
                                    }
                                  }}
                                  disabled={!isSelected || orderMode === 'collective'}
                                  className="h-10 rounded-lg bg-[#1F1E1C] border-white/10 text-sm disabled:opacity-50"
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Collective Amount & Litres - Show in collective mode */}
              {orderMode === 'collective' && selectedVehicles.length > 0 && (
                <div className="flex items-center gap-6">
                  <div className="w-4/5">
                    {/* Amount (₦) → updates Quantity via API */}
                    <Field label="Amount (₦)" error={errors.quantity}>
                      <CustomInput
                        type="text"
                        value={
                          amount === ""
                            ? ""
                            : Number(amount).toLocaleString("en-NG")
                        }
                        onChange={async (e) => {
                          const val = e.target.value.replace(/,/g, "");
                          if (val === "") {
                            setAmount("");
                            setForm((p) => ({ ...p, quantity: 0 }));
                            return;
                          }
                          const naira = Math.max(0, Math.floor(Number(val) || 0));
                          setAmount(naira);

                          // Convert amount to litres instantly using unit price
                          if (upperFuel && naira > 0) {
                            const prices = await ensureUnitPrices();
                            const perL =
                              upperFuel === "DIESEL"
                                ? prices?.diesel
                                : upperFuel === "PETROL"
                                  ? prices?.petrol
                                  : undefined;

                            if (perL) {
                              const litres = Math.max(
                                0,
                                Math.round(naira / perL)
                              );
                              setForm((p) => ({ ...p, quantity: litres }));
                            }
                          } else if (naira === 0) {
                            setForm((p) => ({ ...p, quantity: 0 }));
                          }
                        }}
                        placeholder="Enter total amount in ₦"
                        className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                      />
                      {converting && (
                        <p className="text-xs text-white/60 mt-1">Converting…</p>
                      )}
                    </Field>
                  </div>

                  {/* Quantity (Litres) - Read-only, shows calculated total litres */}
                  <Field label="Quantity (Litres)" error={errors.quantity}>
                    <CustomInput
                      type="text"
                      value={
                        form.quantity === 0
                          ? ""
                          : form.quantity.toLocaleString("en-NG")
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/,/g, "");
                        const litres =
                          val === ""
                            ? 0
                            : Math.max(0, parseInt(val, 10) || 0);
                        setForm((p) => ({ ...p, quantity: litres }));
                        clearError("quantity");
                        if (val === "") {
                          setAmount("");
                        } else {
                          convertLitresToAmount(litres);
                        }
                      }}
                      placeholder="quantity (min: 50L)"
                      className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                    />
                  </Field>
                </div>
              )}

              {errors.asset_id && (
                <p className="text-sm text-rose-400">{errors.asset_id}</p>
              )}
            </div>

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
        note={checkoutData?.note}
      />
    </>
  );
}

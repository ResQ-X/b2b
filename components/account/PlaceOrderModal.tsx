import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type PlaceOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => Promise<void>;
  userName: string;
  subAccountId: string;
};

type OrderData = {
  subAccountId: string;
  serviceType: string;
  orderDetails: {
    asset_ids?: string[];
    fuel_type?: string;
    quantity?: number;
    location_id?: string;
    time_slot?: string;
    is_scheduled?: boolean;
    delivery_spot?: string;
    note?: string;
  };
  note?: string;
};

type Option = { label: string; value: string };

export default function PlaceOrderModal({
  isOpen,
  onClose,
  userName,
  subAccountId,
  onConfirm,
}: PlaceOrderModalProps) {
  const [serviceType, setServiceType] = useState<string>("fuel");
  const [assetIds, setAssetIds] = useState<string[]>([""]);
  const [fuelType, setFuelType] = useState<string>("PETROL");
  const [quantity, setQuantity] = useState<string>("");
  const [locationId, setLocationId] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [deliverySpot, setDeliverySpot] = useState<string>("");
  const [orderNote, setOrderNote] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!serviceType) {
      setError("Please select a service type");
      return;
    }

    // Filter out empty asset IDs
    const validAssetIds = assetIds.filter((id) => id.trim() !== "");

    if (validAssetIds.length === 0) {
      setError("Please add at least one asset ID");
      return;
    }

    if (serviceType === "fuel") {
      const qty = parseFloat(quantity);
      if (!quantity || isNaN(qty) || qty <= 0) {
        setError("Please enter a valid quantity");
        return;
      }

      if (!fuelType) {
        setError("Please select a fuel type");
        return;
      }
    }

    if (!locationId.trim()) {
      setError("Location ID is required");
      return;
    }

    if (isScheduled && !timeSlot) {
      setError("Please select a time slot for scheduled orders");
      return;
    }

    try {
      setIsLoading(true);

      const orderData: OrderData = {
        subAccountId,
        serviceType,
        orderDetails: {
          asset_ids: validAssetIds,
          location_id: locationId.trim(),
          delivery_spot: deliverySpot.trim() || undefined,
          note: orderNote.trim() || undefined,
        },
        note: adminNote.trim() || undefined,
      };

      // Add service-specific fields
      if (serviceType === "fuel") {
        orderData.orderDetails.fuel_type = fuelType;
        orderData.orderDetails.quantity = parseFloat(quantity);
      }

      // Add scheduling fields
      if (isScheduled && timeSlot) {
        orderData.orderDetails.is_scheduled = true;
        orderData.orderDetails.time_slot = timeSlot;
      } else {
        orderData.orderDetails.is_scheduled = false;
      }

      await onConfirm(orderData);

      resetForm();
      onClose();
    } catch (err: any) {
      console.error("Place order failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setServiceType("fuel");
    setAssetIds([""]);
    setFuelType("PETROL");
    setQuantity("");
    setLocationId("");
    setTimeSlot("");
    setIsScheduled(false);
    setDeliverySpot("");
    setOrderNote("");
    setAdminNote("");
    setError(null);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  // Format datetime-local input value
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);
      const res = await axiosInstance.get("/fleet-asset/get-asset");
      const list = res.data?.assets || [];

      setAssets(
        list.map((a: any) => ({
          label: a.name || a.asset_name || a.plate_number,
          value: a.id || a.asset_id,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setFetchError("Failed to load assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const res = await axiosInstance.get("/fleet-asset/get-locations");
      const list = res.data?.data || [];

      setLocations(
        list.map((l: any) => ({
          label: l.location_name,
          value: l.id,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      setFetchError("Failed to load locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      fetchLocations();
    }
  }, [isOpen]);

  console.log("fetchError:", fetchError);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#2D2A27] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Place Order for Sub-Account
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Place an order on behalf of {userName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-white/90">
              Service Type *
            </Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger
                id="serviceType"
                className="h-14 rounded-2xl border border-white/10 bg-[#1F1E1C] text-white"
              >
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1F1E1C] border-white/10 text-white">
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Asset Id */}
          <Select value={assetIds[0]} onValueChange={(v) => setAssetIds([v])}>
            <SelectTrigger className="h-14 rounded-2xl border border-white/10 bg-[#1F1E1C] text-white">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>

            <SelectContent className="bg-[#1F1E1C] border-white/10 text-white">
              {loadingAssets ? (
                <div className="p-2 text-sm text-white/60">Loading...</div>
              ) : (
                assets.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Fuel-specific fields */}
          {serviceType === "fuel" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="text-white/90">
                    Fuel Type *
                  </Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger
                      id="fuelType"
                      className="h-14 rounded-2xl border border-white/10 bg-[#1F1E1C] text-white"
                    >
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F1E1C] border-white/10 text-white">
                      <SelectItem value="PETROL">Petrol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-white/90">
                    Quantity (Liters) *
                  </Label>
                  <CustomInput
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    // className="bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                    className="h-14 rounded-2xl border border-white/10 bg-[#1F1E1C] text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          {/* Location ID */}
          <Select value={locationId} onValueChange={setLocationId}>
            <SelectTrigger className="h-14 rounded-2xl border border-white/10 bg-[#1F1E1C] text-white">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>

            <SelectContent className="bg-[#1F1E1C] border-white/10 text-white">
              {loadingLocations ? (
                <div className="p-2 text-sm text-white/60">Loading...</div>
              ) : (
                locations.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Delivery Spot */}
          <div className="space-y-2">
            <Label htmlFor="deliverySpot" className="text-white/90">
              Delivery Spot (Optional)
            </Label>
            <CustomInput
              id="deliverySpot"
              type="text"
              value={deliverySpot}
              onChange={(e) => setDeliverySpot(e.target.value)}
              placeholder="e.g., Main gate, Building A"
              className="bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
              disabled={isLoading}
            />
          </div>

          {/* Scheduling */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isScheduled"
                checked={isScheduled}
                onCheckedChange={(checked) => setIsScheduled(checked === true)}
                className="border-white/10 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <Label
                htmlFor="isScheduled"
                className="text-white/90 cursor-pointer"
              >
                Schedule this order
              </Label>
            </div>

            {isScheduled && (
              <div className="space-y-2">
                <Label htmlFor="timeSlot" className="text-white/90">
                  Time Slot *
                </Label>
                {/* <CustomInput
                  id="timeSlot"
                  type="datetime-local"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  min={formatDateTimeLocal(new Date())}
                  className="bg-[#1F1E1C] border-white/10 text-white focus:border-white/30"
                  disabled={isLoading}
                /> */}

                <CustomInput
                  id="timeSlot"
                  type="datetime-local"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  min={formatDateTimeLocal(new Date())}
                  className="bg-[#1F1E1C] border-white/10 text-white focus:border-white/30"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Order Note */}
          <div className="space-y-2">
            <Label htmlFor="orderNote" className="text-white/90">
              Order Note (Optional)
            </Label>
            <CustomInput
              id="orderNote"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Special instructions for this order..."
              className="bg-[#1F1E1C] border-white/10 text-white placeholder:text-white/30 focus:border-white/30 resize-none h-40"
              //   rows={2}
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#FF8500] text-white"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

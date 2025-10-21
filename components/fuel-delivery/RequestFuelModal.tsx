// "use client";
// import { Fragment } from "react";
// import { useEffect, useMemo, useState, useRef } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   SelectSeparator,
// } from "@/components/ui/select";
// import CustomInput from "@/components/ui/CustomInput";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// export type RequestFuelForm = {
//   slot: string;
//   location: any;
//   vehicle: any;
//   type: any;
//   fuel_type: string;
//   asset_id: string;
//   location_id?: string;
//   location_address?: string;
//   location_longitude?: string;
//   location_latitude?: string;
//   time_slot: string;
//   quantity: number;
//   note: string;
//   is_scheduled: boolean;
// };

// type Option = { label: string; value: string };

// type GooglePlacePrediction = {
//   description: string;
//   place_id: string;
// };

// // Validation errors type
// type ValidationErrors = {
//   fuel_type?: string;
//   asset_id?: string;
//   location_id?: string;
//   location_address?: string;
//   time_slot?: string;
//   quantity?: string;
// };

// const MANUAL_LOCATION_VALUE = "__manual__";

// export default function RequestFuelModal({
//   open,
//   onOpenChange,
//   onSubmit,
//   initialValues,
//   typeOptions = [],
//   vehicleOptions = [],
//   locationOptions = [],
//   slotOptions = [],
//   title = "Request Fuel Service",
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (data: RequestFuelForm) => Promise<void> | void;
//   initialValues?: Partial<RequestFuelForm>;
//   typeOptions?: Option[];
//   vehicleOptions?: Option[];
//   locationOptions?: Option[];
//   slotOptions?: Option[];
//   title?: string;
// }) {
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [form, setForm] = useState<RequestFuelForm>({
//     slot: initialValues?.slot || "",
//     location: initialValues?.location || "",
//     vehicle: initialValues?.vehicle || "",
//     type: initialValues?.type || "",
//     fuel_type: initialValues?.fuel_type || "",
//     asset_id: initialValues?.asset_id || "",
//     location_id: initialValues?.location_id || "",
//     location_address: initialValues?.location_address || "",
//     location_longitude: initialValues?.location_longitude || "",
//     location_latitude: initialValues?.location_latitude || "",
//     time_slot: initialValues?.time_slot || "",
//     quantity: initialValues?.quantity || 0,
//     note: initialValues?.note || "",
//     is_scheduled: initialValues?.is_scheduled || false,
//   });

//   // Google Maps state
//   const [isMounted, setIsMounted] = useState(false);
//   const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
//   const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
//   const [lookupError, setLookupError] = useState<string | null>(null);
//   const typingTimer = useRef<number | null>(null);

//   // Validation function
//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};

//     // Fuel type validation
//     if (!form.fuel_type) {
//       newErrors.fuel_type = "Please select a fuel type";
//     }

//     // Vehicle validation
//     if (!form.asset_id) {
//       newErrors.asset_id = "Please select a vehicle";
//     }

//     // Location validation
//     const manualMode = form.location_id === MANUAL_LOCATION_VALUE;
//     if (!manualMode && !form.location_id) {
//       newErrors.location_id = "Please select a location";
//     }
//     if (manualMode && !form.location_address?.trim()) {
//       newErrors.location_address = "Please enter a location address";
//     }

//     // Time slot validation
//     if (!form.time_slot) {
//       newErrors.time_slot = "Please select a time slot";
//     }

//     // Quantity validation
//     if (!form.quantity || form.quantity <= 0) {
//       newErrors.quantity = "Quantity must be greater than 0";
//     } else if (form.quantity < 20) {
//       newErrors.quantity = "Minimum quantity is 20 litres";
//     } else if (form.quantity > 5000) {
//       newErrors.quantity = "Maximum quantity is 5000 litres";
//     } else if (!Number.isInteger(form.quantity)) {
//       newErrors.quantity = "Quantity must be a whole number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Clear error when field is modified
//   const clearError = (field: keyof ValidationErrors) => {
//     setErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors[field];
//       return newErrors;
//     });
//   };

//   // keep form in sync when reopening with new initial values
//   useEffect(() => {
//     if (open) {
//       setForm({
//         slot: initialValues?.slot || "",
//         location: initialValues?.location || "",
//         vehicle: initialValues?.vehicle || "",
//         type: initialValues?.type || "",
//         fuel_type: initialValues?.fuel_type || "",
//         asset_id: initialValues?.asset_id || "",
//         location_id: initialValues?.location_id || "",
//         location_address: initialValues?.location_address || "",
//         location_longitude: initialValues?.location_longitude || "",
//         location_latitude: initialValues?.location_latitude || "",
//         time_slot: initialValues?.time_slot || "",
//         quantity: initialValues?.quantity || 0,
//         note: initialValues?.note || "",
//         is_scheduled: initialValues?.is_scheduled || false,
//       });
//       setErrors({});
//       setLookupError(null);
//       setPredictions([]);
//     }
//   }, [open, initialValues]);

//   // Mount guard
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Load Google Maps JS (Places) if available
//   useEffect(() => {
//     if (!isMounted) return;

//     if (
//       typeof window !== "undefined" &&
//       (window as any).google &&
//       (window as any).google.maps
//     ) {
//       setIsGoogleMapsLoaded(true);
//       return;
//     }

//     const existingScript = document.querySelector(
//       'script[src*="maps.googleapis.com"]'
//     ) as HTMLScriptElement | null;
//     if (existingScript) {
//       const onLoad = () => setIsGoogleMapsLoaded(true);
//       existingScript.addEventListener("load", onLoad);
//       if ((window as any).google && (window as any).google.maps)
//         setIsGoogleMapsLoaded(true);
//       return () => existingScript.removeEventListener("load", onLoad);
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.onload = () => setIsGoogleMapsLoaded(true);
//     script.onerror = () => console.error("Failed to load Google Maps script");
//     document.head.appendChild(script);

//     return () => {
//       if (document.head.contains(script)) document.head.removeChild(script);
//     };
//   }, [isMounted]);

//   /* ---------- Place predictions (debounced) ---------- */
//   const getPredictions = (input: string) => {
//     if (typingTimer.current) window.clearTimeout(typingTimer.current);
//     typingTimer.current = window.setTimeout(async () => {
//       if (!isMounted || !isGoogleMapsLoaded || !input.trim()) {
//         setPredictions([]);
//         return;
//       }

//       try {
//         const service = new (
//           window as any
//         ).google.maps.places.AutocompleteService();
//         const results: GooglePlacePrediction[] = await new Promise(
//           (resolve) => {
//             service.getPlacePredictions(
//               { input, componentRestrictions: { country: "ng" } },
//               (preds: any, status: string) => {
//                 if (status === "OK" && preds) {
//                   resolve(
//                     preds.map((p: any) => ({
//                       description: p.description,
//                       place_id: p.place_id,
//                     }))
//                   );
//                 } else {
//                   resolve([]);
//                 }
//               }
//             );
//           }
//         );

//         setPredictions(results);
//       } catch (err) {
//         console.error("Predictions error:", err);
//         setPredictions([]);
//       }
//     }, 200);
//   };

//   const handleSuggestionSelect = async (description: string) => {
//     setPredictions([]);
//     setForm((prev) => ({ ...prev, location_address: description }));
//     clearError("location_address");

//     if (
//       typeof window !== "undefined" &&
//       (window as any).google &&
//       (window as any).google.maps &&
//       (window as any).google.maps.Geocoder
//     ) {
//       try {
//         const geocoder = new (window as any).google.maps.Geocoder();
//         const results: any = await new Promise((resolve, reject) => {
//           geocoder.geocode(
//             { address: description },
//             (res: any, status: string) => {
//               if (status === "OK" && res && res[0]) resolve(res);
//               else reject(status);
//             }
//           );
//         });

//         if (results && results[0] && results[0].geometry) {
//           const loc = results[0].geometry.location;
//           const lat = loc.lat();
//           const lng = loc.lng();
//           setForm((prev) => ({
//             ...prev,
//             location_latitude: String(lat),
//             location_longitude: String(lng),
//           }));
//           return;
//         }
//       } catch (err) {
//         console.warn("Geocoder failed:", err);
//         setLookupError("Failed to resolve coordinates for that place.");
//       }
//     } else {
//       setLookupError("Google Maps geocoder not available.");
//     }
//   };

//   const handleLocationChange = (locationId: string) => {
//     clearError("location_id");

//     if (locationId === MANUAL_LOCATION_VALUE) {
//       setForm((prev) => ({
//         ...prev,
//         location_id: MANUAL_LOCATION_VALUE,
//         location_address: "",
//         location_longitude: "",
//         location_latitude: "",
//       }));
//       return;
//     }

//     const sel = locationOptions.find((l) => l.value === locationId);
//     if (sel) {
//       setForm((prev) => ({
//         ...prev,
//         location_id: locationId,
//         location_address: sel.label,
//       }));
//     }
//   };

//   const manualMode = form.location_id === MANUAL_LOCATION_VALUE;

//   const canSubmit = useMemo(
//     () =>
//       form.fuel_type &&
//       form.asset_id &&
//       (form.location_id || form.location_address) &&
//       form.time_slot &&
//       form.quantity > 0,
//     [form]
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form
//     if (!validateForm()) {
//       return; // Stop if validation fails
//     }

//     setSubmitting(true);
//     try {
//       await onSubmit(form);
//       onOpenChange(false);
//       // Reset form after successful submission
//       setForm({
//         slot: "",
//         location: "",
//         vehicle: "",
//         type: "",
//         fuel_type: "",
//         asset_id: "",
//         location_id: "",
//         location_address: "",
//         location_longitude: "",
//         location_latitude: "",
//         time_slot: "",
//         quantity: 0,
//         note: "",
//         is_scheduled: false,
//       });
//       setErrors({});
//     } catch (error) {
//       console.error("Form submission error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className="
//         w-11/12
//           lg:max-w-[640px]
//           rounded-[28px]
//           border border-white/10
//           bg-[#1F1E1C]
//           text-white
//           p-7 md:p-9
//           max-h-[90vh]
//           overflow-y-auto
//         "
//       >
//         <DialogHeader className="mb-2">
//           <DialogTitle className="text-[28px] leading-8 font-semibold">
//             {title}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Fuel Type */}
//           {/* <Field label="Fuel Type" error={errors.fuel_type}>
//             <Select
//               value={form.fuel_type}
//               onValueChange={(v) => {
//                 setForm((p) => ({ ...p, fuel_type: v }));
//                 clearError("fuel_type");
//               }}
//             >
//               <Trigger placeholder="Select fuel type" />
//               <List options={typeOptions} />
//             </Select>
//           </Field> */}
//           <Field label="Fuel Type" error={errors.fuel_type}>
//             <Select
//               value={form.fuel_type}
//               onValueChange={(v) => {
//                 setForm((p) => ({ ...p, fuel_type: v }));
//                 clearError("fuel_type");
//               }}
//             >
//               <Trigger placeholder="Select fuel type" />

//               <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                 {typeOptions.map((opt, idx) => (
//                   <Fragment key={opt.value}>
//                     <SelectItem
//                       value={opt.value}
//                       className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white font-medium"
//                     >
//                       {opt.label}
//                     </SelectItem>

//                     {idx < typeOptions.length - 1 && (
//                       <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                     )}
//                   </Fragment>
//                 ))}
//               </SelectContent>
//             </Select>
//           </Field>

//           {/* Vehicle */}
//           {/* <Field label="Vehicle" error={errors.asset_id}>
//             <div>
//               <Select
//                 value={form.asset_id}
//                 onValueChange={(v) => {
//                   setForm((p) => ({ ...p, asset_id: v }));
//                   clearError("asset_id");
//                 }}
//                 disabled={vehicleOptions.length === 0}
//               >
//                 <Trigger
//                   placeholder={
//                     vehicleOptions.length > 0
//                       ? "Select vehicle"
//                       : "No vehicles available"
//                   }
//                 />
//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   {vehicleOptions.length > 0 ? (
//                     vehicleOptions.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-3 text-sm text-white/60 max-w-xs">
//                       No vehicles available.
//                     </div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             {vehicleOptions.length === 0 && (
//               <div className="mt-2 text-sm text-white/70">
//                 No vehicles found. Go to the{" "}
//                 <Link href="/fleet" className="underline hover:text-white">
//                   Fleet
//                 </Link>{" "}
//                 page and click{" "}
//                 <span className="font-semibold">Add New Fleet</span> to add an
//                 asset.
//               </div>
//             )}
//           </Field> */}

//           {/* Vehicle */}
//           <Field label="Vehicle" error={errors.asset_id}>
//             <div>
//               <Select
//                 value={form.asset_id}
//                 onValueChange={(v) => {
//                   setForm((p) => ({ ...p, asset_id: v }));
//                   clearError("asset_id");
//                 }}
//                 disabled={vehicleOptions.length === 0}
//               >
//                 <Trigger
//                   placeholder={
//                     vehicleOptions.length > 0
//                       ? "Select vehicle"
//                       : "No vehicles available"
//                   }
//                 />
//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   {vehicleOptions.length > 0 ? (
//                     vehicleOptions.map((opt, idx) => (
//                       <Fragment key={opt.value}>
//                         <SelectItem
//                           value={opt.value}
//                           className="
//                   cursor-pointer
//                   transition-colors
//                   hover:bg-[#FF8500]/20
//                   hover:text-white
//                   focus:bg-[#FF8500]/25
//                   focus:text-white
//                 "
//                         >
//                           {opt.label}
//                         </SelectItem>

//                         {idx < vehicleOptions.length - 1 && (
//                           <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                         )}
//                       </Fragment>
//                     ))
//                   ) : (
//                     <div className="p-3 text-sm text-white/60 max-w-xs">
//                       No vehicles available.
//                     </div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             {vehicleOptions.length === 0 && (
//               <div className="mt-2 text-sm text-white/70">
//                 No vehicles found. Go to the{" "}
//                 <Link href="/fleet" className="underline hover:text-white">
//                   Fleet
//                 </Link>{" "}
//                 page and click{" "}
//                 <span className="font-semibold">Add New Fleet</span> to add an
//                 asset.
//               </div>
//             )}
//           </Field>

//           {/* Service Location */}
//           {!manualMode && (
//             // <Field label="Service Location" error={errors.location_id}>
//             //   <Select
//             //     value={form.location_id || ""}
//             //     onValueChange={handleLocationChange}
//             //   >
//             //     <Trigger placeholder="Select location" />
//             //     <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//             //       {locationOptions.map((opt) => (
//             //         <SelectItem key={opt.value} value={opt.value}>
//             //           {opt.label}
//             //         </SelectItem>
//             //       ))}
//             //       <SelectItem key="manual" value={MANUAL_LOCATION_VALUE}>
//             //         Add location manually
//             //       </SelectItem>
//             //     </SelectContent>
//             //   </Select>
//             // </Field>

//             <Field label="Service Location" error={errors.location_id}>
//               <Select
//                 value={form.location_id || ""}
//                 onValueChange={handleLocationChange}
//               >
//                 <Trigger placeholder="Select location" />

//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   {locationOptions.map((opt, i) => (
//                     <Fragment key={opt.value}>
//                       <SelectItem
//                         value={opt.value}
//                         className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
//                       >
//                         {opt.label}
//                       </SelectItem>

//                       {i < locationOptions.length - 1 && (
//                         <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                       )}
//                     </Fragment>
//                   ))}

//                   {/* Divider before the manual option */}
//                   <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />

//                   <SelectItem
//                     value={MANUAL_LOCATION_VALUE}
//                     className="cursor-pointer transition-colors hover:bg-[#FF8500]/20  focus:bg-[#FF8500]/25 hover:text-white focus:text-white font-medium"
//                   >
//                     Add location manually
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//           )}

//           {/* Manual Location Entry */}
//           {manualMode && (
//             <Field
//               label="Location Name (Manual)"
//               error={errors.location_address}
//             >
//               <div className="relative">
//                 <CustomInput
//                   type="text"
//                   placeholder="Enter location name"
//                   value={form.location_address}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setForm((prev) => ({ ...prev, location_address: val }));
//                     clearError("location_address");
//                     getPredictions(val);
//                   }}
//                   className="
//                     h-14
//                     rounded-2xl
//                     border border-white/10
//                     bg-[#2D2A27]
//                     text-white placeholder:text-white/60
//                   "
//                 />

//                 {predictions.length > 0 && (
//                   <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                     {predictions.map((p, idx) => (
//                       <div
//                         key={p.place_id || idx}
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={async () => {
//                           await handleSuggestionSelect(p.description);
//                         }}
//                       >
//                         {p.description}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {lookupError && (
//                 <p className="text-sm text-rose-400 mt-2">{lookupError}</p>
//               )}
//             </Field>
//           )}

//           {/* Time Slot */}
//           {/* <Field label="Time Slot" error={errors.time_slot}>
//             <Select
//               value={form.time_slot}
//               onValueChange={(v) => {
//                 setForm((p) => ({ ...p, time_slot: v }));
//                 clearError("time_slot");
//               }}
//             >
//               <Trigger placeholder="Select time slot" />
//               <List options={slotOptions} />
//             </Select>
//           </Field> */}
//           <Field label="Time Slot" error={errors.time_slot}>
//             <Select
//               value={form.time_slot}
//               onValueChange={(v) => {
//                 setForm((p) => ({ ...p, time_slot: v }));
//                 clearError("time_slot");
//               }}
//             >
//               <Trigger placeholder="Select time slot" />

//               <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                 {slotOptions.map((opt, idx) => (
//                   <Fragment key={opt.value}>
//                     <SelectItem
//                       value={opt.value}
//                       className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
//                     >
//                       {opt.label}
//                     </SelectItem>

//                     {idx < slotOptions.length - 1 && (
//                       <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                     )}
//                   </Fragment>
//                 ))}
//               </SelectContent>
//             </Select>
//           </Field>

//           {/* Quantity */}
//           <Field label="Quantity (Liters)" error={errors.quantity}>
//             <CustomInput
//               type="number"
//               min="1"
//               value={form.quantity || ""}
//               onChange={(e) => {
//                 setForm((p) => ({
//                   ...p,
//                   quantity: Math.max(0, parseInt(e.target.value) || 0),
//                 }));
//                 clearError("quantity");
//               }}
//               placeholder="Enter quantity in liters (min: 20L)"
//               className="
//                 h-14
//                 rounded-2xl
//                 border border-white/10
//                 bg-[#2D2A27]
//                 text-white placeholder:text-white/60
//               "
//             />
//           </Field>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label className="text-white/80">Additional Notes</Label>
//             <Textarea
//               value={form.note}
//               onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
//               placeholder="Add any extra details to help us find your location or complete the request."
//               className="
//                 min-h-[120px]
//                 rounded-2xl
//                 border border-white/10
//                 bg-[#2D2A27]
//                 text-white placeholder:text-white/60
//               "
//             />
//           </div>

//           <DialogFooter className="mt-4 flex w-full gap-4">
//             <Button
//               type="button"
//               variant="black"
//               onClick={() => onOpenChange(false)}
//               className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px]"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               variant="orange"
//               disabled={!canSubmit || submitting}
//               className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
//             >
//               {submitting ? "Submitting..." : "Request Service"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// /* ---------- internal UI helpers ---------- */

// function Field({
//   label,
//   children,
//   error,
// }: {
//   label: string;
//   children: React.ReactNode;
//   error?: string;
// }) {
//   return (
//     <div className="space-y-2">
//       <Label className="text-white/80">{label}</Label>
//       {children}
//       {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
//     </div>
//   );
// }

// function Trigger({ placeholder = "Select" }: { placeholder?: string }) {
//   return (
//     <SelectTrigger
//       className="
//         h-14
//         rounded-2xl
//         border border-white/10
//         bg-[#2D2A27]
//         text-white
//       "
//     >
//       <SelectValue placeholder={placeholder} />
//     </SelectTrigger>
//   );
// }

// // function List({ options }: { options: { label: string; value: string }[] }) {
// //   return (
// //     <SelectContent className="bg-[#2D2A27] text-white border-white/10">
// //       {options.map((opt) => (
// //         <SelectItem key={opt.value} value={opt.value}>
// //           {opt.label}
// //         </SelectItem>
// //       ))}
// //     </SelectContent>
// //   );
// // }

// function List({
//   options,
//   withDividers = true,
// }: {
//   options: { label: string; value: string }[];
//   withDividers?: boolean;
// }) {
//   return (
//     <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//       {options.map((opt, idx) => (
//         <Fragment key={opt.value}>
//           <SelectItem value={opt.value}>{opt.label}</SelectItem>
//           {withDividers && idx < options.length - 1 && (
//             <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//           )}
//         </Fragment>
//       ))}
//     </SelectContent>
//   );
// }

"use client";

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

/* ===================== Types ===================== */

export type RequestFuelForm = {
  slot: string;
  location: any;
  vehicle: any;
  type: any;

  fuel_type: string;

  // single (legacy) + multi
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

const MANUAL_LOCATION_VALUE = "__manual__";

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
        className="
          p-0 w-[min(520px,92vw)]
          bg-[#2D2A27] text-white border border-white/10 rounded-xl
          max-h-[70vh] overflow-y-auto
          touch-pan-y overscroll-contain
          z-[70]
        "
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
      >
        <Command className="bg-transparent text-white">
          <div className="p-2">
            <CommandInput
              placeholder="Search vehicles..."
              className="bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </div>

          {/* Select All — div, not button (Checkbox is a button) */}
          <div className="px-3 pb-2 pt-1">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={allChecked}
              onClick={toggleAll}
              onKeyDown={handleKeyActivate}
              className="
                w-full flex items-center gap-3 rounded-lg px-3 py-2
                hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 transition-colors
                outline-none
              "
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

          <CommandList
            className="max-h-[50vh] overflow-y-auto touch-pan-y overscroll-contain"
            onWheelCapture={(e) => e.stopPropagation()}
            onTouchMoveCapture={(e) => e.stopPropagation()}
          >
            <CommandEmpty className="px-4 py-3 text-white/60">
              No vehicles found.
            </CommandEmpty>

            <CommandGroup>
              {options.map((opt, idx) => (
                <div key={opt.value}>
                  <CommandItem
                    value={opt.label}
                    onSelect={() => toggleOne(opt.value)}
                    className="
                      ml-2 cursor-pointer rounded-lg px-3 py-2
                      transition-colors text-white
                      hover:bg-[#FF8500]/20 hover:text-white
                      focus:bg-[#FF8500]/25 focus:text-white
                      aria-selected:bg-[#FF8500]/25 aria-selected:text-white
                      data-[highlighted]:bg-[#FF8500]/20 data-[highlighted]:text-white
                    "
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

/* ===================== Main Component ===================== */

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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [form, setForm] = useState<RequestFuelForm>({
    slot: initialValues?.slot || "",
    location: initialValues?.location || "",
    vehicle: initialValues?.vehicle || "",
    type: initialValues?.type || "",
    fuel_type: initialValues?.fuel_type || "",

    asset_id: initialValues?.asset_id || "", // legacy single
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

  // Google Maps state (for manual address)
  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const typingTimer = useRef<number | null>(null);

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
    } else if (form.quantity < 20) {
      next.quantity = "Minimum quantity is 20 litres";
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

  /* -------- Submit -------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Send the form as-is. Don't collapse asset_ids into a single asset_id.
      const payload: RequestFuelForm = { ...form };

      await onSubmit(payload);
      onOpenChange(false);

      // reset form
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
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setSubmitting(true);
  //   try {
  //     const payload: RequestFuelForm = {
  //       ...form,
  //       asset_id:
  //         form.asset_ids && form.asset_ids.length > 0
  //           ? form.asset_ids[0]
  //           : form.asset_id,
  //       asset_ids:
  //         form.asset_ids && form.asset_ids.length > 0
  //           ? form.asset_ids
  //           : undefined,
  //     };

  //     await onSubmit(payload);
  //     onOpenChange(false);

  //     setForm({
  //       slot: "",
  //       location: "",
  //       vehicle: "",
  //       type: "",
  //       fuel_type: "",
  //       asset_id: "",
  //       asset_ids: [],
  //       location_id: "",
  //       location_address: "",
  //       location_longitude: "",
  //       location_latitude: "",
  //       time_slot: "",
  //       quantity: 0,
  //       note: "",
  //       is_scheduled: false,
  //     });
  //     setErrors({});
  //   } catch (error) {
  //     console.error("Form submission error:", error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  /* ===================== UI ===================== */

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
          overscroll-contain
        "
      >
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

          {/* Time Slot */}
          <Field label="Time Slot" error={errors.time_slot}>
            <Select
              value={form.time_slot}
              onValueChange={(v) => {
                setForm((p) => ({ ...p, time_slot: v }));
                clearError("time_slot");
              }}
            >
              <Trigger placeholder="Select time slot" />
              <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                {slotOptions.map((opt, idx) => (
                  <Fragment key={opt.value}>
                    <SelectItem
                      value={opt.value}
                      className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
                    >
                      {opt.label}
                    </SelectItem>
                    {idx < slotOptions.length - 1 && (
                      <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                    )}
                  </Fragment>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Quantity */}
          <Field label="Quantity (Liters)" error={errors.quantity}>
            <CustomInput
              type="number"
              min="1"
              value={form.quantity || ""}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  quantity: Math.max(0, parseInt(e.target.value) || 0),
                }));
                clearError("quantity");
              }}
              placeholder="Enter quantity in liters (min: 20L)"
              className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </Field>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white/80">Additional Notes</Label>
            <Textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
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
  );
}

// "use client";
// import { Fragment } from "react";
// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   SelectSeparator,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import CustomInput from "@/components/ui/CustomInput";

// type Option = {
//   label: string;
//   value: string;
//   latitude?: string;
//   longitude?: string;
// };

// type GooglePlacePrediction = {
//   description: string;
//   place_id: string;
// };

// const MANUAL_LOCATION_VALUE = "__manual__";

// export function RequestEmergencyServiceCard({
//   vehicleOptions = [],
//   locationOptions = [],
//   typeOptions = [],
//   slotOptions = [],
//   onSubmit,
// }: {
//   vehicleOptions?: Option[];
//   locationOptions?: Option[];
//   typeOptions?: Option[];
//   slotOptions?: Option[];
//   onSubmit?: (data: any) => Promise<void> | void;
// }) {
//   /* ---------- Google Maps loader (same as RequestServiceModal) ---------- */
//   const [isMounted, setIsMounted] = useState(false);
//   const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

//   useEffect(() => setIsMounted(true), []);

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

//   /* ---------- base form ---------- */
//   const [form, setForm] = useState({
//     vehicle: "",
//     type: "",
//     slot: "",
//     notes: "",
//   });
//   const isTowing = form.type === "TOWING";

//   /* ---------- NON-TOWING location ---------- */
//   const [locationId, setLocationId] = useState<string>("");
//   const [locationManualName, setLocationManualName] = useState<string>("");
//   const [locationLatitude, setLocationLatitude] = useState<string>("");
//   const [locationLongitude, setLocationLongitude] = useState<string>("");
//   const [locationPredictions, setLocationPredictions] = useState<
//     GooglePlacePrediction[]
//   >([]);
//   const locationTimer = useRef<number | null>(null);
//   const [lookupError, setLookupError] = useState<string | null>(null);

//   /* ---------- TOWING fields & coords ---------- */
//   const [towingMethod, setTowingMethod] = useState<string>("");

//   const [pickupLocationId, setPickupLocationId] = useState<string>("");
//   const [pickupManualName, setPickupManualName] = useState<string>("");
//   const [pickupLatitude, setPickupLatitude] = useState<string>("");
//   const [pickupLongitude, setPickupLongitude] = useState<string>("");
//   const [pickupPredictions, setPickupPredictions] = useState<
//     GooglePlacePrediction[]
//   >([]);
//   const pickupTimer = useRef<number | null>(null);

//   const [dropoffLocationId, setDropoffLocationId] = useState<string>("");
//   const [dropoffManualName, setDropoffManualName] = useState<string>("");
//   const [dropoffLatitude, setDropoffLatitude] = useState<string>("");
//   const [dropoffLongitude, setDropoffLongitude] = useState<string>("");
//   const [dropoffPredictions, setDropoffPredictions] = useState<
//     GooglePlacePrediction[]
//   >([]);
//   const dropoffTimer = useRef<number | null>(null);

//   /* ---------- Predictions helper (same as RequestServiceModal) ---------- */
//   const getPredictions = (
//     input: string,
//     setter: (x: GooglePlacePrediction[]) => void,
//     timer: React.MutableRefObject<number | null>
//   ) => {
//     if (timer.current) window.clearTimeout(timer.current);
//     timer.current = window.setTimeout(async () => {
//       if (!isMounted || !isGoogleMapsLoaded || !input.trim()) {
//         setter([]);
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

//         setter(results);
//       } catch (err) {
//         console.error("Predictions error:", err);
//         setter([]);
//       }
//     }, 200);
//   };

//   /* ---------- Geocoding helper (same as RequestServiceModal) ---------- */
//   const handleSuggestionSelect = async (
//     description: string,
//     setName: (v: string) => void,
//     setLat: (v: string) => void,
//     setLng: (v: string) => void,
//     setPreds: (v: GooglePlacePrediction[]) => void,
//     setError?: (v: string | null) => void
//   ) => {
//     setPreds([]);
//     setName(description);

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
//           setLat(String(lat));
//           setLng(String(lng));
//           return;
//         }
//       } catch (err) {
//         console.warn("Geocoder failed:", err);
//         if (setError) {
//           setError("Failed to resolve coordinates for that place.");
//         }
//       }
//     } else {
//       if (setError) {
//         setError("Google Maps geocoder not available.");
//       }
//     }
//   };

//   /* ---------- NON-TOWING manual input handlers ---------- */
//   const onLocationInputChange = (value: string) => {
//     setLocationManualName(value);
//     setLocationLatitude("");
//     setLocationLongitude("");
//     setLocationPredictions([]);
//     setLookupError(null);
//     getPredictions(value, setLocationPredictions, locationTimer);
//   };

//   const selectLocationPrediction = async (pred: GooglePlacePrediction) => {
//     await handleSuggestionSelect(
//       pred.description,
//       setLocationManualName,
//       setLocationLatitude,
//       setLocationLongitude,
//       setLocationPredictions,
//       setLookupError
//     );
//     setLocationId(MANUAL_LOCATION_VALUE);
//   };

//   const handleLocationSelect = async (value: string) => {
//     setLocationPredictions([]);
//     setLocationManualName("");
//     setLocationLatitude("");
//     setLocationLongitude("");
//     setLocationId(value);

//     if (!value || value === MANUAL_LOCATION_VALUE) return;

//     const sel = locationOptions.find((o) => o.value === value);
//     const label = sel?.label || "";

//     if (sel?.latitude && sel?.longitude) {
//       setLocationLatitude(String(sel.latitude));
//       setLocationLongitude(String(sel.longitude));
//       setLocationManualName(label);
//       return;
//     }

//     // fallback geocoding
//     setLocationManualName(label);
//   };

//   /* ---------- TOWING manual input handlers ---------- */
//   const onPickupInputChange = (value: string) => {
//     setPickupManualName(value);
//     setPickupLatitude("");
//     setPickupLongitude("");
//     setPickupPredictions([]);
//     getPredictions(value, setPickupPredictions, pickupTimer);
//   };

//   const onDropoffInputChange = (value: string) => {
//     setDropoffManualName(value);
//     setDropoffLatitude("");
//     setDropoffLongitude("");
//     setDropoffPredictions([]);
//     getPredictions(value, setDropoffPredictions, dropoffTimer);
//   };

//   const selectPickupPrediction = async (pred: GooglePlacePrediction) => {
//     await handleSuggestionSelect(
//       pred.description,
//       setPickupManualName,
//       setPickupLatitude,
//       setPickupLongitude,
//       setPickupPredictions
//     );
//     setPickupLocationId(MANUAL_LOCATION_VALUE);
//   };

//   const selectDropoffPrediction = async (pred: GooglePlacePrediction) => {
//     await handleSuggestionSelect(
//       pred.description,
//       setDropoffManualName,
//       setDropoffLatitude,
//       setDropoffLongitude,
//       setDropoffPredictions
//     );
//     setDropoffLocationId(MANUAL_LOCATION_VALUE);
//   };

//   /* ---------- Saved location handlers for towing ---------- */
//   const handlePickupLocationSelect = async (value: string) => {
//     setPickupPredictions([]);
//     setPickupManualName("");
//     setPickupLatitude("");
//     setPickupLongitude("");
//     setPickupLocationId(value);

//     if (!value || value === MANUAL_LOCATION_VALUE) return;

//     const sel = locationOptions.find((o) => o.value === value);
//     const label = sel?.label || "";

//     if (sel?.latitude && sel?.longitude) {
//       setPickupLatitude(String(sel.latitude));
//       setPickupLongitude(String(sel.longitude));
//       setPickupManualName(label);
//       return;
//     }

//     setPickupManualName(label);
//   };

//   const handleDropoffLocationSelect = async (value: string) => {
//     setDropoffPredictions([]);
//     setDropoffManualName("");
//     setDropoffLatitude("");
//     setDropoffLongitude("");
//     setDropoffLocationId(value);

//     if (!value || value === MANUAL_LOCATION_VALUE) return;

//     const sel = locationOptions.find((o) => o.value === value);
//     const label = sel?.label || "";

//     if (sel?.latitude && sel?.longitude) {
//       setDropoffLatitude(String(sel.latitude));
//       setDropoffLongitude(String(sel.longitude));
//       setDropoffManualName(label);
//       return;
//     }

//     setDropoffManualName(label);
//   };

//   /* ---------- validation ---------- */
//   const canSubmit = useMemo(() => {
//     const hasVehicleTypeSlot = !!form.vehicle && !!form.type && !!form.slot;
//     if (!hasVehicleTypeSlot) return false;

//     if (!isTowing) {
//       return !!(locationId || locationManualName.trim());
//     }

//     const pickupOk =
//       (pickupLocationId && pickupLocationId !== MANUAL_LOCATION_VALUE) ||
//       (pickupManualName.trim() && pickupLatitude && pickupLongitude);
//     const dropoffOk =
//       (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) ||
//       (dropoffManualName.trim() && dropoffLatitude && dropoffLongitude);

//     return !!(towingMethod && pickupOk && dropoffOk);
//   }, [
//     form.vehicle,
//     form.type,
//     form.slot,
//     isTowing,
//     towingMethod,
//     locationId,
//     locationManualName,
//     pickupLocationId,
//     pickupManualName,
//     pickupLatitude,
//     pickupLongitude,
//     dropoffLocationId,
//     dropoffManualName,
//     dropoffLatitude,
//     dropoffLongitude,
//   ]);

//   /* ---------- submit ---------- */
//   const handleSubmit = async () => {
//     if (!canSubmit || !onSubmit) return;

//     const payload: any = {
//       type: form.type,
//       vehicle: form.vehicle,
//       slot: form.slot,
//       notes: form.notes,
//     };

//     if (!isTowing) {
//       if (locationId && locationId !== MANUAL_LOCATION_VALUE) {
//         payload.location_id = locationId;
//         const sel = locationOptions.find((o) => o.value === locationId);
//         if (sel) {
//           payload.location_name = sel.label;
//           if (sel.latitude) payload.location_latitude = String(sel.latitude);
//           if (sel.longitude) payload.location_longitude = String(sel.longitude);
//         }
//         if (!payload.location_latitude && locationLatitude)
//           payload.location_latitude = locationLatitude;
//         if (!payload.location_longitude && locationLongitude)
//           payload.location_longitude = locationLongitude;
//       } else {
//         payload.location_name = locationManualName;
//         if (locationLatitude) payload.location_latitude = locationLatitude;
//         if (locationLongitude) payload.location_longitude = locationLongitude;
//       }
//     } else {
//       payload.towing_method = towingMethod;

//       if (pickupLocationId && pickupLocationId !== MANUAL_LOCATION_VALUE) {
//         payload.pickup_location_id = pickupLocationId;
//         const sel = locationOptions.find((o) => o.value === pickupLocationId);
//         if (sel) {
//           payload.pickup_location_name = sel.label;
//           if (sel.latitude) payload.pickup_latitude = String(sel.latitude);
//           if (sel.longitude) payload.pickup_longitude = String(sel.longitude);
//         }
//         if (!payload.pickup_latitude && pickupLatitude)
//           payload.pickup_latitude = pickupLatitude;
//         if (!payload.pickup_longitude && pickupLongitude)
//           payload.pickup_longitude = pickupLongitude;
//       } else {
//         payload.pickup_location_name = pickupManualName;
//         if (pickupLatitude) payload.pickup_latitude = pickupLatitude;
//         if (pickupLongitude) payload.pickup_longitude = pickupLongitude;
//       }

//       if (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) {
//         payload.dropoff_location_id = dropoffLocationId;
//         const sel = locationOptions.find((o) => o.value === dropoffLocationId);
//         if (sel) {
//           payload.dropoff_location_name = sel.label;
//           if (sel.latitude) payload.dropoff_latitude = String(sel.latitude);
//           if (sel.longitude) payload.dropoff_longitude = String(sel.longitude);
//         }
//         if (!payload.dropoff_latitude && dropoffLatitude)
//           payload.dropoff_latitude = dropoffLatitude;
//         if (!payload.dropoff_longitude && dropoffLongitude)
//           payload.dropoff_longitude = dropoffLongitude;
//       } else {
//         payload.dropoff_location_name = dropoffManualName;
//         if (dropoffLatitude) payload.dropoff_latitude = dropoffLatitude;
//         if (dropoffLongitude) payload.dropoff_longitude = dropoffLongitude;
//       }
//     }

//     await onSubmit(payload);

//     // reset state
//     setForm({ vehicle: "", type: "", slot: "", notes: "" });
//     setLocationId("");
//     setLocationManualName("");
//     setLocationLatitude("");
//     setLocationLongitude("");
//     setLocationPredictions([]);
//     setLookupError(null);
//     setTowingMethod("");
//     setPickupLocationId("");
//     setPickupManualName("");
//     setPickupLatitude("");
//     setPickupLongitude("");
//     setDropoffLocationId("");
//     setDropoffManualName("");
//     setDropoffLatitude("");
//     setDropoffLongitude("");
//     setPickupPredictions([]);
//     setDropoffPredictions([]);
//   };

//   /* ---------- cleanup ---------- */
//   // useEffect(() => {
//   //   return () => {
//   //     if (pickupTimer.current) window.clearTimeout(pickupTimer.current);
//   //     if (dropoffTimer.current) window.clearTimeout(dropoffTimer.current);
//   //     if (locationTimer.current) window.clearTimeout(locationTimer.current);
//   //   };
//   // }, []);

//   /* ---------- UI ---------- */
//   return (
//     <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
//       <h3 className="text-2xl font-semibold mb-6">Request Emergency Service</h3>

//       <div className="space-y-5">
//         {/* <Field label="Select Vehicle">
//           <Select
//             value={form.vehicle}
//             onValueChange={(v) => setForm((p) => ({ ...p, vehicle: v }))}
//             disabled={vehicleOptions.length === 0}
//           >
//             <Trigger
//               placeholder={
//                 vehicleOptions.length > 0
//                   ? "Select vehicle"
//                   : "No vehicles available"
//               }
//             />
//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {vehicleOptions.map((opt) => (
//                 <SelectItem key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field> */}
//         <Field label="Select Vehicle">
//           <Select
//             value={form.vehicle}
//             onValueChange={(v) => setForm((p) => ({ ...p, vehicle: v }))}
//             disabled={vehicleOptions.length === 0}
//           >
//             <Trigger
//               placeholder={
//                 vehicleOptions.length > 0
//                   ? "Select vehicle"
//                   : "No vehicles available"
//               }
//             />

//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {vehicleOptions.length > 0 ? (
//                 vehicleOptions.map((opt, idx) => (
//                   <Fragment key={opt.value}>
//                     <SelectItem
//                       value={opt.value}
//                       className="
//                 cursor-pointer
//                 transition-colors
//                 hover:bg-[#FF8500]/20
//                 focus:bg-[#FF8500]/25
//                 hover:text-white
//                 focus:text-white
//               "
//                     >
//                       {opt.label}
//                     </SelectItem>

//                     {idx < vehicleOptions.length - 1 && (
//                       <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                     )}
//                   </Fragment>
//                 ))
//               ) : (
//                 <div className="p-3 text-sm text-white/60 max-w-xs">
//                   No vehicles available.
//                 </div>
//               )}
//             </SelectContent>
//           </Select>
//         </Field>

//         {vehicleOptions.length === 0 && (
//           <div className="mt-2 text-sm text-white/70">
//             No vehicles found. Go to the{" "}
//             <Link href="/fleet" className="underline hover:text-white">
//               Fleet
//             </Link>{" "}
//             page and click <span className="font-semibold">Add New Fleet</span>{" "}
//             to add an asset.
//           </div>
//         )}

//         {/* <Field label="Service Needed">
//           <Select
//             value={form.type}
//             onValueChange={(v) => {
//               if (v === "TOWING") {
//                 setLocationId("");
//                 setLocationManualName("");
//                 setLocationLatitude("");
//                 setLocationLongitude("");
//                 setLocationPredictions([]);
//                 setLookupError(null);
//               }
//               setForm((p) => ({ ...p, type: v }));
//             }}
//           >
//             <Trigger />
//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {typeOptions.map((opt) => (
//                 <SelectItem key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field> */}

//         <Field label="Service Needed">
//           <Select
//             value={form.type}
//             onValueChange={(v) => {
//               if (v === "TOWING") {
//                 setLocationId("");
//                 setLocationManualName("");
//                 setLocationLatitude("");
//                 setLocationLongitude("");
//                 setLocationPredictions([]);
//                 setLookupError(null);
//               }
//               setForm((p) => ({ ...p, type: v }));
//             }}
//           >
//             <Trigger placeholder="Select service type" />

//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {typeOptions.map((opt, idx) => (
//                 <Fragment key={opt.value}>
//                   <SelectItem
//                     value={opt.value}
//                     className="
//               cursor-pointer
//               transition-colors
//               hover:bg-[#FF8500]/20
//               focus:bg-[#FF8500]/25
//               hover:text-white
//               focus:text-white
//             "
//                   >
//                     {opt.label}
//                   </SelectItem>

//                   {idx < typeOptions.length - 1 && (
//                     <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                   )}
//                 </Fragment>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field>

//         {isTowing && (
//           <>
//             {/* <Field label="Towing Method">
//               <Select
//                 value={towingMethod}
//                 onValueChange={(v) => setTowingMethod(v)}
//               >
//                 <Trigger />
//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   <SelectItem value="FLATBED">Flatbed Towing</SelectItem>
//                   <SelectItem value="HOOK_AND_CHAIN">
//                     Hook and Chain Towing
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field> */}

//             <Field label="Towing Method">
//               <Select
//                 value={towingMethod}
//                 onValueChange={(v) => setTowingMethod(v)}
//               >
//                 <Trigger placeholder="Select towing method" />

//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   {/* Flatbed Option */}
//                   <SelectItem
//                     value="FLATBED"
//                     className="
//           cursor-pointer
//           transition-colors
//           hover:bg-[#FF8500]/20
//           focus:bg-[#FF8500]/25
//           hover:text-white
//           focus:text-white
//         "
//                   >
//                     Flatbed Towing
//                   </SelectItem>

//                   {/* Divider */}
//                   <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />

//                   {/* Hook & Chain Option */}
//                   <SelectItem
//                     value="HOOK_AND_CHAIN"
//                     className="
//           cursor-pointer
//           transition-colors
//           hover:bg-[#FF8500]/20
//           focus:bg-[#FF8500]/25
//           hover:text-white
//           focus:text-white
//         "
//                   >
//                     Hook and Chain Towing
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>

//             {/* <Field label="Pick Up Location">
//               {pickupLocationId !== MANUAL_LOCATION_VALUE && (
//                 <Select
//                   value={pickupLocationId}
//                   onValueChange={(v) => handlePickupLocationSelect(v)}
//                 >
//                   <Trigger />
//                   <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                     {locationOptions.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                     <SelectItem value={MANUAL_LOCATION_VALUE}>
//                       Enter manually
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}

//               {pickupLocationId === MANUAL_LOCATION_VALUE && (
//                 <div className="relative mt-2">
//                   <CustomInput
//                     type="text"
//                     value={pickupManualName}
//                     onChange={(e) => onPickupInputChange(e.target.value)}
//                     placeholder="Type an address or place"
//                     className="
//                       h-14
//                       rounded-2xl
//                       border border-white/10
//                       bg-[#2D2A27]
//                       text-white placeholder:text-white/60
//                     "
//                   />

//                   {pickupPredictions.length > 0 && (
//                     <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                       {pickupPredictions.map((p, idx) => (
//                         <div
//                           key={p.place_id || idx}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={async () => {
//                             await selectPickupPrediction(p);
//                           }}
//                         >
//                           {p.description}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Field> */}

//             <Field label="Pick Up Location">
//               {pickupLocationId !== MANUAL_LOCATION_VALUE && (
//                 <Select
//                   value={pickupLocationId}
//                   onValueChange={(v) => handlePickupLocationSelect(v)}
//                 >
//                   <Trigger placeholder="Select pickup location" />

//                   <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                     {locationOptions.map((opt, idx) => (
//                       <Fragment key={opt.value}>
//                         <SelectItem
//                           value={opt.value}
//                           className="
//                 cursor-pointer
//                 transition-colors
//                 hover:bg-[#FF8500]/20
//                 focus:bg-[#FF8500]/25
//                 hover:text-white
//                 focus:text-white
//               "
//                         >
//                           {opt.label}
//                         </SelectItem>

//                         {idx < locationOptions.length - 1 && (
//                           <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                         )}
//                       </Fragment>
//                     ))}

//                     {/* Divider before manual entry */}
//                     <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />

//                     <SelectItem
//                       value={MANUAL_LOCATION_VALUE}
//                       className="
//             cursor-pointer
//             transition-colors
//             hover:bg-[#FF8500]/20
//             focus:bg-[#FF8500]/25
//             hover:text-white
//             focus:text-white
//             font-medium
//           "
//                     >
//                       Enter manually
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}

//               {pickupLocationId === MANUAL_LOCATION_VALUE && (
//                 <div className="relative mt-2">
//                   <CustomInput
//                     type="text"
//                     value={pickupManualName}
//                     onChange={(e) => onPickupInputChange(e.target.value)}
//                     placeholder="Type an address or place"
//                     className="
//           h-14
//           rounded-2xl
//           border border-white/10
//           bg-[#2D2A27]
//           text-white placeholder:text-white/60
//         "
//                   />

//                   {pickupPredictions.length > 0 && (
//                     <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                       {pickupPredictions.map((p, idx) => (
//                         <div
//                           key={p.place_id || idx}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={async () => {
//                             await selectPickupPrediction(p);
//                           }}
//                         >
//                           {p.description}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Field>

//             {/* <Field label="Drop Off Location">
//               {dropoffLocationId !== MANUAL_LOCATION_VALUE && (
//                 <Select
//                   value={dropoffLocationId}
//                   onValueChange={(v) => handleDropoffLocationSelect(v)}
//                 >
//                   <Trigger />
//                   <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                     {locationOptions.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                     <SelectItem value={MANUAL_LOCATION_VALUE}>
//                       Enter manually
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}

//               {dropoffLocationId === MANUAL_LOCATION_VALUE && (
//                 <div className="relative mt-2">
//                   <CustomInput
//                     type="text"
//                     value={dropoffManualName}
//                     onChange={(e) => onDropoffInputChange(e.target.value)}
//                     placeholder="Type an address or place"
//                     className="
//                       h-14
//                       rounded-2xl
//                       border border-white/10
//                       bg-[#2D2A27]
//                       text-white placeholder:text-white/60
//                     "
//                   />

//                   {dropoffPredictions.length > 0 && (
//                     <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                       {dropoffPredictions.map((p, idx) => (
//                         <div
//                           key={p.place_id || idx}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={async () => {
//                             await selectDropoffPrediction(p);
//                           }}
//                         >
//                           {p.description}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Field> */}
//             <Field label="Drop Off Location">
//               {dropoffLocationId !== MANUAL_LOCATION_VALUE && (
//                 <Select
//                   value={dropoffLocationId}
//                   onValueChange={(v) => handleDropoffLocationSelect(v)}
//                 >
//                   <Trigger placeholder="Select drop-off location" />

//                   <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                     {locationOptions.map((opt, idx) => (
//                       <Fragment key={opt.value}>
//                         <SelectItem
//                           value={opt.value}
//                           className="
//                 cursor-pointer
//                 transition-colors
//                 hover:bg-[#FF8500]/20
//                 focus:bg-[#FF8500]/25
//                 hover:text-white
//                 focus:text-white
//               "
//                         >
//                           {opt.label}
//                         </SelectItem>

//                         {idx < locationOptions.length - 1 && (
//                           <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                         )}
//                       </Fragment>
//                     ))}

//                     {/* Divider before manual entry */}
//                     <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />

//                     <SelectItem
//                       value={MANUAL_LOCATION_VALUE}
//                       className="
//             cursor-pointer
//             transition-colors
//             hover:bg-[#FF8500]/20
//             focus:bg-[#FF8500]/25
//             hover:text-white
//             focus:text-white
//             font-medium
//           "
//                     >
//                       Enter manually
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}

//               {dropoffLocationId === MANUAL_LOCATION_VALUE && (
//                 <div className="relative mt-2">
//                   <CustomInput
//                     type="text"
//                     value={dropoffManualName}
//                     onChange={(e) => onDropoffInputChange(e.target.value)}
//                     placeholder="Type an address or place"
//                     className="
//           h-14
//           rounded-2xl
//           border border-white/10
//           bg-[#2D2A27]
//           text-white placeholder:text-white/60
//         "
//                   />

//                   {dropoffPredictions.length > 0 && (
//                     <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                       {dropoffPredictions.map((p, idx) => (
//                         <div
//                           key={p.place_id || idx}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={async () => {
//                             await selectDropoffPrediction(p);
//                           }}
//                         >
//                           {p.description}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Field>
//           </>
//         )}

//         {!isTowing && (
//           // <Field label="Location">
//           //   {locationId !== MANUAL_LOCATION_VALUE && (
//           //     <Select
//           //       value={locationId || ""}
//           //       onValueChange={handleLocationSelect}
//           //     >
//           //       <Trigger />
//           //       <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//           //         {locationOptions.map((opt) => (
//           //           <SelectItem key={opt.value} value={opt.value}>
//           //             {opt.label}
//           //           </SelectItem>
//           //         ))}
//           //         <SelectItem value={MANUAL_LOCATION_VALUE}>
//           //           Enter manually
//           //         </SelectItem>
//           //       </SelectContent>
//           //     </Select>
//           //   )}

//           //   {locationId === MANUAL_LOCATION_VALUE && (
//           //     <div className="relative mt-2">
//           //       <CustomInput
//           //         type="text"
//           //         value={locationManualName}
//           //         onChange={(e) => onLocationInputChange(e.target.value)}
//           //         placeholder="Enter address or location name"
//           //         className="
//           //           h-14
//           //           rounded-2xl
//           //           border border-white/10
//           //           bg-[#2D2A27]
//           //           text-white placeholder:text-white/60
//           //         "
//           //       />

//           //       {locationPredictions.length > 0 && (
//           //         <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//           //           {locationPredictions.map((p, idx) => (
//           //             <div
//           //               key={p.place_id || idx}
//           //               className="p-2 hover:bg-gray-100 cursor-pointer"
//           //               onClick={async () => {
//           //                 await selectLocationPrediction(p);
//           //               }}
//           //             >
//           //               {p.description}
//           //             </div>
//           //           ))}
//           //         </div>
//           //       )}

//           //       {lookupError && (
//           //         <p className="text-sm text-rose-400 mt-2">{lookupError}</p>
//           //       )}
//           //     </div>
//           //   )}
//           // </Field>
//           <Field label="Location">
//             {locationId !== MANUAL_LOCATION_VALUE && (
//               <Select
//                 value={locationId || ""}
//                 onValueChange={handleLocationSelect}
//               >
//                 <Trigger placeholder="Select location" />

//                 <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//                   {locationOptions.map((opt, idx) => (
//                     <Fragment key={opt.value}>
//                       <SelectItem
//                         value={opt.value}
//                         className="
//                 cursor-pointer
//                 transition-colors
//                 hover:bg-[#FF8500]/20
//                 focus:bg-[#FF8500]/25
//                 hover:text-white
//                 focus:text-white
//               "
//                       >
//                         {opt.label}
//                       </SelectItem>

//                       {idx < locationOptions.length - 1 && (
//                         <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                       )}
//                     </Fragment>
//                   ))}

//                   {/* Divider before manual entry */}
//                   <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />

//                   <SelectItem
//                     value={MANUAL_LOCATION_VALUE}
//                     className="
//             cursor-pointer
//             transition-colors
//             hover:bg-[#FF8500]/20
//             focus:bg-[#FF8500]/25
//             hover:text-white
//             focus:text-white
//             font-medium
//           "
//                   >
//                     Enter manually
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             )}

//             {locationId === MANUAL_LOCATION_VALUE && (
//               <div className="relative mt-2">
//                 <CustomInput
//                   type="text"
//                   value={locationManualName}
//                   onChange={(e) => onLocationInputChange(e.target.value)}
//                   placeholder="Enter address or location name"
//                   className="
//           h-14
//           rounded-2xl
//           border border-white/10
//           bg-[#2D2A27]
//           text-white placeholder:text-white/60
//         "
//                 />

//                 {locationPredictions.length > 0 && (
//                   <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
//                     {locationPredictions.map((p, idx) => (
//                       <div
//                         key={p.place_id || idx}
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={async () => {
//                           await selectLocationPrediction(p);
//                         }}
//                       >
//                         {p.description}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {lookupError && (
//                   <p className="text-sm text-rose-400 mt-2">{lookupError}</p>
//                 )}
//               </div>
//             )}
//           </Field>
//         )}

//         {/* <Field label="Preferred Time Slot">
//           <Select
//             value={form.slot}
//             onValueChange={(v) => setForm((p) => ({ ...p, slot: v }))}
//           >
//             <Trigger />
//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {slotOptions.map((opt) => (
//                 <SelectItem key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field> */}

//         <Field label="Preferred Time Slot">
//           <Select
//             value={form.slot}
//             onValueChange={(v) => setForm((p) => ({ ...p, slot: v }))}
//           >
//             <Trigger placeholder="Select preferred time slot" />

//             <SelectContent className="bg-[#2D2A27] text-white border-white/10">
//               {slotOptions.map((opt, idx) => (
//                 <Fragment key={opt.value}>
//                   <SelectItem
//                     value={opt.value}
//                     className="
//               cursor-pointer
//               transition-colors
//               hover:bg-[#FF8500]/20
//               focus:bg-[#FF8500]/25
//               hover:text-white
//               focus:text-white
//             "
//                   >
//                     {opt.label}
//                   </SelectItem>

//                   {/* Divider between items */}
//                   {idx < slotOptions.length - 1 && (
//                     <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
//                   )}
//                 </Fragment>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field>

//         <Field label="Additional Notes">
//           <Textarea
//             value={form.notes}
//             onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
//             placeholder="Add any details to help us locate and assist quickly"
//             className="min-h-[110px] rounded-xl border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
//           />
//         </Field>

//         <Button
//           disabled={!canSubmit}
//           variant="orange"
//           className="w-full h-[48px] lg:h-[52px]"
//           onClick={handleSubmit}
//         >
//           Request Service
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Field({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-2">
//       <Label className="text-white/80">{label}</Label>
//       {children}
//     </div>
//   );
// }

// function Trigger({ placeholder = "Select" }: { placeholder?: string }) {
//   return (
//     <SelectTrigger className="h-12 rounded-xl border-white/10 bg-[#2D2A27] text-white">
//       <SelectValue placeholder={placeholder} />
//     </SelectTrigger>
//   );
// }

"use client";
import { Fragment } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/ui/CustomInput";
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

type Option = {
  label: string;
  value: string;
  latitude?: string;
  longitude?: string;
};

type GooglePlacePrediction = {
  description: string;
  place_id: string;
};

const MANUAL_LOCATION_VALUE = "__manual__";

/* ---------- Vehicles Multi-Select (no nested <button> inside <button>) ---------- */
function VehiclesMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select vehicles",
  disabled = false,
}: {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const allValues = useMemo(() => options.map((o) => o.value), [options]);
  const allChecked = value.length > 0 && value.length === allValues.length;
  const indeterminate = value.length > 0 && value.length < allValues.length;

  const toggleAll = () => onChange(allChecked ? [] : allValues);
  const toggleOne = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const labelText = useMemo(() => {
    if (value.length === 0)
      return <span className="text-white/60">{placeholder}</span>;
    if (value.length === 1) {
      const single =
        options.find((o) => o.value === value[0])?.label || "1 selected";
      return <span className="truncate">{single}</span>;
    }
    return <span className="truncate">{value.length} selected</span>;
  }, [value, options, placeholder]);

  const onKeyActivate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
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
            "w-full h-12 rounded-xl border border-white/10 bg-[#2D2A27] text-white px-4",
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

          {/* Select All row — div with role=button (Checkbox is a button) */}
          <div className="px-3 pb-2 pt-1">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={allChecked}
              onClick={toggleAll}
              onKeyDown={onKeyActivate}
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

          {/* List */}
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

export function RequestEmergencyServiceCard({
  vehicleOptions = [],
  locationOptions = [],
  typeOptions = [],
  slotOptions = [],
  onSubmit,
}: {
  vehicleOptions?: Option[];
  locationOptions?: Option[];
  typeOptions?: Option[];
  slotOptions?: Option[];
  onSubmit?: (data: any) => Promise<void> | void;
}) {
  /* ---------- Google Maps loader (same as RequestServiceModal) ---------- */
  const [isMounted, setIsMounted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

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

  /* ---------- base form ---------- */
  const [form, setForm] = useState({
    vehicles: [] as string[], // ✅ multi
    type: "",
    slot: "",
    notes: "",
  });
  const isTowing = form.type === "TOWING";

  /* ---------- NON-TOWING location ---------- */
  const [locationId, setLocationId] = useState<string>("");
  const [locationManualName, setLocationManualName] = useState<string>("");
  const [locationLatitude, setLocationLatitude] = useState<string>("");
  const [locationLongitude, setLocationLongitude] = useState<string>("");
  const [locationPredictions, setLocationPredictions] = useState<
    GooglePlacePrediction[]
  >([]);
  const locationTimer = useRef<number | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  /* ---------- TOWING fields & coords ---------- */
  const [towingMethod, setTowingMethod] = useState<string>("");

  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [pickupManualName, setPickupManualName] = useState<string>("");
  const [pickupLatitude, setPickupLatitude] = useState<string>("");
  const [pickupLongitude, setPickupLongitude] = useState<string>("");
  const [pickupPredictions, setPickupPredictions] = useState<
    GooglePlacePrediction[]
  >([]);
  const pickupTimer = useRef<number | null>(null);

  const [dropoffLocationId, setDropoffLocationId] = useState<string>("");
  const [dropoffManualName, setDropoffManualName] = useState<string>("");
  const [dropoffLatitude, setDropoffLatitude] = useState<string>("");
  const [dropoffLongitude, setDropoffLongitude] = useState<string>("");
  const [dropoffPredictions, setDropoffPredictions] = useState<
    GooglePlacePrediction[]
  >([]);
  const dropoffTimer = useRef<number | null>(null);

  /* ---------- Predictions helper ---------- */
  const getPredictions = (
    input: string,
    setter: (x: GooglePlacePrediction[]) => void,
    timer: React.MutableRefObject<number | null>
  ) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      if (!isMounted || !isGoogleMapsLoaded || !input.trim()) {
        setter([]);
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

        setter(results);
      } catch (err) {
        console.error("Predictions error:", err);
        setter([]);
      }
    }, 200);
  };

  /* ---------- Geocoding helper ---------- */
  const handleSuggestionSelect = async (
    description: string,
    setName: (v: string) => void,
    setLat: (v: string) => void,
    setLng: (v: string) => void,
    setPreds: (v: GooglePlacePrediction[]) => void,
    setError?: (v: string | null) => void
  ) => {
    setPreds([]);
    setName(description);

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
          setLat(String(lat));
          setLng(String(lng));
          return;
        }
      } catch (err) {
        console.warn("Geocoder failed:", err);
        if (setError) {
          setError("Failed to resolve coordinates for that place.");
        }
      }
    } else {
      if (setError) {
        setError("Google Maps geocoder not available.");
      }
    }
  };

  /* ---------- NON-TOWING manual input handlers ---------- */
  const onLocationInputChange = (value: string) => {
    setLocationManualName(value);
    setLocationLatitude("");
    setLocationLongitude("");
    setLocationPredictions([]);
    setLookupError(null);
    getPredictions(value, setLocationPredictions, locationTimer);
  };

  const selectLocationPrediction = async (pred: GooglePlacePrediction) => {
    await handleSuggestionSelect(
      pred.description,
      setLocationManualName,
      setLocationLatitude,
      setLocationLongitude,
      setLocationPredictions,
      setLookupError
    );
    setLocationId(MANUAL_LOCATION_VALUE);
  };

  const handleLocationSelect = async (value: string) => {
    setLocationPredictions([]);
    setLocationManualName("");
    setLocationLatitude("");
    setLocationLongitude("");
    setLocationId(value);

    if (!value || value === MANUAL_LOCATION_VALUE) return;

    const sel = locationOptions.find((o) => o.value === value);
    const label = sel?.label || "";

    if (sel?.latitude && sel?.longitude) {
      setLocationLatitude(String(sel.latitude));
      setLocationLongitude(String(sel.longitude));
      setLocationManualName(label);
      return;
    }

    // fallback: just keep label; backend can resolve if needed
    setLocationManualName(label);
  };

  /* ---------- TOWING manual input handlers ---------- */
  const onPickupInputChange = (value: string) => {
    setPickupManualName(value);
    setPickupLatitude("");
    setPickupLongitude("");
    setPickupPredictions([]);
    getPredictions(value, setPickupPredictions, pickupTimer);
  };

  const onDropoffInputChange = (value: string) => {
    setDropoffManualName(value);
    setDropoffLatitude("");
    setDropoffLongitude("");
    setDropoffPredictions([]);
    getPredictions(value, setDropoffPredictions, dropoffTimer);
  };

  const selectPickupPrediction = async (pred: GooglePlacePrediction) => {
    await handleSuggestionSelect(
      pred.description,
      setPickupManualName,
      setPickupLatitude,
      setPickupLongitude,
      setPickupPredictions
    );
    setPickupLocationId(MANUAL_LOCATION_VALUE);
  };

  const selectDropoffPrediction = async (pred: GooglePlacePrediction) => {
    await handleSuggestionSelect(
      pred.description,
      setDropoffManualName,
      setDropoffLatitude,
      setDropoffLongitude,
      setDropoffPredictions
    );
    setDropoffLocationId(MANUAL_LOCATION_VALUE);
  };

  /* ---------- Saved location handlers for towing ---------- */
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
    setPickupManualName(label);
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
    setDropoffManualName(label);
  };

  /* ---------- validation ---------- */
  const canSubmit = useMemo(() => {
    const hasVehiclesTypeSlot =
      form.vehicles.length > 0 && !!form.type && !!form.slot;
    if (!hasVehiclesTypeSlot) return false;

    if (!isTowing) {
      return !!(locationId || locationManualName.trim());
    }

    const pickupOk =
      (pickupLocationId && pickupLocationId !== MANUAL_LOCATION_VALUE) ||
      (pickupManualName.trim() && pickupLatitude && pickupLongitude);
    const dropoffOk =
      (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) ||
      (dropoffManualName.trim() && dropoffLatitude && dropoffLongitude);

    return !!(towingMethod && pickupOk && dropoffOk);
  }, [
    form.vehicles,
    form.type,
    form.slot,
    isTowing,
    towingMethod,
    locationId,
    locationManualName,
    pickupLocationId,
    pickupManualName,
    pickupLatitude,
    pickupLongitude,
    dropoffLocationId,
    dropoffManualName,
    dropoffLatitude,
    dropoffLongitude,
  ]);

  /* ---------- submit ---------- */
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit || submitting) return;
    setSubmitting(true);

    try {
      const payload: any = {
        type: form.type,
        vehicle: form.vehicles[0] || "", // backward-compat
        asset_id: form.vehicles[0] || "", // first selected
        asset_ids: form.vehicles, // full list
        slot: form.slot,
        notes: form.notes,
      };

      if (!isTowing) {
        if (locationId && locationId !== MANUAL_LOCATION_VALUE) {
          payload.location_id = locationId;
          const sel = locationOptions.find((o) => o.value === locationId);
          if (sel) {
            payload.location_name = sel.label;
            if (sel.latitude) payload.location_latitude = String(sel.latitude);
            if (sel.longitude)
              payload.location_longitude = String(sel.longitude);
          }
          if (!payload.location_latitude && locationLatitude)
            payload.location_latitude = locationLatitude;
          if (!payload.location_longitude && locationLongitude)
            payload.location_longitude = locationLongitude;
        } else {
          payload.location_name = locationManualName;
          if (locationLatitude) payload.location_latitude = locationLatitude;
          if (locationLongitude) payload.location_longitude = locationLongitude;
        }
      } else {
        payload.towing_method = towingMethod;

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

        if (dropoffLocationId && dropoffLocationId !== MANUAL_LOCATION_VALUE) {
          payload.dropoff_location_id = dropoffLocationId;
          const sel = locationOptions.find(
            (o) => o.value === dropoffLocationId
          );
          if (sel) {
            payload.dropoff_location_name = sel.label;
            if (sel.latitude) payload.dropoff_latitude = String(sel.latitude);
            if (sel.longitude)
              payload.dropoff_longitude = String(sel.longitude);
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

      // ✅ Only once
      await onSubmit(payload);

      // reset state
      setForm({ vehicles: [], type: "", slot: "", notes: "" });
      setLocationId("");
      setLocationManualName("");
      setLocationLatitude("");
      setLocationLongitude("");
      setLocationPredictions([]);
      setLookupError(null);
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
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-2xl font-semibold mb-6">Request Emergency Service</h3>

      <div className="space-y-5">
        {/* Vehicles (multi-select) */}
        <Field label="Select Vehicle(s)">
          <VehiclesMultiSelect
            options={vehicleOptions}
            value={form.vehicles}
            onChange={(ids) => setForm((p) => ({ ...p, vehicles: ids }))}
            placeholder={
              vehicleOptions.length > 0
                ? "Select vehicles"
                : "No vehicles available"
            }
            disabled={vehicleOptions.length === 0}
          />
        </Field>

        {vehicleOptions.length === 0 && (
          <div className="mt-2 text-sm text-white/70">
            No vehicles found. Go to the{" "}
            <Link href="/fleet" className="underline hover:text-white">
              Fleet
            </Link>{" "}
            page and click <span className="font-semibold">Add New Fleet</span>{" "}
            to add an asset.
          </div>
        )}

        {/* Service type */}
        <Field label="Service Needed">
          <Select
            value={form.type}
            onValueChange={(v) => {
              if (v === "TOWING") {
                // clear simple location when switching to towing
                setLocationId("");
                setLocationManualName("");
                setLocationLatitude("");
                setLocationLongitude("");
                setLocationPredictions([]);
                setLookupError(null);
              }
              setForm((p) => ({ ...p, type: v }));
            }}
          >
            <Trigger placeholder="Select service type" />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              {typeOptions.map((opt, idx) => (
                <Fragment key={opt.value}>
                  <SelectItem
                    value={opt.value}
                    className="
                      cursor-pointer
                      transition-colors
                      hover:bg-[#FF8500]/20
                      focus:bg-[#FF8500]/25
                      hover:text-white
                      focus:text-white
                    "
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

        {/* Towing-only fields */}
        {isTowing && (
          <>
            <Field label="Towing Method">
              <Select value={towingMethod} onValueChange={setTowingMethod}>
                <Trigger placeholder="Select towing method" />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  <SelectItem
                    value="FLATBED"
                    className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
                  >
                    Flatbed Towing
                  </SelectItem>
                  <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                  <SelectItem
                    value="HOOK_AND_CHAIN"
                    className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
                  >
                    Hook and Chain Towing
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Pickup */}
            <Field label="Pick Up Location">
              {pickupLocationId !== MANUAL_LOCATION_VALUE && (
                <Select
                  value={pickupLocationId}
                  onValueChange={handlePickupLocationSelect}
                >
                  <Trigger placeholder="Select pickup location" />
                  <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                    {locationOptions.map((opt, idx) => (
                      <Fragment key={opt.value}>
                        <SelectItem
                          value={opt.value}
                          className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
                        >
                          {opt.label}
                        </SelectItem>
                        {idx < locationOptions.length - 1 && (
                          <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                        )}
                      </Fragment>
                    ))}
                    <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />
                    <SelectItem
                      value={MANUAL_LOCATION_VALUE}
                      className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 font-medium"
                    >
                      Enter manually
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}

              {pickupLocationId === MANUAL_LOCATION_VALUE && (
                <div className="relative mt-2">
                  <CustomInput
                    type="text"
                    value={pickupManualName}
                    onChange={(e) => onPickupInputChange(e.target.value)}
                    placeholder="Type an address or place"
                    className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                  />

                  {pickupPredictions.length > 0 && (
                    <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                      {pickupPredictions.map((p, idx) => (
                        <div
                          key={p.place_id || idx}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={async () => {
                            await selectPickupPrediction(p);
                          }}
                        >
                          {p.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Field>

            {/* Dropoff */}
            <Field label="Drop Off Location">
              {dropoffLocationId !== MANUAL_LOCATION_VALUE && (
                <Select
                  value={dropoffLocationId}
                  onValueChange={handleDropoffLocationSelect}
                >
                  <Trigger placeholder="Select drop-off location" />
                  <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                    {locationOptions.map((opt, idx) => (
                      <Fragment key={opt.value}>
                        <SelectItem
                          value={opt.value}
                          className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
                        >
                          {opt.label}
                        </SelectItem>
                        {idx < locationOptions.length - 1 && (
                          <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                        )}
                      </Fragment>
                    ))}
                    <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />
                    <SelectItem
                      value={MANUAL_LOCATION_VALUE}
                      className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 font-medium"
                    >
                      Enter manually
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}

              {dropoffLocationId === MANUAL_LOCATION_VALUE && (
                <div className="relative mt-2">
                  <CustomInput
                    type="text"
                    value={dropoffManualName}
                    onChange={(e) => onDropoffInputChange(e.target.value)}
                    placeholder="Type an address or place"
                    className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                  />

                  {dropoffPredictions.length > 0 && (
                    <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                      {dropoffPredictions.map((p, idx) => (
                        <div
                          key={p.place_id || idx}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={async () => {
                            await selectDropoffPrediction(p);
                          }}
                        >
                          {p.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Field>
          </>
        )}

        {/* Simple location (non-towing) */}
        {!isTowing && (
          <Field label="Location">
            {locationId !== MANUAL_LOCATION_VALUE && (
              <Select
                value={locationId || ""}
                onValueChange={handleLocationSelect}
              >
                <Trigger placeholder="Select location" />
                <SelectContent className="bg-[#2D2A27] text-white border-white/10">
                  {locationOptions.map((opt, idx) => (
                    <Fragment key={opt.value}>
                      <SelectItem
                        value={opt.value}
                        className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
                      >
                        {opt.label}
                      </SelectItem>
                      {idx < locationOptions.length - 1 && (
                        <SelectSeparator className="my-1 -mx-1 h-px bg-white/10" />
                      )}
                    </Fragment>
                  ))}
                  <SelectSeparator className="my-2 -mx-1 h-px bg-white/15" />
                  <SelectItem
                    value={MANUAL_LOCATION_VALUE}
                    className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 font-medium"
                  >
                    Enter manually
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            {locationId === MANUAL_LOCATION_VALUE && (
              <div className="relative mt-2">
                <CustomInput
                  type="text"
                  value={locationManualName}
                  onChange={(e) => onLocationInputChange(e.target.value)}
                  placeholder="Enter address or location name"
                  className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
                />

                {locationPredictions.length > 0 && (
                  <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white text-black rounded-md shadow-lg max-h-56 overflow-auto">
                    {locationPredictions.map((p, idx) => (
                      <div
                        key={p.place_id || idx}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={async () => {
                          await selectLocationPrediction(p);
                        }}
                      >
                        {p.description}
                      </div>
                    ))}
                  </div>
                )}

                {lookupError && (
                  <p className="text-sm text-rose-400 mt-2">{lookupError}</p>
                )}
              </div>
            )}
          </Field>
        )}

        {/* Slot */}
        <Field label="Preferred Time Slot">
          <Select
            value={form.slot}
            onValueChange={(v) => setForm((p) => ({ ...p, slot: v }))}
          >
            <Trigger placeholder="Select preferred time slot" />
            <SelectContent className="bg-[#2D2A27] text-white border-white/10">
              {slotOptions.map((opt, idx) => (
                <Fragment key={opt.value}>
                  <SelectItem
                    value={opt.value}
                    className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25"
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

        {/* Notes */}
        <Field label="Additional Notes">
          <Textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Add any details to help us locate and assist quickly"
            className="min-h-[110px] rounded-xl border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
          />
        </Field>

        <Button
          disabled={!canSubmit || submitting}
          variant="orange"
          className="w-full h-[48px] lg:h-[52px]"
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Request Service"}
        </Button>
      </div>
    </div>
  );
}

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
    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-[#2D2A27] text-white">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );
}

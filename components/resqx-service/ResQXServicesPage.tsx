"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { MapComponent } from "@/components/resqx-service/MapComponent";
import { PaymentModal } from "@/components/resqx-service/PaymentModal";
import { DirectPaymentModal } from "@/components/resqx-service/DirectPaymentModal";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/resqx-service/Tabs";

interface Position {
  lat: number;
  lng: number;
}

interface PaymentDetails {
  data: {
    authorization_url: string;
  };
}

interface ServiceResult {
  distance: number;
  durationInMinutes: number;
  normal_price: number;
  flatbed_price: number;
  nighttime_price?: number;
  amount?: number;
  paymentDetails?: PaymentDetails;
}

interface DirectPaymentResult {
  amount: number;
  paymentDetails: PaymentDetails;
}

interface GooglePlacePrediction {
  description: string;
  place_id: string;
}

interface Suggestions {
  start: GooglePlacePrediction[];
  end: GooglePlacePrediction[];
}

const ResQXServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("location");
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);
  const [result, setResult] = useState<ServiceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultCenter] = useState<[number, number]>([6.5244, 3.3792]);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSUV, setIsSUV] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions>({
    start: [],
    end: [],
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [directPaymentAmount, setDirectPaymentAmount] = useState("");
  const [directPaymentResult, setDirectPaymentResult] =
    useState<DirectPaymentResult | null>(null);
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false);
  const [isNightTime, setIsNightTime] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Google Maps script - Fixed version
  useEffect(() => {
    if (!isMounted) return;

    // Check if Google Maps is already loaded
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already in the document
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      // If script exists, just wait for it to load
      const handleLoad = () => {
        setIsGoogleMapsLoaded(true);
        console.log("Google Maps loaded (existing script)");
      };

      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        handleLoad();
      } else {
        existingScript.addEventListener("load", handleLoad);
      }

      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    } else {
      // Create new script only if it doesn't exist
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
        console.log("Google Maps loaded (new script)");
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps");
      };
      document.head.appendChild(script);

      return () => {
        // Only remove if we created it and it's still in the document
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [isMounted]);

  // Handle address predictions - only run when Google Maps is loaded
  const getPredictions = async (input: string, type: "start" | "end") => {
    if (
      !isMounted ||
      !isGoogleMapsLoaded ||
      typeof window === "undefined" ||
      !window.google ||
      !input.trim()
    ) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await new Promise<GooglePlacePrediction[]>(
        (resolve, reject) => {
          service.getPlacePredictions(
            { input, componentRestrictions: { country: "ng" } },
            (results: GooglePlacePrediction[] | null, status: string) =>
              status === "OK" && results ? resolve(results) : reject(status)
          );
        }
      );
      setSuggestions((prev) => ({ ...prev, [type]: predictions }));
    } catch (error) {
      console.error("Prediction error:", error);
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
    }
  };

  // Handle address selection - only run when Google Maps is loaded
  const handleAddressSelect = async (
    address: string,
    type: "start" | "end"
  ) => {
    if (
      !isMounted ||
      !isGoogleMapsLoaded ||
      typeof window === "undefined" ||
      !window.google
    )
      return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode(
            { address },
            (results: google.maps.GeocoderResult[] | null, status: string) =>
              status === "OK" && results ? resolve(results) : reject(status)
          );
        }
      );

      if (results && results[0]) {
        const location = results[0].geometry.location;
        const position: Position = { lat: location.lat(), lng: location.lng() };

        if (type === "start") {
          setStartPosition(position);
          setStartAddress(results[0].formatted_address);
        } else {
          setEndPosition(position);
          setEndAddress(results[0].formatted_address);
        }
        setSuggestions((prev) => ({ ...prev, [type]: [] }));
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startPosition || !endPosition || !userName || !userEmail) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const payload = {
      dropoff_longitude: endPosition.lng.toString(),
      dropoff_latitude: endPosition.lat.toString(),
      pickup_latitude: startPosition.lat.toString(),
      pickup_longitude: startPosition.lng.toString(),
      is_SUV: isSUV,
      order_type: "TOW_TRUCK",
      user_name: userName,
      user_email: userEmail,
      is_NIGHTTIME: isNightTime,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/offlineOrderDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            "x-resqx-key": process.env.NEXT_PUBLIC_RESQX_KEY,
          },
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !directPaymentAmount) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/offline_get_payment_Link`,
        {
          params: {
            user_name: userName,
            user_email: userEmail,
            amount: directPaymentAmount,
          },
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            "x-resqx-key": process.env.NEXT_PUBLIC_RESQX_KEY,
          },
        }
      );

      if (response.data.success) {
        setDirectPaymentResult(response.data.data);
        setShowDirectPaymentModal(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while component is mounting or Google Maps is loading
  if (!isMounted || !isGoogleMapsLoaded) {
    return (
      <div className="min-h-screen bg-[#fff] p-8 md:p-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#FF8500] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isMounted ? "Loading..." : "Loading Google Maps..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] p-0 md:p-16 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="location" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="location"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Location Service
            </TabsTrigger>
            <TabsTrigger
              value="direct"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Direct Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="location"
            className="bg-[#332414] p-6 md:p-8 rounded-lg shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Start Location Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  Start Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startAddress}
                    onChange={(e) => {
                      setStartAddress(e.target.value);
                      getPredictions(e.target.value, "start");
                    }}
                    placeholder="Enter start address"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                  />
                  {suggestions.start.length > 0 && (
                    <div className="absolute z-[1000] w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto">
                      {suggestions.start.map((item, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                          onClick={() =>
                            handleAddressSelect(item.description, "start")
                          }
                        >
                          {item.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <MapComponent
                  position={startPosition}
                  setPosition={setStartPosition}
                  defaultCenter={defaultCenter}
                />
                {startPosition && (
                  <p className="text-sm text-gray-300">
                    Coordinates: {startPosition.lat.toFixed(6)},{" "}
                    {startPosition.lng.toFixed(6)}
                  </p>
                )}
              </div>

              {/* End Location Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  End Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={endAddress}
                    onChange={(e) => {
                      setEndAddress(e.target.value);
                      getPredictions(e.target.value, "end");
                    }}
                    placeholder="Enter end address"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                  />
                  {suggestions.end.length > 0 && (
                    <div className="absolute z-[1000] w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto">
                      {suggestions.end.map((item, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                          onClick={() =>
                            handleAddressSelect(item.description, "end")
                          }
                        >
                          {item.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <MapComponent
                  position={endPosition}
                  setPosition={setEndPosition}
                  defaultCenter={defaultCenter}
                />
                {endPosition && (
                  <p className="text-sm text-gray-300">
                    Coordinates: {endPosition.lat.toFixed(6)},{" "}
                    {endPosition.lng.toFixed(6)}
                  </p>
                )}
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    User Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                  />
                </div>
              </div>

              {/* SUV Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="suv"
                  checked={isSUV}
                  onChange={(e) => setIsSUV(e.target.checked)}
                  className="h-4 w-4 text-[#FF8500] focus:ring-[#FF8500]"
                />
                <label htmlFor="suv" className="text-sm font-medium text-white">
                  Is this for an SUV?
                </label>
              </div>

              {/* Night Time Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nighttime"
                  checked={isNightTime}
                  onChange={(e) => setIsNightTime(e.target.checked)}
                  className="h-4 w-4 text-[#FF8500] focus:ring-[#FF8500]"
                />
                <label
                  htmlFor="nighttime"
                  className="text-sm font-medium text-white"
                >
                  Is this for Night Time?
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF8500] text-white py-3 px-4 rounded-md hover:bg-[#FF8500]/90 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Get Service Details"
                )}
              </button>
            </form>
          </TabsContent>

          <TabsContent
            value="direct"
            className="bg-[#332414] p-6 md:p-8 rounded-lg shadow-lg"
          >
            <form onSubmit={handleDirectPaymentSubmit} className="space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    User Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={directPaymentAmount}
                  onChange={(e) => setDirectPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-[#FAF8F5] text-[#3B3835] rounded-md"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF8500] text-white py-3 px-4 rounded-md hover:bg-[#FF8500]/90 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Get Payment Link"
                )}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && result && (
        <PaymentModal
          result={result}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Direct Payment Modal */}
      {showDirectPaymentModal && directPaymentResult && (
        <DirectPaymentModal
          result={directPaymentResult}
          onClose={() => setShowDirectPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default ResQXServicesPage;

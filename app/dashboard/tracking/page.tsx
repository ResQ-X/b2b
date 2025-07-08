"use client";
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { GiTowTruck } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";
import { useLiveProfessionals } from "@/lib/useLiveProfessionals";
import { Cookies } from "react-cookie";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Enhanced Professional interface for better type safety
interface Professional {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  userType: string;
  professionalType: "PROFESSIONAL_TOW_TRUCK" | "PROFESSIONAL_FIRST_RESPONDDER";
  service?: string;
  status?: string;
  location?: string;
}

// Convert React Icon to data URL with better error handling
const iconToDataUrl = (icon: JSX.Element): string => {
  try {
    const svgString = encodeURIComponent(renderToStaticMarkup(icon));
    return `data:image/svg+xml,${svgString}`;
  } catch (error) {
    console.error("Error converting icon to data URL:", error);
    return ""; // Fallback to default marker
  }
};

export default function Page() {
  const router = useRouter();
  const cookies = new Cookies();
  const user = cookies.get("user");
  const userId = user?.id;
  const MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const { allProfessionalsData, loading, error } = useLiveProfessionals(userId);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
  });

  console.log("All Professionals Data:", allProfessionalsData);

  const mapRef = useRef<google.maps.Map | null>(null);
  const hasCentered = useRef(false);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (allProfessionalsData.length > 0 && !hasCentered.current) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        let hasValidCoordinates = false;

        allProfessionalsData.forEach((pro) => {
          const lat = Number(pro.latitude);
          const lng = Number(pro.longitude);

          // if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
          //   bounds.extend({ lat, lng });
          //   hasValidCoordinates = true;
          // }
          if (
            !isNaN(lat) &&
            !isNaN(lng) &&
            isFinite(lat) &&
            !(lat === 0 && lng === 0) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          ) {
            bounds.extend({ lat, lng });
            hasValidCoordinates = true;
          }
        });

        if (hasValidCoordinates) {
          map.fitBounds(bounds);
          hasCentered.current = true;
        }
      } catch (error) {
        console.error("Error fitting bounds:", error);
        setMapError("Failed to fit map bounds. Please try again later.");
      }
    }
  };

  // Fit bounds on first professionals load
  useEffect(() => {
    if (
      !mapRef.current ||
      allProfessionalsData.length === 0 ||
      hasCentered.current
    )
      return;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoordinates = false;

      allProfessionalsData.forEach((pro) => {
        const lat = Number(pro.latitude);
        const lng = Number(pro.longitude);

        // if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
        //   bounds.extend({ lat, lng });
        //   hasValidCoordinates = true;
        // }
        if (
          !isNaN(lat) &&
          !isNaN(lng) &&
          isFinite(lat) &&
          !(lat === 0 && lng === 0) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          bounds.extend({ lat, lng });
          hasValidCoordinates = true;
        }
      });

      if (hasValidCoordinates) {
        mapRef.current.fitBounds(bounds);
        hasCentered.current = true;
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [allProfessionalsData]);

  const icons = useMemo(() => {
    return {
      PROFESSIONAL_TOW_TRUCK: iconToDataUrl(
        <GiTowTruck size={32} color="#ff6600" />
      ),
      PROFESSIONAL_FIRST_RESPONDDER: iconToDataUrl(
        <MdDeliveryDining size={32} color="#0066cc" />
      ),
    };
  }, []);

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
    ],
    disableDefaultUI: false,
  };

  // const defaultCenter = {
  //   lat: 6.5244,
  //   lng: 3.3792,
  // };

  // const defaultZoom = 10;

  // Handle loading states and errors
  if (loadError || mapError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Failed to load map</p>
          <p className="text-gray-600">{loadError?.message || mapError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading professionals on map...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">
            Error loading professionals
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Please log in to view professionals
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        // center={defaultCenter}
        zoom={500}
        onLoad={handleMapLoad}
        options={mapOptions}
        onClick={() => setSelectedPro(null)}
      >
        {allProfessionalsData
          .filter((pro) => {
            const lat = Number(pro.latitude);
            const lng = Number(pro.longitude);
            return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
          })
          .map((pro) => (
            <Marker
              key={`${pro.id}-${pro.latitude}-${pro.longitude}`}
              position={{
                lat: Number(pro.latitude),
                lng: Number(pro.longitude),
              }}
              icon={{
                url: icons[pro.professionalType] || "",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => setSelectedPro(pro)}
            />
          ))}

        {selectedPro &&
          !isNaN(Number(selectedPro.latitude)) &&
          !isNaN(Number(selectedPro.longitude)) && (
            <InfoWindow
              position={{
                lat: Number(selectedPro.latitude),
                lng: Number(selectedPro.longitude),
              }}
              onCloseClick={() => setSelectedPro(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -35),
                disableAutoPan: true,
              }}
            >
              <div
                className="max-w-xs cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() =>
                  router.push(`/dashboard/tracking/${selectedPro.id}`)
                }
              >
                <h2 className="text-md font-semibold text-gray-800 mb-1">
                  Name: {selectedPro.name}
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  {selectedPro.service && (
                    <p>
                      <span className="font-medium">Service:</span>{" "}
                      {selectedPro.service}
                    </p>
                  )}
                  {selectedPro.status && (
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          selectedPro.is_online ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {selectedPro.status}
                    </p>
                  )}
                  {selectedPro.location && (
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {selectedPro.location}
                    </p>
                  )}

                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedPro.is_online == true ? (
                      <span className="text-green-500">{""} (Online)</span>
                    ) : (
                      <span className="text-red-500"> (Offline)</span>
                    )}
                    {selectedPro.is_online == true
                      ? "Available"
                      : "Unavailable"}
                  </p>

                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedPro.professionalType}
                    {/* {selectedPro.professionalType === "PROFESSIONAL_TOW_TRUCK"
                      ? "Tow Truck"
                      : "First Responder"} */}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </div>
  );
}

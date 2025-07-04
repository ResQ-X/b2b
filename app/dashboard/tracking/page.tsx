"use client";
import React, { JSX, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { FaTruck, FaUserShield } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

const professionals = [
  {
    id: "1",
    name: "John Doe",
    service: "Tow Truck",
    status: "Available",
    location: "123 Main St, Lagos",
    latitude: 6.5244,
    longitude: 3.3792,
    professionalType: "Tow Truck Driver",
  },
  {
    id: "2",
    name: "Jane Smith",
    service: "Fuel Delivery",
    status: "Busy",
    location: "456 Elm St, Lagos",
    latitude: 6.4654,
    longitude: 3.4064,
    professionalType: "First Responder",
  },
  {
    id: "3",
    name: "Ahmed Bello",
    service: "Tire Change",
    status: "On Duty",
    location: "22 Broad St, Lagos Island",
    latitude: 6.451,
    longitude: 3.3905,
    professionalType: "Tow Truck Driver",
  },
  {
    id: "4",
    name: "Chioma Okeke",
    service: "Battery Boost",
    status: "Available",
    location: "Ikeja, Lagos",
    latitude: 6.6018,
    longitude: 3.3515,
    professionalType: "First Responder",
  },
];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Convert React Icon to data URL (for use in Google Map marker)
const iconToDataUrl = (icon: JSX.Element) => {
  const svgString = encodeURIComponent(renderToStaticMarkup(icon));
  return `data:image/svg+xml,${svgString}`;
};

export default function Page() {
  const router = useRouter();
  const MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [selectedPro, setSelectedPro] = useState<any | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
  });

  const center = {
    lat: 6.5244,
    lng: 3.3792,
  };

  const icons = useMemo(() => {
    return {
      "Tow Truck Driver": iconToDataUrl(<FaTruck size={32} color="#ff6600" />),
      "First Responder": iconToDataUrl(
        <FaUserShield size={32} color="#0066cc" />
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

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="relative h-screen w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onClick={() => setSelectedPro(null)}
      >
        {professionals.map((pro) => (
          <Marker
            key={pro.id}
            position={{ lat: pro.latitude, lng: pro.longitude }}
            icon={{
              url: icons[pro.professionalType as keyof typeof icons] || "",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedPro(pro)}
          />
        ))}

        {selectedPro && (
          <InfoWindow
            position={{
              lat: selectedPro.latitude,
              lng: selectedPro.longitude,
            }}
            onCloseClick={() => setSelectedPro(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
          >
            <div
              className="max-w-xs cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/tracking/${selectedPro.id}`)
              }
            >
              <h2 className="text-md font-semibold text-gray-800 mb-1">
                {selectedPro.name}
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Service:</span>{" "}
                  {selectedPro.service}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {selectedPro.status}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {selectedPro.location}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedPro.professionalType}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

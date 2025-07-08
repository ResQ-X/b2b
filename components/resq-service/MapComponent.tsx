import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LocationMarker } from "@/components/resq-service/LocationMarker";
import "leaflet/dist/leaflet.css";

interface Position {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  position: Position | null;
  setPosition: (position: Position) => void;
  defaultCenter: [number, number];
}

const configureLeaflet = async () => {
  if (typeof window !== "undefined") {
    const L = (await import("leaflet")).default;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Configure default markers
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
};

export const MapComponent: React.FC<MapComponentProps> = ({
  position,
  setPosition,
  defaultCenter,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    configureLeaflet();
  }, []);

  if (!isMounted) {
    return (
      <div
        className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
        style={{ height: "300px" }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
        className="rounded-lg z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

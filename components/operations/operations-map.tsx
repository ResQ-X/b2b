"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { Incident } from "@/types/operations";

interface OperationsMapProps {
  incidents: Incident[];
  selectedIncidentId?: string;
}

export function OperationsMap({
  incidents,
  selectedIncidentId,
}: OperationsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 6.5244, lng: 3.3792 }, // Lagos
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        setMap(map);
      }
    });
  }, []);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      // Create new markers
      const newMarkers = incidents.map((incident) => {
        const marker = new google.maps.Marker({
          position: incident.coordinates,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor:
              incident.id === selectedIncidentId ? "#FF8500" : "#FF0000",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
        });

        marker.addListener("click", () => {
          // Handle marker click
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Center map on selected incident
      if (selectedIncidentId) {
        const selected = incidents.find((i) => i.id === selectedIncidentId);
        if (selected) {
          map.panTo(selected.coordinates);
          map.setZoom(15);
        }
      }
    }
  }, [map, incidents, selectedIncidentId]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
}

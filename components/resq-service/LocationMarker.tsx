/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import dynamic from "next/dynamic";

interface Position {
  lat: number;
  lng: number;
}

interface LocationMarkerProps {
  position: Position | null;
  setPosition: (position: Position) => void;
}

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  position,
  setPosition,
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  useMapEvents({
    click(e: any) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

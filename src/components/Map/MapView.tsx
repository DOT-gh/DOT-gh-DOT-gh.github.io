import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useSimStore } from "../../store/simStore";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { EntitiesLayer } from "./layers/EntitiesLayer";
import { PlacementOverlay } from "./PlacementOverlay";

export const MapView: React.FC = () => {
  const { config } = useSimStore();
  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-white/10">
      <MapContainer center={[config.mapBounds.center.lat, config.mapBounds.center.lng]} zoom={config.mapBounds.zoom} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EntitiesLayer />
        <PlacementOverlay />
      </MapContainer>
    </div>
  );
};

// For Next.js SSR safety
export default dynamic(() => Promise.resolve(MapView), { ssr: false });

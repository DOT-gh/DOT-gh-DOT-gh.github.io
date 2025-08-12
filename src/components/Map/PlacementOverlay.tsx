import { useMapEvents } from "react-leaflet";
import { useSimStore } from "../../store/simStore";
import React from "react";

export const PlacementOverlay: React.FC = () => {
  const placing = useSimStore(s => s.placing);
  const setPrev = useSimStore(s => s.setPlacementPreview);
  const place = useSimStore(s => s.placeSelectedDefense);

  useMapEvents({
    mousemove(e) { if (placing) setPrev(e.latlng.lat, e.latlng.lng); },
    click(e) { if (placing) place(e.latlng.lat, e.latlng.lng); }
  });

  return null;
};

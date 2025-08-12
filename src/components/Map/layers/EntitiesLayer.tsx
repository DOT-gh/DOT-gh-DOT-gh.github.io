import React from "react";
import { Circle, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useSimStore } from "../../../store/simStore";
import { CATALOG } from "../../../data/catalog";

const threatIcon = (char: string, color="#eee") => L.divIcon({
  className: "",
  html: `<div style="font-size:16px; transform: translate(-50%,-50%); color:${color};">✈️</div>`,
  iconSize: [16,16],
  iconAnchor: [8,8]
});
const defenseIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:14px; transform: translate(-50%,-50%);">🛡️</div>`,
  iconSize: [16,16],
  iconAnchor: [8,8]
});
const targetIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:16px; transform: translate(-50%,-50%);">🎯</div>`,
  iconSize: [16,16],
  iconAnchor: [8,8]
});

export const EntitiesLayer: React.FC = () => {
  const { targets, defenses, threats, catalog, placementPreview, selectedCard } = useSimStore();

  return (
    <>
      {targets.map(t => (
        <Marker key={t.id} position={[t.pos.lat, t.pos.lng]} icon={targetIcon}>
          <Tooltip direction="top" opacity={1}><div className="entity-label">{t.name} • HP {t.hp}</div></Tooltip>
        </Marker>
      ))}

      {defenses.map(d => {
        const spec = catalog.defenses.find(x => x.id === d.specId)!;
        return (
          <React.Fragment key={d.id}>
            <Circle center={[d.pos.lat, d.pos.lng]} radius={spec.range_km*1000} pathOptions={{ color: "#6366f1", fillOpacity: 0.06 }}/>
            <Marker position={[d.pos.lat, d.pos.lng]} icon={defenseIcon}>
              <Tooltip direction="top" opacity={1}><div className="entity-label">{spec.name} • L{d.level}</div></Tooltip>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{spec.name}</div>
                  <div>Range: {spec.range_km} km</div>
                  <div>Level: {d.level}</div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}

      {threats.map(t => {
        const spec = catalog.threats.find(x => x.id === t.specId)!;
        return (
          <Marker key={t.id} position={[t.pos.lat, t.pos.lng]} icon={threatIcon("✈")}>
            <Tooltip direction="top" opacity={1}>
              <div className="entity-label">{spec.name} • SPD {spec.speed_kmh} • HP {t.hp.toFixed(0)}</div>
            </Tooltip>
          </Marker>
        );
      })}

      {selectedCard && placementPreview && (
        <>
          {(() => {
            const spec = catalog.defenses.find(x => x.id === selectedCard.specId)!;
            return <Circle center={[placementPreview.lat, placementPreview.lng]} radius={spec.range_km*1000} pathOptions={{ color: "#6366f1", dashArray: "4 6", opacity: 0.8, weight: 2, fillOpacity: 0.05 }}/>;
          })()}
        </>
      )}
    </>
  );
};

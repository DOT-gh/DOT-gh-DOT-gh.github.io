import React from "react";
import { useGameStore } from "../store/gameStore";
import { THREATS } from "../data/weapons";

export const ThreatWaveView: React.FC = () => {
  const { threats, wave } = useGameStore();
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Wave {wave} Threats</h3>
      <div className="flex flex-col gap-2">
        {threats.map(t => {
          const spec = THREATS.find(s => s.id === t.specId)!;
          const color =
            spec.tier === "low"
              ? "bg-threat-low/30 border-threat-low/50"
              : spec.tier === "mid"
              ? "bg-threat-mid/30 border-threat-mid/50"
              : "bg-threat-high/30 border-threat-high/50";
          return (
            <div
              key={t.id}
              className={`rounded border px-3 py-2 flex items-center justify-between ${color}`}
            >
              <div>
                <div className="font-medium">{spec.name}</div>
                <div className="text-xs text-gray-300">
                  Tier {spec.tier} • Damage {spec.damage}
                </div>
              </div>
              <div className="text-sm">Count: {t.remaining}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

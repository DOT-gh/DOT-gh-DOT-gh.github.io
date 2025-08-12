import React from "react";
import { useSimStore } from "../../store/simStore";
import { star } from "../../engine/utils";

export const BottomToolbar: React.FC = () => {
  const { catalog, selectDefenseCard, hud, selectedCard } = useSimStore();

  return (
    <div className="toolbar">
      {catalog.defenses.map(d => {
        const affordable = hud.money >= d.cost;
        const selected = selectedCard?.type==="defense" && selectedCard.specId===d.id;
        return (
          <div key={d.id} className={`card p-2 w-40 ${selected ? "ring-2 ring-indigo-500": ""}`}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">{d.name}</div>
              <button title="Подробнее" className="text-xs opacity-70">i</button>
            </div>
            <div className="text-xs text-gray-400">Range: {d.range_km} км</div>
            <div className="text-xs text-gray-400">Cost: {d.cost}</div>
            <div className="text-[10px] mt-1 text-amber-400">{star(d.rating.range)}</div>
            <button
              disabled={!affordable}
              onClick={() => selectDefenseCard(d.id)}
              className={`btn w-full mt-2 ${affordable ? "btn-primary" : ""}`}
            >
              {affordable ? "Выбрать и поставить" : "Недостаточно средств"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

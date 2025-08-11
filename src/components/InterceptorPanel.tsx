import React from "react";
import { INTERCEPTORS } from "../data/weapons";
import { useGameStore } from "../store/gameStore";
import { allocationsCost } from "../store/gameStore";

export const InterceptorPanel: React.FC = () => {
  const { allocations, addAllocation, removeAllocation, budget, phase } = useGameStore();
  const spent = allocationsCost(allocations);
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Interceptors</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {INTERCEPTORS.map(i => {
          const alloc = allocations.find(a => a.interceptorId === i.id);
            return (
              <div key={i.id} className="rounded border border-gray-700 p-3 flex flex-col bg-gray-900/60">
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-gray-400">
                  Eff: {(i.efficiency * 100).toFixed(0)}% • Cost: {i.cost}
                </div>
                <div className="mt-2 text-xs text-gray-300">
                  Bonus vs: {Object.entries(i.vsBonus).map(([k,v]) => `${k}+${(v*100).toFixed(0)}%`).join(", ") || "—"}
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="text-sm">Qty: {alloc?.quantity ?? 0}</div>
                  <div className="flex gap-2">
                    <button
                      disabled={phase!=="planning"}
                      onClick={() => removeAllocation(i.id)}
                      className="px-2 py-1 rounded bg-gray-800 disabled:opacity-40 hover:bg-gray-700 text-xs"
                    >-</button>
                    <button
                      disabled={phase!=="planning"}
                      onClick={() => addAllocation(i.id)}
                      className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs"
                    >+</button>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
      <div className="text-sm">
        Spent: {spent} / Budget: {budget} (Remaining: {budget - spent})
      </div>
    </div>
  );
};

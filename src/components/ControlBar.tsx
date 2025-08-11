import React from "react";
import { useGameStore } from "../store/gameStore";
import { allocationsCost } from "../store/gameStore";

export const ControlBar: React.FC = () => {
  const { allocations, resolve, reset, phase, budget } = useGameStore();
  const spent = allocationsCost(allocations);
  const canResolve = phase === "planning" && spent <= budget;
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={resolve}
        disabled={!canResolve}
        className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 disabled:opacity-40"
      >
        Launch Defense
      </button>
      <button
        onClick={reset}
        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
      >
        Reset
      </button>
      <div className="text-xs text-gray-400">
        Phase: {phase}
      </div>
    </div>
  );
};

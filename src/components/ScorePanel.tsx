import React from "react";
import { useGameStore } from "../store/gameStore";

export const ScorePanel: React.FC = () => {
  const { cumulative, wave, maxWaves, history, phase } = useGameStore();
  const last = history[history.length - 1];
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Status</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Stat label="Wave" value={`${wave}/${maxWaves}`} />
        <Stat label="Score" value={cumulative.score} />
        <Stat label="Prevented" value={cumulative.preventedDamage} />
        <Stat label="Incurred" value={cumulative.incurredDamage} />
      </div>
      {phase !== "planning" && last && (
        <div className="mt-3 text-xs rounded border border-gray-700 p-2 bg-gray-900/60">
          <div className="font-semibold mb-1">Last Wave Outcome</div>
          <div>Intercepted: {last.intercepted}</div>
          <div>Leaked: {last.leaked}</div>
          <div>Damage Prevented: {last.preventedDamage}</div>
          <div>Damage Incurred: {last.incurredDamage}</div>
        </div>
      )}
      {phase === "gameover" && (
        <div className="mt-4 p-3 rounded bg-indigo-700/30 border border-indigo-500 text-sm">
          Game Over — Final Score: {cumulative.score}
        </div>
      )}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="rounded bg-gray-800/60 p-2">
    <div className="text-gray-400 text-[10px] uppercase tracking-wide">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

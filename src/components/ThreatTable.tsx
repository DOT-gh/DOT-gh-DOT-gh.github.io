import React from "react";
import { THREATS } from "../data/weapons";

export const ThreatTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded border border-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800/60 text-gray-300">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Threat</th>
            <th className="px-3 py-2 text-left font-medium">Tier</th>
            <th className="px-3 py-2 text-left font-medium">Speed</th>
            <th className="px-3 py-2 text-left font-medium">Durability</th>
            <th className="px-3 py-2 text-left font-medium">Damage</th>
          </tr>
        </thead>
        <tbody>
          {THREATS.map(t => (
            <tr key={t.id} className="odd:bg-gray-900 even:bg-gray-800/30">
              <td className="px-3 py-2">{t.name}</td>
              <td className="px-3 py-2 capitalize">{t.tier}</td>
              <td className="px-3 py-2">{t.speed}</td>
              <td className="px-3 py-2">{t.durability}</td>
              <td className="px-3 py-2">{t.damage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

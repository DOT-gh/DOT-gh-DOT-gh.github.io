import { ThreatSpec, InterceptorSpec } from "../types/game";

export const THREATS: ThreatSpec[] = [
  {
    id: "swarm-low",
    name: "Swarm (Light)",
    tier: "low",
    speed: 2,
    durability: 1,
    damage: 3,
    value: 2,
    waveScaling: 1.25
  },
  {
    id: "cruise-mid",
    name: "Cruiser (Medium)",
    tier: "mid",
    speed: 4,
    durability: 3,
    damage: 8,
    value: 6,
    waveScaling: 1.18
  },
  {
    id: "ballistic-high",
    name: "Ballistic (Heavy)",
    tier: "high",
    speed: 6,
    durability: 6,
    damage: 18,
    value: 14,
    waveScaling: 1.12
  }
];

export const INTERCEPTORS: InterceptorSpec[] = [
  {
    id: "cheap-net",
    name: "Layer A",
    cost: 4,
    efficiency: 0.35,
    shotsPerWave: 1,
    vsBonus: { low: 0.15 }
  },
  {
    id: "mid-missile",
    name: "Layer B",
    cost: 9,
    efficiency: 0.55,
    shotsPerWave: 1,
    vsBonus: { mid: 0.1, low: 0.05 }
  },
  {
    id: "high-exo",
    name: "Layer C",
    cost: 16,
    efficiency: 0.7,
    shotsPerWave: 1,
    vsBonus: { high: 0.15, mid: 0.05 }
  }
];

export const INITIAL_BUDGET = 60;
export const BASE_BUDGET_PER_WAVE = 25;
export const MAX_WAVES = 10;

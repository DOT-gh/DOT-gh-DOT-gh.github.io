import { LatLng } from "./geo";

export type ThreatKind = "drone_slow" | "drone_fast" | "rocket_assisted_drone" | "cruise" | "ballistic" | "sea_skimmer" | "air_launched";

export type DefenseKind = "aaa" | "sam_short" | "sam_medium" | "sam_long" | "ew" | "fighter_patrol";

export interface Rating { // 0..5 star-style rating for UI
  range: number;
  power: number;
  agility: number;
  survivability: number;
}

export interface ThreatSpec {
  id: string;
  kind: ThreatKind;
  name: string;
  speed_kmh: number;        // abstracted, safe ranges
  altitude_m: number;       // relative
  signature: number;        // detectability 0..1
  durability: number;       // hit points
  damage: number;           // damage on hit
  price?: number;           // score weight
  info: string;             // description (non-sensitive)
  rating: Rating;
}

export interface DefenseSpec {
  id: string;
  kind: DefenseKind;
  name: string;
  range_km: number;
  dps: number;              // damage per second inside bubble
  pk_base: number;          // base per-second kill chance factor
  vsBonus: Partial<Record<ThreatKind, number>>; // multipliers (e.g. +0.15 vs drones)
  cost: number;
  info: string;
  rating: Rating;
  maxLevel: number;
  upgradeCurve: "linear" | "ease" | "step";
}

export interface Target {
  id: string;
  name: string;
  pos: LatLng;
  hp: number;
  value: number;
}

export interface ThreatInstance {
  id: string;
  specId: string;
  pos: LatLng;
  heading: number;       // radians
  speed_kmh: number;
  hp: number;
  targetId: string;
  eta_s: number;
  alive: boolean;
}

export interface DefenseInstance {
  id: string;
  specId: string;
  pos: LatLng;
  level: number;
  active: boolean;
}

export interface GameConfig {
  mapBounds: { center: LatLng; zoom: number; };
  spawnCorridors: Array<{ id: string; name: string; pos: LatLng; spread_km: number; kinds: ThreatKind[] }>;
}

export interface HUD {
  money: number;
  score: number;
  lives: number;
  kills: number;
  speed: 1 | 2 | 3;
  paused: boolean;
}

export interface Catalog {
  threats: ThreatSpec[];
  defenses: DefenseSpec[];
}

export interface SimState {
  tick: number;
  time_s: number;
  hud: HUD;
  targets: Target[];
  threats: ThreatInstance[];
  defenses: DefenseInstance[];
  selectedCard?: { type: "defense"; specId: string } | null;
  placing?: { specId: string } | null;
  placementPreview?: LatLng | null;
  catalog: Catalog;
  config: GameConfig;
}

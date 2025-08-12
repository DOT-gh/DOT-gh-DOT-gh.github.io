import { Target } from "../types/sim";

// Базовые учебные цели (города/объекты — абстракция)
export const TARGETS: Target[] = [
  { id: "kyiv", name: "Kyiv", pos: { lat: 50.45, lng: 30.523 }, hp: 200, value: 200 },
  { id: "lviv", name: "Lviv", pos: { lat: 49.84, lng: 24.03 }, hp: 140, value: 160 },
  { id: "dnipro", name: "Dnipro", pos: { lat: 48.45, lng: 34.98 }, hp: 160, value: 180 },
  { id: "odesa", name: "Odesa", pos: { lat: 46.48, lng: 30.72 }, hp: 140, value: 150 },
  { id: "kharkiv", name: "Kharkiv", pos: { lat: 49.99, lng: 36.23 }, hp: 160, value: 180 }
];

// Центр/зум карты
export const UA_MAP = {
  center: { lat: 49.0, lng: 31.3 },
  zoom: 6
};

// Условные “коридоры” входа угроз (без привязки к конкретным объектам)
export const SPAWNS = [
  { id: "east", name: "East Corridor", pos: { lat: 49.0, lng: 39.5 }, spread_km: 120, kinds: ["drone_slow","drone_fast","cruise","ballistic"] },
  { id: "south", name: "South Corridor", pos: { lat: 46.2, lng: 36.5 }, spread_km: 150, kinds: ["sea_skimmer","cruise","drone_slow"] },
  { id: "air", name: "High Alt Air", pos: { lat: 52.0, lng: 36.5 }, spread_km: 160, kinds: ["air_launched","cruise"] }
] as const;

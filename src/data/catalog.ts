import { Catalog, DefenseSpec, ThreatSpec } from "../types/sim";

// Набор учебных спецификаций (нормализованные, не-реалистичные).
export const THREATS: ThreatSpec[] = [
  {
    id: "drone_slow",
    kind: "drone_slow",
    name: "Slow Drone",
    speed_kmh: 160,
    altitude_m: 300,
    signature: 0.6,
    durability: 20,
    damage: 20,
    price: 8,
    info: "Медленный барражирующий аппарат. Низкая стоимость, массовое применение.",
    rating: { range: 2, power: 2, agility: 1, survivability: 1 }
  },
  {
    id: "drone_fast",
    kind: "drone_fast",
    name: "Fast Drone",
    speed_kmh: 250,
    altitude_m: 400,
    signature: 0.55,
    durability: 25,
    damage: 25,
    price: 10,
    info: "Быстрый тактический БПЛА. Чуть выше скорость, немного устойчивее.",
    rating: { range: 3, power: 2, agility: 2, survivability: 2 }
  },
  {
    id: "rocket_assisted_drone",
    kind: "rocket_assisted_drone",
    name: "Rocket-Assisted Drone",
    speed_kmh: 320,
    altitude_m: 500,
    signature: 0.65,
    durability: 28,
    damage: 28,
    price: 12,
    info: "Дрон с ускоренным стартом. Выше скорость на отрезке входа.",
    rating: { range: 3, power: 3, agility: 2, survivability: 2 }
  },
  {
    id: "cruise",
    kind: "cruise",
    name: "Cruise Missile",
    speed_kmh: 750,
    altitude_m: 1000,
    signature: 0.75,
    durability: 60,
    damage: 80,
    price: 30,
    info: "Высокоточный с дозвуковой скоростью, полёт на малой высоте.",
    rating: { range: 5, power: 4, agility: 3, survivability: 3 }
  },
  {
    id: "ballistic",
    kind: "ballistic",
    name: "Ballistic Missile",
    speed_kmh: 2500,
    altitude_m: 20000,
    signature: 0.9,
    durability: 120,
    damage: 150,
    price: 60,
    info: "Высокая скорость захода, короткое окно перехвата.",
    rating: { range: 5, power: 5, agility: 1, survivability: 4 }
  },
  {
    id: "sea_skimmer",
    kind: "sea_skimmer",
    name: "Sea-Skimming Missile",
    speed_kmh: 850,
    altitude_m: 50,
    signature: 0.7,
    durability: 55,
    damage: 70,
    price: 28,
    info: "Низковысотный заход с моря по огибанию рельефа.",
    rating: { range: 4, power: 4, agility: 3, survivability: 3 }
  },
  {
    id: "air_launched",
    kind: "air_launched",
    name: "Air-Launched Missile",
    speed_kmh: 1200,
    altitude_m: 12000,
    signature: 0.8,
    durability: 80,
    damage: 110,
    price: 45,
    info: "Пуск с носителя в воздухе, гибкость маршрута.",
    rating: { range: 5, power: 5, agility: 3, survivability: 3 }
  }
];

export const DEFENSES: DefenseSpec[] = [
  {
    id: "aaa",
    kind: "aaa",
    name: "AAA (Gun)",
    range_km: 6,
    dps: 10,
    pk_base: 0.15,
    vsBonus: { drone_slow: 0.2, drone_fast: 0.1 },
    cost: 500,
    info: "Зенитная артиллерия ближнего действия. Дешёвая зона покрытия.",
    rating: { range: 2, power: 2, agility: 3, survivability: 2 },
    maxLevel: 5,
    upgradeCurve: "linear"
  },
  {
    id: "sam_short",
    kind: "sam_short",
    name: "SAM Short-Range",
    range_km: 20,
    dps: 18,
    pk_base: 0.28,
    vsBonus: { drone_slow: 0.15, rocket_assisted_drone: 0.1, cruise: 0.05 },
    cost: 1000,
    info: "ЗРК малой дальности. Баланс стоимости и эффективности.",
    rating: { range: 3, power: 3, agility: 3, survivability: 3 },
    maxLevel: 5,
    upgradeCurve: "ease"
  },
  {
    id: "sam_medium",
    kind: "sam_medium",
    name: "SAM Medium-Range",
    range_km: 45,
    dps: 25,
    pk_base: 0.35,
    vsBonus: { cruise: 0.1, sea_skimmer: 0.15, air_launched: 0.05 },
    cost: 1800,
    info: "Средняя дальность. Хороша против КР и низколетящих целей.",
    rating: { range: 4, power: 4, agility: 3, survivability: 3 },
    maxLevel: 5,
    upgradeCurve: "ease"
  },
  {
    id: "sam_long",
    kind: "sam_long",
    name: "SAM Long-Range",
    range_km: 90,
    dps: 35,
    pk_base: 0.42,
    vsBonus: { ballistic: 0.12, air_launched: 0.12, cruise: 0.08 },
    cost: 2600,
    info: "Большой купол. Может перехватывать высокоскоростные цели.",
    rating: { range: 5, power: 5, agility: 3, survivability: 4 },
    maxLevel: 5,
    upgradeCurve: "step"
  },
  {
    id: "ew",
    kind: "ew",
    name: "EW Jammer",
    range_km: 18,
    dps: 0,
    pk_base: 0.18,
    vsBonus: { drone_slow: 0.25, drone_fast: 0.2, rocket_assisted_drone: 0.15 },
    cost: 700,
    info: "РЭБ: снижает эффективность дронов, повышает шанс отказа.",
    rating: { range: 3, power: 2, agility: 4, survivability: 2 },
    maxLevel: 5,
    upgradeCurve: "linear"
  },
  {
    id: "fighter_patrol",
    kind: "fighter_patrol",
    name: "Fighter Patrol",
    range_km: 120,
    dps: 20,
    pk_base: 0.25,
    vsBonus: { cruise: 0.12, sea_skimmer: 0.1, air_launched: 0.15 },
    cost: 3000,
    info: "Дежурство истребителей — гибкая зона перехватов.",
    rating: { range: 5, power: 4, agility: 5, survivability: 3 },
    maxLevel: 3,
    upgradeCurve: "step"
  }
];

export const CATALOG: Catalog = { threats: THREATS, defenses: DEFENSES };

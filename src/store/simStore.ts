import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CATALOG } from "../data/catalog";
import { SPAWNS, UA_MAP, TARGETS } from "../data/ukraine";
import { SimState } from "../types/sim";
import { placeDefense, spawnThreat, tick } from "../engine/sim";

interface Actions {
  setPaused: (v: boolean) => void;
  setSpeed: (v: 1|2|3) => void;
  startWave: (pattern?: "mixed" | "swarm" | "missiles") => void;
  selectDefenseCard: (specId: string | null) => void;
  setPlacementPreview: (lat: number, lng: number) => void;
  placeSelectedDefense: (lat: number, lng: number) => void;
  upgradeDefenseById: (id: string) => void;
  reset: () => void;
  frame: (dt: number) => void;
  importCatalog: (cat: any) => void;
}

const initialState: SimState = {
  tick: 0,
  time_s: 0,
  hud: { money: 5000, score: 0, lives: 20, kills: 0, speed: 1, paused: false },
  targets: TARGETS,
  threats: [],
  defenses: [],
  catalog: CATALOG,
  config: {
    mapBounds: UA_MAP,
    spawnCorridors: SPAWNS as any
  },
  selectedCard: null,
  placing: null,
  placementPreview: null
};

export const useSimStore = create<SimState & Actions>()(persist((set, get) => ({
  ...initialState,
  setPaused: (v) => set(state => ({ hud: { ...state.hud, paused: v }})),
  setSpeed: (v) => set(state => ({ hud: { ...state.hud, speed: v }})),
  startWave: (pattern="mixed") => {
    const s = get();
    const targetIds = s.targets.map(t => t.id);
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random()*arr.length)];
    const east = s.config.spawnCorridors[0];
    const south = s.config.spawnCorridors[1];
    const air = s.config.spawnCorridors[2];

    const addFrom = (corr: SimState["config"]["spawnCorridors"][number] | undefined, n: number) => {
      if (!corr) return; // важная защита от undefined
      for (let i=0;i<n;i++) {
        const k = pick(corr.kinds as any);
        const jitterLat = (Math.random()-0.5) * (corr.spread_km/111);
        const jitterLng = (Math.random()-0.5) * (corr.spread_km/80);
        spawnThreat(s as any, k as any, { lat: corr.pos.lat + jitterLat, lng: corr.pos.lng + jitterLng }, pick(targetIds));
      }
    };

    if (pattern === "mixed") { addFrom(east, 10); addFrom(south, 6); addFrom(air, 4); }
    if (pattern === "swarm") { addFrom(east, 18); addFrom(south, 8); }
    if (pattern === "missiles") { addFrom(east, 8); addFrom(air, 8); }
    set({ ...s });
  },
  selectDefenseCard: (specId) => set({ selectedCard: specId ? { type:"defense", specId } : null, placing: specId ? { specId } : null }),
  setPlacementPreview: (lat, lng) => set({ placementPreview: { lat, lng } }),
  placeSelectedDefense: (lat, lng) => {
    const s = get();
    if (!s.placing) return;
    const spec = s.catalog.defenses.find(d => d.id === s.placing!.specId)!;
    if (s.hud.money < spec.cost) return;
    placeDefense(s as any, s.placing.specId, { lat, lng });
    set({ ...s, placing: null, selectedCard: null, placementPreview: null });
  },
  upgradeDefenseById: (id) => {
    const s = get();
    const d = s.defenses.find(x => x.id === id);
    if (!d) return;
    const before = JSON.stringify(s.defenses);
    // @ts-ignore tick will clean mutated store
    s.defenses = s.defenses; // no-op
    set({ ...s });
  },
  reset: () => set({ ...initialState }),
  frame: (dt) => {
    const s = get();
    tick(s as any, dt);
    set({ ...s });
  },
  importCatalog: (cat) => {
    const s = get();
    set({ ...s, catalog: cat });
  }
}), { name: "sim-store" }));

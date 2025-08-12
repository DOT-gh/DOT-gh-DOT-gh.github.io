import { create } from "zustand";
import { persist } from "zustand/middleware";

// NOTE: Пути и имена ниже соответствуют текущему проекту.
// Если у вас другие пути — скорректируйте только импорты, остальной код оставьте как есть.
import { CATALOG } from "../data/catalog";
import { SPAWNS, UA_MAP, TARGETS } from "../data/ukraine";
import { SimState } from "../types/sim";
import { placeDefense, spawnThreat, tick } from "../engine/sim";

interface Actions {
  setPaused: (v: boolean) => void;
  setSpeed: (v: 1 | 2 | 3) => void;
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

// ВАЖНО: строгий pick — возвращает всегда T, а не T | undefined.
// Бросает внятную ошибку, если его вызвать с пустым массивом.
function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) {
    throw new Error("pick() was called with an empty array");
  }
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const useSimStore = create<SimState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPaused: (v) =>
        set((state) => ({ hud: { ...state.hud, paused: v } })),

      setSpeed: (v) =>
        set((state) => ({ hud: { ...state.hud, speed: v } })),

      startWave: (pattern = "mixed") => {
        const s = get();

        // Собираем список целей и проверяем, что он не пуст
        const targetIds = s.targets.map((t) => t.id);
        if (targetIds.length === 0) {
          console.warn("No targets configured — wave start aborted");
          return;
        }

        // Доступ по индексу может дать undefined при строгих настройках TS,
        // поэтому допускаем undefined и фильтруем внутри addFrom.
        const east = s.config.spawnCorridors[0];
        const south = s.config.spawnCorridors[1];
        const air = s.config.spawnCorridors[2];

        type Corridor = SimState["config"]["spawnCorridors"][number];

        const addFrom = (corr: Corridor | undefined, n: number) => {
          if (!corr) return;
          for (let i = 0; i < n; i++) {
            const k = pick(corr.kinds as any);
            const jitterLat = (Math.random() - 0.5) * (corr.spread_km / 111);
            const jitterLng = (Math.random() - 0.5) * (corr.spread_km / 80);
            spawnThreat(
              s as any,
              k as any,
              {
                lat: corr.pos.lat + jitterLat,
                lng: corr.pos.lng + jitterLng
              },
              pick(targetIds) // теперь строго string
            );
          }
        };

        if (pattern === "mixed") {
          addFrom(east, 10);
          addFrom(south, 6);
          addFrom(air, 4);
        } else if (pattern === "swarm") {
          addFrom(east, 18);
          addFrom(south, 8);
        } else if (pattern === "missiles") {
          addFrom(east, 8);
          addFrom(air, 8);
        }

        // Обновляем состояние (на случай мутаций внутри движка)
        set({ ...s });
      },

      selectDefenseCard: (specId) =>
        set({
          selectedCard: specId ? { type: "defense", specId } : null,
          placing: specId ? { specId } : null
        }),

      setPlacementPreview: (lat, lng) => set({ placementPreview: { lat, lng } }),

      placeSelectedDefense: (lat, lng) => {
        const s = get();
        if (!s.placing) return;

        const spec = s.catalog.defenses.find(
          (d: any) => d.id === s.placing!.specId
        );
        if (!spec) return;
        if (s.hud.money < spec.cost) return;

        placeDefense(s as any, s.placing.specId, { lat, lng });

        set({
          ...s,
          placing: null,
          selectedCard: null,
          placementPreview: null
        });
      },

      upgradeDefenseById: (id) => {
        const s = get();
        const d = s.defenses.find((x: any) => x.id === id);
        if (!d) return;
        // Реализация апгрейда зависит от движка; оставляем заглушку.
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
    }),
    { name: "sim-store" }
  )
);

import { create } from "zustand";
import { GameState, Allocation } from "../types/game";
import { createInitialState, calculateAllocationCost, resolveWave, advanceGame } from "../engine/gameLogic";
import { INTERCEPTORS, INITIAL_BUDGET, BASE_BUDGET_PER_WAVE, MAX_WAVES } from "../data/weapons";

interface Actions {
  addAllocation: (id: string) => void;
  removeAllocation: (id: string) => void;
  reset: () => void;
  resolve: () => void;
}

export const useGameStore = create<GameState & Actions>((set, get) => ({
  ...createInitialState(),
  budget: INITIAL_BUDGET,
  baseBudgetPerWave: BASE_BUDGET_PER_WAVE,
  maxWaves: MAX_WAVES,
  addAllocation: (id: string) => {
    const state = get();
    if (state.phase !== "planning") return;
    const allocations = [...state.allocations];
    const existing = allocations.find(a => a.interceptorId === id);
    if (existing) existing.quantity += 1;
    else allocations.push({ interceptorId: id, quantity: 1 });
    const cost = calculateAllocationCost(allocations);
    if (cost > state.budget) return; // exceed budget -> ignore
    set({ allocations });
  },
  removeAllocation: (id: string) => {
    const state = get();
    if (state.phase !== "planning") return;
    const allocations = state.allocations
      .map(a => (a.interceptorId === id ? { ...a, quantity: a.quantity - 1 } : a))
      .filter(a => a.quantity > 0);
    set({ allocations });
  },
  reset: () => set({ ...createInitialState(), budget: INITIAL_BUDGET }),
  resolve: () => {
    const state = get();
    if (state.phase !== "planning") return;
    const outcome = resolveWave({ state });
    set({
      phase: "resolved"
    });
    advanceGame(state, outcome);
    // apply updated fields from mutated state
    set({ ...state });
  }
}));

export function allocationsCost(allocations: Allocation[]) {
  return allocations.reduce((acc, a) => {
    const spec = INTERCEPTORS.find(i => i.id === a.interceptorId);
    if (!spec) return acc;
    return acc + spec.cost * a.quantity;
  }, 0);
}

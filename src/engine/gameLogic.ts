import { THREATS, INTERCEPTORS } from "../data/weapons";
import {
  Allocation,
  GameState,
  WaveOutcome,
  WaveThreatInstance
} from "../types/game";
import { prng } from "./random";

export function createInitialState(): GameState {
  return {
    wave: 1,
    budget: 60,
    baseBudgetPerWave: 25,
    threats: generateWaveThreats(1),
    cumulative: {
      preventedDamage: 0,
      incurredDamage: 0,
      score: 0
    },
    allocations: [],
    phase: "planning",
    history: [],
    maxWaves: 10
  };
}

export function generateWaveThreats(wave: number): WaveThreatInstance[] {
  // Simple scaling logic
  return THREATS.map(t => {
    const countBase = wave * t.waveScaling;
    const noise = 0.5 + Math.random();
    const qty = Math.max(1, Math.round(countBase * noise));
    return {
      specId: t.id,
      id: `${t.id}-w${wave}`,
      remaining: qty
    };
  });
}

export function calculateAllocationCost(allocs: Allocation[]) {
  return allocs.reduce((sum, a) => {
    const spec = INTERCEPTORS.find(i => i.id === a.interceptorId);
    if (!spec) return sum;
    return sum + spec.cost * a.quantity;
  }, 0);
}

interface ResolveParams {
  state: GameState;
  seed?: number;
}

export function resolveWave({ state, seed }: ResolveParams): WaveOutcome {
  const rng = prng(seed ?? Date.now());
  let intercepted = 0;
  let leaked = 0;
  let preventedDamage = 0;
  let incurredDamage = 0;
  const logs: string[] = [];

  const interceptorsDeployed = state.allocations.flatMap(a => {
    const spec = INTERCEPTORS.find(i => i.id === a.interceptorId)!;
    return Array.from({ length: a.quantity }, () => spec);
  });

  // For each threat unit simulate
  state.threats.forEach(wi => {
    const threatSpec = THREATS.find(t => t.id === wi.specId)!;
    for (let n = 0; n < wi.remaining; n++) {
      // Combine chance across interceptors (independent attempts per layer shot)
      const chance = combinedInterceptChance(threatSpec, interceptorsDeployed, rng);
      const r = rng();
      const success = r < chance;
      if (success) {
        intercepted++;
        preventedDamage += threatSpec.damage;
        state.cumulative.score += threatSpec.value;
      } else {
        leaked++;
        incurredDamage += threatSpec.damage;
      }
    }
  });

  const outcome: WaveOutcome = {
    intercepted,
    leaked,
    preventedDamage,
    incurredDamage,
    scoreGain: preventedDamage - incurredDamage * 0.5 + intercepted,
    logs
  };
  state.cumulative.preventedDamage += preventedDamage;
  state.cumulative.incurredDamage += incurredDamage;
  return outcome;
}

function combinedInterceptChance(threat: any, interceptors: any[], rng: () => number) {
  // Each interceptor has shotsPerWave attempts; treat aggregated probability:
  let probNot = 1;
  interceptors.forEach(intc => {
    for (let s = 0; s < intc.shotsPerWave; s++) {
      const base = intc.efficiency + (intc.vsBonus[threat.tier] || 0);
      const p = Math.min(0.95, base);
      probNot *= 1 - p;
    }
  });
  return 1 - probNot;
}

export function advanceGame(state: GameState, outcome: WaveOutcome) {
  state.history.push(outcome);
  if (state.wave >= state.maxWaves) {
    state.phase = "gameover";
    return;
  }
  state.wave += 1;
  state.budget += state.baseBudgetPerWave;
  state.allocations = [];
  state.threats = generateWaveThreats(state.wave);
  state.phase = "planning";
}

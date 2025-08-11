export interface ThreatSpec {
  id: string;
  name: string;
  tier: "low" | "mid" | "high";
  speed: number;          // abstract units
  durability: number;     // hit points
  damage: number;         // damage if passes
  value: number;          // score weight if intercepted
  waveScaling: number;    // multiplier per wave
}

export interface InterceptorSpec {
  id: string;
  name: string;
  cost: number;           // budget cost per unit
  efficiency: number;     // base chance per "shot"
  shotsPerWave: number;   // autonomous salvos per wave
  vsBonus: Partial<Record<ThreatSpec["tier"], number>>; // additive probability bonus
}

export interface WaveThreatInstance {
  specId: string;
  id: string;
  remaining: number;
}

export interface Allocation {
  interceptorId: string;
  quantity: number;
}

export interface WaveOutcome {
  intercepted: number;
  leaked: number;
  preventedDamage: number;
  incurredDamage: number;
  scoreGain: number;
  logs: string[];
}

export interface GameState {
  wave: number;
  budget: number;
  baseBudgetPerWave: number;
  threats: WaveThreatInstance[];
  cumulative: {
    preventedDamage: number;
    incurredDamage: number;
    score: number;
  };
  allocations: Allocation[];
  phase: "planning" | "resolved" | "gameover";
  history: WaveOutcome[];
  maxWaves: number;
}

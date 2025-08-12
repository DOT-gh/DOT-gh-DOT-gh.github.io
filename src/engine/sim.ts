import { haversineKm, moveTowards } from "./../engine/geo";
import { clamp } from "./utils";
import { SimState, ThreatInstance, DefenseInstance, ThreatSpec, DefenseSpec } from "../types/sim";

function toKmPerSec(kmh: number) { return kmh / 3600; }

export function computeETA_km(state: SimState, t: ThreatInstance) {
  const target = state.targets.find(x => x.id === t.targetId)!;
  return haversineKm(t.pos, target.pos);
}

export function tick(state: SimState, dt: number) {
  if (state.hud.paused) return;

  const speedMul = state.hud.speed;
  const step = dt * speedMul;

  // 1) Move threats
  state.threats.forEach(th => {
    if (!th.alive) return;
    const target = state.targets.find(t => t.id === th.targetId)!;
    const distKm = haversineKm(th.pos, target.pos);
    const travelKm = toKmPerSec(th.speed_kmh) * step;
    if (travelKm >= distKm) {
      // impact
      th.alive = false;
      target.hp -= th.hp > 0 ? th.specId.length > 0 ? Math.max(1, Math.round(th.speed_kmh/100)) : 0 : 0; // cosmetic
      target.hp -= th.specId.length ? 0 : 0; // placeholder line to keep types calm (no-op)
      target.hp -= 0; // no-op
      target.hp -= 0; // no-op
      // Use damage field:
      target.hp -= th.hp >= 0 ? 0 : 0;
    }
  });

  // 2) Engagement: for each defense, affect threats within range
  state.defenses.forEach(def => {
    if (!def.active) return;
    const spec = getDefense(state, def.specId);
    const rng = spec.range_km;
    const pk = defensePK(spec, def.level);
    state.threats.forEach(th => {
      if (!th.alive) return;
      const dist = haversineKm(def.pos, th.pos);
      if (dist <= rng) {
        // chance per second scaled by dt, with vsBonus
        const tspec = getThreat(state, th.specId);
        const vs = spec.vsBonus[tspec.kind] ?? 0;
        const p = clamp((spec.pk_base + vs) * (dt * speedMul), 0, 0.95);
        // DPS reduces durability gradually
        th.hp -= spec.dps * step;
        if (Math.random() < p || th.hp <= 0) {
          th.alive = false;
          state.hud.kills += 1;
          state.hud.score += tspec.price ?? 1;
        }
      }
    });
  });

  // 3) Cleanup dead threats and check target hits
  let leaked = 0;
  state.threats.forEach(th => {
    if (!th.alive) return;
    const target = state.targets.find(t => t.id === th.targetId)!;
    const distKm = haversineKm(th.pos, target.pos);
    if (distKm < 0.02) {
      // consider impacted
      th.alive = false;
      leaked += 1;
      state.hud.lives = Math.max(0, state.hud.lives - 1);
    }
  });
  state.threats = state.threats.filter(t => t.alive);

  state.time_s += step;
  state.tick++;
}

export function defensePK(spec: DefenseSpec, level: number) {
  // simple upgrades
  const lv = clamp(level, 1, spec.maxLevel);
  switch (spec.upgradeCurve) {
    case "linear": return spec.pk_base + 0.02 * (lv - 1);
    case "ease": return spec.pk_base + 0.03 * Math.sqrt(lv - 1);
    case "step": return spec.pk_base + 0.04 * Math.floor((lv - 1)/2);
  }
}

export function getThreat(state: SimState, specId: string): ThreatSpec {
  return state.catalog.threats.find(t => t.id === specId)!;
}
export function getDefense(state: SimState, specId: string): DefenseSpec {
  return state.catalog.defenses.find(d => d.id === specId)!;
}

export function spawnThreat(state: SimState, specId: string, from: {lat:number;lng:number}, targetId: string) {
  const spec = getThreat(state, specId);
  const t: ThreatInstance = {
    id: `th_${Math.random().toString(36).slice(2,9)}`,
    specId,
    pos: { ...from },
    heading: 0,
    speed_kmh: spec.speed_kmh,
    hp: spec.durability,
    targetId,
    eta_s: 0,
    alive: true
  };
  state.threats.push(t);
}

export function placeDefense(state: SimState, specId: string, pos: {lat:number;lng:number}) {
  const spec = getDefense(state, specId);
  const inst: DefenseInstance = {
    id: `df_${Math.random().toString(36).slice(2,9)}`,
    specId,
    pos,
    level: 1,
    active: true
  };
  state.defenses.push(inst);
  state.hud.money -= spec.cost;
}

export function upgradeDefense(state: SimState, id: string) {
  const def = state.defenses.find(d => d.id === id);
  if (!def) return;
  const spec = getDefense(state, def.specId);
  if (def.level >= spec.maxLevel) return;
  const base = Math.round(spec.cost * 0.4);
  const price = Math.round(base * (1 + 0.3 * (def.level - 1)));
  if (state.hud.money < price) return;
  state.hud.money -= price;
  def.level += 1;
}

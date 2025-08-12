export function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
export function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
export function star(n: number) { return "★".repeat(n) + "☆".repeat(5-n); }
export function id(prefix = "id") { return `${prefix}_${Math.random().toString(36).slice(2,9)}`; }

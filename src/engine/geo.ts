import { LatLng } from "../types/geo";

const R = 6371; // km
export function haversineKm(a: LatLng, b: LatLng) {
  const dLat = deg2rad(b.lat - a.lat);
  const dLng = deg2rad(b.lng - a.lng);
  const lat1 = deg2rad(a.lat);
  const lat2 = deg2rad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
export function moveTowards(a: LatLng, b: LatLng, distKm: number): LatLng {
  const total = Math.max(1e-6, haversineKm(a, b));
  const r = distKm / total;
  return { lat: a.lat + (b.lat - a.lat)*r, lng: a.lng + (b.lng - a.lng)*r };
}
export function bearingRad(a: LatLng, b: LatLng) {
  const y = deg2rad(b.lng - a.lng);
  const x1 = deg2rad(a.lat), x2 = deg2rad(b.lat);
  const y1 = deg2rad(a.lng), y2 = deg2rad(b.lng);
  const yx = Math.sin(y)*Math.cos(x2);
  const xx = Math.cos(x1)*Math.sin(x2) - Math.sin(x1)*Math.cos(x2)*Math.cos(y);
  return Math.atan2(yx, xx);
}
function deg2rad(d: number) { return d * Math.PI / 180; }

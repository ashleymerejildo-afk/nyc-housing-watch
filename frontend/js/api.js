// frontend/js/api.js
import { BACKEND_BASE } from './config.js';

export async function fetchHotspots() {
  const res = await fetch(`${BACKEND_BASE}/api/hotspots`);
  if (!res.ok) throw new Error('Backend respondió ' + res.status);
  return res.json();
}

export async function fetchViolationsForAddress(house, street, borough) {
  const q = new URLSearchParams({ house, street, borough });
  const res = await fetch(`${BACKEND_BASE}/api/violations?${q.toString()}`);
  if (!res.ok) throw new Error('Backend respondió ' + res.status);
  return res.json();
}

export async function geocodeAddress(house, street, borough) {
  const q = new URLSearchParams({ house, street, borough });
  const res = await fetch(`${BACKEND_BASE}/api/geocode?${q.toString()}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.lat || !data.lon) return null;
  return { lat: data.lat, lon: data.lon };
}

// frontend/js/map.js
import { fetchHotspots } from './api.js';
import { getClass, getLat, getLon, severityColor } from './utils.js';
import { sampleHotspotData } from './sampleData.js';

const NYC_CENTER = [40.7128, -73.9060];

let map;
let hotspotLayer;
let addressMarker = null;
let lastHotspotRows = [];

// Exposes the citywide hotspot rows already fetched for the map, so other
// modules (like insights.js) can reuse them without an extra API call.
export function getHotspotRows() {
  return lastHotspotRows;
}

export function initMap() {
  map = L.map('map', { zoomControl: true }).setView(NYC_CENTER, 10.4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18
  }).addTo(map);
  hotspotLayer = L.layerGroup().addTo(map);
  return map;
}

export async function loadHotspots(onFallback) {
  try {
    const rows = await fetchHotspots();
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('Sin filas');
    renderHotspots(rows);
  } catch (err) {
    console.warn('No se pudo cargar el mapa en vivo, usando datos de muestra:', err);
    if (onFallback) onFallback();
    renderHotspots(sampleHotspotData());
  }
}

function renderHotspots(rows) {
  lastHotspotRows = rows;
  hotspotLayer.clearLayers();
  rows.forEach(row => {
    const lat = getLat(row), lon = getLon(row);
    if (!lat || !lon) return;
    const cls = getClass(row);
    L.circleMarker([lat, lon], {
      radius: cls === 'C' ? 3.4 : 2.6,
      color: severityColor[cls],
      fillColor: severityColor[cls],
      fillOpacity: 0.55,
      weight: 0
    }).addTo(hotspotLayer);
  });
}

export function highlightAddress(lat, lon, label) {
  if (addressMarker) map.removeLayer(addressMarker);
  addressMarker = L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup();
  map.setView([lat, lon], 15);
}

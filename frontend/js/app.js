// frontend/js/app.js
import { initMap, loadHotspots, highlightAddress } from './map.js';
import { fetchViolationsForAddress, geocodeAddress } from './api.js';
import { renderReport, renderLoading } from './report.js';
import { sampleViolationsForDemo } from './sampleData.js';

function showBanner(msg) {
  const b = document.getElementById('status-banner');
  b.textContent = msg;
  b.style.display = 'block';
}
function hideBanner() {
  document.getElementById('status-banner').style.display = 'none';
}

initMap();
loadHotspots(() => {
  showBanner('⚠ No se pudo conectar con el backend para el mapa citywide. ¿Está corriendo "npm start" en backend/? Mostrando datos de muestra mientras tanto.');
});

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideBanner();

  const fd = new FormData(e.target);
  const house = fd.get('house').trim();
  const street = fd.get('street').trim();
  const borough = fd.get('borough');

  renderLoading();

  let isDemo = false;
  let rows = [];
  try {
    rows = await fetchViolationsForAddress(house, street, borough);
    if (!Array.isArray(rows)) throw new Error('respuesta inesperada');
  } catch (err) {
    console.warn('Fallo la consulta en vivo, usando datos de muestra:', err);
    showBanner('⚠ No se pudo conectar con el backend. Revisa que esté corriendo en localhost:3001. Mostrando datos de muestra.');
    isDemo = true;
    rows = sampleViolationsForDemo();
  }

  renderReport(`${house} ${street}, ${borough}`, rows, isDemo);

  try {
    const geo = await geocodeAddress(house, street, borough);
    if (geo) highlightAddress(geo.lat, geo.lon, `<b>${house} ${street}</b><br>${borough}`);
  } catch (err) {
    console.warn('Geocodificación no disponible:', err);
  }
});

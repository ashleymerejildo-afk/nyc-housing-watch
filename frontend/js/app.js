// frontend/js/app.js
import { initMap, loadHotspots, highlightAddress, getHotspotRows } from './map.js';
import { fetchViolationsForAddress, geocodeAddress } from './api.js';
import { renderReport, renderLoading } from './report.js';
import { sampleViolationsForDemo } from './sampleData.js';
import { initInsights, updateInsights, setHotspotSource } from './insights.js';

setHotspotSource(getHotspotRows);
initInsights();

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
  showBanner('⚠ Could not connect to the backend for the citywide map. Is "npm start" running in backend/? Showing sample data in the meantime.');
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
    if (!Array.isArray(rows)) throw new Error('unexpected response');
  } catch (err) {
    console.warn('Live query failed, using sample data:', err);
    showBanner('⚠ Could not connect to the backend. Check that it\'s running on localhost:3001. Showing sample data.');
    isDemo = true;
    rows = sampleViolationsForDemo();
  }

  const addressLabel = `${house} ${street}, ${borough}`;
  renderReport(addressLabel, rows, isDemo);
  updateInsights(addressLabel, rows, isDemo);

  try {
    const geo = await geocodeAddress(house, street, borough);
    if (geo) highlightAddress(geo.lat, geo.lon, `<b>${house} ${street}</b><br>${borough}`);
  } catch (err) {
    console.warn('Geocoding not available:', err);
  }
});

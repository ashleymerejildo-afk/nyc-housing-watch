// backend/src/services/geoclientService.js
const config = require('../config/env');

const isConfigured = Boolean(config.geoclient.appId && config.geoclient.appKey);

async function geocode(house, street, borough) {
  if (!isConfigured) return null;

  const url =
    `${config.geoclient.baseUrl}` +
    `?houseNumber=${encodeURIComponent(house)}` +
    `&street=${encodeURIComponent(street)}` +
    `&borough=${encodeURIComponent(borough)}` +
    `&app_id=${config.geoclient.appId}&app_key=${config.geoclient.appKey}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Geoclient respondió ${resp.status}`);

  const data = await resp.json();
  const addr = data.address || {};
  if (!addr.latitude || !addr.longitude) return null;

  return {
    lat: parseFloat(addr.latitude),
    lon: parseFloat(addr.longitude),
    source: 'geoclient',
    bbl: addr.bbl,
    bin: addr.buildingIdentificationNumber
  };
}

module.exports = { geocode, isConfigured };

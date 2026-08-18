// backend/src/services/socrataService.js
const config = require('../config/env');

function authHeaders() {
  return config.socrata.appToken ? { 'X-App-Token': config.socrata.appToken } : {};
}

function escapeSoQL(value) {
  return String(value).toUpperCase().replace(/'/g, "''");
}

/**
 * Violaciones abiertas para una dirección puntual.
 */
async function fetchViolationsForAddress(house, street, borough) {
  const where =
    `upper(housenumber)='${escapeSoQL(house)}' ` +
    `AND upper(streetname) LIKE '%${escapeSoQL(street)}%' ` +
    `AND upper(borough)='${escapeSoQL(borough)}'`;

  const params = new URLSearchParams({
    '$where': where,
    '$order': 'inspectiondate DESC',
    '$limit': '200'
  });

  const resp = await fetch(`${config.socrata.baseUrl}?${params.toString()}`, { headers: authHeaders() });
  if (!resp.ok) throw new Error(`Socrata respondió ${resp.status}`);
  return resp.json();
}

/**
 * Violaciones Clase B/C recientes con coordenadas, para el mapa citywide.
 */
async function fetchHotspots() {
  const params = new URLSearchParams({
    '$select': 'class,latitude,longitude',
    '$where': "class in('B','C') AND latitude IS NOT NULL",
    '$order': 'inspectiondate DESC',
    '$limit': '4000'
  });

  const resp = await fetch(`${config.socrata.baseUrl}?${params.toString()}`, { headers: authHeaders() });
  if (!resp.ok) throw new Error(`Socrata respondió ${resp.status}`);
  return resp.json();
}

module.exports = { fetchViolationsForAddress, fetchHotspots };

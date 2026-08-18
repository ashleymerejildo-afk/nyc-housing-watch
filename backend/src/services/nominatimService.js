// backend/src/services/nominatimService.js
// Respaldo gratuito cuando no hay Geoclient configurado. No requiere clave.

async function geocode(house, street, borough) {
  const q = encodeURIComponent(`${house} ${street}, ${borough}, New York, NY`);
  const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`, {
    headers: { 'User-Agent': 'nyc-housing-watch-app' }
  });
  if (!resp.ok) throw new Error(`Nominatim respondió ${resp.status}`);

  const data = await resp.json();
  if (!data.length) return null;

  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), source: 'nominatim' };
}

module.exports = { geocode };

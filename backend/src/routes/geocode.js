// backend/src/routes/geocode.js
const express = require('express');
const geoclientService = require('../services/geoclientService');
const nominatimService = require('../services/nominatimService');

const router = express.Router();

// GET /api/geocode?house=123&street=West 125 Street&borough=MANHATTAN
router.get('/', async (req, res) => {
  const { house, street, borough } = req.query;
  if (!house || !street || !borough) {
    return res.status(400).json({ error: 'Faltan parámetros: house, street, borough' });
  }

  try {
    if (geoclientService.isConfigured) {
      const result = await geoclientService.geocode(house, street, borough);
      if (result) return res.json(result);
    }
  } catch (err) {
    console.warn('Geoclient falló, usando Nominatim como respaldo:', err.message);
  }

  try {
    const result = await nominatimService.geocode(house, street, borough);
    if (!result) return res.status(404).json({ error: 'Dirección no encontrada' });
    res.json(result);
  } catch (err) {
    console.error('Error en /api/geocode:', err.message);
    res.status(502).json({ error: 'No se pudo geocodificar', detail: err.message });
  }
});

module.exports = router;

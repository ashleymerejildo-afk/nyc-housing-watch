// backend/src/routes/hotspots.js
const express = require('express');
const { fetchHotspots } = require('../services/socrataService');

const router = express.Router();

// GET /api/hotspots
router.get('/', async (req, res) => {
  try {
    const data = await fetchHotspots();
    res.json(data);
  } catch (err) {
    console.error('Error en /api/hotspots:', err.message);
    res.status(502).json({ error: 'No se pudo consultar NYC Open Data', detail: err.message });
  }
});

module.exports = router;

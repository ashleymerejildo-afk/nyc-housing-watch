// backend/src/routes/violations.js
const express = require('express');
const { fetchViolationsForAddress } = require('../services/socrataService');

const router = express.Router();

// GET /api/violations?house=123&street=West 125 Street&borough=MANHATTAN
router.get('/', async (req, res) => {
  const { house, street, borough } = req.query;
  if (!house || !street || !borough) {
    return res.status(400).json({ error: 'Faltan parámetros: house, street, borough' });
  }

  try {
    const data = await fetchViolationsForAddress(house, street, borough);
    res.json(data);
  } catch (err) {
    console.error('Error en /api/violations:', err.message);
    res.status(502).json({ error: 'No se pudo consultar NYC Open Data', detail: err.message });
  }
});

module.exports = router;

// backend/src/app.js
const express = require('express');
const cors = require('cors');

const violationsRouter = require('./routes/violations');
const hotspotsRouter = require('./routes/hotspots');
const geocodeRouter = require('./routes/geocode');

const app = express();
app.use(cors());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/violations', violationsRouter);
app.use('/api/hotspots', hotspotsRouter);
app.use('/api/geocode', geocodeRouter);

module.exports = app;

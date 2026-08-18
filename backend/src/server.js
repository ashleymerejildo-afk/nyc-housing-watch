// backend/src/server.js
const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(`NYC Housing Watch backend escuchando en http://localhost:${config.port}`);
});

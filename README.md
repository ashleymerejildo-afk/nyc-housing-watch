# NYC Housing Watch

## Estructura
```
nyc-housing-watch/
  backend/
    src/
      config/
        env.js               ← lee .env una sola vez
      services/
        socrataService.js    ← llamadas a Socrata (violaciones, hotspots)
        geoclientService.js  ← geocodificación oficial NYC
        nominatimService.js  ← geocodificación de respaldo (gratis, sin clave)
      routes/
        violations.js        ← GET /api/violations
        hotspots.js          ← GET /api/hotspots
        geocode.js           ← GET /api/geocode (con fallback automático)
      app.js                 ← cablea middlewares + rutas
      server.js               ← arranca el servidor
    package.json
    .env.example              ← copia a .env y pon tus claves reales
    .gitignore
  frontend/
    index.html                ← solo estructura
    css/
      styles.css
    js/
      config.js                ← URL del backend
      utils.js                 ← lectura defensiva de campos, severidad
      api.js                   ← todas las llamadas fetch al backend
      map.js                   ← Leaflet: hotspots + marcador de dirección
      report.js                ← renderiza la lista de violaciones
      sampleData.js            ← datos de respaldo si el backend no responde
      app.js                   ← punto de entrada, conecta todo
  README.md
```

## 1. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
```
Abre `.env` y pega tus claves reales (nunca las escribas en el chat, solo aquí):
```
SOCRATA_APP_TOKEN=tu_token_de_socrata
GEOCLIENT_ID=tu_app_id_de_geoclient      # opcional
GEOCLIENT_KEY=tu_app_key_de_geoclient    # opcional
```

## 2. Arrancar el backend
```bash
npm start
```
Debe imprimir: `NYC Housing Watch backend escuchando en http://localhost:3001`

Puedes probar que está vivo en `http://localhost:3001/health`.

## 3. Servir el frontend
Como el frontend usa módulos JS (`type="module"`), no lo abras con doble clic
(`file://`) — sírvelo con un servidor estático:
```bash
cd frontend
npx serve .
```
Y abre la URL que te dé (normalmente `http://localhost:3000`).

Si despliegas el backend en otra URL (Render, Railway, Fly.io, etc.), cambia
`BACKEND_BASE` en `frontend/js/config.js` por esa URL pública.

## Notas de seguridad
- `backend/.env` nunca se sube a git (ya está en `.gitignore`).
- El frontend nunca llama directo a Socrata ni a Geoclient — solo a tu backend.
- Si despliegas en Vercel/Render, configura `SOCRATA_APP_TOKEN`, `GEOCLIENT_ID`
  y `GEOCLIENT_KEY` como variables de entorno del proyecto, no en el código.
- No pegues claves reales en un chat (conmigo o con cualquier otra IA); ponlas
  directamente en tu `.env` local.

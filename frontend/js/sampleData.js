// frontend/js/sampleData.js
// Se usa únicamente si el backend no responde, para que la UI nunca
// se quede vacía durante una demo o mientras configuras las claves.

export function sampleHotspotData() {
  const seeds = [
    [40.8296, -73.9262, 'C'], [40.6782, -73.9442, 'C'], [40.7500, -73.8967, 'B'],
    [40.6501, -73.9496, 'C'], [40.5795, -74.1502, 'B'], [40.8448, -73.8648, 'C'],
    [40.7282, -73.7949, 'B'], [40.6892, -73.9866, 'C'], [40.8115, -73.9465, 'C'],
    [40.7069, -73.9210, 'B']
  ];
  const out = [];
  seeds.forEach(([lat, lon, cls]) => {
    for (let i = 0; i < 25; i++) {
      out.push({ class: cls, latitude: lat + (Math.random() - 0.5) * 0.04, longitude: lon + (Math.random() - 0.5) * 0.04 });
    }
  });
  return out;
}

export function sampleViolationsForDemo() {
  return [
    { class: 'C', currentstatus: 'OPEN', apartment: '4B', inspectiondate: '2026-06-02T00:00:00.000', novdescription: 'FALTA DE CALEFACCIÓN - NO SE PROPORCIONÓ CALOR ADECUADO' },
    { class: 'C', currentstatus: 'OPEN', apartment: '2A', inspectiondate: '2026-05-14T00:00:00.000', novdescription: 'PELIGRO DE INCENDIO - ESCALERA DE INCENDIOS BLOQUEADA' },
    { class: 'B', currentstatus: 'OPEN', apartment: '3F', inspectiondate: '2026-04-30T00:00:00.000', novdescription: 'FUGA DE AGUA EN EL TECHO DEL BAÑO' },
    { class: 'B', currentstatus: 'OPEN', apartment: null, inspectiondate: '2026-03-11T00:00:00.000', novdescription: 'PINTURA DESCASCARADA EN ÁREAS COMUNES' },
    { class: 'A', currentstatus: 'OPEN', apartment: '1C', inspectiondate: '2026-02-20T00:00:00.000', novdescription: 'MOSQUITERO DE VENTANA FALTANTE' }
  ];
}

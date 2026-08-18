// frontend/js/sampleData.js
// Used only if the backend doesn't respond, so the UI is never
// left empty during a demo or while you're setting up your keys.

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
    { class: 'C', currentstatus: 'OPEN', apartment: '4B', inspectiondate: '2026-06-02T00:00:00.000', novdescription: 'LACK OF HEAT - FAILURE TO PROVIDE ADEQUATE HEAT' },
    { class: 'C', currentstatus: 'OPEN', apartment: '2A', inspectiondate: '2026-05-14T00:00:00.000', novdescription: 'FIRE HAZARD - FIRE ESCAPE BLOCKED' },
    { class: 'B', currentstatus: 'OPEN', apartment: '3F', inspectiondate: '2026-04-30T00:00:00.000', novdescription: 'WATER LEAK IN BATHROOM CEILING' },
    { class: 'B', currentstatus: 'OPEN', apartment: null, inspectiondate: '2026-03-11T00:00:00.000', novdescription: 'PEELING PAINT IN COMMON AREAS' },
    { class: 'A', currentstatus: 'OPEN', apartment: '1C', inspectiondate: '2026-02-20T00:00:00.000', novdescription: 'MISSING WINDOW SCREEN' }
  ];
}

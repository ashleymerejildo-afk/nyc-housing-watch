// frontend/js/utils.js

// Lee un campo probando varios nombres posibles (mayúsc/minúsc incluida),
// por si el dataset usa una variante distinta a la esperada.
export function pick(row, candidates) {
  for (const c of candidates) {
    if (row[c] !== undefined && row[c] !== null && row[c] !== '') return row[c];
    const found = Object.keys(row).find(k => k.toLowerCase() === c.toLowerCase());
    if (found && row[found] !== undefined && row[found] !== null && row[found] !== '') return row[found];
  }
  return null;
}

export function getClass(row) {
  const c = pick(row, ['class', 'violationclass', 'currentseverity']);
  if (!c) return 'A';
  const up = String(c).toUpperCase();
  if (up.includes('C')) return 'C';
  if (up.includes('B')) return 'B';
  return 'A';
}

export function isOpen(row) {
  const s = pick(row, ['currentstatus', 'violationstatus', 'status']);
  if (!s) return true;
  const up = String(s).toUpperCase();
  return !(up.includes('CLOS') || up.includes('CERTIF') || up.includes('DISMISS'));
}

export function getLat(row) { return parseFloat(pick(row, ['latitude', 'lat'])); }
export function getLon(row) { return parseFloat(pick(row, ['longitude', 'long', 'lng'])); }

export const severityColor = { A: '#3F7D5C', B: '#D9812F', C: '#BC2A2A' };
export const severityRank = { C: 0, B: 1, A: 2 };

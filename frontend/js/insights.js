// frontend/js/insights.js
// Data analysis layer. Reuses rows already fetched by app.js/map.js —
// makes NO additional API calls of its own.
import { pick, getClass, isOpen, severityColor } from './utils.js';
import { renderReport } from './report.js';

const CATEGORY_RULES = [
  { key: 'heat_hot_water', label: 'Heat / Hot Water', test: /HEAT|HOT WATER|BOILER/ },
  { key: 'pests', label: 'Pests', test: /VERMIN|MICE|RAT|ROACH|PEST|INFESTAT/ },
  { key: 'water_leak_mold', label: 'Water Leak / Mold', test: /LEAK|MOLD|MILDEW|WATER DAMAGE|CEILING/ },
  { key: 'paint_plaster', label: 'Paint / Plaster', test: /PAINT|PLASTER|PEELING/ },
  { key: 'electrical', label: 'Electrical', test: /ELECTRIC|WIRING|OUTLET/ },
  { key: 'plumbing', label: 'Plumbing', test: /PLUMBING|PIPE|FAUCET|TOILET|SEWAGE/ },
  { key: 'fire_safety', label: 'Fire Safety', test: /FIRE|SMOKE DETECTOR|CARBON MONOXIDE|ESCAPE/ },
  { key: 'structural', label: 'Structural', test: /FLOOR|WALL|STRUCTUR|DOOR|WINDOW|LOCK/ }
];

function categorize(desc) {
  if (!desc) return 'Other';
  const up = String(desc).toUpperCase();
  const match = CATEGORY_RULES.find(r => r.test.test(up));
  return match ? match.label : 'Other';
}

function monthKey(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ---- state ----
let rawRows = [];        // all open violations for the current address, unfiltered
let addressLabel = '';
let isDemoData = false;
let chartSeverity = null, chartType = null, chartTrend = null, chartCompare = null;

function applyFilters() {
  const panel = document.getElementById('insights-panel');
  const severities = [...panel.querySelectorAll('.f-severity:checked')].map(el => el.value);
  const type = panel.querySelector('.f-type').value;
  const from = panel.querySelector('.f-date-from').value;
  const to = panel.querySelector('.f-date-to').value;

  return rawRows.filter(row => {
    if (severities.length && !severities.includes(getClass(row))) return false;
    const desc = pick(row, ['novdescription', 'description']);
    if (type && categorize(desc) !== type) return false;
    const date = pick(row, ['inspectiondate', 'novissueddate']);
    if (from && (!date || date < from)) return false;
    if (to && (!date || date > to)) return false;
    return true;
  });
}

function destroyCharts() {
  [chartSeverity, chartType, chartTrend, chartCompare].forEach(c => c && c.destroy());
  chartSeverity = chartType = chartTrend = chartCompare = null;
}

function baseChartOptions(extra) {
  return Object.assign({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#122032', font: { family: 'IBM Plex Sans', size: 11 } } },
      tooltip: { backgroundColor: '#122032', titleFont: { family: 'IBM Plex Sans' }, bodyFont: { family: 'IBM Plex Sans' } }
    }
  }, extra);
}

function renderCharts(rows) {
  const counts = { A: 0, B: 0, C: 0 };
  rows.forEach(r => counts[getClass(r)]++);
  const total = rows.length;

  // Severity donut
  const sevCtx = document.getElementById('chart-severity');
  chartSeverity = new Chart(sevCtx, {
    type: 'doughnut',
    data: {
      labels: ['Class A — Low', 'Class B — Hazardous', 'Class C — Immediately hazardous'],
      datasets: [{ data: [counts.A, counts.B, counts.C], backgroundColor: [severityColor.A, severityColor.B, severityColor.C], borderWidth: 0 }]
    },
    options: baseChartOptions({ cutout: '62%' })
  });

  // Type bar
  const typeCounts = {};
  rows.forEach(r => {
    const desc = pick(r, ['novdescription', 'description']);
    const cat = categorize(desc);
    typeCounts[cat] = (typeCounts[cat] || 0) + 1;
  });
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const typeCtx = document.getElementById('chart-type');
  chartType = new Chart(typeCtx, {
    type: 'bar',
    data: {
      labels: typeEntries.map(e => e[0]),
      datasets: [{ label: 'Open violations', data: typeEntries.map(e => e[1]), backgroundColor: '#3E7A96', borderRadius: 3, maxBarThickness: 28 }]
    },
    options: baseChartOptions({
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0, color: '#5a5546' }, grid: { color: '#e7e2d3' } },
        y: { ticks: { color: '#122032', font: { family: 'IBM Plex Sans', size: 11 } }, grid: { display: false } }
      }
    })
  });

  // Trend line — only if there are at least 2 distinct months of data.
  const trendWrap = document.getElementById('trend-wrap');
  const months = {};
  rows.forEach(r => {
    const key = monthKey(pick(r, ['inspectiondate', 'novissueddate']));
    if (key) months[key] = (months[key] || 0) + 1;
  });
  const monthKeys = Object.keys(months).sort();
  if (monthKeys.length >= 2) {
    trendWrap.style.display = '';
    const trendCtx = document.getElementById('chart-trend');
    chartTrend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: monthKeys,
        datasets: [{ label: 'Violations issued', data: monthKeys.map(k => months[k]), borderColor: '#3E7A96', backgroundColor: 'rgba(62,122,150,0.12)', fill: true, tension: 0.25, pointRadius: 3 }]
      },
      options: baseChartOptions({
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#5a5546', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0, color: '#5a5546' }, grid: { color: '#e7e2d3' } }
        }
      })
    });
  } else {
    trendWrap.style.display = 'none';
  }

  return { counts, total, typeEntries, monthKeys };
}

function renderComparison(counts, hotspotRows) {
  const wrap = document.getElementById('compare-wrap');
  const bcTotal = counts.B + counts.C;
  const cityBC = { B: 0, C: 0 };
  hotspotRows.forEach(r => { const c = getClass(r); if (c === 'B' || c === 'C') cityBC[c]++; });
  const cityTotal = cityBC.B + cityBC.C;

  if (bcTotal === 0 || cityTotal === 0) {
    wrap.style.display = 'none';
    return null;
  }
  wrap.style.display = '';

  const buildingCPct = Math.round((counts.C / bcTotal) * 100);
  const cityCPct = Math.round((cityBC.C / cityTotal) * 100);

  const compareCtx = document.getElementById('chart-compare');
  chartCompare = new Chart(compareCtx, {
    type: 'bar',
    data: {
      labels: ['This building', 'Citywide sample'],
      datasets: [{ label: '% Class C among B/C violations', data: [buildingCPct, cityCPct], backgroundColor: ['#BC2A2A', '#8a8272'], borderRadius: 3, maxBarThickness: 46 }]
    },
    options: baseChartOptions({
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: '#5a5546', callback: v => v + '%' }, grid: { color: '#e7e2d3' } },
        x: { ticks: { color: '#122032', font: { family: 'IBM Plex Sans', size: 12 } }, grid: { display: false } }
      }
    })
  });

  return { buildingCPct, cityCPct, cityTotal };
}

function renderInsightText(counts, total, typeEntries, compare) {
  const el = document.getElementById('insights-text');
  const items = [];

  if (total === 0) {
    el.innerHTML = '<li>No open violations match the current filters.</li>';
    return;
  }

  const cPct = Math.round((counts.C / total) * 100);
  items.push(`Class C (immediately hazardous) violations represent <b>${cPct}%</b> of the ${total} open violation${total === 1 ? '' : 's'} shown for this address.`);

  if (typeEntries.length) {
    const [topLabel, topCount] = typeEntries[0];
    items.push(`The most common category is <b>${topLabel}</b> (${topCount} of ${total} open violations).`);
  }

  if (compare) {
    if (compare.cityTotal < 30) {
      items.push(`Compared to a citywide sample (n=${compare.cityTotal} — small sample, interpret with caution): this building's active B/C violations are <b>${compare.buildingCPct}% Class C</b>, vs <b>${compare.cityCPct}%</b> citywide.`);
    } else if (compare.buildingCPct > compare.cityCPct) {
      items.push(`This building's hazard violations skew more severe than the citywide sample: <b>${compare.buildingCPct}%</b> Class C here vs <b>${compare.cityCPct}%</b> citywide. This reflects violation mix, not a claim about building management.`);
    } else {
      items.push(`This building's hazard violations do not skew more severe than the citywide sample (${compare.buildingCPct}% vs ${compare.cityCPct}% Class C).`);
    }
  }

  if (total < 5) {
    items.push(`Note: with only ${total} open violation${total === 1 ? '' : 's'}, patterns above are based on a small sample and may not be statistically meaningful.`);
  }

  el.innerHTML = items.map(t => `<li>${t}</li>`).join('');
}

function rerender() {
  const filtered = applyFilters();
  destroyCharts();
  const { counts, total, typeEntries } = renderCharts(filtered);
  const compare = renderComparison(counts, getHotspotRowsSafe());
  renderInsightText(counts, total, typeEntries, compare);
  // Keep the existing detailed-complaints list in sync with the filters.
  renderReport(addressLabel, filtered, isDemoData);
}

let hotspotGetter = () => [];
export function setHotspotSource(getterFn) {
  hotspotGetter = getterFn;
}
function getHotspotRowsSafe() {
  try { return hotspotGetter() || []; } catch { return []; }
}

function populateTypeFilter(rows) {
  const select = document.querySelector('#insights-panel .f-type');
  const cats = [...new Set(rows.map(r => categorize(pick(r, ['novdescription', 'description']))))].sort();
  select.innerHTML = '<option value="">All types</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

export function initInsights() {
  const panel = document.getElementById('insights-panel');
  panel.querySelectorAll('.f-severity, .f-type, .f-date-from, .f-date-to').forEach(el => {
    el.addEventListener('change', rerender);
  });
  panel.querySelector('.f-reset').addEventListener('click', () => {
    panel.querySelectorAll('.f-severity').forEach(el => el.checked = true);
    panel.querySelector('.f-type').value = '';
    panel.querySelector('.f-date-from').value = '';
    panel.querySelector('.f-date-to').value = '';
    rerender();
  });
}

export function updateInsights(label, rows, isDemo) {
  addressLabel = label;
  isDemoData = isDemo;
  rawRows = rows.filter(isOpen);

  const panel = document.getElementById('insights-panel');
  panel.style.display = rawRows.length ? '' : 'none';
  if (!rawRows.length) return;

  populateTypeFilter(rawRows);
  panel.querySelectorAll('.f-severity').forEach(el => el.checked = true);
  panel.querySelector('.f-type').value = '';
  panel.querySelector('.f-date-from').value = '';
  panel.querySelector('.f-date-to').value = '';

  rerender();
}

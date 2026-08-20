// frontend/js/report.js
import { pick, getClass, isOpen, severityRank } from './utils.js';

const KPI_ICONS = {
  total: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  a: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>',
  b: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  c: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
};

export function renderReport(addressLabel, rows, isDemo) {
  const col = document.getElementById('report-col');
  const openRows = rows.filter(isOpen);
  openRows.sort((a, b) => severityRank[getClass(a)] - severityRank[getClass(b)]);

  const counts = { A: 0, B: 0, C: 0 };
  openRows.forEach(r => counts[getClass(r)]++);

  let html = `
    <div class="addr-heading">${addressLabel}</div>
    <div class="summary-row">
      <div class="summary-card total"><div class="kpi-icon">${KPI_ICONS.total}</div><div class="num">${openRows.length}</div><div class="lbl">Open Violations</div></div>
      <div class="summary-card a"><div class="kpi-icon">${KPI_ICONS.a}</div><div class="num">${counts.A}</div><div class="lbl">Class A · Low</div></div>
      <div class="summary-card b"><div class="kpi-icon">${KPI_ICONS.b}</div><div class="num">${counts.B}</div><div class="lbl">Class B · Hazardous</div></div>
      <div class="summary-card c"><div class="kpi-icon">${KPI_ICONS.c}</div><div class="num">${counts.C}</div><div class="lbl">Class C · Severe</div></div>
    </div>
  `;

  if (openRows.length === 0) {
    html += `<div class="empty-state"><div class="big">No open violations</div>No open violations were found on record for this address.</div>`;
  } else {
    openRows.forEach(row => {
      const cls = getClass(row);
      const desc = pick(row, ['novdescription', 'description']) || 'Description not available';
      const date = pick(row, ['inspectiondate', 'novissueddate']);
      const dateFmt = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
      const status = pick(row, ['currentstatus', 'violationstatus']) || 'OPEN';
      const apt = pick(row, ['apartment', 'apt']);
      const emoji = cls === 'C' ? '🔴' : cls === 'B' ? '🟠' : '🟢';
      html += `
        <div class="violation-card class${cls}">
          <div class="vc-top">
            <div class="stamp class${cls}">${cls}</div>
            <div class="vc-label">${emoji} ${cls === 'C' ? 'Immediately hazardous' : cls === 'B' ? 'Hazardous' : 'Low concern'}</div>
          </div>
          <div class="vc-desc">${desc}</div>
          <div class="vc-meta">
            <span><b>Date:</b> ${dateFmt}</span>
            ${apt ? `<span><b>Unit:</b> ${apt}</span>` : ''}
            <span class="status-pill open">${status}</span>
          </div>
        </div>
      `;
    });
  }

  if (isDemo) {
    html = `<div style="font-family:var(--font-mono);font-size:11px;background:rgba(225,69,69,.12);border:1px solid rgba(225,69,69,.3);color:#ff9a8a;padding:8px 10px;border-radius:8px;margin-bottom:16px;">⚠ Showing sample data: the request to the backend could not be completed.</div>` + html;
  }

  col.innerHTML = html;
}

export function renderLoading() {
  document.getElementById('report-col').innerHTML =
    `<div class="empty-state"><div class="big">Searching…</div>Querying NYC Open Data.</div>`;
}

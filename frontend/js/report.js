// frontend/js/report.js
import { pick, getClass, isOpen, severityRank } from './utils.js';

export function renderReport(addressLabel, rows, isDemo) {
  const col = document.getElementById('report-col');
  const openRows = rows.filter(isOpen);
  openRows.sort((a, b) => severityRank[getClass(a)] - severityRank[getClass(b)]);

  const counts = { A: 0, B: 0, C: 0 };
  openRows.forEach(r => counts[getClass(r)]++);

  let html = `
    <div class="addr-heading">${addressLabel}</div>
    <div class="summary-row">
      <div class="summary-card total"><div class="num">${openRows.length}</div><div class="lbl">Open</div></div>
      <div class="summary-card a"><div class="num">${counts.A}</div><div class="lbl">Class A</div></div>
      <div class="summary-card b"><div class="num">${counts.B}</div><div class="lbl">Class B</div></div>
      <div class="summary-card c"><div class="num">${counts.C}</div><div class="lbl">Class C</div></div>
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
    html = `<div style="font-family:var(--font-mono);font-size:11px;background:#fde3e3;color:#7a1f1f;padding:8px 10px;border-radius:2px;margin-bottom:16px;">⚠ Showing sample data: the request to the backend could not be completed.</div>` + html;
  }

  col.innerHTML = html;
}

export function renderLoading() {
  document.getElementById('report-col').innerHTML =
    `<div class="empty-state"><div class="big">Searching…</div>Querying NYC Open Data.</div>`;
}

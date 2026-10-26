/* Meetings renderer: reads window.MEETINGS (js/meetings-data.js). Fills the homepage "next meeting" bar and the calendar. */
(() => {
  const COL = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan'];
  const M = (window.MEETINGS || []).map((m, i) => ({
    ...m,
    c: COL[i % 7],
    d: new Date(+m.date.slice(0, 4), +m.date.slice(5, 7) - 1, +m.date.slice(8, 10))
  })).sort((a, b) => a.d - b.d);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  } [c]));
  const fmt = d => d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const up = M.filter(m => m.d >= today);
  const card = m => `<div class="card" style="--c:var(--${m.c})"><div class="tag">${fmt(m.d)} · ${esc(m.time)}</div><h3>${esc(m.title)}</h3><p>${esc(m.place)}${m.desc ? ' · ' + esc(m.desc) : ''}</p></div>`;

  document.querySelectorAll('[data-next-meeting]').forEach(el => {
    const n = up[0];
    el.innerHTML = n ? `<span class="hand">next meeting</span><b>${esc(n.title)}</b><span>${fmt(n.d)} · ${esc(n.time)} · ${esc(n.place)}</span><a href="meetings.html">All meetings →</a>` :
      `<span class="hand">next meeting</span><span>Dates coming soon. We meet in Room 92.</span><a href="meetings.html">Meeting info →</a>`;
  });

  const root = document.getElementById('cal');
  if (!root) return;
  const list = document.getElementById('upcoming'),
    detail = document.getElementById('cal-detail');
  if (list) list.innerHTML = up.length ? up.slice(0, 6).map(card).join('') : '<p>No upcoming meetings yet. Check back soon!</p>';
  let v = new Date(today.getFullYear(), today.getMonth(), 1);
  const draw = () => {
    const first = new Date(v),
      pad = first.getDay(),
      days = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate(),
      n = Math.ceil((pad + days) / 7) * 7;
    let g = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="dow">${d}</div>`).join('');
    for (let i = 0; i < n; i++) {
      const d = new Date(v.getFullYear(), v.getMonth(), 1 - pad + i),
        same = d.getMonth() === v.getMonth();
      const evs = M.map((m, k) => [m, k]).filter(([m]) => +m.d === +d).map(([m, k]) => `<button class="ev" style="--c:var(--${m.c})" data-i="${k}" aria-label="${esc(m.title)}">${esc(m.time)} ${esc(m.title)}</button>`).join('');
      g += `<div class="${same ? '' : 'out'} ${+d === +today ? 'now' : ''}"><b>${d.getDate()}</b>${evs}</div>`;
    }
    root.innerHTML = `<div class="cal-h"><h2>${v.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2><button data-a="t">Today</button><button data-a="p" aria-label="Previous month">‹</button><button data-a="n" aria-label="Next month">›</button></div><div class="cal-g">${g}</div>`;
  };
  root.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.a) {
      v = b.dataset.a === 't' ? new Date(today.getFullYear(), today.getMonth(), 1) : new Date(v.getFullYear(), v.getMonth() + (b.dataset.a === 'n' ? 1 : -1), 1);
      draw();
    } else if (b.dataset.i && detail) detail.innerHTML = card(M[+b.dataset.i]);
  });
  draw();
})();

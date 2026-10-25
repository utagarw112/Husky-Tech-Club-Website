/* ==========================================================
   Husky Tech – main.js
   1. Shared header + footer (edit links/text HERE once for all pages)
   2. Mobile menu  3. Scroll reveal  4. Count-up stats
   5. Tabs  6. Copy buttons  7. Image slots (data-src)
   Every feature checks that its elements exist, so no page can break another.
   ========================================================== */
(() => {
  /* ---------- 1. Shared header + footer ---------- */
  const DISCORD = 'https://discord.gg/4ZCV4mYDE5';
  const INTEREST = 'https://tinyurl.com/whsclubinterest';          // Register / interest Google Form
  const DASH = 'https://clubs.hackclub.com/auth/member?join=UHUTP6'; // Hack Club Dashboard
  const NAV = [['about','About'],['hackclub','HackClub'],['curriculum','Curriculum'],['outreach','Outreach'],['meetings','Meetings'],['team','Officers'],['resources','Resources']];
  const page = document.body.dataset.page || '';
  const LOGO = '<img class="logo-img" src="assets/images/branding/huskytech_withoutbg.png" alt="">';

  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `
    <a class="flag" href="https://hackclub.com/" target="_blank" rel="noopener" aria-label="Hack Club"><img src="https://assets.hackclub.com/flag-orpheus-top.svg" alt="Hack Club"></a>
    <div class="wrap nav-in">
      <a class="brand" href="index.html">${LOGO}WHS Husky Tech</a>
      <nav id="nav" aria-label="Main">
        ${NAV.map(([p,t]) => `<a href="${p}.html"${p===page?' class="active" aria-current="page"':''}>${t}</a>`).join('')}
        <div class="nav-tools">
          <a class="icon-btn" href="${DISCORD}" target="_blank" rel="noopener" aria-label="Join our Discord"><i class="fa-brands fa-discord"></i></a>
          <button class="icon-btn theme" type="button" aria-label="Switch theme"></button>
          <a class="btn btn-reg btn-sm" href="${INTEREST}" target="_blank" rel="noopener">Register <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </nav>
      <button class="burger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
    </div>`;

  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `
    <img class="stk" src="assets/images/stickers/club-illustration.png" alt="" aria-hidden="true" data-speed=".03" style="--s:150px;--r:-6deg;top:-42px;right:5%">
    <div class="wrap">
      <div class="fgrid">
        <div><a class="brand" href="index.html">${LOGO}Husky Tech</a>
          <p>An official Hack Club chapter at WHS. You ship, we ship.</p></div>
        <div><h4>Explore</h4>${NAV.map(([p,t]) => `<a href="${p}.html">${t}</a>`).join('')}</div>
        <div><h4>Get involved</h4>
          <a href="join.html">How to join</a>
          <a href="${INTEREST}" target="_blank" rel="noopener">Register interest</a>
          <a href="${DASH}" target="_blank" rel="noopener">Hack Club Dashboard</a>
          <a href="https://tinyurl.com/whsdescription" target="_blank" rel="noopener">Club charter</a></div>
        <div><h4>Connect</h4>
          <a href="${DISCORD}" target="_blank" rel="noopener"><i class="fa-brands fa-discord"></i> Discord</a>
          <a href="https://www.instagram.com/whshuskytechclub" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>
          <a href="mailto:whshuskytechclub@gmail.com"><i class="fa-solid fa-envelope"></i> Email us</a></div>
      </div>
      <div class="fbot"><span>© <span data-year>2026</span> WHS Husky Tech Club</span><span>Advisor: Ms. Megan Thaler · Room 92</span></div>
    </div>`;
  document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

  /* ---------- 2. Mobile menu ---------- */
  const burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });

  /* ---------- 3. Scroll reveal (falls back to visible if unsupported) ---------- */
  const watch = (sel, fn) => {
    const els = document.querySelectorAll(sel); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(e => fn(e)); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  };
  watch('.rv', e => {                      // cards in a grid reveal one after another
    if (e.parentElement.classList.contains('cards')) {
      e.style.transitionDelay = Math.min([...e.parentElement.children].indexOf(e), 5) * 80 + 'ms';
      setTimeout(() => e.style.transitionDelay = '', 1000);
    }
    e.classList.add('in');
  });

  /* ---------- 4. Count-up stats: <b data-count="20" data-prefix="" data-suffix="+"> ---------- */
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  watch('[data-count]', el => {
    const to = +el.dataset.count, p = el.dataset.prefix || '', s = el.dataset.suffix || '';
    if (still) { el.textContent = p + to + s; return; }
    const t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 1200, 1); el.textContent = p + Math.round(to * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  /* ---------- 5. Tabs: buttons[data-tab="id"] show panels[data-panel="id"] ---------- */
  document.querySelectorAll('.tabs').forEach(box => {
    const btns = box.querySelectorAll('[data-tab]');
    const show = id => {
      btns.forEach(b => b.setAttribute('aria-selected', b.dataset.tab === id));
      document.querySelectorAll('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== id);
    };
    btns.forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
    const h = location.hash.slice(1); if (h && box.querySelector(`[data-tab="${h}"]`)) show(h);
  });

  /* ---------- 6. Copy buttons: <button data-copy="text"> ---------- */
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const label = b.innerHTML;
    (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.copy) : Promise.reject())
      .then(() => b.textContent = 'Copied!').catch(() => b.textContent = 'Press Ctrl/Cmd+C')
      .finally(() => setTimeout(() => b.innerHTML = label, 1600));
  }));

  /* ---------- 7. Image slots: fill data-src on any .ph and it becomes a real image ---------- */
  document.querySelectorAll('.ph[data-src]').forEach(ph => {
    const src = ph.dataset.src.trim(); if (!src) return;
    const img = new Image(); img.alt = ph.dataset.alt || ''; img.loading = 'lazy';
    img.onload = () => { ph.appendChild(img); ph.classList.add('has'); };  // stays a placeholder if the path is wrong
    img.src = src;
  });

  /* ---------- 8. Light / dark theme (saved in the browser; initial value is set in each page <head>) ---------- */
  const root = document.documentElement, tb = document.querySelector('.theme');
  const paint = () => { const l = root.dataset.theme === 'light';
    if (tb) { tb.innerHTML = `<i class="fa-solid ${l ? 'fa-moon' : 'fa-sun'}"></i>`; tb.setAttribute('aria-label', l ? 'Switch to dark mode' : 'Switch to light mode'); } };
  paint();
  if (tb) tb.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('ht-theme', root.dataset.theme); } catch (e) {}
    paint();
  });

  /* ---------- 9. Scroll progress bar, floating Register button, sticker parallax + drag ---------- */
  const bar = document.createElement('div'); bar.id = 'prog'; document.body.append(bar);
  const fab = document.createElement('div'); fab.className = 'fab';
  fab.innerHTML = `<a class="btn btn-reg btn-sm" href="${INTEREST}" target="_blank" rel="noopener">Register <i class="fa-solid fa-arrow-right"></i></a><button class="icon-btn" type="button" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>`;
  document.body.append(fab);
  fab.querySelector('button').addEventListener('click', () => scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' }));
  const stks = [...document.querySelectorAll('.stk')];
  let busy = false;
  const onScroll = () => { if (busy) return; busy = true; requestAnimationFrame(() => { busy = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    fab.classList.toggle('on', scrollY > 500);
    if (!still) stks.forEach(s => { const r = (s.offsetParent || s.parentElement).getBoundingClientRect();
      s.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * (+s.dataset.speed || .05)).toFixed(1) + 'px'); }); }); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  stks.forEach(s => { let on = false, sx = 0, sy = 0, ox = 0, oy = 0;   // drag stickers with a mouse
    s.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; on = true; sx = e.clientX - ox; sy = e.clientY - oy; s.setPointerCapture(e.pointerId); s.style.cursor = 'grabbing'; });
    s.addEventListener('pointermove', e => { if (!on) return; ox = e.clientX - sx; oy = e.clientY - sy; s.style.translate = `${ox}px ${oy}px`; });
    const end = () => { on = false; s.style.cursor = ''; }; s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end); });
})();

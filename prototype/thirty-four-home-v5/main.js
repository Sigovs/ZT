/* ZT — "Thirty-Four Degrees" · motion and interaction (homepage v5)
   One geometry drives the hero: a band at 34° (the angle of the ZT monogram's bars).
   1. Entrance: the film fills the screen from the first paint, with the slogan and the menu in place; then glass closes
      over it and leaves the bar. Nothing is hidden first, and it takes about a second.
   2. Marque selector: five marks. Each wipes its own footage into the bar along the bar's axis.
      The slogan stays.
   3. Scroll: the bar slides out along its axis; the monolith columns waiting
      beneath it rise, flatten their 34° cut and become the second screen.      */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const M = Math.tan(34 * Math.PI / 180);           // slope of the ZT bars
  const stage = $('#stage');
  const heroEl = $('.hero');
  // phones get their own composition: the bar crosses the screen, the columns become stacked bands
  const mqMobile = window.matchMedia('(max-width: 900px)');
  const mobile = mqMobile.matches;
  const bar = $('.bar');
  const plates = $('.bar__plates'), glassEdge = $('.hero__edge');
  const wordEl = $('[data-display]');
  // ?slogan=2|3|4 shows the other lines that were written; the one in the markup is the one chosen
  const SLOGANS = { 2: ['Five marques.', 'One house.'], 3: ['Extraordinary,', 'by name.'], 4: ['Driven by', 'excellence.'] };
  const alt = SLOGANS[new URLSearchParams(location.search).get('slogan')];
  if (alt) $$('.line', wordEl).forEach((l, i) => { l.textContent = alt[i]; });
  const cols = $$('.col');
  const monolith = $('.monolith');
  const items = $$('.index__item');
  const creditEl = $('[data-readout-credit]');
  const HOME = creditEl.textContent;
  const nowMark = $('[data-now-mark]'), nowName = $('[data-now-name]'), stepN = $('[data-step-n]');
  const ORDER = [null, ...items];
  // ?hero=reel|strokes|type|none switches between the compositions that were explored; none is the one chosen (Alex, 24 Nov 2026)
  heroEl.dataset.hero = (new URLSearchParams(location.search).get('hero') || 'none');
  const name = btn => { nowMark.className = 'mark' + (btn ? ' mark--' + btn.dataset.key : ''); nowName.textContent = btn ? btn.getAttribute('aria-label') : 'ZT Automotive Collection'; stepN.textContent = ORDER.indexOf(btn || null) + ' / 5'; };
  const announce = key => document.dispatchEvent(new CustomEvent('zt:marque', { detail: { key } }));

  /* ---------- geometry ---------- */
  const G = { W: 0, H: 0, cx: 0, cy: 0, T: 0, gap: 0 };
  function measure() {
    G.W = heroEl.clientWidth; G.H = heroEl.clientHeight;
    if (mobile) { G.cx = G.W * 0.5; G.cy = G.H * 0.39; G.T = G.H * 0.31; G.gap = 14; return; }
    G.cx = G.W * 0.60;  G.cy = G.H * 0.56;
    G.T = G.H * 0.48;   G.gap = Math.max(18, G.H * 0.026);
  }
  // the control is a broken line laid along the bar: above its upper edge on desktop, below its lower edge on phones
  function placeReel() {
    const n = Math.sqrt(1 + M * M), d = mobile ? 30 : Math.max(26, G.H * 0.036), sgn = mobile ? 1 : -1;
    const xA = mobile ? G.W * 0.07 : G.W * 0.1;
    const edge = G.cy - M * (xA - G.cx) + sgn * G.T / 2;
    heroEl.style.setProperty('--rx', (xA + sgn * M * d / n) + 'px');
    heroEl.style.setProperty('--ry', (edge + sgn * d / n) + 'px');
  }
  // band state: t = thickness, s = slide along the band axis (px)
  const band = { t: 0, s: 0 };
  function drawBar() {
    const k = 1 / Math.sqrt(1 + M * M);
    const dx = band.s * k, dy = -band.s * M * k;
    const cx = G.cx + dx, cy = G.cy + dy;
    const c = x => cy - M * (x - cx);
    const x0 = -60, x1 = G.W + 60, h = band.t / 2;
    bar.style.clipPath =
      `polygon(${x0}px ${c(x0) - h}px, ${x1}px ${c(x1) - h}px, ${x1}px ${c(x1) + h}px, ${x0}px ${c(x0) + h}px)`;
    if (glassEdge) glassEdge.style.clipPath = `polygon(${x0}px ${c(x0) - h - 1.4}px, ${x1}px ${c(x1) - h - 1.4}px, ${x1}px ${c(x1) - h}px, ${x0}px ${c(x0) - h}px)`;
    // the footage moves a little less than the band → depth along the same axis
    plates.style.transform = `translate3d(${dx * 0.55}px, ${dy * 0.55}px, 0)`;
  }

  /* columns: their tops follow the bar's lower edge, then flatten */
  const colState = { p: 0, intro: 0 };
  const ease = hasGSAP ? window.gsap.parseEase('power3.inOut') : (x => x);
  function drawCols() {
    if (mobile || monolith.classList.contains('is-open') || monolith.classList.contains('is-busy')) return;
    const n = cols.length;
    cols.forEach((col, i) => {
      const x0 = col.offsetLeft, x1 = x0 + col.offsetWidth;
      const lower = x => G.cy + G.T / 2 - M * (x - G.cx) + G.gap;
      const delay = (n - 1 - i) * 0.09;                        // right-hand columns lead, like the diagonal
      const local = Math.min(Math.max((colState.p - delay) / (1 - 0.36), 0), 1);
      const e = ease(local);
      const push = colState.intro * G.H;
      const a = Math.max(0, (lower(x0) + push) * (1 - e));
      const b = Math.max(0, (lower(x1) + push) * (1 - e));
      col.style.clipPath = `polygon(0 ${a}px, 100% ${b}px, 100% 100%, 0 100%)`;
    });
  }

  /* ---------- reduced motion / no GSAP: a designed static page ---------- */
  if (reduce || !hasGSAP) {
    document.documentElement.classList.add('rm');
    heroEl.classList.add('is-set'); measure(); placeReel(); band.t = G.T; drawBar();
    if (!mobile) cols.forEach(c => (c.style.clipPath = 'none'));
    let cur = null;
    items.forEach(btn => btn.addEventListener('click', () => {
      cur = cur === btn ? null : btn;                          // a second press returns to the Collection
      const key = cur ? cur.dataset.key : 'collection';
      items.forEach(b => { b.classList.toggle('is-active', b === cur); b.setAttribute('aria-pressed', String(b === cur)); });
      $$('.plate').forEach(p => p.classList.toggle('is-active', p.dataset.plate === key));
      creditEl.textContent = cur ? cur.dataset.credit : HOME; name(cur);
      announce(key);
    }));
    $$('[data-step]').forEach(b => b.addEventListener('click', () => { const nx = ORDER[(ORDER.indexOf(cur) + +b.dataset.step + 6) % 6]; (nx || cur).click(); }));
    window.addEventListener('resize', () => { measure(); placeReel(); drawBar(); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // the entrance is a designed opening — always start the experience at the top
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------- Lenis on GSAP's ticker ---------- */
  const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.ztLenis = lenis;                                      // home.js: menu lock, jumps

  measure(); placeReel();
  const FULL = 2 * Math.max(G.cy + M * G.cx, G.H - G.cy + M * (G.W - G.cx)) + 8;        // a band so thick that it covers the screen
  band.t = FULL; drawBar();
  colState.intro = 1; drawCols();

  /* ---------- 1 · entrance ---------- */
  gsap.set('[data-intro="fade"]', { autoAlpha: 0 });
  const intro = gsap.timeline({ delay: 0.35, onComplete: () => { band.t = G.T; drawBar(); } });
  intro
    .add(() => heroEl.classList.add('is-set'), 0.55)
    .to(band, { t: () => G.T, duration: 1.05, ease: 'expo.inOut', onUpdate: drawBar }, 0)
    .to(colState, { intro: 0, duration: 0.8, ease: 'power3.out', onUpdate: drawCols }, 0.62)
    .to('[data-intro="fade"]', { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.8);

  /* ---------- 2 · marque selector ---------- */
  let current = 'collection', busy = false, queued;
  function setMarque(btn) {
    const key = btn ? btn.dataset.key : 'collection';
    if (key === current) return;
    if (busy) { queued = btn; return; }
    busy = true;
    items.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    const next = $(`.plate[data-plate="${key}"]`);
    const prev = $(`.plate[data-plate="${current}"]`);
    current = key;
    announce(key);

    const tl = gsap.timeline({
      onComplete: () => {
        prev.classList.remove('is-active');
        next.classList.add('is-active'); next.classList.remove('is-entering');
        busy = false;
        if (queued !== undefined) { const q = queued; queued = undefined; setMarque(q); }
      }
    });
    // footage: wipe in along the band's axis (mask gradient at 56° = perpendicular to the 34° bars)
    next.classList.add('is-entering');
    tl.fromTo(next, { '--w': '-16%' }, { '--w': '110%', duration: 1.05, ease: 'power3.inOut' }, 0)
      .fromTo(next.children, { scale: 1.12, xPercent: -3 }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0);
    // the chosen marque is named by its mark, alone, under the word
    tl.to(nowMark, { yPercent: -112, duration: 0.3, ease: 'power3.in' }, 0)
      .add(() => name(btn), 0.32)
      .fromTo(nowMark, { yPercent: 112 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.34);
    // the credit follows
    tl.to(creditEl, { autoAlpha: 0, duration: 0.25 }, 0)
      .add(() => { creditEl.textContent = btn ? btn.dataset.credit : HOME; }, 0.3)
      .to(creditEl, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.5);
  }
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let homeT;
  const indexEl = $('.index');
  items.forEach(btn => {
    if (fine) btn.addEventListener('mouseenter', () => setMarque(btn));
    btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) setMarque(btn); });   // keyboard only: a tap also focuses
    // touch: a tap selects; a second tap on the same mark returns to the Collection
    btn.addEventListener('click', () => setMarque(!fine && current === btn.dataset.key ? null : btn));
  });
  // leaving the selector returns the bar to the Collection film
  indexEl.addEventListener('mouseleave', () => { homeT = setTimeout(() => { if (!indexEl.contains(document.activeElement)) setMarque(null); }, 700); });
  indexEl.addEventListener('mouseenter', () => clearTimeout(homeT));
  indexEl.addEventListener('focusout', e => { if (!indexEl.contains(e.relatedTarget) && heroEl.dataset.hero !== 'type') setMarque(null); });
  $$('[data-step]').forEach(b => b.addEventListener('click', () => { const cur = items.find(x => x.dataset.key === current) || null; setMarque(ORDER[(ORDER.indexOf(cur) + +b.dataset.step + 6) % 6]); }));

  /* ---------- 3 · scroll: the bar leaves along its axis, the monolith rises ---------- */
  if (mobile) {
    // no pin on phones: the bar leaves along its axis as the hero scrolls away
    gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } })
      .to(band, { s: () => G.W * 1.7, duration: 1, ease: 'power1.in', onUpdate: drawBar }, 0)
      .to('.display', { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0)
      .to('.hero__what', { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 0);
    monolith.classList.add('is-live');
  } else {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: () => '+=' + Math.round(G.H * 1.5),
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => {
          const live = self.progress > 0.96;
          if (live !== monolith.classList.contains('is-live')) { monolith.classList.toggle('is-live', live); document.dispatchEvent(new CustomEvent('zt:monolith', { detail: { live } })); }
        }
      }
    });
    scrollTl
      .to(band, { s: () => G.W * 1.9, duration: 1, ease: 'power2.in', onUpdate: drawBar }, 0)
      .to(bar, { autoAlpha: 0, duration: 0.12 }, 0.88)
      .to('.display', { yPercent: -38, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0)
      .to('.hero__what', { y: -60, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0)
      .to('.pick, .scrollcue, .hero__film', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(colState, { p: 1, duration: 1, ease: 'none', onUpdate: drawCols }, 0)
      .to('.col > img', { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo('.col__body', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, stagger: -0.04, ease: 'power2.out' }, 0.7);
  }

  /* ---------- resize ---------- */
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { if (mqMobile.matches !== mobile) { location.reload(); return; } measure(); placeReel(); if (!intro.isActive()) band.t = G.T; drawBar(); drawCols(); ScrollTrigger.refresh(); }, 120);
  });
  // column widths change on hover in screen 2 → keep the clip in sync while flex animates
  if (!mobile) {
    cols.forEach(c => c.addEventListener('transitionrun', e => { if (e.target === c) gsap.ticker.add(drawCols); }));
    cols.forEach(c => c.addEventListener('transitionend', e => { if (e.target === c) gsap.ticker.remove(drawCols); }));
  }
})();
